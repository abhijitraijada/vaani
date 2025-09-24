import { useEffect, useState } from 'react';
import { Card, Stack, Flex, Grid } from '../primitives/Layout';
import { Text } from '../primitives/Typography';
import { Button } from '../primitives/Button';
import { Field, FieldLabel, TextInput, EmailInput, PhoneInput, NumberInput, Select, Textarea } from '../form/Fields';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../primitives/Accordion';
import { validateName, validateEmail, validatePhone, validateCity, validateAge, validateGender, validateLanguage } from '../../lib/validation';

type ValidationErrors = {
  name?: string;
  email?: string;
  phone?: string;
  city?: string;
  age?: string;
  gender?: string;
  language?: string;
};

export type Participant = {
  name: string;
  email: string;
  phone: string;
  city: string;
  age: number | null;
  gender: 'M' | 'F';
  language: string;
  special_requirements?: string;
};

export function ParticipantRegistrationForm({
  participants,
  onChange,
  onAdd,
  onRemove,
  onNext,
  submitButtonText = "Next",
  isSubmitting = false,
  onCancel,
}: {
  participants: Participant[];
  onChange: (index: number, patch: Partial<Participant>) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onNext: () => void;
  submitButtonText?: string;
  isSubmitting?: boolean;
  onCancel?: () => void;
}) {
  const [openItem, setOpenItem] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<number, ValidationErrors>>({});

  // Validate a single field
  const validateField = (participant: Participant, field: keyof ValidationErrors): string | undefined => {
    const value = participant[field];
    switch (field) {
      case 'name':
        return validateName(value as string).error;
      case 'email':
        return validateEmail(value as string).error;
      case 'phone':
        return validatePhone(value as string).error;
      case 'city':
        return validateCity(value as string).error;
      case 'age':
        return validateAge(value as number).error;
      case 'gender':
        return validateGender(value as string).error;
      case 'language':
        return validateLanguage(value as string).error;
      default:
        return undefined;
    }
  };

  // Validate all fields for a participant
  const validateParticipant = (participant: Participant, index: number) => {
    const participantErrors: ValidationErrors = {};
    let hasErrors = false;

    (['name', 'email', 'phone', 'city', 'age', 'gender', 'language'] as const).forEach(field => {
      const error = validateField(participant, field);
      if (error) {
        participantErrors[field] = error;
        hasErrors = true;
      }
    });

    setErrors(prev => ({
      ...prev,
      [index]: participantErrors
    }));

    return !hasErrors;
  };

  // Validate all participants
  const validateAll = (): boolean => {
    let isValid = true;
    participants.forEach((participant, index) => {
      if (!validateParticipant(participant, index)) {
        isValid = false;
        setOpenItem(index.toString()); // Open the accordion with errors
      }
    });
    return isValid;
  };

  // Handle field blur
  const handleBlur = (index: number, field: keyof ValidationErrors) => {
    const participant = participants[index];
    const error = validateField(participant, field);
    setErrors(prev => ({
      ...prev,
      [index]: {
        ...prev[index],
        [field]: error
      }
    }));
  };

  // Handle next button click
  const handleNext = () => {
    if (validateAll()) {
      onNext();
    }
  };

  // Auto-open first item when it's the only one
  useEffect(() => {
    if (participants.length === 1) {
      setOpenItem('0');
    }
  }, [participants.length]);

  // Auto-open newly added items
  useEffect(() => {
    if (participants.length > 0) {
      setOpenItem((participants.length - 1).toString());
    }
  }, [participants.length]);

  return (
    <Card>
      <Stack className="gap-4">
        <Accordion
          type="single"
          value={openItem}
          onValueChange={(value) => setOpenItem(Array.isArray(value) ? value[0] : value)}
          className="w-full"
        >
          {participants.map((p, idx) => (
            <AccordionItem key={idx} value={idx.toString()} className="mb-2">
              <AccordionTrigger>
                <span className="truncate text-left">
                  {idx === 0 ? 'Primary Contact' : `Member ${idx + 1}`}: {p.name || 'Unnamed'}
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <Stack>
                  <Grid className="grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field>
                      <FieldLabel>Name</FieldLabel>
                      <TextInput 
                        value={p.name} 
                        onChange={(e) => onChange(idx, { name: e.target.value.trim() })}
                        onBlur={() => handleBlur(idx, 'name')}
                        placeholder="Full Name"
                        required 
                      />
                      {errors[idx]?.name && (
                        <Text className="text-sm text-red-500 dark:text-red-500 mt-1">{errors[idx].name}</Text>
                      )}
                    </Field>

                    <Field>
                      <FieldLabel>Email</FieldLabel>
                      <EmailInput 
                        value={p.email} 
                        onChange={(e) => onChange(idx, { email: e.target.value.trim() })}
                        onBlur={() => handleBlur(idx, 'email')}
                        placeholder="email@example.com"
                        required
                      />
                      {errors[idx]?.email && (
                        <Text className="text-sm text-red-500 dark:text-red-500 mt-1">{errors[idx].email}</Text>
                      )}
                    </Field>

                    <Field>
                      <FieldLabel>Phone</FieldLabel>
                      <PhoneInput 
                        value={p.phone} 
                        onChange={(e) => onChange(idx, { phone: e.target.value.trim() })}
                        onBlur={() => handleBlur(idx, 'phone')}
                        placeholder="+91 98765 43210"
                        required
                      />
                      {errors[idx]?.phone && (
                        <Text className="text-sm text-red-500 dark:text-red-500 mt-1">{errors[idx].phone}</Text>
                      )}
                    </Field>

                    <Field>
                      <FieldLabel>City</FieldLabel>
                      <TextInput 
                        value={p.city} 
                        onChange={(e) => onChange(idx, { city: e.target.value.trim() })}
                        onBlur={() => handleBlur(idx, 'city')}
                        placeholder="Your City"
                        required
                      />
                      {errors[idx]?.city && (
                        <Text className="text-sm text-red-500 dark:text-red-500 mt-1">{errors[idx].city}</Text>
                      )}
                    </Field>

                    <Field>
                      <FieldLabel>Age</FieldLabel>
                      <NumberInput 
                                                  value={p.age || ''}  
                        onChange={(e) => onChange(idx, { age: Number(e.target.value) })}
                        onBlur={() => handleBlur(idx, 'age')}
                        placeholder="Age in years"
                        required
                      />
                      {errors[idx]?.age && (
                        <Text className="text-sm text-red-500 dark:text-red-500 mt-1">{errors[idx].age}</Text>
                      )}
                    </Field>

                    <Field>
                      <FieldLabel>Gender</FieldLabel>
                      <Select
                        value={p.gender}
                        onChange={(e) => onChange(idx, { gender: e.target.value as Participant['gender'] })}
                        onBlur={() => handleBlur(idx, 'gender')}
                        required
                      >
                        <option value="">Select</option>
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                      </Select>
                      {errors[idx]?.gender && (
                        <Text className="text-sm text-red-500 dark:text-red-500 mt-1">{errors[idx].gender}</Text>
                      )}
                    </Field>

                    <Field>
                      <FieldLabel>Preferred Language</FieldLabel>
                      <TextInput 
                        value={p.language} 
                        onChange={(e) => onChange(idx, { language: e.target.value.trim() })}
                        onBlur={() => handleBlur(idx, 'language')}
                        placeholder="e.g., Hindi, English"
                        required
                      />
                      {errors[idx]?.language && (
                        <Text className="text-sm text-red-500 dark:text-red-500 mt-1">{errors[idx].language}</Text>
                      )}
                    </Field>

                    <Field>
                      <FieldLabel>Special Requirements</FieldLabel>
                      <Textarea
                        value={p.special_requirements}
                        onChange={(e) => onChange(idx, { special_requirements: e.target.value.trim() })}
                        placeholder="Any special requirements or notes"
                      />
                    </Field>
                  </Grid>
                  {participants.length > 1 && (
                    <Flex className="justify-end gap-2 mt-4">
                      <Button variant="destructive" onClick={() => onRemove(idx)}>Remove</Button>
                    </Flex>
                  )}
                </Stack>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <Stack className="gap-4">
          <Button variant="secondary" onClick={onAdd}>Add Another Member</Button>
          <div className="flex flex-col sm:flex-row justify-end gap-4">
            {onCancel && (
              <Button 
                variant="secondary" 
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}
            <Button onClick={handleNext} loading={isSubmitting} disabled={isSubmitting}>
              {submitButtonText}
            </Button>
          </div>
        </Stack>
      </Stack>
    </Card>
  );
}