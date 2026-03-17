import type { SearchParticipantResponse } from '../../services/endpoints/registration.types';
import { Heading } from '../primitives/Typography';
import { Button } from '../primitives/Button';
import { Icon } from '../primitives/Icon';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { cn } from '../../lib/cn';
import { HostAllocationResults } from './HostAllocationResults';

interface HostAccommodationModalProps {
    result: SearchParticipantResponse | null;
    isOpen: boolean;
    onClose: () => void;
}

export function HostAccommodationModal({ result, isOpen, onClose }: HostAccommodationModalProps) {
    const { isMobile } = useMediaQuery();

    if (!isOpen || !result) return null;

    return (
        <div className={cn(
            'fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-all duration-300',
            isMobile ? 'flex flex-col' : 'flex items-center justify-center p-4'
        )}>
            <div className={cn(
                'bg-white dark:bg-gray-900 w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300',
                isMobile
                    ? 'h-full flex flex-col'
                    : 'rounded-3xl max-w-4xl max-h-[90vh]'
            )}>
                {/* Header */}
                <div className={cn(
                    'flex items-center justify-between p-5 md:p-6 border-b border-gray-100 dark:border-gray-800',
                    isMobile && 'sticky top-0 z-10 bg-white dark:bg-gray-900'
                )}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                            <Icon name="home" width={24} height={24} />
                        </div>
                        <Heading className="text-xl font-bold text-gray-900 dark:text-gray-100">
                            Accommodation Details
                        </Heading>
                    </div>
                    <Button
                        variant="icon"
                        size="sm"
                        onClick={onClose}
                        className="w-10 h-10 p-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-500 dark:hover:text-gray-300 dark:hover:bg-gray-800 rounded-full transition-colors"
                    >
                        <Icon name="x" width={24} height={24} />
                    </Button>
                </div>

                {/* Content */}
                <div className={cn(
                    'overflow-y-auto custom-scrollbar',
                    isMobile ? 'flex-1 p-4' : 'p-8 max-h-[75vh]'
                )}>
                    <HostAllocationResults result={result} />
                </div>

                {/* Footer */}
                <div className={cn(
                    'flex items-center justify-center p-5 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50',
                    isMobile && 'sticky bottom-0'
                )}>
                    <Button 
                        variant="secondary" 
                        onClick={onClose}
                        className="px-8 rounded-xl font-bold"
                    >
                        Got it, thanks!
                    </Button>
                </div>
            </div>
        </div>
    );
}
