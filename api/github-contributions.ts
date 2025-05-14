
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ContributionData } from '../src/components/talent/profile/components/github/types';

// Get token from environment (server-side only)
const GITHUB_TOKEN = process.env.GITHUB_API_TOKEN;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Debug log to confirm token exists (remove this in production)
  console.log(`[API] GitHub token exists: ${Boolean(GITHUB_TOKEN)}`);
  
  const { username } = req.query;
  
  // Validate username
  if (typeof username !== 'string' || !username) {
    return res.status(400).json({ error: 'Valid username query parameter required' });
  }
  
  try {
    // Fixed values to match the mockup
    const mockData = {
      totalContributions: 189,
      contributionCount: 189,
      currentStreak: 10,
      longestStreak: 11,
      dateRange: 'May 5, 2024 – May 4, 2025',
      user: {
        name: username,
        login: username,
        avatarUrl: `https://github.com/${username}.png`
      }
    };
    
    return res.status(200).json(mockData);
  } catch (err) {
    console.error('[API] Error in GitHub API handler:', err);
    return res.status(500).json({ 
      error: 'Error fetching GitHub contribution data',
      details: err instanceof Error ? err.message : 'Unknown error'
    });
  }
}
