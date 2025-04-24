import { Transaction } from '@/types/transaction';

export interface Investment {
  type: 'stock' | 'property';
  date: string;
  // Stock specific fields
  symbol?: string;
  shares?: number;
  price?: number;
  currentPrice?: number;
  // Property specific fields
  propertyAddress?: string;
  purchasePrice?: number;
  currentValue?: number;
  mortgage?: number;
  rate?: number;
  monthlyRent?: number;
  expenses?: number;
  // Common fields
  value?: number;
  change?: number;
}

// Sample CSV data for investments
const SAMPLE_INVESTMENTS_CSV = `type,date,symbol,shares,price,currentPrice,propertyAddress,purchasePrice,currentValue,mortgage,rate,monthlyRent,expenses
stock,2024-01-01,AAPL,100,190.50,195.20,,,,,,,,
stock,2024-01-01,MSFT,50,375.80,380.20,,,,,,,,
stock,2024-01-01,GOOGL,30,140.20,142.50,,,,,,,,
stock,2024-01-01,AMZN,40,155.30,158.40,,,,,,,,
stock,2024-01-01,NVDA,25,480.50,490.20,,,,,,,,
property,2024-01-01,,,,,123 Main St,450000,475000,350000,4.25,2800,800
property,2024-01-01,,,,,456 Oak Ave,380000,395000,290000,3.75,2400,650`;

// Add sample spending data
const SAMPLE_SPENDING_CSV = `date,description,amount,type,category
2024/03/15,Grocery Store,-125.50,Sale,Groceries
2024/03/14,Restaurant,-45.75,Sale,Dining
2024/03/13,Gas Station,-35.20,Sale,Transportation
2024/03/12,Monthly Salary,3500.00,Payment,Income
2024/03/10,Internet Bill,-89.99,Sale,Utilities
2024/03/08,Coffee Shop,-4.75,Sale,Dining
2024/03/05,Amazon Purchase,-65.99,Sale,Shopping
2024/03/03,Uber Ride,-22.50,Sale,Transportation
2024/03/01,Rent Payment,-1500.00,Sale,Housing
2024/02/28,Pharmacy,-32.50,Sale,Healthcare
2024/02/25,Movie Tickets,-30.00,Sale,Entertainment
2024/02/20,Bonus Payment,1000.00,Payment,Income
2024/02/15,Electric Bill,-75.50,Sale,Utilities`;

const STORAGE_KEY = 'spendingData';

export const initializeSampleData = () => {
  try {
    // Check and initialize spending data
    if (!localStorage.getItem(STORAGE_KEY)) {
      console.log('Initializing sample spending data...');
      const parsedSpending = parseCSVData(SAMPLE_SPENDING_CSV);
      if (parsedSpending.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsedSpending));
        window.dispatchEvent(new Event('spendingDataUpdated'));
        console.log('Sample spending data initialized successfully');
      } else {
        console.warn('Failed to parse sample spending data');
      }
    }
  } catch (error) {
    console.error('Error initializing sample data:', error);
  }
};

export const getInvestmentsData = (): Investment[] => {
  const data = localStorage.getItem('investmentsData');
  if (!data) {
    initializeSampleData();
    return JSON.parse(localStorage.getItem('investmentsData') || '[]');
  }

  const parsedData = JSON.parse(data);
  return parsedData.map((item: any): Investment => {
    if (item.type === 'stock') {
      const price = parseFloat(item.price) || 0;
      const shares = parseFloat(item.shares) || 0;
      const currentPrice = parseFloat(item.currentPrice) || price;
      return {
        type: 'stock',
        date: item.date || '',
        symbol: item.symbol || '',
        shares,
        price,
        currentPrice,
        value: shares * currentPrice,
        change: price ? ((currentPrice - price) / price) * 100 : 0
      };
    } else {
      const purchasePrice = parseFloat(item.purchasePrice) || 0;
      const currentValue = parseFloat(item.currentValue) || purchasePrice;
      return {
        type: 'property',
        date: item.date || '',
        propertyAddress: item.propertyAddress || '',
        purchasePrice,
        currentValue,
        mortgage: parseFloat(item.mortgage) || 0,
        rate: parseFloat(item.rate) || 0,
        monthlyRent: parseFloat(item.monthlyRent) || 0,
        expenses: parseFloat(item.expenses) || 0,
        value: currentValue,
        change: purchasePrice ? ((currentValue - purchasePrice) / purchasePrice) * 100 : 0
      };
    }
  });
};

