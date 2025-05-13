import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OverviewTab from '@/components/OverviewTab';
import InvestmentsTab from '@/components/InvestmentsTab';
import PropertiesTab from '@/components/PropertiesTab';
import { fetchProperties } from '@/lib/data';
import { useEffect } from 'react';
import { useState } from 'react';
import { PropertyType } from '@/types/PropertyTypes';
import InsightsTab from '@/components/InsightsTab';

export default function Dashboard() {
  const [properties, setProperties] = useState<PropertyType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load Properties and pass to different tabs.
  useEffect(() => {
    async function loadProperties() {
      try {
        const data = await fetchProperties();
        setProperties(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load properties'
        );
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadProperties();
  }, []);

  function handlePropertyAdd(newProperty: PropertyType) {
    setProperties((prev) => [...prev, newProperty]);
  }

  function handlePropertyUpdate(updatedProperty: PropertyType) {
    setProperties((prev) =>
      prev.map((prop) =>
        prop.id === updatedProperty.id ? updatedProperty : prop
      )
    );
  }

  function handlePropertyDelete(propertyId: number) {
    setProperties((prev) => prev.filter((prop) => prop.id !== propertyId));
  }

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex flex-col gap-4">
      {/* <h1 className="text-3xl font-bold">Financial Overview</h1> */}

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="investments">Investments</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="w-full">
          <OverviewTab properties={properties} />
        </TabsContent>

        <TabsContent value="properties">
          <PropertiesTab
            properties={properties}
            onPropertyAdd={handlePropertyAdd}
            onPropertyUpdate={handlePropertyUpdate}
            onPropertyDelete={handlePropertyDelete}
          />
        </TabsContent>

        <TabsContent value="investments">
          <InvestmentsTab />
        </TabsContent>

        <TabsContent value="insights">
          <InsightsTab properties={properties} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
