import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getSpendingData, getInvestmentsData } from '@/lib/csv-storage';
import { Loader2, TrendingUp, AlertCircle, Lightbulb, Users, Target, BarChart2, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface Insight {
  type: 'spending' | 'budget' | 'investment' | 'savings' | 'comparison' | 'health';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  action?: string;
  metrics?: {
    value: number;
    comparison?: number;
    unit?: string;
  };
}

interface Transaction {
  date: string;
  description: string;
  category: string;
  amount: string;
}

interface Investment {
  date: string;
  symbol: string;
  shares: number;
  price: number;
  currentPrice?: number;
  value?: number;
  change?: number;
}

interface FinancialGoal {
  id: string;
  type: 'savings' | 'investment';
  name: string;
  target: number;
  current: number;
  priority: 'high' | 'medium' | 'low';
}

const FinancialInsights = () => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [financialHealthScore, setFinancialHealthScore] = useState<number>(31.6);
  const [ageComparison, setAgeComparison] = useState({
    savings: 15000,
    investments: 50000,
    debt: 25000
  });
  const [goals] = useState<FinancialGoal[]>([
    {
      id: '1',
      type: 'savings',
      name: 'Emergency Fund',
      target: 10000,
      current: 0,
      priority: 'high'
    },
    {
      id: '2',
      type: 'investment',
      name: 'Retirement',
      target: 1000000,
      current: 0,
      priority: 'high'
    }
  ]);

  useEffect(() => {
    const analyzeData = async () => {
      try {
        setLoading(true);
        const spendingData = await getSpendingData();
        const investmentData = await getInvestmentsData();

        // Generate insights based on the data
        const generatedInsights: Insight[] = [];

        // Calculate financial health score (0-100)
        let healthScore = 0;
        const factors: { [key: string]: number } = {};

        // Analyze spending patterns
        if (spendingData.length > 0) {
          // Calculate monthly averages
          const monthlyTotals: { [key: string]: number } = {};
          spendingData.forEach((transaction: Transaction) => {
            const [month, day, year] = transaction.date.split('/');
            const dateKey = `${year}-${month.padStart(2, '0')}`;
            const amount = parseFloat(transaction.amount);
            if (amount < 0) { // Only count actual spending
              monthlyTotals[dateKey] = (monthlyTotals[dateKey] || 0) + Math.abs(amount);
            }
          });

          // Calculate average monthly spending
          const monthlySpending = Object.values(monthlyTotals);
          const averageSpending = monthlySpending.reduce((a, b) => a + b, 0) / monthlySpending.length;

          // Identify significant changes
          const recentMonths = Object.entries(monthlyTotals)
            .sort((a, b) => b[0].localeCompare(a[0]))
            .slice(0, 3);
          
          if (recentMonths.length >= 2) {
            const latestMonth = recentMonths[0][1];
            const previousMonth = recentMonths[1][1];
            const change = ((latestMonth - previousMonth) / previousMonth) * 100;

            if (Math.abs(change) > 20) {
              generatedInsights.push({
                type: 'spending',
                title: 'Significant Spending Change',
                description: `Your spending ${change > 0 ? 'increased' : 'decreased'} by ${Math.abs(change).toFixed(1)}% compared to last month.`,
                impact: Math.abs(change) > 30 ? 'high' : 'medium',
                action: change > 0 ? 'Consider reviewing your recent expenses.' : 'Great job on reducing expenses!'
              });
            }
          }

          // Analyze category spending
          const categoryTotals: { [key: string]: number } = {};
          spendingData.forEach((transaction: Transaction) => {
            const amount = parseFloat(transaction.amount);
            if (amount < 0 && transaction.category) {
              categoryTotals[transaction.category] = (categoryTotals[transaction.category] || 0) + Math.abs(amount);
            }
          });

          // Identify largest spending category
          const largestCategory = Object.entries(categoryTotals)
            .sort((a, b) => b[1] - a[1])[0];

          if (largestCategory && largestCategory[1] > averageSpending * 0.3) {
            generatedInsights.push({
              type: 'budget',
              title: 'Category Spending Alert',
              description: `${largestCategory[0]} accounts for ${((largestCategory[1] / averageSpending) * 100).toFixed(1)}% of your monthly spending.`,
              impact: 'medium',
              action: 'Consider diversifying your spending across categories.'
            });
          }

          // Calculate savings rate
          const totalIncome = spendingData
            .filter((t: Transaction) => parseFloat(t.amount) > 0)
            .reduce((sum: number, t: Transaction) => sum + Math.abs(parseFloat(t.amount)), 0);
          
          const totalExpenses = spendingData
            .filter((t: Transaction) => parseFloat(t.amount) < 0)
            .reduce((sum: number, t: Transaction) => sum + Math.abs(parseFloat(t.amount)), 0);

          const savingsRate = ((totalIncome - totalExpenses) / totalIncome) * 100;
          factors.savingsRate = savingsRate;

          // Add savings rate insight
          generatedInsights.push({
            type: 'savings',
            title: 'Savings Rate Analysis',
            description: `Your current savings rate is ${Math.round(savingsRate)}% of your income.`,
            impact: savingsRate >= 20 ? 'low' : savingsRate >= 10 ? 'medium' : 'high',
            action: savingsRate < 20 ? 'Consider increasing your savings rate to at least 20%.' : 'Great job maintaining a healthy savings rate!',
            metrics: {
              value: Math.round(savingsRate),
              comparison: 20, // Recommended savings rate
              unit: '%'
            }
          });
        }

        // Analyze investments
        if (investmentData.length > 0) {
          const totalValue = investmentData.reduce((total: number, investment: Investment) => {
            const value = investment.shares * investment.price;
            return total + (isNaN(value) ? 0 : value);
          }, 0);

          // Check for portfolio concentration
          const largestHolding = investmentData
            .map((investment: Investment) => ({
              symbol: investment.symbol,
              value: investment.shares * investment.price
            }))
            .sort((a: { value: number }, b: { value: number }) => b.value - a.value)[0];

          if (largestHolding && (largestHolding.value / totalValue) > 0.3) {
            generatedInsights.push({
              type: 'investment',
              title: 'Portfolio Concentration',
              description: `${largestHolding.symbol} makes up ${((largestHolding.value / totalValue) * 100).toFixed(1)}% of your portfolio.`,
              impact: 'medium',
              action: 'Consider diversifying your investments to reduce risk.'
            });
          }

          // Calculate portfolio diversity score
          const holdings = investmentData.map((investment: Investment) => ({
            symbol: investment.symbol,
            percentage: (investment.shares * investment.price) / totalValue
          }));

          const diversityScore = Math.round(100 - (Math.max(...holdings.map((h: { percentage: number }) => h.percentage)) * 100));
          factors.diversity = diversityScore;

          // Add diversity insight
          generatedInsights.push({
            type: 'investment',
            title: 'Portfolio Diversity',
            description: `Your portfolio diversity score is ${diversityScore}/100.`,
            impact: diversityScore >= 70 ? 'low' : diversityScore >= 50 ? 'medium' : 'high',
            action: diversityScore < 70 ? 'Consider diversifying your portfolio further.' : 'Your portfolio is well-diversified!',
            metrics: {
              value: diversityScore,
              comparison: 70,
              unit: '/100'
            }
          });
        }

        // Calculate overall financial health score
        healthScore = Math.round(
          (factors.savingsRate || 0) * 0.4 + // 40% weight
          (factors.diversity || 0) * 0.3 +   // 30% weight
          (Object.values(factors).length > 0 ? 30 : 0) // 30% base score
        );

        setFinancialHealthScore(healthScore);

        // Add financial health insight
        generatedInsights.push({
          type: 'health',
          title: 'Financial Health Score',
          description: `Your overall financial health score is ${healthScore}/100.`,
          impact: healthScore >= 80 ? 'low' : healthScore >= 60 ? 'medium' : 'high',
          action: healthScore < 80 ? 'Focus on improving your savings rate and portfolio diversity.' : 'Excellent financial health!',
          metrics: {
            value: healthScore,
            comparison: 80,
            unit: '/100'
          }
        });

        // Add age-based comparison insights
        // Note: These would typically come from an API or database
        const ageGroupAverages = {
          savings: 15000, // Example average savings for age group
          investments: 50000, // Example average investments for age group
          debt: 25000 // Example average debt for age group
        };

        setAgeComparison(ageGroupAverages);

        generatedInsights.push({
          type: 'comparison',
          title: 'Age Group Comparison',
          description: 'How you compare to others in your age group:',
          impact: 'medium',
          metrics: {
            value: 0,
            comparison: 0
          }
        });

        setInsights(generatedInsights);
      } catch (error) {
        console.error('Error analyzing data:', error);
      } finally {
        setLoading(false);
      }
    };

    analyzeData();
  }, []);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'spending':
        return <BarChart2 className="h-4 w-4" />;
      case 'budget':
        return <DollarSign className="h-4 w-4" />;
      case 'investment':
        return <TrendingUp className="h-4 w-4" />;
      case 'savings':
        return <Target className="h-4 w-4" />;
      case 'comparison':
        return <Users className="h-4 w-4" />;
      case 'health':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Lightbulb className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Financial Goals</h3>
        <Button variant="outline" size="sm">Add Goal</Button>
      </div>

      {goals.map(goal => (
        <Card key={goal.id} className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">{goal.name}</h4>
              <p className="text-sm text-muted-foreground">
                {goal.type === 'savings' ? 'Savings' : 'Investment'} • {goal.priority} Priority
              </p>
            </div>
            <div className="text-right">
              <div className="font-medium">{formatCurrency(goal.current)}</div>
              <div className="text-sm text-muted-foreground">of {formatCurrency(goal.target)}</div>
            </div>
          </div>
        </Card>
      ))}

      <Card className="p-4">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-lg font-medium">Financial Health Score</CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <div className="flex items-end justify-between">
            <div className="text-3xl font-bold">{financialHealthScore}</div>
            <div className="text-xl text-muted-foreground">/100</div>
          </div>
          <div className="mt-4 h-2 w-full bg-gray-200 rounded-full">
            <div
              className="h-2 bg-blue-500 rounded-full"
              style={{ width: `${financialHealthScore}%` }}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="p-4">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="text-lg font-medium">Age Group Comparison</CardTitle>
        </CardHeader>
        <CardContent className="px-0 pb-0 space-y-4">
          <div>
            <div className="flex justify-between text-sm">
              <span>Savings</span>
              <span className="font-medium">{formatCurrency(ageComparison.savings)} avg</span>
            </div>
            <div className="mt-1 h-2 w-full bg-gray-200 rounded-full">
              <div className="h-2 bg-blue-500 rounded-full" style={{ width: '60%' }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm">
              <span>Investments</span>
              <span className="font-medium">{formatCurrency(ageComparison.investments)} avg</span>
            </div>
            <div className="mt-1 h-2 w-full bg-gray-200 rounded-full">
              <div className="h-2 bg-green-500 rounded-full" style={{ width: '40%' }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm">
              <span>Debt</span>
              <span className="font-medium">{formatCurrency(ageComparison.debt)} avg</span>
            </div>
            <div className="mt-1 h-2 w-full bg-gray-200 rounded-full">
              <div className="h-2 bg-red-500 rounded-full" style={{ width: '80%' }} />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2">
        {insights.map((insight, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-start gap-4">
              <div className={`mt-1 ${getImpactColor(insight.impact)}`}>
                {getInsightIcon(insight.type)}
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{insight.title}</h4>
                <p className="text-sm text-muted-foreground">{insight.description}</p>
                {insight.action && (
                  <p className="mt-1 text-sm font-medium text-blue-500">{insight.action}</p>
                )}
                {insight.metrics && (
                  <div className="mt-2">
                    <div className="flex items-end gap-1">
                      <span className="text-2xl font-bold">{insight.metrics.value}</span>
                      {insight.metrics.unit && (
                        <span className="text-muted-foreground">{insight.metrics.unit}</span>
                      )}
                    </div>
                    {insight.metrics.comparison && (
                      <div className="mt-1 h-2 w-full bg-gray-200 rounded-full">
                        <div
                          className="h-2 bg-blue-500 rounded-full"
                          style={{
                            width: `${(insight.metrics.value / insight.metrics.comparison) * 100}%`,
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FinancialInsights; 