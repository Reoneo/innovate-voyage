
// Extract GitHub username from social links with improved handling
export const extractGitHubUsername = (passport: any) => {
  // First check if we already have github username directly in socials
  if (passport?.socials?.github) {
    const directGithub = passport.socials.github;
    console.log('GitHub from passport.socials.github:', directGithub);
    
    // If it's already a clean username (no URL), return it
    if (typeof directGithub === 'string' && !directGithub.includes('/') && !directGithub.includes('.')) {
      if (directGithub.startsWith('@')) {
        return directGithub.substring(1); // Remove @ prefix
      }
      return directGithub;
    }
  }
  
  // If nothing found or we need to extract from URL
  if (!passport?.socials?.github) {
    console.log('No GitHub social link found in passport');
    return null;
  }
  
  const githubUrl = passport.socials.github;
  console.log('Extracting GitHub username from:', githubUrl);
  
  try {
    // Handle different GitHub URL formats
    if (typeof githubUrl === 'string') {
      // Handle github.com URL format
      if (githubUrl.includes('github.com/')) {
        const parts = githubUrl.split('github.com/');
        // Get everything after github.com/ and before any query params or hashes
        const username = parts[1]?.split(/[/?#]/)[0];
        console.log('Extracted GitHub username from URL:', username);
        return username?.trim() || null;
      }
      
      // Handle direct username format with @ prefix
      if (githubUrl.startsWith('@')) {
        const username = githubUrl.substring(1).trim(); // Remove @ prefix
        console.log('Extracted GitHub username from @-prefix:', username);
        return username || null;
      }
      
      // Handle pure username format (no URL, no @)
      if (githubUrl.trim() !== '') {
        const username = githubUrl.trim();
        console.log('Using GitHub value directly as username:', username);
        return username;
      }
    }
  } catch (error) {
    console.error('Error extracting GitHub username:', error);
  }
  
  console.log('Could not extract GitHub username');
  return null;
};
