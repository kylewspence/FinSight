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

  useEffect(() => {
    async function loadProperties() {
      try {
        const data = await fetchProperties();
        setProperties(data);
      } catch (err) {
        console.error(err);
      }
    }
    loadProperties();
  }, []);

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
          <PropertiesTab />
        </TabsContent>

        <TabsContent value="investments">
          <InvestmentsTab />
        </TabsContent>

        <TabsContent value="insights">
          <InsightsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