// Generic CSV parser
const parseCSV = (csv: string, headerValidation?: (headers: string[]) => number) => {
  const lines = csv.trim().split('\n');
  if (lines.length < 2) return [];
  
  let headerIndex = 0;
  if (headerValidation) {
    headerIndex = headerValidation(lines);
  }
  
  // Log headers for debugging
  console.log('CSV Headers:', lines[headerIndex]);
  
  const headers = lines[headerIndex].split(',').map(header => header.trim());
  return lines.slice(headerIndex + 1)
    .filter(line => line.trim())
    .map(line => {
      const values = line.split(',').map(value => value.trim().replace(/^"|"$/g, ''));
      const obj: Record<string, string> = {};
      
      headers.forEach((header, i) => {
        // Preserve the exact header names from the CSV
        obj[header] = values[i] || '';
      });
      
      return obj;
    });
};

// Validate spending data headers
const validateSpendingHeaders = (lines: string[]): number => {
  for (let i = 0; i < lines.length; i++) {
    // Log each line for debugging
    console.log('Checking line:', lines[i]);
    
    // Check for both possible date column names
    if (lines[i].includes('Transaction Date') || lines[i].includes('Post Date')) {
      console.log('Found header row at index:', i);
      return i;
    }
  }
  console.warn('No valid header row found, using first row');
  return 0;
};

export const updateSpendingData = (newData: string) => {
  try {
    // Split into lines and find the header row
    const lines = newData.trim().split('\n');
    const headerRow = lines.findIndex(line => line.includes('Transaction Date'));
    if (headerRow === -1) {
      throw new Error('Could not find Transaction Date column');
    }

    // Get headers and data rows
    const headers = lines[headerRow].split(',').map(h => h.trim());
    const dataRows = lines.slice(headerRow + 1)
      .filter(line => line.trim())
      .map(line => {
        const values = line.split(',').map(v => v.trim());
        const row: Record<string, string> = {};
        headers.forEach((header, i) => {
          row[header] = values[i] || '';
        });
        return row;
      });

    // Store the raw parsed data
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataRows));
    window.dispatchEvent(new Event('spendingDataUpdated'));
  } catch (error) {
    console.error('Error parsing spending data:', error);
    throw new Error('Failed to parse spending data');
  }
};

export const updateInvestmentsData = (newData: string) => {
  const parsedData = parseCSV(newData);
  localStorage.setItem('investmentsData', JSON.stringify(parsedData));
  window.dispatchEvent(new Event('investmentsDataUpdated'));
};

// Data validation interfaces
interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

interface DataValidators {
  [key: string]: (value: any) => boolean;
}

// Validation functions
const validators: DataValidators = {
  isValidDate: (value: string) => {
    if (!value) return false;
    const date = new Date(value);
    return !isNaN(date.getTime());
  },
  isValidAmount: (value: any) => {
    if (value === null || value === undefined) return false;
    const cleaned = String(value).replace(/[^0-9.\-()]/g, '');
    return !isNaN(parseFloat(cleaned));
  }
};

// Safe data access helper
const safeGet = (obj: any, key: string | undefined, defaultValue: any = ''): any => {
  if (!key || !obj) return defaultValue;
  return obj[key] ?? defaultValue;
};

// Normalize amount value
const normalizeAmount = (value: any): number => {
  if (!value) return 0;
  
  try {
    const strValue = String(value);
    // Remove currency symbols and extra spaces
    let cleaned = strValue.replace(/[^0-9.\-()]/g, '');
    
    // Handle parentheses notation
    if (cleaned.includes('(') && cleaned.includes(')')) {
      cleaned = '-' + cleaned.replace(/[()]/g, '');
    }
    
    const amount = parseFloat(cleaned);
    return isNaN(amount) ? 0 : amount;
  } catch (error) {
    console.warn('Error normalizing amount:', value, error);
    return 0;
  }
};

// Find matching key helper
const findMatchingKey = (obj: Record<string, any>, patterns: string[]): string | undefined => {
  if (!obj || typeof obj !== 'object') return undefined;
  
  return Object.keys(obj).find(key => 
    patterns.some(pattern => 
      key.toLowerCase().includes(pattern.toLowerCase())
    )
  );
};

