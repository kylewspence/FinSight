// client/src/components/PropertiesTab.tsx
import { Carousel, Card } from './ui/apple-cards-carousel';
import { PropertyModal } from './PropertyModal';
import { Plus } from 'lucide-react';
import { ButtonWithIcon } from './ui/buttonwithicon';
import { AddPropertyForm } from './AddPropertyForm';
import { PropertyType } from '@/types/PropertyTypes';
import { useEffect, useState } from 'react';
import { deleteProperty, fetchProperties, updateProperty } from '@/lib/data';

export function PropertiesTab() {
  const [properties, setProperties] = useState<PropertyType[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProperties() {
      try {
        const data = await fetchProperties();
        setProperties(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load properties'
        );
      } finally {
        setIsLoading(false);
      }
    }
    loadProperties();
  }, []);

  // Handle adding a new property
  function handlePropertyAdded(newProperty: PropertyType) {
    setProperties([...properties, newProperty]);
    setShowAddForm(false);
  }

  async function handlePropertyUpdate(updatedProperty: PropertyType) {
    try {
      await updateProperty(updatedProperty);
      // Update local state with updated property
      setProperties((prevProperties) =>
        prevProperties.map((prop) =>
          prop.id === updatedProperty.id ? updatedProperty : prop
        )
      );
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to update property'
      );
    }
  }

  async function handlePropertyDelete(propertyId: number) {
    try {
      await deleteProperty(propertyId);
      // Remove the property from local state
      setProperties((prev) => prev.filter((p) => p.id !== propertyId));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to delete property'
      );
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-lg">Loading properties...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-500 text-lg">Error: {error}</div>
      </div>
    );
  }

  // Transform properties into card data
  const cardsData = properties.map((property) => ({
    id: property.id,
    title: property.formattedAddress,
    src: property.image || '',
    content: (
      <PropertyModal
        property={property}
        onUpdate={handlePropertyUpdate}
        onDelete={handlePropertyDelete}
      />
    ),
  }));

  // Create carousel cards
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

export default PropertiesTab;
