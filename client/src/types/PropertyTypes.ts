// client/src/types/PropertyTypes.ts
export interface PropertyType {
  id: number;
  formattedAddress: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  yearBuilt: number;
  lastSaleDate: string;
  lastSalePrice: number;
  estimatedValue: number;
  estimatedRangeLow?: number;
  estimatedRangeHigh?: number;
  priceRangeHigh?: number;
  priceRangeLow?: number;
  price?: number;
  monthlyRent?: number;
  image?: string;
  notes: string;
  mortgagePayment: number;
  mortgageBalance: number;
  hoaPayment: number;
  interestRate: number;
}
