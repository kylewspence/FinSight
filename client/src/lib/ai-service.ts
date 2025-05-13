import { PropertyType } from '@/types/PropertyTypes';
import { readToken } from './data';

export interface AIInsights {
  overview: string;
  timeline_to_purchase: string;
  market_trends: string;
  peer_strategies: string;
}

export async function getFinancialInsights(
  properties: PropertyType[],
  messages: string[] = []
): Promise<AIInsights[]> {
  try {
    console.log('properties sent to AI:', properties);
    const token = readToken();
    if (!token) {
      throw new Error('No token found');
    }

    const payload = {
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content:
            "You are an expert financial advisor and AI analyst specialized in real estate investing. Your job is to analyze a user's real estate portfolio and return clear, actionable insights across key financial categories.",
        },
        {
          role: 'user',
          content: `
      Based on the following real estate portfolio data, return a JSON object containing AI-driven insights and recommendations. Your response should be helpful, realistic, and tailored to the user's financial position.
      
      DATA:
      ${JSON.stringify(properties, null, 2)}
      
      OUTPUT FORMAT (strictly follow this structure):
      {
        "overview": "Brief summary of the user's financial health. Mention overall asset value, income vs. liabilities, and anything concerning or promising.",
        "timeline_to_purchase": "Estimate when the user might be able to purchase another investment property. Consider monthly rent, liabilities, taxes (~25%), property management (~8%), and reserves. Be realistic.",
        "market_trends": "Suggest 2-3 up-and-coming markets for similar property types. Give 1 reason why each is worth researching.",
        "peer_strategies": "Speculate on what other real estate investors might be doing with similar portfolios and recommend one strategic adjustment for this user."
      }
      
      Rules:
      - Keep each section concise but insightful (2–5 sentences).
      - If data is missing, note assumptions or return “insufficient data.”
      `,
        },
        ...messages.map((msg) => ({ role: 'user' as const, content: msg })),
      ],
    };

    const response = await fetch('/api/ai/insights', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch insights');
    }
    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Raw response data:', data);
    return data.insights || [];
  } catch (error) {
    console.error('Error fetching insights:', error);
    throw error;
  }
}

// You can add this function to your ai-service.ts file
export async function testAIEndpoint() {
  const token = readToken();
  if (!token) {
    throw new Error('No token found');
  }

  const testMessages = [
    {
      role: 'system',
      content:
        'You are a helpful financial assistant that provides insights in JSON format.',
    },
    {
      role: 'user',
      content:
        'Please give me a simple financial insight about real estate investing. Format as a JSON with keys: "tip", "reason", "action".',
    },
  ];

  const response = await fetch('/api/ai/insights', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: testMessages,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch insights: ${response.status}`);
  }

  const data = await response.json();
  console.log('AI Endpoint Test Response:', data);
  return data;
}
