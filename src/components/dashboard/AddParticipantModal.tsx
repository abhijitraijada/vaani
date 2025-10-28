import { useState } from 'react';
import { Button } from '../primitives/Button';
import { Heading, Text } from '../primitives/Typography';
import { ParticipantRegistrationForm, type Participant } from '../participant/ParticipantRegistrationForm';
import { DailyPreferencesForm, type DayPreferences } from '../participant/DailyPreferencesForm';
import { TransportTypeSelector, type TransportType } from '../participant/TransportTypeSelector';
import { VehicleDetailsFields, type VehicleDetails } from '../participant/VehicleDetailsFields';
import { RegistrationStepper } from '../participant/RegistrationStepper';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { cn } from '../../lib/cn';
import { useAppSelector } from '../../store';

interface AddParticipantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (registrationData: CompleteRegistrationData) => Promise<void>;
  className?: string;
}

export type CompleteRegistrationData = {
  participants: Participant[];
  transportType: TransportType;
  vehicle: VehicleDetails;
  preferencesByDate: Record<string, DayPreferences>;
};

export function AddParticipantModal({ isOpen, onClose, onSubmit, className }: AddParticipantModalProps) {
  const { isMobile } = useMediaQuery();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get event data to access event days
  const { activeEvent } = useAppSelector(state => state.events);
  
  // Step 1: Participant Details
  const [participants, setParticipants] = useState<Participant[]>([
    {
      name: '',
      email: '',
      phone: '',
      city: '',
      age: null,
      gender: 'M',
      language: '',
      special_requirements: ''
    }
  ]);

  // Step 2: Daily Preferences (per day)
  const [preferencesByDate, setPreferencesByDate] = useState<Record<string, DayPreferences>>({});
  const [preferenceStep, setPreferenceStep] = useState(0);

  // Step 3: Transportation (with defaults)
  const [transportType, setTransportType] = useState<TransportType>('public');
  const [vehicle, setVehicle] = useState<VehicleDetails>({
    hasEmptySeats: false,
    availableSeats: undefined,
  });

  const steps = ['Register', 'Preferences', 'Vehicle'];
  
  // Get event days sorted chronologically
  const eventDays = activeEvent ? [...activeEvent.event_days].sort((a, b) => 
    new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
  ) : [];

  const handleAddParticipant = () => {
    setParticipants(prev => [...prev, {
      name: '',
      email: '',
      phone: '',
      city: '',
      age: null,
      gender: 'M',
      language: '',
      special_requirements: ''
    }]);
  };

  const handleRemoveParticipant = (index: number) => {
    setParticipants(prev => prev.filter((_, i) => i !== index));
  };

  const handleParticipantChange = (index: number, patch: Partial<Participant>) => {
    setParticipants(prev => prev.map((p, i) => i === index ? { ...p, ...patch } : p));
  };

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const completeData: CompleteRegistrationData = {
        participants,
        transportType,
        vehicle,
        preferencesByDate,
      };
      
      await onSubmit(completeData);
      handleClose();
    } catch (error) {
      console.error('Failed to add participant:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    // Reset all form data
    setCurrentStep(0);
    setPreferenceStep(0);
    setParticipants([{
      name: '',
      email: '',
      phone: '',
      city: '',
      age: null,
      gender: 'M',
      language: '',
      special_requirements: ''
    }]);
    setPreferencesByDate({});
    setTransportType('public');
    setVehicle({
      hasEmptySeats: false,
      availableSeats: undefined,
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <ParticipantRegistrationForm
            participants={participants}
            onAdd={handleAddParticipant}
            onRemove={handleRemoveParticipant}
            onChange={handleParticipantChange}
            onNext={handleNextStep}
            onCancel={handleClose}
            submitButtonText="Next: Preferences"
            isSubmitting={isSubmitting}
          />
        );
      
      case 1:
        const currentDay = eventDays[preferenceStep];
        const currentDate = currentDay?.event_date;
        const dayPrefs = preferencesByDate[currentDate] ?? {
          attending: true, // Default to attending
          stayingWithYatra: false,
          dinnerAtHost: currentDay?.dinner_provided || false,
          breakfastAtHost: currentDay?.breakfast_provided || false,
          lunchWithYatra: currentDay?.lunch_provided || false,
          physicalLimitations: '',
          toiletPreference: 'indian' as 'indian' | 'western' | null,
        };

        const formatDate = (dateString: string) => {
          const date = new Date(dateString);
          return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          });
        };

        const handlePreferenceChange = (patch: Partial<DayPreferences>) => {
          if (currentDate) {
            setPreferencesByDate(prev => ({
              ...prev,
              [currentDate]: { ...dayPrefs, ...patch }
            }));
          }
        };

        const handlePreferenceNext = () => {
          if (preferenceStep < eventDays.length - 1) {
            setPreferenceStep(prev => prev + 1);
          } else {
            handleNextStep();
          }
        };

        const handlePreferencePrev = () => {
          if (preferenceStep > 0) {
            setPreferenceStep(prev => prev - 1);
          } else {
            handlePrevStep();
          }
        };

        return (
          <div className="space-y-6">
            <div className="text-center">
              <Heading className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Daily Preferences
              </Heading>
              <Text className="text-sm text-gray-600 dark:text-gray-400">
                Set preferences for each event day
              </Text>
            </div>
            
            {/* Day stepper */}
            <div className="flex justify-center">
              <RegistrationStepper 
                steps={eventDays.map(day => formatDate(day.event_date))} 
                current={preferenceStep} 
              />
            </div>
            
            {/* Daily preferences form */}
            <DailyPreferencesForm
              dateLabel={currentDate ? formatDate(currentDate) : ''}
              dayConfig={{
                breakfast_provided: currentDay?.breakfast_provided || false,
                lunch_provided: currentDay?.lunch_provided || false,
                dinner_provided: currentDay?.dinner_provided || false,
                daily_notes: currentDay?.daily_notes || '',
                location_name: currentDay?.location_name || '',
              }}
              values={dayPrefs}
              onChange={handlePreferenceChange}
              onPrev={preferenceStep === 0 ? undefined : handlePreferencePrev}
              onNext={handlePreferenceNext}
              backToRegister={handlePreferencePrev}
            />
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Heading className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Transportation Details
              </Heading>
              <Text className="text-sm text-gray-600 dark:text-gray-400">
                Set transportation preferences
              </Text>
            </div>
            
            <TransportTypeSelector
              value={transportType}
              onChange={setTransportType}
              hint="Choose the transport type for this participant."
            />
            
            {transportType === 'private' && (
              <VehicleDetailsFields
                values={vehicle}
                onChange={(patch) => setVehicle(prev => ({ ...prev, ...patch }))}
              />
            )}
            
            <div className="flex justify-between">
              <Button variant="secondary" onClick={handlePrevStep}>
                Back: Preferences
              </Button>
              <Button onClick={handleSubmit} loading={isSubmitting} disabled={isSubmitting}>
                {isSubmitting ? "Adding Participant..." : "Add Participant"}
              </Button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className={cn(
      'fixed inset-0 z-50',
      isMobile ? 'flex flex-col' : 'flex items-center justify-center'
    )}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className={cn(
        'relative bg-white dark:bg-gray-900 shadow-xl w-full overflow-hidden',
        isMobile 
          ? 'h-full flex flex-col' 
          : 'rounded-xl max-w-4xl mx-4 max-h-[90vh]',
        className
      )}>
        {/* Header - Sticky on mobile */}
        <div className={cn(
          'flex items-center justify-between p-4 md:p-6 border-b border-gray-200 dark:border-gray-700',
          isMobile && 'sticky top-0 z-10 bg-white dark:bg-gray-900'
        )}>
          <div className="flex-1">
            <Heading className="text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100">
              Add New Participant
            </Heading>
            <Text className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-1">
              Complete registration with all required details
            </Text>
          </div>
          <Button
            variant="ghost"
            onClick={handleClose}
            className="p-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>

        {/* Step Indicator - Sticky on mobile */}
        <div className={cn(
          'px-4 md:px-6 py-3 md:py-4 border-b border-gray-200 dark:border-gray-700',
          isMobile && 'sticky top-[73px] z-10 bg-white dark:bg-gray-900'
        )}>
          <RegistrationStepper steps={steps} current={currentStep} />
        </div>

        {/* Content - Flexible on mobile */}
        <div className={cn(
          'overflow-y-auto',
          isMobile 
            ? 'flex-1 p-4' 
            : 'p-6 max-h-[calc(90vh-200px)]'
        )}>
          {renderStepContent()}
        </div>
      </div>
    </div>
  );
}
