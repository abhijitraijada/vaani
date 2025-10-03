import { useState } from 'react';
import { Card } from '../primitives/Layout';
import { Heading, Text } from '../primitives/Typography';
import { Button } from '../primitives/Button';
import { Icon } from '../primitives/Icon';

interface DeleteAssignmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  participantName: string;
  hostName: string;
  isLoading?: boolean;
}

export function DeleteAssignmentDialog({
  isOpen,
  onClose,
  onConfirm,
  participantName,
  hostName,
  isLoading = false
}: DeleteAssignmentDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Delete confirmation failed:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    if (!isDeleting && !isLoading) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <Icon name="alert-triangle" width={24} height={24} className="text-red-500" />
            <Heading className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Remove Assignment
            </Heading>
          </div>
          
          {/* Content */}
          <div className="mb-6">
            <Text className="text-gray-600 dark:text-gray-400 mb-4">
              Are you sure you want to remove <span className="font-medium text-gray-900 dark:text-gray-100">{participantName}</span> from{' '}
              <span className="font-medium text-gray-900 dark:text-gray-100">{hostName}</span>?
            </Text>
            
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <Text className="text-red-600 dark:text-red-400 text-sm">
                ⚠️ This action cannot be undone. The participant will be unassigned from this host.
              </Text>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <Button 
              variant="secondary" 
              onClick={handleCancel}
              disabled={isDeleting || isLoading}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleConfirm}
              disabled={isDeleting || isLoading}
            >
              <div className="flex items-center space-x-2">
                {isDeleting || isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <Text>Removing...</Text>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <Text>Remove Assignment</Text>
                  </>
                )}
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
