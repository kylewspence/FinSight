import React, { useEffect, useMemo } from 'react';
import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getSpendingData } from '@/lib/csv-storage';
import { formatCurrency, useDataLoader } from '@/lib/utils';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { Badge } from './ui/badge';

export interface Transaction {
  id: string;
  date: string;  // Transaction Date
  postDate: string;
  description: string;
  category: string;
  type: 'Sale' | 'Return' | 'Payment';  // Updated to match actual transaction types
  amount: number;
  memo?: string;
}

export interface GroupedTransactions {
  [key: string]: Transaction[];
}

const ITEMS_PER_PAGE = 25;

const MonthlyTransactions = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Transaction; direction: 'ascending' | 'descending' } | null>(null);
  const [visibleItems, setVisibleItems] = useState(ITEMS_PER_PAGE);
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    // Force sample data initialization on component mount
    const initializeData = async () => {
      const currentData = localStorage.getItem('spendingData');
      if (!currentData) {
        console.log('No spending data found, initializing...');
        const { initializeSampleData } = await import('@/lib/csv-storage');
        initializeSampleData();
      } else {
        console.log('Found existing spending data:', currentData.slice(0, 100) + '...');
      }
    };
    initializeData();
  }, []);

  const { data: transactions = [], loading: isLoading } = useDataLoader<Transaction[]>(
    async () => {
      console.log('MonthlyTransactions: Starting data load');
      const data = await getSpendingData();
      console.log('MonthlyTransactions: Received data:', {
        dataLength: data.length,
        sampleTransaction: data[0]
      });
      
      return data.map(item => ({
        id: `${item.date}-${item.description}-${item.amount}`,
        date: item.date,
        postDate: item.date,
        description: item.description,
        category: item.category,
        type: item.type,
        amount: Number(item.amount),
        memo: ''
      }));
    },
    [],
    ['storage', 'spendingDataUpdated']
  );

  useEffect(() => {
    console.log('MonthlyTransactions: Current transactions:', {
      count: transactions?.length ?? 0,
      isLoading,
      sampleTransaction: transactions?.[0]
    });
  }, [transactions, isLoading]);

  const total = useMemo(() => 
    (transactions || []).reduce((sum: number, transaction: Transaction) => sum + transaction.amount, 0),
    [transactions]
  );

  const groupedTransactions = useMemo(() => {
    const transactionsArray = transactions || [];
    if (!Array.isArray(transactionsArray)) return {};
    
    return transactionsArray.reduce((acc: GroupedTransactions, transaction: Transaction) => {
      try {
        // Skip invalid transactions
        if (!transaction || typeof transaction !== 'object') {
          console.warn('Invalid transaction object:', transaction);
          return acc;
        }

        // Get the transaction date directly from the data
        const dateStr = transaction.date;
        if (!dateStr) {
          console.warn(`Transaction missing date:`, transaction);
          return acc;
        }

        // Parse date in MM/DD/YYYY format without any transformation
        const dateParts = dateStr.split('/');
        if (dateParts.length !== 3) {
          console.warn(`Invalid date format for transaction:`, dateStr);
          return acc;
        }

        const [month, day, year] = dateParts;
        const dateKey = `${year}-${month.padStart(2, '0')}`;
        
        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }

        // Use the original transaction data without modifying dates
        const normalizedTransaction: Transaction = {
          id: transaction.id || `${dateStr}-${transaction.description}-${transaction.amount}`,
          date: dateStr, // Keep original date string
          postDate: transaction.postDate || dateStr,
          description: transaction.description || 'No description',
          category: transaction.category || 'Uncategorized',
          type: transaction.type || 'Sale',
          amount: Number(transaction.amount) || 0,
          memo: transaction.memo
        };

        acc[dateKey].push(normalizedTransaction);
        return acc;
      } catch (error) {
        console.error('Error processing transaction:', transaction, error);
        return acc;
      }
    }, {});
  }, [transactions]);

  // Add debug logging to check the dates
  useEffect(() => {
    if (transactions?.length) {
      console.log('Sample transaction dates:', 
        transactions.slice(0, 3).map(t => ({
          original: t.date,
          normalized: t.date
        }))
      );
    }
  }, [transactions]);

  const availableMonths = useMemo(() => {
    return Object.keys(groupedTransactions)
      .sort()
      .reverse()
      .map(month => {
        const [year, monthNum] = month.split('-');
        return {
          value: month,
          label: new Date(parseInt(year), parseInt(monthNum) - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        };
      });
  }, [groupedTransactions]);

  const filteredTransactions = useMemo(() => {
    const transactionsArray = transactions || [];
    let filtered: Transaction[] = selectedMonth ? (groupedTransactions[selectedMonth] || []) : transactionsArray;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((t: Transaction) => 
        t.description.toLowerCase().includes(query) ||
        t.category.toLowerCase().includes(query) ||
        t.amount.toString().includes(query)
      );
    }

    if (sortConfig) {
      filtered.sort((a: Transaction, b: Transaction) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        // Handle undefined values
        if (aValue === undefined && bValue === undefined) return 0;
        if (aValue === undefined) return 1;
        if (bValue === undefined) return -1;
        
        // Compare values
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortConfig.direction === 'ascending' 
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        
        // Handle numeric values
        const aNum = Number(aValue);
        const bNum = Number(bValue);
        return sortConfig.direction === 'ascending' 
          ? aNum - bNum
          : bNum - aNum;
      });
    }

    return filtered;
  }, [selectedMonth, groupedTransactions, transactions, searchQuery, sortConfig]);

  const visibleTransactions = useMemo(() => {
    return (filteredTransactions || []).slice(0, visibleItems);
  }, [filteredTransactions, visibleItems]);

  const handleSort = (key: keyof Transaction) => {
    setSortConfig(prev => {
      if (prev?.key === key) {
        return {
          key,
          direction: prev.direction === 'ascending' ? 'descending' : 'ascending'
        };
      }
      return { key, direction: 'ascending' };
    });
  };

  const loadMore = () => {
    setVisibleItems(prev => prev + ITEMS_PER_PAGE);
  };

  const formatDate = (dateStr: string) => {
    // Return the date string as is since it's already in MM/DD/YYYY format
    return dateStr;
  };

  if (isLoading) {
    return (
      <Card className="p-4">
        <CardHeader>
          <CardTitle>Loading transactions...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  const renderMobileTransaction = (transaction: Transaction) => (
    <Card key={transaction.id} className="mb-4 p-4">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium">{transaction.description}</h4>
          <p className="text-sm text-gray-500">{transaction.date}</p>
          <Badge variant="secondary">
            {transaction.category}
          </Badge>
        </div>
        <div className={`text-${transaction.amount > 0 ? 'green' : 'red'}-600 font-medium`}>
          ${Math.abs(transaction.amount).toFixed(2)}
        </div>
      </div>
    </Card>
  );

  const renderTableCell = (transaction: Transaction): React.ReactElement => {
    return (
      <TableCell>
        <Badge variant="secondary">
          {transaction.category}
        </Badge>
      </TableCell>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <Select 
              value={selectedMonth || "all"} 
              onValueChange={(value) => setSelectedMonth(value === "all" ? "" : value)}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Transactions</SelectItem>
                {availableMonths.map(month => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input 
              type="search" 
              placeholder="Search transactions..." 
              className="w-full sm:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {isMobile ? (
            <div className="space-y-2">
              {visibleTransactions.map(renderMobileTransaction)}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleTransactions.map((transaction: Transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    {renderTableCell(transaction)}
                    <TableCell className={`text-right text-${transaction.amount > 0 ? 'green' : 'red'}-600`}>
                      ${Math.abs(transaction.amount).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          
          {(filteredTransactions?.length ?? 0) > visibleItems && (
            <div className="flex justify-center mt-4">
              <Button variant="outline" onClick={loadMore}>
                Load More
              </Button>
            </div>
          )}
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Total Spending</span>
              <span className="font-medium">{formatCurrency(total)}</span>
            </div>
            <div className="text-sm text-gray-500">
              {filteredTransactions?.length ?? 0} transactions
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlyTransactions; 