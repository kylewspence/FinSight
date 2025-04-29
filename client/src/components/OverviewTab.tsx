import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';

// Sample data for the asset allocation chart
const assetAllocationData = [
  { name: 'Real Estate', value: 320000, color: '#F26C6C' }, // Red
  { name: 'Stocks', value: 80000, color: '#1E88E5' }, // Blue
  { name: 'Bonds', value: 30000, color: '#FDD835' }, // Yellow
  { name: 'Cash', value: 20000, color: '#43A047' }, // Green
];

export default function OverviewTab() {
  return (
    <>
      <div className="grid grid-cols-3 gap-6">
        <Card className="p-4 w-full">
          <h3 className="font-medium text-md mb-2">Total Assets</h3>
          <p className="text-2xl font-bold">$450,000</p>
        </Card>

        <Card className="p-4">
          <h3 className="font-medium text-md mb-2">Monthly Income</h3>
          <p className="text-2xl font-bold">$8,500</p>
        </Card>

        <Card className="p-4">
          <h3 className="font-medium text-md mb-2">Monthly Expenses</h3>
          <p className="text-2xl font-bold">$4,200</p>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6">
        <Card className="p-4 w-full">
          <CardHeader>
            <CardTitle>Asset Allocation</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={assetAllocationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }>
                  {assetAllocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
