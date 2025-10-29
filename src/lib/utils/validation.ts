// Validation utilities for Indian identity documents

export const validatePAN = (pan: string): boolean => {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
  return panRegex.test(pan);
};

export const validateGST = (gst: string): boolean => {
  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return gstRegex.test(gst);
};

export const validateAadhaar = (aadhaar: string): boolean => {
  const aadhaarRegex = /^[0-9]{12}$/;
  return aadhaarRegex.test(aadhaar.replace(/\s/g, ''));
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[6-9][0-9]{9}$/;
  return phoneRegex.test(phone);
};

export const formatPhone = (phone: string): string => {
  if (!phone) return '';
  return phone.replace(/(\d{5})(\d{5})/, '$1 $2');
};

export const formatAadhaar = (aadhaar: string): string => {
  if (!aadhaar) return '';
  return aadhaar.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3');
};
