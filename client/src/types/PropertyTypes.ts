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
  priceRangehigh?: number;
  priceRangeLow?: number; // For compatibility with RentCast API
  price?: number; // For compatibility with RentCast API
  monthlyRent?: number;
  image?: string;
  notes: string;
}
