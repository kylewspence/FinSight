
import { CardTitle, CardContent, CardHeader, Card } from '@/components/ui/card';
import { getSpendingData } from '../lib/csv-storage'; // your existing function
import { Transaction } from '@/types/transaction';

const calculateTotal = (transactions: Transaction[]): number => {
  return transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
};
     
     function DashboardNew() {
       const data = getSpendingData();
       
       return (
         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
           <Card>
             <CardHeader> 
               <CardTitle>Total Spending</CardTitle>
             </CardHeader>
             <CardContent>
               <p className="text-2xl font-bold">${calculateTotal(data)}</p>
             </CardContent>
           </Card>
           {/* More Shadcn components */}
         </div>
       );
     }

     export default DashboardNew;