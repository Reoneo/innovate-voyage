
/**
 * Normalize and detect ENS and related input types only as needed
 * @param raw - input from user
 * @param isPostalCode - helper function passed in for postcode detection in your main resolver
 */
export function normalizeInput(raw: string, isPostalCode: (v: string) => boolean): string {
  raw = raw.trim();

  let type: 'ensName' | 'address' | 'email' | 'phone' | 'postcode' | 'handle';
  if (/\.eth$/i.test(raw)) {
    type = 'ensName';
  } else if (/^0x[0-9A-Fa-f]{40}$/.test(raw)) {
    type = 'address';
  } else if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw)) {
    type = 'email';
  } else if (/^\+?[0-9]{7,15}$/.test(raw)) {
    type = 'phone';
  } else if (isPostalCode(raw)) {
    type = 'postcode';
  } else {
    type = 'handle';
  }

  // Only append .eth if it looks like an ENS name but lacks suffix
  if (type === 'ensName' && !/\.eth$/i.test(raw)) {
    return raw + '.eth';
  }
  return raw;
}
