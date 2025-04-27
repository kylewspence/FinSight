import express from 'express';
import { ClientError, authMiddleware } from './lib/index.js';
import pg from 'pg';

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const router = express.Router();
router.use(authMiddleware);

// GET all transactions for a user
router.get('/', async (req, res, next) => {
  try {
    console.log(`GET /transactions/${req.user?.userId} requested`);

    const userId = Number(req.user?.userId);
    if (!userId) {
      console.warn(`Invalid userId provided: ${req.user?.userId}`);
      throw new ClientError(400, 'userId is required');
    }

    const sql = `
        SELECT * from "transactions"
        WHERE "userId" = $1
        ORDER BY "date" DESC
        `;

    const result = await db.query(sql, [userId]);
    console.log(`Found ${result.rows.length} transactions for user ${userId}`);

    res.json(result.rows);
  } catch (err) {
    console.error(`Error in GET /transactions/${req.user?.userId}:`, err);
    next(err);
  }
});

// POST a new transaction
router.post('/', async (req, res, next) => {
  try {
    console.log('POST /transactions requested');

    const userId = Number(req.user?.userId);
    if (!userId) {
      throw new ClientError(401, 'Authentication required');
    }

    const { date, amount, category, description } = req.body;
    if (!date || !amount || !category || !description) {
      console.warn('Missing required fields');
      throw new ClientError(400, 'Missing required fields');
    }

    const sql = `
        INSERT INTO "transactions" ("userId", "date", "amount", "category", "description")
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
        `;

    const params = [userId, date, amount, category, description];
    const result = await db.query(sql, params);
    console.log('Result:', result.rows[0]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error in POST /transactions:', err);
    next(err);
  }
});

// PUT to update a transaction
router.put('/:transactionId', async (req, res, next) => {
  try {
    console.log('Put Transaction Request params:', req.params);
    console.log('Put Transaction Request body:', req.body);

    const userId = Number(req.user?.userId);
    if (!userId) {
      throw new ClientError(401, 'Authentication required');
    }

    const transactionId = Number(req.params.transactionId);
    if (!transactionId) {
      throw new ClientError(400, 'transactionId is required');
    }

    // Verify ownership
    const verifyOwnerSql = `
        SELECT * FROM "transactions" 
        WHERE "transactionId" = $1 AND "userId" = $2
      `;
    const ownershipResult = await db.query(verifyOwnerSql, [
      transactionId,
      userId,
    ]);

    if (ownershipResult.rows.length === 0) {
      throw new ClientError(403, 'Not authorized to update this transaction');
    }

    const { date, description, category, amount } = req.body;

    const sql = `
        UPDATE "transactions"
        SET "date" = $1,
            "description" = $2,
            "category" = $3,
            "amount" = $4
        WHERE "transactionId" = $5
        RETURNING *
      `;

    const params = [date, description, category, amount, transactionId];
    const result = await db.query(sql, params);
    console.log('Result:', result.rows[0]);
    if (result.rows.length === 0) {
      throw new ClientError(
        404,
        `Transaction with id ${transactionId} not found`
      );
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error in PUT /transactions/:transactionId:', err);

    next(err);
  }
});

// DELETE a transaction
router.delete('/:transactionId', async (req, res, next) => {
  try {
    console.log('Delete Transaction Request params:', req.params);

    const userId = Number(req.user?.userId);
    if (!userId) {
      throw new ClientError(401, 'Authentication required');
    }

    const transactionId = Number(req.params.transactionId);
    if (!transactionId) {
      throw new ClientError(400, 'transactionId is required');
    }

    // Verify ownership
    const verifyOwnerSql = `
    SELECT * FROM "transactions" 
    WHERE "transactionId" = $1 AND "userId" = $2
    `;
    const ownershipResult = await db.query(verifyOwnerSql, [
      transactionId,
      userId,
    ]);
    if (ownershipResult.rows.length === 0) {
      throw new ClientError(403, 'Not authorized to delete this transaction');
    }

    const sql = `
        DELETE FROM "transactions"
        WHERE "transactionId" = $1
        RETURNING *
      `;

    const result = await db.query(sql, [transactionId]);
    console.log('Result:', result.rows[0]);
    if (result.rows.length === 0) {
      throw new ClientError(
        404,
        `Transaction with id ${transactionId} not found`
      );
    }

    res.sendStatus(204);
  } catch (err) {
    console.error('Error in DELETE /transactions/:transactionId:', err);

    next(err);
  }
});

export default router;
