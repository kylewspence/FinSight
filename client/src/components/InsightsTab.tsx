import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart2, Target, Brain, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';
import { getFinancialInsights } from '@/lib/ai-service';
import { PropertyType } from '@/types/PropertyTypes';
import { saveInsights } from '@/lib/ai-service';
import type { AIInsights } from '@/lib/ai-service';

interface AIInsightsProps {
  properties: PropertyType[];
}

export function AIInsights({ properties }: AIInsightsProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [insights, setInsights] = useState<AIInsights | null>(null);
  const [loading, setLoading] = useState(false);

  console.log('insights', insights);

  useEffect(() => {
    console.log('Insights state changed:', insights);
  }, [insights]);

  async function generateAndSaveInsights() {
    try {
      setLoading(true);
      // Get insights with corrected typing
      const result = await getFinancialInsights(properties);
      console.log('Generated insights response:', result);

      if (result && result.insights) {
        // Validate that all required fields exist and are strings
        const { overview, timelineToPurchase, marketTrends, peerStrategies } =
          result.insights;

        if (
          typeof overview === 'string' &&
          typeof timelineToPurchase === 'string' &&
          typeof marketTrends === 'string' &&
          typeof peerStrategies === 'string'
        ) {
          setInsights(result.insights);

          try {
            await saveInsights(result.insights);
            console.log('Saved insights successfully');
          } catch (saveError) {
            console.error('Error saving insights:', saveError);
          }
        } else {
          console.error('Invalid insights format:', result.insights);
        }
      }
    } catch (err) {
      console.error('Error generating or saving insights:', err);
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

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center">
            <BarChart2 className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="goals" className="flex items-center">
            <Target className="mr-2 h-4 w-4" />
            Goals
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="flex items-center">
            <TrendingUp className="mr-2 h-4 w-4" />
            Recommendations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Financial Health Overview</CardTitle>
            </CardHeader>
            <CardContent>
              {insights && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-lg">Portfolio Overview</h3>
                    <p>{insights.overview}</p>
                  </div>

                  <div>
                    <h3 className="font-medium text-lg">
                      Timeline to Purchase
                    </h3>
                    <p>{insights.timelineToPurchase}</p>
                  </div>

                  <div>
                    <h3 className="font-medium text-lg">Market Trends</h3>
                    <p>{insights.marketTrends}</p>
                  </div>

                  <div>
                    <h3 className="font-medium text-lg">Peer Strategies</h3>
                    <p>{insights.peerStrategies}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6"></TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground">
                Based on your financial data, here are personalized
                recommendations:
              </div>
              {/* We'll add AI recommendations component here */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default AIInsights;
