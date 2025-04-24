import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { formatCurrency, formatPercentage, useDataLoader } from '@/lib/utils';
import { Investment, PropertyInvestment, StockInvestment } from '@/types/investment';
import { investmentService } from '@/lib/investment-service';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
const STOCK_SECTORS: Record<string, string> = {
  AAPL: 'Technology',
  MSFT: 'Technology',
  GOOGL: 'Technology',
  AMZN: 'Consumer',
  NVDA: 'Technology'
};

const InvestmentsDesktop = () => {
  const { data: investments, loading, refresh, refreshing } = useDataLoader(
    investmentService.getInvestments,
    [],
    ['investmentsDataUpdated'],
    {
      key: 'investments-cache',
      ttl: 5 * 60 * 1000 // 5 minutes cache
    }
  );

  const calculations = useMemo(() => {
    if (!investments) return {
      totalValue: 0,
      netRealEstateValue: 0,
      monthlyRealEstateIncome: 0,
      assetAllocation: []
    };

    const totalValue = investments.reduce((total, investment) => total + investment.value, 0);
    
    const netRealEstateValue = investments
      .filter((inv): inv is PropertyInvestment => inv.type === 'property')
      .reduce((total, property) => total + (property.currentValue - property.mortgage), 0);
    
    const monthlyRealEstateIncome = investments
      .filter((inv): inv is PropertyInvestment => inv.type === 'property')
      .reduce((total, property) => {
        const monthlyIncome = property.monthlyRent - property.expenses;
        const monthlyMortgage = property.mortgage * (property.rate / 1200);
        return total + monthlyIncome - monthlyMortgage;
      }, 0);
    
    const stockValue = investments
      .filter(inv => inv.type === 'stock')
      .reduce((total, stock) => total + stock.value, 0);
    
    const realEstateValue = investments
      .filter(inv => inv.type === 'property')
      .reduce((total, property) => total + property.value, 0);

    const assetAllocation = [
      { name: 'Stocks', value: stockValue },
      { name: 'Real Estate', value: realEstateValue }
    ];

    return {
      totalValue,
      netRealEstateValue,
      monthlyRealEstateIncome,
      assetAllocation
    };
  }, [investments]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading investments...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={refresh}
          disabled={refreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh Values
        </Button>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Portfolio Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(calculations.totalValue)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Net Real Estate Equity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(calculations.netRealEstateValue)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Real Estate Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(calculations.monthlyRealEstateIncome)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Asset Allocation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={calculations.assetAllocation}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {calculations.assetAllocation.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="stocks">
        <TabsList>
          <TabsTrigger value="stocks">Stocks</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
        </TabsList>

        <TabsContent value="stocks">
          <Card>
            <CardHeader>
              <CardTitle>Stock Holdings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Symbol</TableHead>
                      <TableHead>Sector</TableHead>
                      <TableHead>Shares</TableHead>
                      <TableHead>Current Price</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Change</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {investments?.filter((inv): inv is StockInvestment => inv.type === 'stock')
                      .map((stock) => (
                        <TableRow key={stock.id} className="hover:bg-gray-50">
                          <TableCell className="font-medium">{stock.symbol}</TableCell>
                          <TableCell>{STOCK_SECTORS[stock.symbol] || 'Other'}</TableCell>
                          <TableCell>{stock.shares}</TableCell>
                          <TableCell>{formatCurrency(stock.currentPrice)}</TableCell>
                          <TableCell>{formatCurrency(stock.value)}</TableCell>
                          <TableCell className={stock.change > 0 ? 'text-green-500' : 'text-red-500'}>
                            {formatPercentage(stock.change)}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="properties">
          <Card>
            <CardHeader>
              <CardTitle>Property Holdings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Address</TableHead>
                      <TableHead>Current Value</TableHead>
                      <TableHead>Mortgage</TableHead>
                      <TableHead>Equity</TableHead>
                      <TableHead>Monthly Income</TableHead>
                      <TableHead>ROI</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {investments?.filter((inv): inv is PropertyInvestment => inv.type === 'property')
                      .map((property) => {
                        const equity = property.currentValue - property.mortgage;
                        const monthlyIncome = property.monthlyRent - property.expenses;
                        const monthlyMortgage = property.mortgage * (property.rate / 1200);
                        const netMonthlyIncome = monthlyIncome - monthlyMortgage;
                        const annualROI = (netMonthlyIncome * 12) / equity * 100;

                        return (
                          <TableRow key={property.id} className="hover:bg-gray-50">
                            <TableCell className="font-medium">{property.propertyAddress}</TableCell>
                            <TableCell>{formatCurrency(property.currentValue)}</TableCell>
                            <TableCell>{formatCurrency(property.mortgage)}</TableCell>
                            <TableCell>{formatCurrency(equity)}</TableCell>
                            <TableCell>{formatCurrency(netMonthlyIncome)}</TableCell>
                            <TableCell className={annualROI > 0 ? 'text-green-500' : 'text-red-500'}>
                              {formatPercentage(annualROI)}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InvestmentsDesktop; 