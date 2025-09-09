import { useState } from 'react';
import { Button } from '../primitives/Button';
import { Icon } from '../primitives/Icon';
import { ExportOptionsModal } from './ExportOptionsModal';
import { ExportProgressModal } from './ExportProgressModal';
import type { ExportOptions } from '../../services/export/export.types';

interface ExportButtonProps {
  onExport: (options: ExportOptions) => Promise<void>;
  availableDays: Array<{
    id: string;
    date: string;
    location: string;
    participants: Array<{
      status: 'registered' | 'waiting' | 'confirmed' | 'cancelled';
    }>;
  }>;
  className?: string;
}

export function ExportButton({ onExport, availableDays, className }: ExportButtonProps) {
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [exportProgress, setExportProgress] = useState({ progress: 0, step: '' });

  const handleExportClick = () => {
    setShowOptionsModal(true);
  };

  const handleExportConfirm = async (options: ExportOptions) => {
    setShowOptionsModal(false);
    setShowProgressModal(true);
    setExportProgress({ progress: 0, step: 'Starting export...' });

    try {
      await onExport(options);
      setExportProgress({ progress: 100, step: 'Export completed!' });
      
      // Close progress modal after a short delay
      setTimeout(() => {
        setShowProgressModal(false);
        setExportProgress({ progress: 0, step: '' });
      }, 1500);
    } catch (error) {
      console.error('Export failed:', error);
      setExportProgress({ 
        progress: 0, 
        step: `Export failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      });
      
      // Close progress modal after showing error
      setTimeout(() => {
        setShowProgressModal(false);
        setExportProgress({ progress: 0, step: '' });
      }, 3000);
    }
  };


  return (
    <>
      <Button
        onClick={handleExportClick}
        className={className ? className : ''}
        variant="secondary"
      >
        <div className="flex items-center">
          <Icon name="download" className="w-4 h-4 mr-2" />
          <span>Export to Excel</span>
        </div>
      </Button>

      {showOptionsModal && (
        <ExportOptionsModal
          availableDays={availableDays}
          onConfirm={handleExportConfirm}
          onCancel={() => setShowOptionsModal(false)}
        />
      )}

      {showProgressModal && (
        <ExportProgressModal
          progress={exportProgress.progress}
          step={exportProgress.step}
          onClose={() => setShowProgressModal(false)}
        />
      )}
    </>
  );
}
