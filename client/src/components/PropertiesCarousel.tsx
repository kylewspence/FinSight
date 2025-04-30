import { Carousel, Card } from '../components/ui/apple-cards-carousel';
import { formatCurrency } from '../lib/utils';
import { Edit, Plus, Trash } from 'lucide-react';
import { ButtonWithIcon } from '../components/ui/buttonwithicon';

// Sample property data - this could come from props or context
const properties = [
  {
    id: 'prop1',
    address: '123 Main Street',
    formattedAddress: '123 Main Street, San Francisco, CA 94107',
    propertyType: 'Single Family Home',
    bedrooms: 3,
    bathrooms: 2,
    squareFootage: 1800,
    yearBuilt: 2005,
    lastSaleDate: '2018-05-12',
    lastSalePrice: 350000,
    estimatedValue: 425000,
    estimatedRangeLow: 405000,
    estimatedRangeHigh: 445000,
    monthlyRent: 2200,
    image:
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=3540&auto=format&fit=crop',
  },
  {
    id: 'prop2',
    address: '456 Maple Avenue',
    formattedAddress: '456 Maple Avenue, Oakland, CA 94611',
    propertyType: 'Rental Property',
    bedrooms: 2,
    bathrooms: 1,
    squareFootage: 1200,
    yearBuilt: 1998,
    lastSaleDate: '2019-08-23',
    lastSalePrice: 280000,
    estimatedValue: 320000,
    estimatedRangeLow: 310000,
    estimatedRangeHigh: 330000,
    monthlyRent: 1800,
    image:
      'https://images.unsplash.com/photo-1604014238312-ccb88904fa7c?q=80&w=3270&auto=format&fit=crop',
  },
];

type PropertyType = {
  id: string;
  address: string;
  formattedAddress: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  yearBuilt: number;
  lastSaleDate: string;
  lastSalePrice: number;
  estimatedValue: number;
  estimatedRangeLow: number;
  estimatedRangeHigh: number;
  monthlyRent: number;
  image: string;
};

// Property card content component
export const PropertyContent = ({ property }: { property: PropertyType }) => {
  return (
    <div className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4">
      <div className="grid gap-4 max-w-3xl mx-auto">
        <div className="grid gap-2">
          <div className="text-sm font-medium">Estimated Value</div>
          <div className="text-2xl font-bold">
            {formatCurrency(property.estimatedValue)}
          </div>
          <div className="text-sm text-muted-foreground">
            Range: {formatCurrency(property.estimatedRangeLow)} -{' '}
            {formatCurrency(property.estimatedRangeHigh)}
          </div>
        </div>

        <div className="grid gap-1">
          <div className="text-sm font-medium">Property Details</div>
          <div className="text-sm">
            {property.propertyType} • {property.bedrooms} bed •{' '}
            {property.bathrooms} bath •{' '}
            {property.squareFootage.toLocaleString()} sqft
          </div>
          <div className="text-sm">Built in {property.yearBuilt}</div>
        </div>

        <div className="grid gap-1">
          <div className="text-sm font-medium">Last Sale</div>
          <div className="text-sm">
            {new Date(property.lastSaleDate).toLocaleDateString()} •{' '}
            {formatCurrency(property.lastSalePrice)}
          </div>
        </div>

        <div className="grid gap-1">
          <div className="text-sm font-medium">Monthly Rent</div>
          <div className="text-sm">{formatCurrency(property.monthlyRent)}</div>
        </div>

        <div className="flex justify-end mt-4 pt-2 border-t">
          <div className="flex space-x-2">
            <ButtonWithIcon icon={Edit} variant="outline">
              Edit
            </ButtonWithIcon>
            <ButtonWithIcon icon={Trash} variant="destructive">
              Delete
            </ButtonWithIcon>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function PropertiesCarousel() {
  // Transform properties into card data
  const cardsData = properties.map((property) => ({
    category: property.propertyType,
    title: property.address,
    src: property.image,
    content: <PropertyContent property={property} />,
  }));

  // Create carousel cards
  const cards = cardsData.map((card, index) => (
    <Card key={index} card={card} index={index} />
  ));

  return (
    <div className="w-full h-full pb-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">My Properties</h2>
        <ButtonWithIcon icon={Plus} children="Add Property" />
      </div>
      <Carousel items={cards} />
    </div>
  );
}
