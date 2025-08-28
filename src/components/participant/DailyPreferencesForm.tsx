import type { FormEvent } from 'react';
import { Card, Stack } from '../primitives/Layout';
import { Heading, Text } from '../primitives/Typography';
import { Button } from '../primitives/Button';
import { Form } from '../form/Form';
import { Field, FieldLabel, FieldError, Checkbox, Textarea, Select, Radio } from '../form/Fields';
import { Switch } from '../primitives/Switch';
import { Flex } from '../primitives/Layout';

export type DayPreferences = {
  attending: boolean | null; // null = not selected, true = attending, false = not attending
  stayingWithYatra: boolean;
  dinnerAtHost: boolean;
  breakfastAtHost: boolean;
  lunchWithYatra: boolean;
  physicalLimitations: string | null;
  toiletPreference: 'indian' | 'western' | null;
};

export function DailyPreferencesForm({
  dateLabel,
  values,
  errors = {},
  onChange,
  onPrev,
  onNext,
  backToRegister,
  dayConfig,
}: {
  dateLabel: string;
  values: DayPreferences;
  errors?: Partial<Record<keyof DayPreferences, string>>;
  onChange: (patch: Partial<DayPreferences>) => void;
  onPrev?: () => void;
  onNext?: () => void;
  backToRegister: () => void;
  dayConfig: {
    breakfast_provided: boolean;
    lunch_provided: boolean;
    dinner_provided: boolean;
    daily_notes: string;
    location_name: string;
  };
}) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onNext?.();
  };

  // Parse the date to get day of the week
  const getDayOfWeek = (dateString: string) => {
    // Handle both DD/MM/YYYY and YYYY-MM-DD formats
    let date: Date;
    if (dateString.includes('/')) {
      // DD/MM/YYYY format
      const [day, month, year] = dateString.split('/');
      date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    } else {
      // YYYY-MM-DD format
      date = new Date(dateString);
    }
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  return (
    <Card>
      <Stack className="gap-4">
        <Stack className="gap-2">
          <Heading className="text-lg">Preferences for {dateLabel} ({getDayOfWeek(dateLabel)})</Heading>
          <Text className="text-sm text-gray-600 dark:text-gray-400">{dayConfig.daily_notes}</Text>
        </Stack>
        <Form onSubmit={handleSubmit}>
          <Stack className="gap-4">
            <Field>
              <FieldLabel>Will you attend the yatra on this day?</FieldLabel>
              <div className="space-y-2">
                <Flex className="items-center gap-3">
                  <Radio
                    id="attending-yes"
                    name="attending"
                    checked={values.attending === true}
                    onChange={() => onChange({ 
                      attending: true,
                      stayingWithYatra: false,
                      dinnerAtHost: false,
                      breakfastAtHost: false,
                      lunchWithYatra: false,
                      physicalLimitations: '',
                      toiletPreference: null
                    })}
                  />
                  <FieldLabel>Yes, I will attend</FieldLabel>
                </Flex>
                <Flex className="items-center gap-3">
                  <Radio
                    id="attending-no"
                    name="attending"
                    checked={values.attending === false}
                    onChange={() => onChange({ 
                      attending: false,
                      stayingWithYatra: false,
                      dinnerAtHost: false,
                      breakfastAtHost: false,
                      lunchWithYatra: false,
                      physicalLimitations: '',
                      toiletPreference: null
                    })}
                  />
                  <FieldLabel>No, I will not attend</FieldLabel>
                </Flex>
              </div>
              <FieldError>{errors.attending}</FieldError>
            </Field>

            {values.attending === true && (
              <>
                <Field className="mb-2">
                  <div className="flex items-center justify-between">
                    <FieldLabel>Stay with Local Families</FieldLabel>
                    <Switch
                      checked={values.stayingWithYatra}
                      onCheckedChange={(checked) => {
                        if (!checked) {
                          // If not staying with yatra, uncheck breakfast and dinner
                          onChange({ 
                            stayingWithYatra: checked,
                            breakfastAtHost: false,
                            dinnerAtHost: false
                          });
                        } else {
                          onChange({ stayingWithYatra: checked });
                        }
                      }}
                    />
                  </div>
                  <FieldError>{errors.stayingWithYatra}</FieldError>
                  {!values.stayingWithYatra ? (
                    <Text className="text-sm text-yellow-700 dark:text-yellow-300 text-left">
                      Note: Since you are not staying with the local families, you can only opt for lunch if needed.
                    </Text>
                    ) : null
                  }
                </Field>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Always show lunch if provided */}
                  {dayConfig.lunch_provided && (
                    <Field>
                      <Flex className="items-center gap-3">
                        <Checkbox 
                          checked={values.lunchWithYatra} 
                          onChange={(e) => onChange({ lunchWithYatra: e.target.checked })} 
                        />
                        <FieldLabel>Lunch with yatra</FieldLabel>
                      </Flex>
                      <FieldError>{errors.lunchWithYatra}</FieldError>
                    </Field>
                  )}
                  
                  {/* Show breakfast and dinner only when staying with yatra */}
                  {values.stayingWithYatra && (
                    <>
                      {dayConfig.dinner_provided && (
                        <Field>
                          <Flex className="items-center gap-3">
                            <Checkbox 
                              checked={values.dinnerAtHost} 
                              onChange={(e) => onChange({ dinnerAtHost: e.target.checked })} 
                            />
                            <FieldLabel>Dinner at host</FieldLabel>
                          </Flex>
                          <FieldError>{errors.dinnerAtHost}</FieldError>
                        </Field>
                      )}

                      {dayConfig.breakfast_provided && (
                        <Field>
                          <Flex className="items-center gap-3">
                            <Checkbox 
                              checked={values.breakfastAtHost} 
                              onChange={(e) => onChange({ breakfastAtHost: e.target.checked })} 
                            />
                            <FieldLabel>Breakfast at host</FieldLabel>
                          </Flex>
                          <FieldError>{errors.breakfastAtHost}</FieldError>
                        </Field>
                      )}
                    </>
                  )}
                </div>

                {values.stayingWithYatra && (
                  <>
                    <Field className="pt-4">
                      <FieldLabel>Physical limitations</FieldLabel>
                      <Textarea value={values.physicalLimitations ?? ''} onChange={(e) => onChange({ physicalLimitations: (e.target as HTMLTextAreaElement).value })} />
                      <FieldError>{errors.physicalLimitations}</FieldError>
                    </Field>

                    <Field>
                      <FieldLabel>Toilet preference</FieldLabel>
                      <Select value={values.toiletPreference ?? ''} onChange={(e) => onChange({ toiletPreference: (e.target as HTMLSelectElement).value as DayPreferences['toiletPreference'] })}>
                        <option value="">Select</option>
                        <option value="indian">Indian</option>
                        <option value="western">Western</option>
                      </Select>
                      <FieldError>{errors.toiletPreference}</FieldError>
                    </Field>
                  </>
                )}
              </>
            )}

            {values.attending === false && (
              <Text className="text-sm text-gray-600 dark:text-gray-400 text-center py-4">
                You have indicated that you will not attend on this day. No further preferences are needed.
              </Text>
            )}

            <Stack className="gap-4">
              <Button type="button" variant="secondary" onClick={backToRegister}>
                Back to Register
              </Button>
              <div className="flex flex-col sm:flex-row justify-end gap-4">
                {onPrev && (
                  <Button type="button" variant="secondary" onClick={onPrev}>
                    Previous
                  </Button>
                )}
                {onNext ? (
                  <Button 
                    type="submit" 
                    disabled={values.attending === null}
                  >
                    Next
                  </Button>
                ) : null}
              </div>
            </Stack>
          </Stack>
        </Form>
      </Stack>
    </Card>
  );
}


