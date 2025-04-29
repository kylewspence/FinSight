import { Plus } from 'lucide-react';
import { ButtonWithIcon } from './ui/buttonwithicon';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { formatCurrency } from '@/lib/utils';

// Mock data - in a real app this would come from parsing CSV uploads
const portfolioData = {
  totalValue: 258750,
  previousValue: 245000,
  changePercent: 5.61,
  allocation: [
    { category: 'Stocks', value: 145000, percentage: 56 },
    { category: 'Bonds', value: 45000, percentage: 17.4 },
    { category: 'Real Estate', value: 35000, percentage: 13.5 },
    { category: 'Cash', value: 33750, percentage: 13.1 },
  ],
};

const accountsData = [
  {
    id: 'acc1',
    name: '401(k)',
    institution: 'Fidelity',
    balance: 125000,
    previousBalance: 118500,
    changePercent: 5.5,
    lastUpdated: '2023-12-31',
  },
  {
    id: 'acc2',
    name: 'Roth IRA',
    institution: 'Vanguard',
    balance: 68500,
    previousBalance: 65000,
    changePercent: 5.4,
    lastUpdated: '2023-12-31',
  },
  {
    id: 'acc3',
    name: 'Brokerage',
    institution: 'Charles Schwab',
    balance: 65250,
    previousBalance: 61500,
    changePercent: 6.1,
    lastUpdated: '2023-12-31',
  },
];

const holdingsData = [
  {
    id: 'h1',
    symbol: 'VTI',
    name: 'Vanguard Total Stock Market ETF',
    category: 'ETF',
    shares: 240,
    price: 248.72,
    value: 59692.8,
    costBasis: 52000,
    gain: 7692.8,
    gainPercent: 14.8,
  },
  {
    id: 'h2',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    category: 'Stock',
    shares: 105,
    price: 182.63,
    value: 19176.15,
    costBasis: 15000,
    gain: 4176.15,
    gainPercent: 27.8,
  },
  {
    id: 'h3',
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    category: 'Stock',
    shares: 45,
    price: 402.95,
    value: 18132.75,
    costBasis: 12000,
    gain: 6132.75,
    gainPercent: 51.1,
  },
  {
    id: 'h4',
    symbol: 'BND',
    name: 'Vanguard Total Bond Market ETF',
    category: 'ETF',
    shares: 320,
    price: 72.84,
    value: 23308.8,
    costBasis: 24500,
    gain: -1191.2,
    gainPercent: -4.9,
  },
  {
    id: 'h5',
    symbol: 'VNQ',
    name: 'Vanguard Real Estate ETF',
    category: 'ETF',
    shares: 180,
    price: 85.32,
    value: 15357.6,
    costBasis: 14200,
    gain: 1157.6,
    gainPercent: 8.2,
  },
];

export default function InvestmentsTab() {
  const totalGrowth = portfolioData.totalValue - portfolioData.previousValue;
  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">My Investments</h2>
          <ButtonWithIcon icon={Plus} children="Add Investment" />
        </div>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-md font-bold text-muted-foreground">
                Total Portfolio Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(portfolioData.totalValue)}
              </div>
              <div className="mt-1">
                <span
                  className={
                    totalGrowth >= 0 ? 'text-green-500' : 'text-red-500'
                  }>
                  {totalGrowth >= 0 ? '+' : ''}
                  {formatCurrency(totalGrowth)}
                </span>
                <span
                  className={`ml-2 ${
                    totalGrowth >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                  ({portfolioData.changePercent.toFixed(2)}%)
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-md font-bold text-muted-foreground">
                Asset Allocation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {portfolioData.allocation.map((item) => (
                  <div key={item.category} className="flex items-center">
                    <span className="text-sm w-24">{item.category}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            item.category === 'Bonds'
                              ? 'bg-green-500'
                              : item.category === 'Stocks'
                              ? 'bg-blue-500'
                              : item.category === 'Real Estate'
                              ? 'bg-amber-500'
                              : item.category === 'Cash'
                              ? 'bg-purple-500'
                              : 'bg-slate-500'
                          }`}
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">
                        {item.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Performance Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">1 Month</span>
                  <span className="text-sm font-medium text-green-500">
                    +2.3%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">3 Months</span>
                  <span className="text-sm font-medium text-green-500">
                    +4.8%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Year to Date</span>
                  <span className="text-sm font-medium text-green-500">
                    +8.2%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">1 Year</span>
                  <span className="text-sm font-medium text-green-500">
                    +12.5%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Investment Accounts</h3>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {accountsData.map((account) => (
              <Card key={account.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <CardTitle className="text-md font-bold">
                      {account.name}
                    </CardTitle>
                    <span className="text-sm text-muted-foreground">
                      {account.institution}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(account.balance)}
                  </div>
                  <div className="mt-1 flex flex-col justify-between">
                    <div>
                      <span
                        className={
                          account.changePercent >= 0
                            ? 'text-green-500'
                            : 'text-red-500'
                        }>
                        {account.changePercent >= 0 ? '+' : ''}
                        {account.changePercent.toFixed(2)}%
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-2">
                      Last updated:{' '}
                      {new Date(account.lastUpdated).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Holdings Breakdown</h3>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Symbol</th>
                      <th className="text-left p-3">Name</th>
                      <th className="text-left p-3">Category</th>
                      <th className="text-right p-3">Shares</th>
                      <th className="text-right p-3">Price</th>
                      <th className="text-right p-3">Value</th>
                      <th className="text-right p-3">Gain/Loss</th>
                    </tr>
                  </thead>
                  <tbody>
                    {holdingsData.map((holding) => (
                      <tr
                        key={holding.id}
                        className="border-b hover:bg-muted/50">
                        <td className="p-3 font-medium">{holding.symbol}</td>
                        <td className="p-3">{holding.name}</td>
                        <td className="p-3">{holding.category}</td>
                        <td className="p-3 text-right">{holding.shares}</td>
                        <td className="p-3 text-right">
                          {formatCurrency(holding.price)}
                        </td>
                        <td className="p-3 text-right">
                          {formatCurrency(holding.value)}
                        </td>
                        <td className="p-3 text-right">
                          <div
                            className={
                              holding.gainPercent >= 0
                                ? 'text-green-500'
                                : 'text-red-500'
                            }>
                            {formatCurrency(holding.gain)} (
                            {holding.gainPercent >= 0 ? '+' : ''}
                            {holding.gainPercent.toFixed(1)}%)
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-muted/50">
                      <td colSpan={5} className="p-3 font-bold text-right">
                        Total:
                      </td>
                      <td className="p-3 font-bold text-right">
                        {formatCurrency(
                          holdingsData.reduce(
                            (sum, holding) => sum + holding.value,
                            0
                          )
                        )}
                      </td>
                      <td className="p-3 font-bold text-right">
                        {formatCurrency(
                          holdingsData.reduce(
                            (sum, holding) => sum + holding.gain,
                            0
                          )
                        )}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
