import { ClientError } from './lib/index.js';
import express from 'express';
import pg from 'pg';

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const router = express.Router();

// GET all properties for a user
router.get('/:userId', async (req, res, next) => {
  try {
    const userId = Number(req.params.userId);
    if (!userId) {
      throw new ClientError(400, 'userId is required');
    }

    const sql = `
        Select * from "properties"
        where "userId" = $1;
        order by "propertyId"
        `;
    const result = await db.query(sql, [userId]);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});
// POST a new property
// PUT to update a property
// DELETE a property

export default router;
