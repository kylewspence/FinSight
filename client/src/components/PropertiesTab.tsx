// client/src/components/PropertiesTab.tsx
import { Carousel, Card } from './ui/apple-cards-carousel';
import { PropertyModal } from './PropertyModal';
import { Plus } from 'lucide-react';
import { ButtonWithIcon } from './ui/buttonwithicon';
import { AddPropertyForm } from './AddPropertyForm';
import { PropertyType } from '@/types/PropertyTypes';
import { useEffect, useState } from 'react';

interface DbProperty {
  propertyId: number;
  address: string;
  type: string;
  beds: string;
  bath: string;
  sqft: number;
  built: number;
  lastSale: string;
  estValue: number;
  range: number;
}
// Sample property data - this could come from props or context
const sampleProperties = [
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
  {
    id: 'prop3',
    address: '83 S 227th Ln',
    formattedAddress: '83 S 227th Ln, Buckeye, AZ 85326',
    propertyType: 'Single Family',
    bedrooms: 4,
    bathrooms: 2,
    squareFootage: 1831,
    yearBuilt: 2005,
    lastSaleDate: '2017-06-16',
    lastSalePrice: 178000,
    estimatedValue: 245000, // Estimated based on previous sales data and appreciation
    estimatedRangeLow: 235000,
    estimatedRangeHigh: 255000,
    monthlyRent: 1950, // Estimated market rent
    image:
      'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?q=80&w=2070&auto=format&fit=crop',
    location: {
      latitude: 33.446612,
      longitude: -112.540231,
      city: 'Buckeye',
      state: 'AZ',
      county: 'Maricopa',
      zipCode: '85326',
    },
    features: {
      cooling: true,
      coolingType: 'Refrigeration',
      exteriorType: 'Stucco',
      floorCount: 2,
      garage: true,
    },
    lotSize: 4950,
    taxes: {
      annual: 2310, // Most recent year
      assessedValue: 18530,
    },
  },
  {
    id: 'prop4',
    address: '179 S 229th Dr',
    formattedAddress: '179 S 229th Dr, Buckeye, AZ 85326',
    propertyType: 'Single Family',
    bedrooms: 3,
    bathrooms: 2.5,
    squareFootage: 1902,
    yearBuilt: 2005,
    lastSaleDate: '2017-09-13',
    lastSalePrice: 177000,
    estimatedValue: 255000, // Estimated based on previous sales data and appreciation
    estimatedRangeLow: 243000,
    estimatedRangeHigh: 267000,
    monthlyRent: 2050, // Estimated market rent
    image:
      'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=2070&auto=format&fit=crop',
    location: {
      latitude: 33.44571,
      longitude: -112.543659,
      city: 'Buckeye',
      state: 'AZ',
      county: 'Maricopa',
      zipCode: '85326',
    },
    features: {
      cooling: true,
      coolingType: 'Refrigeration',
      exteriorType: 'Wood',
      floorCount: 2,
      garage: true,
    },
    lotSize: 5291,
    taxes: {
      annual: 1468, // Most recent year
      assessedValue: 16280,
    },
  },
];

export default function PropertiesTab() {
  // State for properties
  const [properties, setProperties] =
    useState<PropertyType[]>(sampleProperties);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    async function loadProperties() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          return; // Not logged in
        }

        const response = await fetch('/api/properties', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to load properties');
        }

        const dbProperties = await response.json();

        // Convert database properties to PropertyType format
        const formattedProperties: PropertyType[] = dbProperties.map(
          (prop: DbProperty) => ({
            id: `prop${prop.propertyId}`,
            address: prop.address,
            formattedAddress: prop.address,
            propertyType: prop.type,
            bedrooms: parseInt(prop.beds) || 0,
            bathrooms: parseFloat(prop.bath) || 0,
            squareFootage: prop.sqft,
            yearBuilt: prop.built,
            lastSaleDate: prop.lastSale,
            lastSalePrice: 0, // Not in your schema
            estimatedValue: prop.estValue,
            estimatedRangeLow: prop.range,
            estimatedRangeHigh: prop.estValue + prop.estValue * 0.05, // Estimate
            monthlyRent: 0, // Not in your schema
            image:
              'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=2070&auto=format&fit=crop',
          })
        );

        setProperties(formattedProperties);
      } catch (err) {
        console.error('Error loading properties:', err);
      }
    }

    loadProperties();
  }, []);

  // Handle adding a new property
  const handlePropertyAdded = (newProperty: PropertyType) => {
    setProperties([...properties, newProperty]);
    setShowAddForm(false);
  };

  // Transform properties into card data
  const cardsData = properties.map((property) => ({
    category: property.propertyType,
    title: property.address,
    subtitle: `${property.bedrooms} bed, ${property.bathrooms} bath`,
    src:
      property.image ||
      'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=2070&auto=format&fit=crop',
    content: <PropertyModal property={property} />,
  }));

  // Create carousel cards
  const cards = cardsData.map((card, index) => (
    <Card key={index} card={card} index={index} />
  ));

  console.log('Card data:', cardsData);

  return (
    <div className="w-full h-full pb-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">My Properties</h2>

        {showAddForm ? (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">Add New Property</h3>
              <AddPropertyForm
                onPropertyAdded={handlePropertyAdded}
                onCancel={() => setShowAddForm(false)}
              />
            </div>
          </div>
        ) : (
          <ButtonWithIcon icon={Plus} onClick={() => setShowAddForm(true)}>
            Add Property
          </ButtonWithIcon>
        )}
      </div>
      <Carousel items={cards} />
    </div>
  );
}
