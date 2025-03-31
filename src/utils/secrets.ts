
/**
 * Utility for managing application secrets
 * These values would normally be kept in environment variables
 * or a secure secrets manager
 */

// These are just placeholders that would be replaced with actual environment variable access
// in a production environment
const SECRETS = {
  DOPPLER_API_KEY: "vGJ0AfBhEbUpxaHxGcfaqPNuEucj9ccs48HFobTbG8TGoZBnxH7My5MptnHSzR6f",
  POAP_CLIENT_ID: "sjiB1afZNmYODDWFYZBSxd3bQTz5p5Bv",
  POAP_CLIENT_SECRET: "8dsDHAWhjbzbtZH2x6WHEqt0swIqq59d7sh0gNesJdpjU-cUtypmHu49frLMSJbU",
};

/**
 * Get a secret value by key
 * @param key The secret key to retrieve
 * @returns The secret value or null if not found
 */
export function getSecret(key: keyof typeof SECRETS): string | null {
  return SECRETS[key] || null;
}

/**
 * Check if a secret exists and has a value
 * @param key The secret key to check
 * @returns True if the secret exists and has a value
 */
export function hasSecret(key: keyof typeof SECRETS): boolean {
  return !!SECRETS[key];
}
