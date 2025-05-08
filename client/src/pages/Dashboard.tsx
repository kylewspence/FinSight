import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OverviewTab from '@/components/OverviewTab';
import InvestmentsTab from '@/components/InvestmentsTab';
import PropertiesTab from '@/components/PropertiesTab';
import { readToken } from '@/lib/data';
import { useEffect } from 'react';
import { useState } from 'react';
import { PropertyType } from '@/types/PropertyTypes';

export default function Dashboard() {
  const [properties, setProperties] = useState<PropertyType[]>([]);

  useEffect(() => {
    async function loadProperties() {
      const token = readToken();
      if (!token) return;
      const response = await fetch('/api/properties', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setProperties(data);
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

        <TabsContent value="AI Insights">
          <p>AI Insights will be displayed here</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
