
// Use explicit named exports to avoid star export conflicts
export { avatarCache } from './avatarCache';
export { generateFallbackAvatar } from './avatarCache';
export { WEB3_BIO_API_KEY, WEB3_BIO_HEADERS, REQUEST_DELAY_MS } from './config';
export { getWeb3BioEndpoint } from './endpointResolver';
export { processWeb3BioProfileData } from './profileProcessor';
export { enforceRateLimit, getWeb3BioHeaders } from './rateLimiter';
export { fetchWeb3BioProfile } from './profileFetcher';
