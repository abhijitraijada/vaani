type ValidationResult = {
  isValid: boolean;
  error?: string;
};

export const validateName = (value: string): ValidationResult => {
  const trimmed = value.trim();
  if (!trimmed) {
    return { isValid: false, error: 'Name is required' };
  }
  if (trimmed.length < 3) {
    return { isValid: false, error: 'Name must be at least 3 characters long' };
  }
  return { isValid: true };
};

export const validateEmail = (value: string): ValidationResult => {
  const trimmed = value.trim();
  if (!trimmed) {
    return { isValid: false, error: 'Email is required' };
  }
  // RFC 5322 compliant email regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  if (!emailRegex.test(trimmed)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  return { isValid: true };
};

export const validatePhone = (value: string): ValidationResult => {
  const trimmed = value.trim();
  if (!trimmed) {
    return { isValid: false, error: 'Phone number is required' };
  }
  // Allow only digits and + symbol
  const phoneRegex = /^[+\d]+$/;
  if (!phoneRegex.test(trimmed)) {
    return { isValid: false, error: 'Phone number can only contain digits and + symbol' };
  }
  // Remove + and check length
  const digitsOnly = trimmed.replace(/[+]/g, '');
  if (digitsOnly.length < 10) {
    return { isValid: false, error: 'Phone number must be at least 10 digits long' };
  }
  return { isValid: true };
};

export const validateCity = (value: string): ValidationResult => {
  const trimmed = value.trim();
  if (!trimmed) {
    return { isValid: false, error: 'City is required' };
  }
  return { isValid: true };
};

export const validateAge = (value: number | null): ValidationResult => {
  if (!value && value !== 0) {
    return { isValid: false, error: 'Age is required' };
  }
  if (value <= 0 || value > 120) {
    return { isValid: false, error: 'Please enter a valid age between 1 and 120' };
  }
  return { isValid: true };
};

export const validateGender = (value: string): ValidationResult => {
  if (!value) {
    return { isValid: false, error: 'Gender is required' };
  }
  return { isValid: true };
};

export const validateLanguage = (value: string): ValidationResult => {
  const trimmed = value.trim();
  if (!trimmed) {
    return { isValid: false, error: 'Language is required' };
  }
  return { isValid: true };
};
