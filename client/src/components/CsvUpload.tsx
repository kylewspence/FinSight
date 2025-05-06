import { useState } from 'react';
import { Button } from './ui/button';
import { readToken } from '@/lib/data';

interface CsvUploadProps {
  onUploadComplete?: () => void;
}

export function CsvUpload({ onUploadComplete }: CsvUploadProps = {}) {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // This function runs when the user selects a file
  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    // Get the file from the input element
    const selectedFile = event.target.files?.[0];

    // Only proceed if a file was actually selected
    if (selectedFile) {
      // Update state with the file object
      setFile(selectedFile);
      // Save the filename for display
      setFileName(selectedFile.name);
    }
  }

  async function handleUpload(event: React.FormEvent) {
    event.preventDefault();
    if (!file) return;
    setIsSubmitting(true);
    setMessage('');

    try {
      const token = readToken();
      if (!token) throw new Error('Authentication required');

      const formData = new FormData();
      formData.append('csvFile', file);

      const response = await fetch('/api/uploads/csv', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }

      const result = await response.json();
      setMessage(`File "${result.fileName}" uploaded successfully!`);
      setFile(null);
      setFileName('');

      // Reset the file input
      const fileInput = document.getElementById('csv-file') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

      if (onUploadComplete) {
        onUploadComplete();
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage(
        `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="p-5 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Upload Statement</h2>

      <form onSubmit={handleUpload}>
        <div className="mb-4">
          <label htmlFor="csv-file" className="block text-sm font-medium mb-1">
            Select a CSV File
          </label>
          <input
            id="csv-file"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 
      file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        {file && (
          <div className="mt-3">
            <p className="text-sm text-gray-500">
              Selected File: <span className="font-semibold">{fileName}</span>
            </p>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Uploading...' : 'Upload'}
            </Button>
          </div>
        )}

        {message && (
          <div
            className={`mt-3 p-3 rounded ${
              message.includes('Error')
                ? 'bg-red-100 text-red-700'
                : 'bg-green-100 text-green-700'
            }`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
}
