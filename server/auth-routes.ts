import express from 'express';
import pg from 'pg';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { ClientError } from './lib/index.js';

const router = express.Router();

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Environment variables - in production these would be properly set
const TOKEN_SECRET = process.env.TOKEN_SECRET || 'devsecret';

// Routes will go here
router.post('/register', async (req, res, next) => {
  try {
    console.log('POST /register requested');
    const { userName, password } = req.body;
    if (!userName || !password) {
      console.warn('Missing required registration fields');
      throw new ClientError(400, 'userName and password are required');
    }

    const checkUserSql = `
        SELECT "userId" FROM "users"
        WHERE "userName" = $1
        `;

    const userExistResult = await db.query(checkUserSql, [userName]);
    if (userExistResult.rows.length > 0) {
      console.warn('User already exists');
      throw new ClientError(400, 'User already exists');
    }

    const hashedPassword = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 65536,
      timeCost: 3,
      parallelism: 4,
      hashLength: 32,
    });

    const sql = `
      INSERT INTO "users" ("userName", "hashedPassword", "createdAt")
      VALUES ($1, $2, CURRENT_TIMESTAMP)
      RETURNING "userId", "userName", "createdAt"
    `;

    const result = await db.query(sql, [userName, hashedPassword]);
    const user = result.rows[0];

    const token = jwt.sign(
      { userId: user.userId, userName: user.userName }, // Payload data
      TOKEN_SECRET, // Secret key
      { expiresIn: '24h' } // Options
    );

    res.status(201).json({ user, token });
  } catch (err) {
    next(err);
  }
});

export default router;
