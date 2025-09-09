import { Card } from '../primitives/Layout';
import { Heading, Text } from '../primitives/Typography';
import { Button } from '../primitives/Button';
import { Icon } from '../primitives/Icon';

interface ExportProgressModalProps {
  progress: number;
  step: string;
  onClose: () => void;
}

export function ExportProgressModal({ progress, step, onClose }: ExportProgressModalProps) {
  const isError = step.includes('failed') || step.includes('error');
  const isComplete = progress >= 100 && !isError;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <div className="p-6">
          <div className="text-center mb-6">
            {isError ? (
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="x" className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
            ) : isComplete ? (
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="check" className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            ) : (
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            )}
            
            <Heading className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {isError ? 'Export Failed' : isComplete ? 'Export Complete' : 'Exporting Data'}
            </Heading>
            
            <Text className="text-gray-600 dark:text-gray-400">
              {step}
            </Text>
          </div>

          {/* Progress Bar */}
          {!isError && (
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="flex justify-center">
            {isComplete || isError ? (
              <Button onClick={onClose}>
                {isComplete ? 'Close' : 'Try Again'}
              </Button>
            ) : (
              <Button variant="secondary" onClick={onClose} disabled>
                Cancel Export
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
