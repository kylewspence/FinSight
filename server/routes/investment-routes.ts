// server/routes/investment-routes.ts (create this file)
import express from 'express';
import { csvUploadsMiddleware } from '../lib/uploads-middleware.js';
import { ClientError, authMiddleware } from '../lib/index.js';
import { parse } from 'csv-parse';
import fs from 'node:fs';
import pg from 'pg';

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function processCSV(filePath: string): Promise<Record<string, string>[]> {
  return new Promise((resolve, reject) => {
    const results: Record<string, string>[] = [];

    fs.createReadStream(filePath)
      .pipe(
        parse({
          columns: true, // Treat first row as column names
          skip_empty_lines: true, // Skip empty lines
          trim: true, // Trim whitespace from values
        })
      )
      .on('data', (row) => {
        // Each row is an object with keys from the header row
        results.push(row);
      })
      .on('end', () => {
        resolve(results);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

const router = express.Router();

// Apply authentication middleware
router.use(authMiddleware);

// CSV upload endpoint
router.post(
  '/upload',
  csvUploadsMiddleware.single('csvFile'),
  async (req, res, next) => {
    try {
      // Check if file exists
      if (!req.file) {
        throw new ClientError(400, 'No CSV file provided');
      }

      const userId = Number(req.user?.userId);
      if (!userId) {
        throw new ClientError(400, 'User ID is required');
      }

      // Process the CSV file
      const rows = await processCSV(req.file.path);
      console.log('First row:', rows[0]);

      for (const row of rows) {
        const symbol = row.Symbol || '';
        const shares = parseFloat(row.Shares || '0');
        const accountName = req.body.accountName || 'Default Account';

        if (!symbol || isNaN(shares)) {
          console.warn('Skipping invalid row:', row);
          continue; // Skip this row and continue with the next
        }

        try {
          // Insert or update the holding in the database
          // If user has Apple stock (AAPL) in their "401k" account,
          // they cannot have another row with the exact same combination, but they could have:
          // Apple stock (AAPL) in their "Roth IRA" account.
          const sql = `
          INSERT INTO "holdings" ("userId", "symbol", "shares", "accountName")
          VALUES ($1, $2, $3, $4)
          ON CONFLICT ("userId", "symbol", "accountName") 
          DO UPDATE SET "shares" = $3
          RETURNING *
        `;

          const result = await db.query(sql, [
            userId,
            symbol,
            shares,
            accountName,
          ]);
          console.log('Inserted/updated holding:', result.rows[0]);
        } catch (dbError) {
          console.error('Database error for row:', row, dbError);
          // Continue processing other rows even if one fails
        }
      }

      // Return success
      res.json({ message: 'CSV file received' });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
