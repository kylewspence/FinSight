import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FileUploadSheet from '@/components/FileUploadSheet';
import Spending from '@/components/Spending';
import InvestmentsDesktop from '@/components/InvestmentsDesktop';
import MonthlyTransactions from '@/components/MonthlyTransactions';
import { PropertyList } from '@/components/PropertyList';
import FinancialInsights from '@/components/FinancialInsights';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('investments');

  return (
    <div className="flex-1 space-y-4 p-4 md:p-6 pt-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h2>
        <FileUploadSheet />
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 md:w-auto md:inline-flex">
          <TabsTrigger value="investments">Investments</TabsTrigger>
          <TabsTrigger value="spending">Spending</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
        </TabsList>
        <TabsContent value="investments" className="space-y-4">
          <InvestmentsDesktop />
        </TabsContent>
        <TabsContent value="spending" className="space-y-4">
          <Spending />
        </TabsContent>
        <TabsContent value="transactions" className="space-y-4">
          <MonthlyTransactions />
        </TabsContent>
        <TabsContent value="properties" className="space-y-4">
          <PropertyList />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;