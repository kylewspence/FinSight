import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useToast } from '@/components/ui/use-toast';
import { parseCSVData } from '@/lib/csv-storage';
import { Upload } from 'lucide-react';

const FileUploadSheet = () => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const validateCSV = (text: string): boolean => {
    console.log('Validating CSV...');
    const lines = text.split('\n');
    if (lines.length < 2) {
      toast({
        title: 'Error',
        description: 'The file appears to be empty or invalid.',
        variant: 'destructive',
      });
      return false;
    }

    // Basic structure validation
    const headers = lines[0].split(',').map(header => header.trim());
    console.log('Headers found:', headers);
    
    // Check if we have at least some recognizable fields
    const hasRecognizableFields = headers.some(header => {
      const h = header.toLowerCase();
      return h.includes('date') || 
             h.includes('amount') || 
             h.includes('total') || 
             h.includes('description') ||
             h.includes('category') ||
             h.includes('type');
    });

    if (!hasRecognizableFields) {
      toast({
        title: 'Warning',
        description: 'This CSV file might not contain financial transaction data. Please verify the contents.',
        variant: 'destructive',
      });
      return false;
    }

    // Sample a few rows to check data format
    const sampleRows = lines.slice(1, 4).filter(line => line.trim());
    if (sampleRows.length === 0) {
      toast({
        title: 'Error',
        description: 'No data rows found in the file.',
        variant: 'destructive',
      });
      return false;
    }

    return true;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File selected:', event.target.files?.[0]);
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    console.log('Upload button clicked');
    if (!selectedFile) {
      console.log('No file selected');
      toast({
        title: 'Error',
        description: 'Please select a file first.',
        variant: 'destructive',
      });
      return;
    }

    try {
      console.log('Reading file...');
      const text = await selectedFile.text();
      console.log('File content:', text.substring(0, 100) + '...');
      
      if (!validateCSV(text)) {
        console.log('CSV validation failed');
        return;
      }

      console.log('Parsing CSV data...');
      parseCSVData(text);
      
      toast({
        title: 'Success',
        description: 'File uploaded and processed successfully.',
      });
      setSelectedFile(null);
      setIsOpen(false);
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Error',
        description: 'Failed to process the file. Please check the format and try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">Upload Data</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Upload Data</SheetTitle>
          <SheetDescription>
            Upload your financial transaction data in CSV format.
            <br />
            The file should contain transaction details like dates, amounts, and descriptions.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="flex items-center px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose File
              </label>
              {selectedFile && (
                <span className="text-sm text-gray-600">{selectedFile.name}</span>
              )}
            </div>
            <Button 
              onClick={handleUpload}
              disabled={!selectedFile}
              className="w-full"
            >
              Upload File
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FileUploadSheet; 