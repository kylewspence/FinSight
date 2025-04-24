export interface StockInvestment {
  type: 'stock';
  id: string;
  date: string;
  symbol: string;
  shares: number;
  price: number;
  currentPrice: number;
  value: number;
  change: number;
}

export interface PropertyInvestment {
  type: 'property';
  id: string;
  date: string;
  propertyAddress: string;
  purchasePrice: number;
  currentValue: number;
  mortgage: number;
  rate: number;
  monthlyRent: number;
  expenses: number;
  value: number;
  change: number;
}

export type Investment = StockInvestment | PropertyInvestment;

// Mock data that would come from an API
const mockInvestments: Investment[] = [
  {
    type: 'stock',
    id: '1',
    date: '2024-01-01',
    symbol: 'AAPL',
    shares: 100,
    price: 190.50,
    currentPrice: 195.20,
    value: 19520,
    change: 2.47
  },
  {
    type: 'stock',
    id: '2',
    date: '2024-01-01',
    symbol: 'MSFT',
    shares: 50,
    price: 375.80,
    currentPrice: 380.20,
    value: 19010,
    change: 1.17
  },
  {
    type: 'stock',
    id: '3',
    date: '2024-01-01',
    symbol: 'GOOGL',
    shares: 30,
    price: 140.20,
    currentPrice: 142.50,
    value: 4275,
    change: 1.64
  },
  {
    type: 'property',
    id: '4',
    date: '2024-01-01',
    propertyAddress: '123 Main St, Anytown, USA',
    purchasePrice: 450000,
    currentValue: 475000,
    mortgage: 350000,
    rate: 4.25,
    monthlyRent: 2800,
    expenses: 800,
    value: 475000,
    change: 5.56
  },
  {
    type: 'property',
    id: '5',
    date: '2024-01-01',
    propertyAddress: '456 Oak Ave, Somewhere, USA',
    purchasePrice: 380000,
    currentValue: 395000,
    mortgage: 290000,
    rate: 3.75,
    monthlyRent: 2400,
    expenses: 650,
    value: 395000,
    change: 3.95
  }
];

// Mock API functions that simulate real API calls
export const investmentService = {
  async getInvestments(): Promise<Investment[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockInvestments;
  },

  async getPropertyValue(address: string): Promise<number> {
    // This would be replaced with actual Zillow API call
    await new Promise(resolve => setTimeout(resolve, 500));
    const property = mockInvestments.find(
      inv => inv.type === 'property' && inv.propertyAddress === address
    ) as PropertyInvestment | undefined;
    return property?.currentValue || 0;
  },

  async getStockPrice(symbol: string): Promise<number> {
    // This would be replaced with actual stock API call
    await new Promise(resolve => setTimeout(resolve, 500));
    const stock = mockInvestments.find(
      inv => inv.type === 'stock' && inv.symbol === symbol
    ) as StockInvestment | undefined;
    return stock?.currentPrice || 0;
  },

  async updatePropertyDetails(id: string, updates: Partial<PropertyInvestment>): Promise<PropertyInvestment> {
    // This would be replaced with actual API call
    await new Promise(resolve => setTimeout(resolve, 500));
    const property = mockInvestments.find(
      inv => inv.type === 'property' && inv.id === id
    ) as PropertyInvestment;
    return { ...property, ...updates };
  }
}; 