/**
 * Sanitizes a phone number for searching and registration.
 * Removes all white spaces, leading +91 (India country code), and leading zero(s).
 * 
 * @param phone - The raw phone number string from input
 * @returns A sanitized 10-digit (typically) phone number string
 */
export const sanitizePhoneNumber = (phone: string): string => {
  if (!phone) return '';
  
  return phone
    .replace(/\s+/g, '')       // Remove all white spaces
    .replace(/^\+91/, '')     // Remove leading +91
    .replace(/^0+/, '');      // Remove leading zero(s)
};
