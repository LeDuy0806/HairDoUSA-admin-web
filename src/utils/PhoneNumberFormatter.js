export const formatUSPhoneNumber = phoneNumber => {
  // Remove all non-digit characters
  let digits = phoneNumber.replace(/\D/g, '');

  // If the number doesn't have country code, add it
  if (digits.length === 10) {
    digits = '1' + digits;
  }

  // If the first digit is 1 (without +), assume it's the country code
  if (digits.length === 11 && digits[0] === '1') {
    // Format as: +1 (XXX) XXX-XXXX
    return `+1 ${digits.slice(1, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 11)}`;
  }

  // If it's not a standard US number, return cleaned version with +1
  return digits ? `+1 ${digits}` : '';
};
