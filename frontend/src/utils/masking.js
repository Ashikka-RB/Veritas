/**
 * Masks the Aadhaar number to display only the last 4 digits.
 * Format: XXXX XXXX 9012
 * @param {string|number} number - The Aadhaar number to mask
 * @returns {string} The masked Aadhaar number
 */
export const maskAadhaar = (number) => {
  if (number === null || number === undefined) return 'Not Found';
  const clean = String(number).replace(/\s/g, '');
  if (clean.length === 0) return 'Not Found';
  if (clean.length < 4) return clean;
  const last4 = clean.slice(-4);
  return `XXXX XXXX ${last4}`;
};

/**
 * Masks the PAN number to display only the last 4 characters.
 * Format: ******234F
 * @param {string} number - The PAN number to mask
 * @returns {string} The masked PAN number
 */
export const maskPan = (number) => {
  if (number === null || number === undefined) return 'Not Found';
  const clean = String(number).trim();
  if (clean.length === 0) return 'Not Found';
  if (clean.length < 4) return clean;
  const last4 = clean.slice(-4);
  return `******${last4}`;
};
