// client/src/components/PropertiesTab.tsx
import { Carousel, Card } from './ui/apple-cards-carousel';
import { PropertyModal } from './PropertyModal';
import { Plus } from 'lucide-react';
import { ButtonWithIcon } from './ui/buttonwithicon';
import { AddPropertyForm } from './AddPropertyForm';
import { PropertyType } from '@/types/PropertyTypes';
import { useState } from 'react';
import { deleteProperty, updateProperty } from '@/lib/data';

interface PropertiesTabProps {
  properties: PropertyType[];
  onPropertyAdd?: (property: PropertyType) => void;
  onPropertyUpdate?: (property: PropertyType) => void;
  onPropertyDelete?: (propertyId: number) => void;
}

export function PropertiesTab({
  properties,
  onPropertyAdd,
  onPropertyUpdate,
  onPropertyDelete,
}: PropertiesTabProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle adding a new property
  function handlePropertyAdded(newProperty: PropertyType) {
    if (onPropertyAdd) {
      onPropertyAdd(newProperty);
    }
    setShowAddForm(false);
  }
  // Handle updating a property
  async function handlePropertyUpdate(updatedProperty: PropertyType) {
    try {
      setIsLoading(true);
      await updateProperty(updatedProperty);

      if (onPropertyUpdate) {
        onPropertyUpdate(updatedProperty);
      }
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to update property'
      );
    } finally {
      setIsLoading(false);
    }
  }

  // Handle deleting a property
  async function handlePropertyDelete(id: number) {
    try {
      setIsLoading(true);
      await deleteProperty(id);

      if (onPropertyDelete) {
        onPropertyDelete(id);
      }
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to delete property'
      );
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading && properties.length === 0) {
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
      // Render the property modal
      <PropertyModal
        property={property}
        onUpdate={handlePropertyUpdate}
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

export default PropertiesTab;
