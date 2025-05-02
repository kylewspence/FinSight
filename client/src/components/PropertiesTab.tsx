// client/src/components/PropertiesTab.tsx
import { Carousel, Card } from './ui/apple-cards-carousel';
import { PropertyModal } from './PropertyModal';
import { Plus } from 'lucide-react';
import { ButtonWithIcon } from './ui/buttonwithicon';
import { AddPropertyForm } from './AddPropertyForm';
import { PropertyType } from '@/types/PropertyTypes';
import { useEffect, useState } from 'react';
import { readToken } from '@/lib/data';
import { useUser } from './useUser';
import { getStreetViewImage } from '@/lib/utils';

interface DbProperty {
  propertyId: number;
  address: string;
  type: string;
  beds: number;
  bath: number;
  squareFootage: number;
  yearBuilt: number;
  lastSale: string;
  lastSalePrice: number;
  estimatedValue: number;
  estimatedRangeLow: number;
  estimatedRangeHigh: number;
}

export default function PropertiesTab() {
  const { user } = useUser();
  const [properties, setProperties] = useState<PropertyType[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    async function loadProperties() {
      try {
        const token = readToken();
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
            bedrooms: prop.beds,
            bathrooms: prop.bath,
            squareFootage: prop.squareFootage,
            yearBuilt: prop.yearBuilt,
            lastSaleDate: prop.lastSale,
            lastSalePrice: 0, // Not in your schema
            estimatedValue: prop.estimatedValue,
            estimatedRangeLow: prop.estimatedRangeLow,
            estimatedRangeHigh:
              prop.estimatedValue + prop.estimatedValue * 0.05, // Estimate
            monthlyRent: 0, // Not in your schema
            image: getStreetViewImage(prop.address),
          })
        );

        setProperties(formattedProperties);
      } catch (err) {
        console.error('Error loading properties:', err);
      }
    }

    loadProperties();
  }, [user]);

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
    src: property.image || '',
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
