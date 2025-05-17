import { ClientError, authMiddleware } from '../lib/index.js';
import express from 'express';
import OpenAI from 'openai';
import pg from 'pg';

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const router = express.Router();
router.use(authMiddleware);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Get all insights for a user
router.get('/insights', async (req, res, next) => {
  try {
    // Verify user is authenticated
    const userId = Number(req.user?.userId);
    if (!userId) {
      console.warn(`Invalid userId provided: ${req.user?.userId}`);

      throw new ClientError(400, 'userId is required');
    }

    const sql = `
        SELECT * from "insights"
        WHERE "userId" = $1
        ORDER by "insightId"
        `;
    const result = await db.query(sql, [userId]);

    res.json(result.rows);
  } catch (err) {
    console.error(`Error in GET /api/ai/ for ${req.user?.userId}:`, err);

    next(err);
  }
});

// POST endpoint for AI insights
router.post('/insights', async (req, res, next) => {
  try {
    const userId = Number(req.user?.userId);
    if (!userId) throw new ClientError(401, 'Authentication required');

    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      throw new ClientError(400, 'Valid messages array required');
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages,
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content || '';

    try {
      const insightsData = JSON.parse(content);
      res.json({
        insights: {
          overview: insightsData.overview || 'No data available',
          timelineToPurchase:
            insightsData.timelineToPurchase || 'No data available',
          marketTrends: insightsData.marketTrends || 'No data available',
          peerStrategies: insightsData.peerStrategies || 'No data available',
        },
      });
    } catch (error) {
      console.error('Error parsing AI response as JSON:', error);

      res.json({
        insights: {
          overview:
            content.substring(0, 200) + '...' || 'Error parsing insights',
          timelineToPurchase: 'Error parsing insights',
          marketTrends: 'Error parsing insights',
          peerStrategies: 'Error parsing insights',
        },
      });
    }
  } catch (err) {
    console.error('Error in POST /ai/insights:', err);
    next(err);
  }
});

router.post('/insights/save', async (req, res, next) => {
  try {
    const userId = Number(req.user?.userId);

    if (!userId) throw new ClientError(401, 'Authentication required');

    const { overview, timelineToPurchase, marketTrends, peerStrategies } =
      req.body;

    if (!overview || !timelineToPurchase || !marketTrends || !peerStrategies) {
      throw new ClientError(400, 'All fields are required');
    }

    const sql = `INSERT INTO "insights" (
        "userId", 
        "overview", 
        "timelineToPurchase", 
        "marketTrends", 
        "peerStrategies")
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING *`;

    const params = [
      userId,
      overview,
      timelineToPurchase,
      marketTrends,
      peerStrategies,
    ];

    const result = await db.query(sql, params);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

export default router;
