
// Re-export all avatar service functionality
export * from './getRealAvatar';

// Add fetchAvatarUrl function
export const fetchAvatarUrl = async (identity: string): Promise<string | null> => {
  // Import dynamically to avoid circular dependencies
  const { getRealAvatar } = await import('./getRealAvatar');
  return getRealAvatar(identity);
};
