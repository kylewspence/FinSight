// Mock data
export const getInvestmentTotal = () => {
  return portfolioData.totalValue;
};

export const getTotalInvestmentIncome = () => {
  const { cash, bonds, stockDividends } = portfolioData.interestIncome;
  return (
    cash.monthlyIncome + bonds.monthlyIncome + stockDividends.monthlyIncome
  );
};

export const portfolioData = {
  totalValue: 4127650,
  previousValue: 3945800,
  changePercent: 4.61,
  // Add interest/yield data
  interestIncome: {
    cash: {
      balance: 547232,
      apy: 4.75,
      monthlyIncome: 2163, // (547232 * 0.0475) / 12
    },
    bonds: {
      balance: 908083,
      apy: 5.25,
      monthlyIncome: 3973, // (908083 * 0.0525) / 12
    },
    stockDividends: {
      balance: 2486590,
      yield: 1.85,
      monthlyIncome: 3834, // (2486590 * 0.0185) / 12
    },
  },
  allocation: [
    { category: 'Stocks', value: 2486590, percentage: 60.2 },
    { category: 'Bonds', value: 908083, percentage: 22.0 },
    { category: 'Real Estate', value: 185745, percentage: 4.5 },
    { category: 'Cash', value: 547232, percentage: 13.3 },
  ],
  cash: 547232,
  bonds: 908083,
  stocks: 2486590,
  realEstate: 185745,
};

export const accountsData = [
  {
    id: 'acc1',
    name: '401(k)',
    institution: 'Fidelity',
    balance: 1870450,
    previousBalance: 1786500,
    changePercent: 4.7,
    lastUpdated: '2023-12-31',
  },
  {
    id: 'acc2',
    name: 'Roth IRA',
    institution: 'Vanguard',
    balance: 962300,
    previousBalance: 924500,
    changePercent: 4.1,
    lastUpdated: '2023-12-31',
  },
  {
    id: 'acc3',
    name: 'Brokerage',
    institution: 'Charles Schwab',
    balance: 1294900,
    previousBalance: 1234800,
    changePercent: 4.9,
    lastUpdated: '2023-12-31',
  },
];

export const holdingsData = [
  {
    id: 'h1',
    symbol: 'VTI',
    name: 'Vanguard Total Stock Market ETF',
    category: 'ETF',
    shares: 3240,
    price: 248.72,
    value: 805852.8,
    costBasis: 712000,
    gain: 93852.8,
    gainPercent: 13.2,
  },
  {
    id: 'h2',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    category: 'Stock',
    shares: 1850,
    price: 182.63,
    value: 337865.5,
    costBasis: 275000,
    gain: 62865.5,
    gainPercent: 22.9,
  },
  {
    id: 'h3',
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    category: 'Stock',
    shares: 825,
    price: 402.95,
    value: 332433.75,
    costBasis: 240000,
    gain: 92433.75,
    gainPercent: 38.5,
  },
  {
    id: 'h4',
    symbol: 'BND',
    name: 'Vanguard Total Bond Market ETF',
    category: 'ETF',
    shares: 5240,
    price: 72.84,
    value: 381681.6,
    costBasis: 395000,
    gain: -13318.4,
    gainPercent: -3.4,
  },
  {
    id: 'h5',
    symbol: 'VNQ',
    name: 'Vanguard Real Estate ETF',
    category: 'ETF',
    shares: 985,
    price: 85.32,
    value: 84040.2,
    costBasis: 79800,
    gain: 4240.2,
    gainPercent: 5.3,
  },
];

export const performanceData = [
  { date: '2023-01', portfolio: 3650000, sp500: 3650000 },
  { date: '2023-02', portfolio: 3685000, sp500: 3726300 },
  { date: '2023-03', portfolio: 3720000, sp500: 3694200 },
  { date: '2023-04', portfolio: 3708000, sp500: 3730500 },
  { date: '2023-05', portfolio: 3775000, sp500: 3796800 },
  { date: '2023-06', portfolio: 3820000, sp500: 3831000 },
  { date: '2023-07', portfolio: 3865000, sp500: 3875200 },
  { date: '2023-08', portfolio: 3888000, sp500: 3788900 },
  { date: '2023-09', portfolio: 3920000, sp500: 3843100 },
  { date: '2023-10', portfolio: 3965000, sp500: 3929400 },
  { date: '2023-11', portfolio: 4020000, sp500: 3986600 },
  { date: '2023-12', portfolio: 4127650, sp500: 4072000 },
];

// Add this to mockData.ts
export const upcomingTasks = [
  {
    id: 1,
    title: 'Property Tax Payment',
    description: 'Annual property tax for 123 Main St',
    dueDate: '2024-07-15',
    amount: 8750,
    priority: 'high',
    category: 'tax',
  },
  {
    id: 2,
    title: 'HOA Annual Review',
    description:
      'Review HOA financial statements and budget for Oakwood Community',
    dueDate: '2024-06-30',
    amount: null,
    priority: 'medium',
    category: 'review',
  },
  {
    id: 3,
    title: 'Investment Portfolio Rebalancing',
    description: 'Quarterly review and rebalancing of investment allocations',
    dueDate: '2024-07-01',
    amount: null,
    priority: 'medium',
    category: 'investment',
  },
  {
    id: 4,
    title: 'Insurance Premium Payment',
    description: "Homeowner's insurance for mountain vacation property",
    dueDate: '2024-08-15',
    amount: 2450,
    priority: 'high',
    category: 'insurance',
  },
  {
    id: 5,
    title: 'Rental Property Inspection',
    description: 'Schedule annual inspection for 456 Oak Avenue',
    dueDate: '2024-09-01',
    amount: null,
    priority: 'low',
    category: 'property',
  },
];
