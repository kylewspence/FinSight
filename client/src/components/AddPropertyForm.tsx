// client/src/components/AddPropertyForm.tsx
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getPropertyDetails } from '@/lib/rentcast-service';

interface AddPropertyFormProps {
  onPropertyAdded: (property: any) => void;
  onCancel: () => void;
}

export function AddPropertyForm({
  onPropertyAdded,
  onCancel,
}: AddPropertyFormProps) {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!address.trim()) {
      setError('Please enter a valid address');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Fetching property details for:', address);

      // Call our rentcast service to get property details
      const propertyData = await getPropertyDetails(address);
      console.log('Property data received:', propertyData);

      // Save to database
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('You must be logged in to save properties');
      }

      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(propertyData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save property');
      }

      const savedProperty = await response.json();

      // Transform the database response to match PropertyType
      const newProperty = {
        id: `prop${savedProperty.propertyId}`,
        address: savedProperty.address,
        formattedAddress: savedProperty.address,
        propertyType: savedProperty.type,
        bedrooms: parseInt(savedProperty.beds) || 0,
        bathrooms: parseFloat(savedProperty.bath) || 0,
        squareFootage: savedProperty.sqft,
        yearBuilt: savedProperty.built,
        lastSaleDate: savedProperty.lastSale,
        lastSalePrice: 0, // Not in your schema
        estimatedValue: savedProperty.estValue,
        estimatedRangeLow: savedProperty.range,
        estimatedRangeHigh:
          savedProperty.estValue + savedProperty.estValue * 0.05, // Estimate
        monthlyRent: 0, // Not in your schema
      };
      // Pass the property to the parent component
      onPropertyAdded(newProperty);

      // Clear the form
      setAddress('');
    } catch (err) {
      console.error('Error saving property:', err);
      setError(err instanceof Error ? err.message : 'Failed to save property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="address" className="block text-sm font-medium mb-1">
          Property Address
        </label>
        <Input
          id="address"
          type="text"
          placeholder="Enter full address (e.g. 123 Main St, City, State, ZIP)"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          disabled={loading}
        />
      </div>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Add Property'}
        </Button>
      </div>
    </form>
  );
}
