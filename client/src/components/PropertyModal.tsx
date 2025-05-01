// client/src/components/PropertyContent.tsx
import { formatCurrency } from '@/lib/utils';
import { ButtonWithIcon } from '@/components/ui/buttonwithicon';
import { Edit, Trash } from 'lucide-react';
import { PropertyType } from '@/types/PropertyTypes';

export function PropertyModal({ property }: { property: PropertyType }) {
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
}
