export interface BaseInvestment {
  id: string;
  type: 'stock' | 'property';
  date: string;
  value: number;
  change: number;
}

export interface StockInvestment extends BaseInvestment {
  type: 'stock';
  symbol: string;
  shares: number;
  price: number;
  currentPrice: number;
}

export interface PropertyInvestment extends BaseInvestment {
  type: 'property';
  propertyAddress: string;
  purchasePrice: number;
  currentValue: number;
  mortgage: number;
  rate: number;
  monthlyRent: number;
  expenses: number;
}

export type Investment = StockInvestment | PropertyInvestment; 