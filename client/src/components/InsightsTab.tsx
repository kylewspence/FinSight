import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart2, Target, Brain, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';
import { getFinancialInsights, testAIEndpoint } from '@/lib/ai-service';
import { PropertyType } from '@/types/PropertyTypes';

interface AIInsightsProps {
  properties: PropertyType[];
}

export function AIInsights({ properties }: AIInsightsProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [insights, setInsights] = useState<any>(null);

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
            <CardContent></CardContent>
          </Card>

          <Button
            onClick={async () => {
              const result = await getFinancialInsights(properties);
              setInsights(result);
              console.log(result);
            }}>
            Get AI Insights
          </Button>
          <Button onClick={testAIEndpoint}>Test AI Endpoint</Button>
          {insights && (
            <div className="mt-4">
              <h3 className="text-lg font-medium">AI Insights</h3>
              <pre className="mt-2 p-4 bg-gray-100 rounded-md overflow-auto">
                {JSON.stringify(insights, null, 2)}
              </pre>
            </div>
          )}
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
