import { ClientError, authMiddleware } from '../lib/index.js';
import express from 'express';
import OpenAI from 'openai';

const router = express.Router();
router.use(authMiddleware);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// POST endpoint for AI insights
router.post('/insights', async (req, res, next) => {
  try {
    console.log('POST /ai/insights requested');

    const userId = Number(req.user?.userId);
    if (!userId) throw new ClientError(401, 'Authentication required');

    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      throw new ClientError(400, 'Valid messages array required');
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages,
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content || '';

    try {
      const insights = JSON.parse(content);
      res.json({ insights });
    } catch {
      res.json({
        insights: {
          overview: content,
          timeline_to_purchase: 'No data available',
          market_trends: 'No data available',
          peer_strategies: 'No data available',
        },
      });
    }
  } catch (err) {
    console.error('Error in POST /ai/insights:', err);
    next(err);
  }
});

export default router;
