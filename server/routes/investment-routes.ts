// server/routes/investment-routes.ts (create this file)
import express from 'express';
import { csvUploadsMiddleware } from '../lib/uploads-middleware.js';
import { authMiddleware } from '../lib/index.js';
import fs from 'fs';
import csv from 'fast-csv';
import pg from 'pg';

type Holdings = {
  accountNumber: string;
  userId: number;
  investmentName: string;
  symbol: string;
  shares: number;
  sharePrice: number;
  totalValue: number;
};

type Transactions = {
  accountNumber: string;
  userId: number;
  tradeDate: string;
  settlementDate: string;
  transactionType: string;
  transactionDescription: string;
  investmentName: string;
  symbol: string;
  shares: number;
  sharePrice: number;
  principalAmount: number;
  fees: number;
  netAmount: number;
  accruedInterest: number;
  accountType: string;
};

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const router = express.Router();

// Apply authentication middleware
router.use(authMiddleware);

router.post('/csv', csvUploadsMiddleware.single('file'), (req, res) => {
  const holdings: Holdings[] = [];
  const transactions: Transactions[] = [];

  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  fs.createReadStream(req.file.path) // Assuming multer is saving the file
    .pipe(csv.parse({ headers: false }))
    .on('error', (error) => {
      console.error('CSV parse error:', error);
      res.status(500).json({ error: 'Failed to parse CSV' });
    })
    .on('data', (row: string[]) => {
      // Skip header rows or empty rows
      if (!row[0] || row[0].includes('Account Number')) return;

      if (!req.user?.userId) {
        return res.status(401).json({ error: 'User not authenticated' });
      }
      const userId = req.user.userId;

      if (row.length === 7) {
        holdings.push({
          accountNumber: row[0],
          userId,
          investmentName: row[1],
          symbol: row[2],
          shares: parseFloat(row[3]),
          sharePrice: parseFloat(row[4]),
          totalValue: parseFloat(row[5]),
        });
      } else if (row.length === 15) {
        transactions.push({
          accountNumber: row[0],
          userId,
          tradeDate: row[1],
          settlementDate: row[2],
          transactionType: row[3],
          transactionDescription: row[4],
          investmentName: row[5],
          symbol: row[6],
          shares: parseFloat(row[7]),
          sharePrice: parseFloat(row[8]),
          principalAmount: parseFloat(row[9]),
          fees: parseFloat(row[10]),
          netAmount: parseFloat(row[11]),
          accruedInterest: parseFloat(row[12]),
          accountType: row[13],
        });
      } else {
        console.warn('Unexpected row length:', row.length, row);
      }
    })
    .on('end', async () => {
      try {
        for (const h of holdings) {
          const sql = `
            INSERT INTO holdings (
              account_number,
              user_id,
              investment_name,
              symbol,
              shares,
              share_price,
              total_value
            ) VALUES ($1, $2, $3, $4, $5, $6, $7);
          `;
          const params = [
            h.accountNumber,
            h.userId,
            h.investmentName,
            h.symbol,
            h.shares,
            h.sharePrice,
            h.totalValue,
          ];
          await db.query(sql, params);
        }

        for (const t of transactions) {
          const sql = `
            INSERT INTO transactions (
              account_number,
              user_id,
              trade_date,
              settlement_date,
              transaction_type,
              transaction_description,
              investment_name,
              symbol,
              shares,
              share_price,
              principal_amount,
              fees,
              net_amount,
              accrued_interest,
              account_type
            ) VALUES (
              $1, $2, $3, $4, $5, $6, $7,
              $8, $9, $10, $11, $12, $13, $14, $15
            );
          `;
          const params = [
            t.accountNumber,
            t.userId,
            t.tradeDate,
            t.settlementDate,
            t.transactionType,
            t.transactionDescription,
            t.investmentName,
            t.symbol,
            t.shares,
            t.sharePrice,
            t.principalAmount,
            t.fees,
            t.netAmount,
            t.accruedInterest,
            t.accountType,
          ];
          await db.query(sql, params);
        }
        res
          .status(200)
          .json({
            message: 'Upload parsed',
            holdingsCount: holdings.length,
            transactionsCount: transactions.length,
          });
      } catch (err) {
        console.error('DB insert error:', err);
        res.status(500).json({ error: 'DB insert failed' });

        if (req.file) {
          fs.unlink(req.file.path, (err) => {
            if (err) console.error('Error deleting uploaded file:', err);
          });
        }
      }
    });
});

export default router;
