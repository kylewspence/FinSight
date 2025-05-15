import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OverviewTab from '@/components/OverviewTab';
import InvestmentsTab from '@/components/InvestmentsTab';
import PropertiesTab from '@/components/PropertiesTab';
import { fetchProperties } from '@/lib/data';
import { useEffect } from 'react';
import { useState } from 'react';
import { PropertyType } from '@/types/PropertyTypes';
import { AIInsights, getSavedInsights } from '@/lib/ai-service';
import AIInsightsTab from '@/components/InsightsTab';

export default function Dashboard() {
  const [properties, setProperties] = useState<PropertyType[]>([]);
  const [insights, setInsights] = useState<AIInsights | null>(null);
  const [isLoadingInsights, setIsLoadingInsights] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  // Load Properties and Insights
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        
        // Load properties
        const propertiesData = await fetchProperties();
        setProperties(propertiesData);
        
        // Load insights
        const savedInsights = await getSavedInsights();
        if (savedInsights.length > 0) {
          setInsights(savedInsights[savedInsights.length - 1]);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load data'
        );
        console.error(err);
      } finally {
        setIsLoading(false);
        setIsLoadingInsights(false);
      }
    }
    
    loadData();
  }, []);

    // Separate function to load insights that can be passed down
    async function loadInsights() {
      try {
        setIsLoadingInsights(true);
        const savedInsights = await getSavedInsights();
        if (savedInsights.length > 0) {
          setInsights(savedInsights[savedInsights.length - 1]);
        }
      } catch (error) {
        console.error('Error loading insights:', error);
      } finally {
        setIsLoadingInsights(false);
      }
    }

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
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="investments">Investments</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="w-full">
          <OverviewTab properties={properties} insights={insights} onViewInsights={() => {setActiveTab('insights')}} />
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
        <AIInsightsTab 
            properties={properties}
            insights={insights}
            isLoading={isLoadingInsights}
            onInsightsUpdated={loadInsights} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
