import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain } from 'lucide-react';
import { Button } from './ui/button';
import { getFinancialInsights } from '@/lib/ai-service';
import { PropertyType } from '@/types/PropertyTypes';
import { saveInsights } from '@/lib/ai-service';
import type { AIInsights } from '@/lib/ai-service';

interface AIInsightsProps {
  properties: PropertyType[];
  insights: AIInsights | null;
  isLoading: boolean;
  onInsightsUpdated: () => Promise<void>;
}

export function AIInsightsTab({
  properties,
  insights,
  isLoading,
  onInsightsUpdated,
}: AIInsightsProps) {
  const [loading, setLoading] = useState(false);

  async function generateAndSaveInsights() {
    try {
      setLoading(true);
      const result = await getFinancialInsights(properties);

      if (result && result.insights) {
        const { overview, timelineToPurchase, marketTrends, peerStrategies } =
          result.insights;

        if (
          typeof overview === 'string' &&
          typeof timelineToPurchase === 'string' &&
          typeof marketTrends === 'string' &&
          typeof peerStrategies === 'string'
        ) {
          try {
            await saveInsights(result.insights);
            await onInsightsUpdated();
          } catch (saveError) {
            console.error('Error saving insights:', saveError);
          }
        }
      }
    } catch (err) {
      console.error('Error generating insights:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center">
            <Brain className="mr-2 h-8 w-8" />
            AI Financial Insights
          </h2>
          <p className="text-muted-foreground">
            AI-powered analysis and recommendations for your financial journey
          </p>
        </div>
        <Button onClick={generateAndSaveInsights} disabled={loading}>
          {loading ? 'Processing...' : 'Generate Insights'}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Insights</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading insights...</p>
          ) : insights ? (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Overview</h3>
                <p className="text-sm text-gray-600">{insights.overview}</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Timeline to Purchase</h3>
                <p className="text-sm text-gray-600">
                  {insights.timelineToPurchase}
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Market Trends</h3>
                {insights.marketTrends.includes('1.') ? (
                  // If it contains numbered items, split and display as a list
                  <ul className="list-disc pl-5 space-y-2">
                    {insights.marketTrends
                      .split(/\d+\.\s+/) // Split by numbers followed by dot and space
                      .filter((item) => item.trim().length > 0) // Remove empty strings
                      .map((trend, index) => (
                        <li key={index} className="text-sm text-gray-600">
                          {trend.trim()}
                        </li>
                      ))}
                  </ul>
                ) : (
                  // Otherwise display as regular text
                  <p className="text-sm text-gray-600">
                    {insights.marketTrends}
                  </p>
                )}
              </div>
              <div>
                <h3 className="font-medium mb-2">Peer Strategies</h3>
                <p className="text-sm text-gray-600">
                  {insights.peerStrategies}
                </p>
              </div>
            </div>
          ) : (
            <p>Generate insights to see your financial analysis here.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default AIInsightsTab;
