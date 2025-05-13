import { PropertyType } from '@/types/PropertyTypes';
import { readToken } from './data';

export interface AIInsights {
  overview: string;
  timelineToPurchase: string;
  marketTrends: string;
  peerStrategies: string;
}

export async function getFinancialInsights(
  properties: PropertyType[],
  messages: string[] = []
): Promise<{ insights: AIInsights }> {
  try {
    // Create a trimmed version of properties without images
    const trimmedProperties = properties.map((prop) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { image, ...rest } = prop;
      return rest;
    });

    const token = readToken();
    if (!token) {
      throw new Error('No token found');
    }

    const payload = {
      model: 'gpt-4-turbo',
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
      ${JSON.stringify(trimmedProperties, null, 2)}
      
      OUTPUT FORMAT (strictly follow this structure):
      {
        "overview": "Brief summary of the user's financial health. Mention overall asset value, income vs. liabilities, and anything concerning or promising.",
        "timelineToPurchase": "Estimate when the user might be able to purchase another investment property. Consider monthly rent, liabilities, taxes (~25%), property management (~8%), and reserves. Be realistic.",
        "marketTrends": "Suggest 2-3 up-and-coming markets for similar property types. Give 1 reason why each is worth researching.",
        "peerStrategies": "Speculate on what other real estate investors might be doing with similar portfolios and recommend one strategic adjustment for this user."
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

    const data = await response.json();
    console.log('AI response:', data);
    return data;
  } catch (error) {
    console.error('Error fetching insights:', error);
    throw error;
  }
}

export async function saveInsights(insights: AIInsights): Promise<AIInsights> {
  try {
    console.log('saveInsights function called');
    const token = readToken();
    if (!token) {
      throw new Error('No token found');
    }
    console.log('insights before save at saveInsights:', insights);
    console.log(
      'Saving insights with data:',
      JSON.stringify(insights, null, 2)
    );
    const response = await fetch('/api/ai/insights/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(insights),
    });

    if (!response.ok) {
      throw new Error('Failed to save insights');
    }

    return await response.json();
  } catch (error) {
    console.error('Error saving insights:', error);
    throw error;
  }
}

export async function getAndSaveInsights(
  properties: PropertyType[]
): Promise<AIInsights> {
  console.log('getAndSaveInsights function called');
  const result = await getFinancialInsights(properties);
  const insights = result.insights;
  if (insights) {
    await saveInsights(insights);
  }
  return insights;
}
