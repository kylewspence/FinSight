import express from 'express';
import pg from 'pg';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { ClientError } from './lib/index.js';

interface JwtPayload {
  userId: number;
  userName: string;
}

const router = express.Router();

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Environment variables - in production these would be properly set
const TOKEN_SECRET = process.env.TOKEN_SECRET || 'devsecret';

// User Registration
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

// User Login
router.post('/login', async (req, res, next) => {
  try {
    console.log('POST /login requested');
    const { userName, password } = req.body;
    if (!userName || !password) {
      console.warn('Missing required login fields');
      throw new ClientError(400, 'userName and password are required');
    }

    const sql = `
    SELECT * FROM "users"
    WHERE "userName" = $1
    `;

    const result = await db.query(sql, [userName]);

    if (result.rows.length === 0) {
      console.warn('User not found', userName);
      throw new ClientError(401, 'Invalid user name or password');
    }

    const user = result.rows[0];

    try {
      const verifyPw = await argon2.verify(user.hashedPassword, password);
      if (!verifyPw) {
        console.warn('Invalid password', userName);
        throw new ClientError(401, 'Invalid user name or password');
      }

      const token = jwt.sign(
        { userId: user.userId, userName: user.userName },
        TOKEN_SECRET,
        { expiresIn: '24h' }
      );

      const userWithoutPassword = { ...user };
      delete userWithoutPassword.hashedPassword;

      res.json({ user: userWithoutPassword, token });
    } catch (argonError) {
      console.error('Argon2 verification failed:', argonError);
      throw new ClientError(401, 'Invalid username or password');
    }
  } catch (err) {
    next(err);
  }
});

// Get user Profile
router.get('/profile', async (req, res, next) => {
  try {
    console.log('GET /profile requested');
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      console.warn('No authorization header');
      throw new ClientError(401, 'Authorization header missing');
    }

    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer' || !token) {
      console.warn('Invalid authorization header');
      throw new ClientError(401, 'Invalid authorization header');
    }

    try {
      const decoded = jwt.verify(token, TOKEN_SECRET) as JwtPayload;
      const userId = decoded.userId;

      console.log('Token verified for user:', decoded.userName);

      const sql = `
            SELECT "userId", "userName", "createdAt"
            FROM "users"
            WHERE "userId" = $1
            `;

      const result = await db.query(sql, [userId]);
      if (result.rows.length === 0) {
        console.warn('User not found', userId);
        throw new ClientError(404, 'User not found');
      }

      const user = result.rows[0];
      res.json(user);
    } catch (jwtError) {
      console.error('JWT verification failed:', jwtError);
      throw new ClientError(401, 'Invalid token');
    }
  } catch (err) {
    next(err);
  }
});

export default router;
