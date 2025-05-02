// client/src/components/PropertyContent.tsx
import { formatCurrency } from '@/lib/utils';
import { ButtonWithIcon } from '@/components/ui/buttonwithicon';
import { Check, Pencil, Trash } from 'lucide-react';
import { PropertyType } from '@/types/PropertyTypes';
import React, { useState } from 'react';
import { Label } from '@radix-ui/react-label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
interface PropertyModalProps {
  property: PropertyType;
  onClose: () => void;
  onUpdate: (updatedProperty: PropertyType) => void;
  onDelete: (propertyId: number) => Promise<void>;
}

export function PropertyModal({
  property,
  onUpdate,
  onDelete,
}: PropertyModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProperty, setEditedProperty] = useState(property);
  const handleEditToggle = () => {
    if (isEditing) {
      setEditedProperty({ ...property });
    }
    setIsEditing(!isEditing);
  };

  // Handle changes to rent or textarea
  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    // Extracts name and value from the event target
    const { name, value } = e.target;
    // Converts rent to a number if its a valid number
    const processedValue =
      name === 'monthlyRent' && value !== '' ? Number(value) : value;
    setEditedProperty((prev) => ({
      ...prev,
      [name]: processedValue,
    }));
  }
  // Save changes
  function handleSaveChanges(e?: React.FormEvent) {
    if (e) {
      e.preventDefault();
    }
    try {
      onUpdate(editedProperty);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating property:', error);
    }
  }

  // Delete Property
  async function handleDelete() {
    if (!window.confirm('Are you sure you want to delete this property?'))
      return;
    try {
      await onDelete(property.id);
    } catch (error) {
      alert('Failed to delete property.');
      console.error(error);
    }
  }

  if (isEditing) {
    return (
      <div className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4">
        <div className="grid gap-4 max-w-3xl mx-auto">
          <h2 className="text-xl font-bold">Edit Property</h2>

          <form onSubmit={handleSaveChanges}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="monthlyRent">Monthly Rent</Label>
                <Input
                  id="monthlyRent"
                  name="monthlyRent"
                  value={editedProperty.monthlyRent || ''}
                  onChange={handleInputChange}
                  placeholder="HOA information, website links, or other notes about this property"
                  className="w-full"
                />

                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={editedProperty.notes || ''}
                      onChange={handleInputChange}
                      placeholder="HOA information, website links, or other notes about this property"
                      className="h-32"
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>

          <div className="flex justify-end mt-4 pt-2 border-t">
            <div className="flex space-x-2">
              <ButtonWithIcon
                icon={Pencil}
                variant="outline"
                onClick={handleEditToggle}>
                Cancel
              </ButtonWithIcon>
              <ButtonWithIcon
                variant="default"
                icon={Check}
                onClick={handleSaveChanges}>
                Save Changes
              </ButtonWithIcon>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4">
      <div className="grid gap-4 max-w-3xl mx-auto">
        <div className="grid gap-2">
          <div className="text-sm font-medium">Estimated Value</div>
          <div className="text-2xl font-bold">
            {formatCurrency(property.estimatedValue)}
          </div>
          <div className="text-sm text-muted-foreground">
            Range:{' '}
            {formatCurrency(
              property.estimatedRangeLow || property.priceRangeLow || 0
            )}{' '}
            -{' '}
            {formatCurrency(property.estimatedRangeHigh || property.price || 0)}
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

        {property.monthlyRent !== undefined && (
          <div className="grid gap-1">
            <div className="text-sm font-medium">Monthly Rent</div>
            <div className="text-sm">
              {formatCurrency(property.monthlyRent)}
            </div>
          </div>
        )}

        {property.notes && (
          <div className="grid gap-1">
            <div className="text-sm font-medium">Notes</div>
            <div className="text-sm">{property.notes}</div>
          </div>
        )}

        <div className="flex justify-end mt-4 pt-2 border-t">
          <div className="flex space-x-2">
            <ButtonWithIcon
              icon={Pencil}
              variant="outline"
              onClick={handleEditToggle}>
              Edit
            </ButtonWithIcon>
            <ButtonWithIcon
              icon={Trash}
              variant="destructive"
              onClick={handleDelete}>
              Delete
            </ButtonWithIcon>
          </div>
        </div>
      </div>
    </div>
  );
}