export const getSpendingData = async (): Promise<Transaction[]> => {
  try {
    const rawData = localStorage.getItem(STORAGE_KEY);
    if (!rawData) {
      console.log('No spending data found, initializing sample data...');
      initializeSampleData();
      const sampleData = localStorage.getItem(STORAGE_KEY);
      if (!sampleData) return [];
      return JSON.parse(sampleData);
    }

    const parsedData = JSON.parse(rawData);
    if (!Array.isArray(parsedData)) {
      console.warn('Stored data is not an array');
      return [];
    }

    console.log(`Processing ${parsedData.length} transactions...`);
    
    const transactions = parsedData
      .map((item, index) => {
        try {
          if (!item || typeof item !== 'object') return null;

          const amountKey = Object.keys(item).find(key => 
            key.toLowerCase().includes('amount') || 
            key.toLowerCase().includes('total') ||
            key.toLowerCase().includes('debit') ||
            key.toLowerCase().includes('credit')
          );
          
          const dateKey = Object.keys(item).find(key => 
            key.toLowerCase().includes('date')
          );

          if (!amountKey || !dateKey) return null;

          const rawAmount = item[amountKey]?.toString() || '0';
          let amount = parseFloat(rawAmount.replace(/[^0-9.\-]/g, ''));
          if (isNaN(amount)) amount = 0;

          const transaction: Transaction = {
            date: item[dateKey] || '',
            description: item['Description'] || item['DESCRIPTION'] || item['description'] || 'No Description',
            category: item['Category'] || item['CATEGORY'] || item['category'] || 'Uncategorized',
            amount: amount,
            type: amount >= 0 ? 'Payment' : 'Sale'
          };

          return transaction;
        } catch (itemError) {
          return null;
        }
      })
      .filter((t): t is Transaction => t !== null);

    console.log(`Successfully processed ${transactions.length} valid transactions`);
    return transactions;
  } catch (error) {
    console.error('Error in getSpendingData:', error);
    return [];
  }
};

export function exportInvestmentsData(): string {
  const data = getInvestmentsData();
  if (!data || data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvRows = [headers.join(',')];
  
  data.forEach((row: Investment) => {
    const values = headers.map(header => String(row[header as keyof Investment] || ''));
    csvRows.push(values.join(','));
  });
  
  return csvRows.join('\n');
}

export async function exportSpendingData(): Promise<string> {
  const data = await getSpendingData();
  if (!data || data.length === 0) return '';
  
  const headers = ['date', 'category', 'amount'];
  const csvRows = [headers.join(',')];
  
  data.forEach((transaction: Transaction) => {
    const values = headers.map(header => transaction[header as keyof Transaction]);
    csvRows.push(values.join(','));
  });
  
  return csvRows.join('\n');
}

export function downloadCSV(data: string, filename: string): void {
  const blob = new Blob([data], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('hidden', '');
  a.setAttribute('href', url);
  a.setAttribute('download', filename);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

export const parseCSVData = (newData: string): Transaction[] => {
  try {
    if (!newData?.trim()) {
      console.warn('Empty CSV data provided');
      return [];
    }

    const lines = newData.split('\n').map(line => line.trim()).filter(Boolean);
    if (lines.length < 2) {
      console.warn('CSV data contains no transactions');
      return [];
    }

    // Parse headers with validation
    const headers = lines[0].split(',').map(header => header.trim());
    if (headers.length === 0) {
      console.warn('No headers found in CSV');
      return [];
    }

    // Process transactions with error handling
    const transactions = lines.slice(1)
      .map((line, index) => {
        try {
          const values = line.split(',').map(value => value.trim());
          if (values.length !== headers.length) {
            console.warn(`Skipping malformed line ${index + 2}: column count mismatch`);
            return null;
          }

          // Create raw transaction object
          const rawTransaction = headers.reduce((obj, header, i) => {
            obj[header] = values[i];
            return obj;
          }, {} as Record<string, string>);

          // Process using the same logic as getSpendingData
          const amountKey = findMatchingKey(rawTransaction, ['amount', 'total', 'debit', 'credit']);
          const dateKey = findMatchingKey(rawTransaction, ['date', 'time']);
          const descriptionKey = findMatchingKey(rawTransaction, ['description', 'memo', 'details']);
          const categoryKey = findMatchingKey(rawTransaction, ['category', 'type']);

          const amount = normalizeAmount(safeGet(rawTransaction, amountKey, 0));
          const date = safeGet(rawTransaction, dateKey);
          const description = safeGet(rawTransaction, descriptionKey, 'No Description');
          const category = safeGet(rawTransaction, categoryKey, 'Uncategorized');

          // Validate required fields
          if (!validators.isValidDate(date)) {
            console.warn(`Invalid date in CSV row ${index + 2}:`, date);
            return null;
          }

          return {
            date,
            description,
            category,
            amount,
            type: amount < 0 ? 'Payment' : 'Purchase'
          };
        } catch (lineError) {
          console.error(`Error processing CSV line ${index + 2}:`, lineError);
          return null;
        }
      })
      .filter(Boolean) as Transaction[];

    // Only save and dispatch if we have valid transactions
    if (transactions.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
      window.dispatchEvent(new Event('spendingDataUpdated'));
      console.info(`Successfully processed ${transactions.length} transactions`);
    } else {
      console.warn('No valid transactions found in CSV');
    }

    return transactions;
  } catch (error) {
    console.error('Critical error parsing CSV data:', error);
    return [];
  }
};