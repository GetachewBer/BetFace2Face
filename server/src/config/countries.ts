export interface Country {
  name: string;
  code: string;
  dialCode: string;
  flag: string;
}

export const countries: Country[] = [
  { name: 'Ethiopia', code: 'ET', dialCode: '+251', flag: '🇪🇹' },
  { name: 'Kenya', code: 'KE', dialCode: '+254', flag: '🇰🇪' },
  { name: 'Somalia', code: 'SO', dialCode: '+252', flag: '🇸🇴' },
  { name: 'Djibouti', code: 'DJ', dialCode: '+253', flag: '🇩🇯' },
  { name: 'Eritrea', code: 'ER', dialCode: '+291', flag: '🇪🇷' },
  { name: 'Sudan', code: 'SD', dialCode: '+249', flag: '🇸🇩' },
  { name: 'South Sudan', code: 'SS', dialCode: '+211', flag: '🇸🇸' },
  { name: 'Egypt', code: 'EG', dialCode: '+20', flag: '🇪🇬' },
  { name: 'Nigeria', code: 'NG', dialCode: '+234', flag: '🇳🇬' },
  { name: 'Ghana', code: 'GH', dialCode: '+233', flag: '🇬🇭' },
  { name: 'United States', code: 'US', dialCode: '+1', flag: '🇺🇸' },
  { name: 'United Kingdom', code: 'GB', dialCode: '+44', flag: '🇬🇧' },
  { name: 'United Arab Emirates', code: 'AE', dialCode: '+971', flag: '🇦🇪' },
  { name: 'Saudi Arabia', code: 'SA', dialCode: '+966', flag: '🇸🇦' },
];

// Get country by dial code
export const getCountryByDialCode = (dialCode: string): Country | undefined => {
  return countries.find((c) => c.dialCode === dialCode);
};

// Validate phone number format (9 digits after country code)
export const isValidPhoneNumber = (phone: string, dialCode: string): boolean => {
  // Remove the dial code and any spaces/dashes
  const number = phone.replace(dialCode, '').replace(/[\s\-\(\)]/g, '');
  // Check if remaining is exactly 9 digits
  return /^\d{9}$/.test(number);
};

// Format full phone number
export const formatPhoneNumber = (dialCode: string, number: string): string => {
  // Clean the number (remove non-digits)
  const cleanNumber = number.replace(/\D/g, '');
  return `${dialCode}${cleanNumber}`;
};