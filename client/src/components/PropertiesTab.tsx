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

// TODO: This is a temporary type for the properties tab.
// This defines the shape of property data as it comes from the database with
// database specific field names.
// Working on refactoring this to use the PropertyType interface.
interface DbProperty {
  propertyId: number;
  formattedAddress: string;
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
  imageUrl?: string;
  notes?: string;
  monthlyRent?: number;
  mortgagePayment?: number;
  mortgageBalance?: number;
  hoaPayment?: number;
  interestRate?: number;
}

export default function PropertiesTab() {
  const { user } = useUser(); // Get the user from the context
  const [properties, setProperties] = useState<PropertyType[]>([]); // State to store properties
  const [showAddForm, setShowAddForm] = useState(false); // State to show the add form

  // Load the properties from the database
  useEffect(() => {
    async function loadProperties() {
      try {
        // Read the login token from the local storage
        const token = readToken();
        if (!token) {
          return; // Not logged in
        }

        // Fetch the properties from the database based on the user's id
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
            id: prop.propertyId,
            formattedAddress: prop.formattedAddress,
            propertyType: prop.type,
            bedrooms: prop.beds,
            bathrooms: prop.bath,
            squareFootage: prop.squareFootage,
            yearBuilt: prop.yearBuilt,
            lastSaleDate: prop.lastSale,
            lastSalePrice: prop.lastSalePrice,
            estimatedValue: prop.estimatedValue,
            estimatedRangeLow: prop.estimatedRangeLow,
            estimatedRangeHigh:
              prop.estimatedValue + prop.estimatedValue * 0.04,
            monthlyRent: prop.monthlyRent || 0,
            image: prop.imageUrl || getStreetViewImage(prop.formattedAddress),
            notes: prop.notes || '',
            mortgagePayment: prop.mortgagePayment || 0,
            mortgageBalance: prop.mortgageBalance || 0,
            hoaPayment: prop.hoaPayment || 0,
            interestRate: prop.interestRate || 0,
          })
        );

        setProperties(formattedProperties); // Set the properties in the state
      } catch (err) {
        console.error('Error loading properties:', err);
      }
    }

    loadProperties(); // Load the properties
  }, [user]);

  // Handle adding a new property
  function handlePropertyAdded(newProperty: PropertyType) {
    if (!newProperty.image && newProperty.formattedAddress) {
      // If the property doesn't have an image yet but has an address, get the street view image
      // from Google Maps API - function in utils.ts
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      newProperty.image = `https://maps.googleapis.com/maps/api/streetview?size=600x400&location=${encodeURIComponent(
        newProperty.formattedAddress
      )}&key=${apiKey}`;
    }
    setProperties([...properties, newProperty]); // copies the existing properties and adds the new one
    setShowAddForm(false); // close the add form
  }

  async function handlePropertyUpdate(updatedProperty: PropertyType) {
    try {
      // Read the login token from the local storage
      const token = readToken();
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`/api/properties/${updatedProperty.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Send the updated property fields to the database
          monthlyRent: updatedProperty.monthlyRent || 0,
          notes: updatedProperty.notes || '',
          mortgageBalance: updatedProperty.mortgageBalance || 0,
          mortgagePayment: updatedProperty.mortgagePayment || 0,
          interestRate: updatedProperty.interestRate || 0,
          hoaPayment: updatedProperty.hoaPayment || 0,
        }),
      });

      if (!response.ok) {
        // error handling if the property is not updated
        const errorData = await response.json(); // get the error data
        console.error('Error updating property:', errorData); // log the error
        throw new Error('Failed to update property'); // throw an error
      }

      // Update local state with updated property
      setProperties((prevProperties) =>
        // takes prev properties and updates the one that matches the updated propertyId
        prevProperties.map((prop) =>
          prop.id === updatedProperty.id ? updatedProperty : prop
        )
      );
    } catch (error) {
      console.error('Error updating property:', error);
      alert('Failed to update property.');
    }
  }

  // Handle deleting a property
  async function handlePropertyDelete(propertyId: number) {
    try {
      // Read the login token from the local storage
      const token = readToken();
      if (!token) throw new Error('No token found');

      const response = await fetch(`/api/properties/${propertyId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete property');
      }

      // Remove the property from local state
      setProperties((prev) => prev.filter((p) => p.id !== propertyId));
    } catch (error) {
      alert('Failed to delete property.');
      console.error(error);
    }
  }

  // Transform properties into card data
  const cardsData = properties.map((property) => ({
    id: property.id,
    title: property.formattedAddress,
    src: property.image || '',
    content: (
      // Render the property modal
      <PropertyModal
        property={property}
        onUpdate={handlePropertyUpdate}
        onClose={() => {
          setProperties;
        }}
        onDelete={handlePropertyDelete}
      />
    ),
  }));

  // Create carousel cards - Carousel component comes with static dummy data.
  // This is where we would add the dynamic data from the database and pass it to the carousel component.
  const cards = cardsData.map((card, index) => (
    <Card key={card.id} card={card} index={index} />
  ));

  return (
    <div className="w-full h-full pb-10">
      <div className="flex justify-between items-center">
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
