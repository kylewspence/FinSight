import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";

interface PropertyDetailsProps {
  address: string;
  propertyData: {
    formattedAddress: string;
    propertyType: string;
    bedrooms: number;
    bathrooms: number;
    squareFootage: number;
    yearBuilt: number;
    lastSale: string;
    lastSalePrice: number;
    estimatedValue: number;
    estimatedRangeLow: number;
    estimatedRangeHigh: number;
  } | null;
  loading: boolean;
}

export function PropertyDetails({ address, propertyData, loading }: PropertyDetailsProps) {
  if (loading) {
    return <PropertyDetailsSkeleton />;
  }

  if (!propertyData) {
    return (
      <Card className="p-6">
        <div className="text-destructive">Failed to load property details</div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-xl font-semibold">
          {propertyData.formattedAddress}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0 grid gap-4">
        <div className="grid gap-2">
          <div className="text-sm font-medium">Estimated Value</div>
          <div className="text-2xl font-bold">
            {formatCurrency(propertyData.estimatedValue)}
          </div>
          <div className="text-sm text-muted-foreground">
            Range: {formatCurrency(propertyData.estimatedRangeLow)} - {formatCurrency(propertyData.estimatedRangeHigh)}
          </div>
        </div>

        <div className="grid gap-1">
          <div className="text-sm font-medium">Property Details</div>
          <div className="text-sm">
            {propertyData.propertyType} • {propertyData.bedrooms} bed • {propertyData.bathrooms} bath • {propertyData.squareFootage.toLocaleString()} sqft
          </div>
          <div className="text-sm">Built in {propertyData.yearBuilt}</div>
        </div>

        <div className="grid gap-1">
          <div className="text-sm font-medium">Last Sale</div>
          <div className="text-sm">
            {new Date(propertyData.lastSaleDate).toLocaleDateString()} • {formatCurrency(propertyData.lastSalePrice)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PropertyDetailsSkeleton() {
  return (
    <Card className="p-6">
      <CardHeader className="px-0 pt-0">
        <Skeleton className="h-6 w-3/4" />
      </CardHeader>
      <CardContent className="px-0 space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-32" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-48" />
        </div>
      </CardContent>
    </Card>
  );
} 