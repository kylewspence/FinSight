import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getSpendingData } from '@/lib/csv-storage';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/lib/utils';
import { Transaction } from '@/types/transaction';

interface MonthlyData {
  name: string;
  amount: number;
}

interface CategoryData {
  name: string;
  amount: number;
}

const Spending = () => {
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);

  const processMonthlyData = (data: Transaction[]) => {
    if (!data || data.length === 0) return [];

    const monthlyTotals = new Map<string, number>();

    data.forEach(item => {
      try {
        const date = new Date(item.date);
        const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' });
        // Only include purchases (positive amounts) in spending totals
        if (item.amount > 0) {
          monthlyTotals.set(
            monthYear,
            (monthlyTotals.get(monthYear) || 0) + item.amount
          );
        }
      } catch (error) {
        console.error('Error formatting date:', error);
      }
    });

    return Array.from(monthlyTotals.entries())
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => {
        const dateA = new Date(a.name);
        const dateB = new Date(b.name);
        return dateA.getTime() - dateB.getTime();
      });
  };

  const processCategoryData = (data: Transaction[]) => {
    if (!data || data.length === 0) return [];

    const categoryTotals = new Map<string, number>();

    data.forEach(item => {
      // Only include purchases (positive amounts) in category totals
      if (item.amount > 0) {
        const category = item.category || 'Uncategorized';
        categoryTotals.set(
          category,
          (categoryTotals.get(category) || 0) + item.amount
        );
      }
    });

    return Array.from(categoryTotals.entries())
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getSpendingData();
        const monthly = processMonthlyData(data);
        const category = processCategoryData(data);

        setMonthlyData(monthly);
        setCategoryData(category);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    const handleDataUpdate = () => {
      loadData();
    };

    window.addEventListener('storage', handleDataUpdate);
    window.addEventListener('spendingDataUpdated', handleDataUpdate);

    return () => {
      window.removeEventListener('storage', handleDataUpdate);
      window.removeEventListener('spendingDataUpdated', handleDataUpdate);
    };
  }, []);

  if (loading) {
    return (
      <Card className="p-6">
        <CardHeader>
          <CardTitle>Loading spending data...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Monthly Spending</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => formatCurrency(value)} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Bar dataKey="amount" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Spending by Category</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tickFormatter={(value) => formatCurrency(value)} />
              <YAxis type="category" dataKey="name" width={100} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Bar dataKey="amount" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Spending; 