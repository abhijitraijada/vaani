import { useState } from 'react';
import { Button } from '../primitives/Button';
import { Heading, Text } from '../primitives/Typography';
import { Card } from '../primitives/Layout';
import { cn } from '../../lib/cn';
import { hostDashboardService } from '../../services/endpoints/host.service';

interface HostBulkUploadProps {
  eventId: string;
  onUploadSuccess?: () => void;
  className?: string;
}

export function HostBulkUpload({ eventId, onUploadSuccess, className }: HostBulkUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{
    total: number;
    successful: number;
    failed: number;
    errors: string[];
  } | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setSelectedFile(file);
      setUploadResult(null);
    } else {
      alert('Please select a valid CSV file');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    
    try {
      const result = await hostDashboardService.bulkUploadHosts(eventId, selectedFile);
      
      setUploadResult({
        total: result.total_rows,
        successful: result.successful_imports,
        failed: result.failed_imports,
        errors: result.errors
      });
      
      if (onUploadSuccess && result.successful_imports > 0) {
        onUploadSuccess();
      }
      
      // Clear the file input if upload was successful
      if (result.successful_imports > 0) {
        setSelectedFile(null);
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      setUploadResult({
        total: 0,
        successful: 0,
        failed: 1,
        errors: [error?.message || 'Upload failed. Please check the file format and try again.']
      });
    } finally {
      setIsUploading(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent = `name,phone_no,place_name,max_participants,toilet_facilities,gender_preference,facilities_description
John Smith,9876543210,Smith Residence Downtown,5,both,both,Air conditioning WiFi parking
Jane Doe,9876543211,Doe House Suburb,4,western,female,Parking available`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'host_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className={cn('p-6', className)}>
      <Heading className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Bulk Upload Hosts
      </Heading>
      
      <Text className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Upload multiple hosts at once using a CSV file. Download the template to see the required format.
      </Text>

      <div className="space-y-4">
        {/* Template Download */}
        <div className="flex items-center gap-4">
          <Button variant="secondary" size="sm" onClick={downloadTemplate}>
            Download CSV Template
          </Button>
          <Text className="text-xs text-gray-500 dark:text-gray-400">
            Required format: name, phone_no, place_name, max_participants, toilet_facilities, gender_preference, facilities_description
          </Text>
        </div>

        {/* File Upload */}
        <div className="space-y-3">
          <div>
            <label htmlFor="csv-upload" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select CSV File
            </label>
            <input
              id="csv-upload"
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 dark:file:bg-purple-900/20 dark:file:text-purple-300"
            />
          </div>
          <div className="flex justify-end">
            <Button 
              variant="primary" 
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              loading={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Upload CSV'}
            </Button>
          </div>
        </div>

        {/* Selected File Info */}
        {selectedFile && (
          <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <Text className="text-sm font-medium text-green-800 dark:text-green-200">
                Ready to upload: {selectedFile.name} ({Math.round(selectedFile.size / 1024)}KB)
              </Text>
            </div>
          </div>
        )}

        {/* Upload Results */}
        {uploadResult && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Heading className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Upload Results
            </Heading>
            <div className="space-y-2">
              <Text className="text-sm">
                Total rows: <span className="font-medium">{uploadResult.total}</span>
              </Text>
              <Text className="text-sm text-green-600 dark:text-green-400">
                Successful: <span className="font-medium">{uploadResult.successful}</span>
              </Text>
              <Text className="text-sm text-red-600 dark:text-red-400">
                Failed: <span className="font-medium">{uploadResult.failed}</span>
              </Text>
              
              {uploadResult.errors.length > 0 && (
                <div className="mt-3">
                  <Text className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Errors:</Text>
                  <ul className="list-disc list-inside space-y-1">
                    {uploadResult.errors.map((error, index) => (
                      <li key={index} className="text-sm text-red-600 dark:text-red-400">
                        {error}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
