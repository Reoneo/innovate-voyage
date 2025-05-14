
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
    // For demonstration purposes, just return mock data
    // In a real implementation, you would fetch actual data from GitHub
    
    // Generate random contributions between 100-500
    const totalContributions = Math.floor(Math.random() * 400) + 100;
    
    // Generate random streaks
    const currentStreak = Math.floor(Math.random() * 10) + 1;
    const longestStreak = Math.floor(Math.random() * 20) + currentStreak;
    
    const mockData = {
      totalContributions,
      contributionCount: totalContributions,
      currentStreak,
      longestStreak,
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
