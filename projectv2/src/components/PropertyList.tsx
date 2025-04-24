import { useState, useEffect } from 'react';
import { PropertyDetails } from './PropertyDetails';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { rentcastService } from '@/lib/rentcast-service';
import { Home, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";

// Format: Street,City,State,ZIP (with commas, no spaces after commas)
const PROPERTIES = [
  "179 S 229th Dr,Buckeye,AZ,85326",
  "26124 W Burnett Rd,Buckeye,AZ,85396",
  "23009 W Cocopah St,Buckeye,AZ,85326",
  "83 S 227th Ln,Buckeye,AZ,85326"
];

interface PropertyData {
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
}

function formatAddressForTab(address: string) {
  const parts = address.split(',');
  return parts[0].trim(); // Return just the street address
}

export function PropertyList() {
  const [properties, setProperties] = useState<Record<string, PropertyData | null>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeProperty, setActiveProperty] = useState(PROPERTIES[0]);

  const loadProperties = async (forceClear = false) => {
    try {
      setLoading(true);
      setError(null);

      if (forceClear) {
        rentcastService.clearCache();
      }
      
      // Only force refresh when explicitly clearing cache
      const data = await rentcastService.getPropertyDetails(activeProperty, {}, forceClear);
      console.log('Property data:', data);
      
      // Update the estimated range values using the correct data structure
      const propertyWithRange = {
        ...data,
        estimatedValue: data.estimatedValue || 0,
        estimatedRangeLow: data.priceRangeLow || 0,
        estimatedRangeHigh: data.price || 0
      };
      
      setProperties(prev => ({
        ...prev,
        [activeProperty]: propertyWithRange
      }));
    } catch (error) {
      console.error('Error loading property:', error);
      setError(error instanceof Error ? error.message : 'Failed to load property data');
    } finally {
      setLoading(false);
    }
  };

  // Load data when active property changes
  useEffect(() => {
    // Check if we already have this property's data
    if (!properties[activeProperty]) {
      loadProperties();
    }
  }, [activeProperty, properties]);

  if (error) {
    return (
      <Card className="p-4 bg-destructive/10 text-destructive">
        {error}
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <CardHeader className="px-0 pt-0">
        <div className="flex items-center justify-between">
          <CardTitle>Properties</CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => loadProperties(true)}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-0">
        <Tabs 
          value={activeProperty} 
          onValueChange={setActiveProperty}
          className="space-y-4"
        >
          <TabsList>
            {PROPERTIES.map((address) => (
              <TabsTrigger key={address} value={address} className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                {formatAddressForTab(address)}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {PROPERTIES.map((address) => (
            <TabsContent key={address} value={address}>
              <PropertyDetails 
                address={address}
                propertyData={properties[address]}
                loading={loading}
              />
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
} 