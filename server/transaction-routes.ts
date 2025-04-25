import express from 'express';
import { ClientError } from './lib/index.js';
import pg from 'pg';

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const router = express.Router();

// GET all transactions for a user
router.get('/:userId', async (req, res, next) => {
  try {
    const userId = Number(req.params.userId);
    if (!userId) {
      throw new ClientError(400, 'userId is required');
    }

    const sql = `
        SELECT * from "transactions"
        WHERE "userId" = $1
        ORDER BY "date" DESC
        `;

    const result = await db.query(sql, [userId]);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// POST a new transaction
router.post('/', async (req, res, next) => {
  try {
    const { userId, date, amount, category, description } = req.body;
    if (!userId || !date || !amount || !category || !description) {
      throw new ClientError(400, 'Missing required fields');
    }

    const sql = `
        INSERT INTO "transactions" ("userId", "date", "amount", "category", "description")
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
        `;

    const params = [userId, date, amount, category, description];
    const result = await db.query(sql, params);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// PUT to update a transaction
router.put('/:transactionId', async (req, res, next) => {
  try {
    const transactionId = Number(req.params.transactionId);
    const { date, description, category, amount } = req.body;

    if (!transactionId) {
      throw new ClientError(400, 'transactionId is required');
    }

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

    if (result.rows.length === 0) {
      throw new ClientError(
        404,
        `Transaction with id ${transactionId} not found`
      );
    }

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

// DELETE a transaction
router.delete('/:transactionId', async (req, res, next) => {
  try {
    const transactionId = Number(req.params.transactionId);

    if (!transactionId) {
      throw new ClientError(400, 'transactionId is required');
    }

    const sql = `
        DELETE FROM "transactions"
        WHERE "transactionId" = $1
        RETURNING *
      `;

    const result = await db.query(sql, [transactionId]);

    if (result.rows.length === 0) {
      throw new ClientError(
        404,
        `Transaction with id ${transactionId} not found`
      );
    }

    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

export default router;
