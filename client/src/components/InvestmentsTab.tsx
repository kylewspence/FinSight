import { Plus } from 'lucide-react';
import { ButtonWithIcon } from './ui/buttonwithicon';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { formatCurrency } from '@/lib/utils';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Mock data
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

const performanceData = [
  { date: '2023-01', portfolio: 210000, sp500: 210000 },
  { date: '2023-02', portfolio: 215000, sp500: 216300 },
  { date: '2023-03', portfolio: 220000, sp500: 214200 },
  { date: '2023-04', portfolio: 218000, sp500: 220500 },
  { date: '2023-05', portfolio: 225000, sp500: 226800 },
  { date: '2023-06', portfolio: 230000, sp500: 231000 },
  { date: '2023-07', portfolio: 235000, sp500: 235200 },
  { date: '2023-08', portfolio: 238000, sp500: 228900 },
  { date: '2023-09', portfolio: 240000, sp500: 233100 },
  { date: '2023-10', portfolio: 245000, sp500: 239400 },
  { date: '2023-11', portfolio: 250000, sp500: 243600 },
  { date: '2023-12', portfolio: 258750, sp500: 252000 },
];

export default function InvestmentsTab() {
  const startPortfolio = performanceData[0].portfolio;
  const endPortfolio = performanceData[performanceData.length - 1].portfolio;
  const portfolioChange =
    ((endPortfolio - startPortfolio) / startPortfolio) * 100;

  const startSP500 = performanceData[0].sp500;
  const endSP500 = performanceData[performanceData.length - 1].sp500;
  const sp500Change = ((endSP500 - startSP500) / startSP500) * 100;

  const totalGrowth = portfolioData.totalValue - portfolioData.previousValue;
  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">My Investments</h2>
          <ButtonWithIcon icon={Plus} children="Add Investment" />
        </div>

        {/* // TOTAL PORTFOLIO VALUE */}
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

        {/* // PERFORMANCE CHART */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Performance Over Time</h3>
            <div className="flex gap-2">
              <button className="px-2 py-1 text-xs text-muted-foreground">
                1M
              </button>
              <button className="px-2 py-1 text-xs text-muted-foreground">
                3M
              </button>
              <button className="px-2 py-1 text-xs text-muted-foreground">
                6M
              </button>
              <button className="px-2 py-1 text-xs bg-primary text-primary-foreground rounded-md">
                1Y
              </button>
            </div>
          </div>

          <Card>
            <CardContent className="p-6 pb-0">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={performanceData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}>
                    <CartesianGrid strokeDasharray="3 3" />{' '}
                    {/* // GRID LINES */}
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12 }}
                      tickFormatter={(tick) => {
                        const date = new Date(tick);
                        return date.toLocaleString('default', {
                          month: 'short',
                        });
                      }}
                    />{' '}
                    {/* // DATE LABELS */}
                    <YAxis
                      tick={{ fontSize: 12 }}
                      tickFormatter={(tick) => formatCurrency(tick)}
                      width={80}
                      domain={[startPortfolio - 10000, 'auto']}
                    />
                    {/* // $ LABELS */}
                    <Tooltip
                      formatter={(value: number, name: string) => {
                        const startValue =
                          name === 'Portfolio' ? startPortfolio : startSP500;
                        const percentChange = (
                          ((value - startValue) / startValue) *
                          100
                        ).toFixed(2);

                        return [
                          `${formatCurrency(value)} (${percentChange}%)`,
                          name === 'portfolio' ? 'Portfolio' : 'S&P 500',
                        ];
                      }}
                      labelFormatter={(label) => {
                        const date = new Date(label);
                        return date.toLocaleDateString('default', {
                          month: 'long',
                          year: 'numeric',
                        });
                      }}
                    />{' '}
                    {/* // DATA POINTS */}
                    {/* recharts passes data as "payload" */}
                    <Legend
                      content={({ payload }) => (
                        <div className="flex justify-center gap-10 mt-2">
                          {payload?.map((entry, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-4">
                              {/* Color indicator */}
                              <span
                                className="inline-block w-3 h-3 rounded-full"
                                style={{ backgroundColor: entry.color }}
                              />

                              {/* Label and values */}
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">
                                    {entry.value === 'portfolio'
                                      ? 'Your Portfolio'
                                      : 'S&P 500'}
                                  </span>
                                  <span className="text-sm font-medium">
                                    {entry.value === 'portfolio'
                                      ? formatCurrency(endPortfolio)
                                      : formatCurrency(endSP500)}
                                  </span>
                                  <span
                                    className={
                                      entry.value === 'portfolio'
                                        ? portfolioChange >= 0
                                          ? 'text-green-500'
                                          : 'text-red-500'
                                        : sp500Change >= 0
                                        ? 'text-green-500'
                                        : 'text-red-500'
                                    }>
                                    {entry.value === 'portfolio'
                                      ? (portfolioChange >= 0 ? '+' : '') +
                                        portfolioChange.toFixed(2) +
                                        '%'
                                      : (sp500Change >= 0 ? '+' : '') +
                                        sp500Change.toFixed(2) +
                                        '%'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    />
                    {/* // SUMMARY UNDER CHART */}
                    <Line
                      type="monotone"
                      dataKey="portfolio"
                      stroke="#8884d8"
                    />{' '}
                    {/* // PORTFOLIO LINE */}
                    <Line
                      type="monotone"
                      dataKey="sp500"
                      stroke="#82ca9d"
                    />{' '}
                    {/* // SP500 LINE */}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* // INVESTMENT ACCOUNTS */}
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

        {/* // HOLDINGS BREAKDOWN - PAGINATED */}
        {/* // SEARCH AND FILTER */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Holdings Breakdown</h3>
          <div className="flex items-center gap-3">
            <div className="w-64">
              <Input placeholder="Search holdings..." />
            </div>
            <div className="w-36">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="ETF">ETF</SelectItem>
                  <SelectItem value="Stock">Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* TABLE  */}
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Holdings Breakdown</h3>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-center p-3">Symbol</th>
                      <th className="text-center p-3">Name</th>
                      <th className="text-center p-3">Category</th>
                      <th className="text-center p-3">Shares</th>
                      <th className="text-center p-3">Price</th>
                      <th className="text-center p-3">Value</th>
                      <th className="text-center p-3">Gain/Loss</th>
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
                        <td className="p-3 text-center">{holding.shares}</td>
                        <td className="p-3 text-center">
                          {formatCurrency(holding.price)}
                        </td>
                        <td className="p-3 text-center">
                          {formatCurrency(holding.value)}
                        </td>
                        <td className="p-3 text-center">
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
                      <td className="p-3 font-bold text-center">
                        {formatCurrency(
                          holdingsData.reduce(
                            (sum, holding) => sum + holding.value,
                            0
                          )
                        )}
                      </td>
                      <td className="p-3 font-bold text-center">
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

        {/* // PAGINATION */}
        <div className="py-4 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious className="cursor-pointer" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink isActive className="cursor-pointer">
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink className="cursor-pointer">2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext className="cursor-pointer" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Recent Transactions</h3>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-center p-3">Date</th>
                      <th className="text-center p-3">Type</th>
                      <th className="text-center p-3">Symbol</th>
                      <th className="text-center p-3">Description</th>
                      <th className="text-center p-3">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b hover:bg-muted/50">
                      <td className="p-3">2023-12-15</td>
                      <td className="p-3">Buy</td>
                      <td className="p-3 font-medium">VTI</td>
                      <td className="p-3">Bought 10 shares @ $245.10</td>
                      <td className="p-3 text-center text-red-500">
                        -$2,451.00
                      </td>
                    </tr>
                    <tr className="border-b hover:bg-muted/50">
                      <td className="p-3">2023-12-10</td>
                      <td className="p-3">Dividend</td>
                      <td className="p-3 font-medium">MSFT</td>
                      <td className="p-3">Quarterly dividend</td>
                      <td className="p-3 text-center text-green-500">
                        +$35.10
                      </td>
                    </tr>
                    <tr className="border-b hover:bg-muted/50">
                      <td className="p-3">2023-12-05</td>
                      <td className="p-3">Sell</td>
                      <td className="p-3 font-medium">AAPL</td>
                      <td className="p-3">Sold 5 shares @ $185.75</td>
                      <td className="p-3 text-center text-green-500">
                        +$928.75
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
