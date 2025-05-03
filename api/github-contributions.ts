
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
    // First verify the user exists
    const userExists = await verifyGitHubUser(username);
    if (!userExists) {
      return res.status(404).json({ error: `GitHub user ${username} does not exist or is not accessible` });
    }
    
    // Fetch the contributions data with GraphQL
    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);
    
    const query = `
      query {
        user(login: "${username}") {
          name
          login
          avatarUrl
          contributionsCollection(from: "${oneYearAgo.toISOString()}", to: "${today.toISOString()}") {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  date
                  contributionCount
                  contributionLevel
                }
              }
            }
          }
          repositoriesContributedTo(first: 1) {
            totalCount
          }
        }
      }
    `;

    console.log(`[API] Fetching GitHub contributions for ${username}`);
    
    // No token check needed here - this is server-side, so we'll use the token if it's available
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // Add authorization header if token is available
    if (GITHUB_TOKEN) {
      headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`;
    } else {
      console.warn('[API] No GitHub API token found in environment variables');
    }
    
    const graphqlResponse = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers,
      body: JSON.stringify({ query })
    });
    
    if (!graphqlResponse.ok) {
      const status = graphqlResponse.status;
      const errorText = await graphqlResponse.text();
      
      console.error(`[API] GitHub API error: ${status}`, errorText);
      return res.status(status).json({ 
        error: `GitHub API returned error: ${status}`,
        details: errorText
      });
    }

    const graphqlData = await graphqlResponse.json();
    
    if (graphqlData.errors) {
      console.error('[API] GitHub GraphQL errors:', graphqlData.errors);
      return res.status(400).json({ 
        error: 'GitHub GraphQL error',
        details: graphqlData.errors[0].message
      });
    }
    
    // Process the data
    const contributionData = processContributionData(graphqlData, username);
    
    // Return the processed data
    return res.status(200).json(contributionData);
  } catch (err) {
    console.error('[API] Error in GitHub API handler:', err);
    return res.status(500).json({ 
      error: 'Error fetching GitHub contribution data',
      details: err instanceof Error ? err.message : 'Unknown error'
    });
  }
}

async function verifyGitHubUser(username: string): Promise<boolean> {
  console.log(`[API] Verifying GitHub user: ${username}`);
  try {
    const userResponse = await fetch(`https://api.github.com/users/${username}`);

    if (!userResponse.ok) {
      console.error(`[API] GitHub API returned ${userResponse.status} for ${username}`);
      return false;
    }
    
    const userData = await userResponse.json();
    console.log(`[API] Found GitHub user: ${userData.login} (${userData.name || 'No name'})`);
    return true;
  } catch (error) {
    console.error('[API] Error verifying GitHub user:', error);
    return false;
  }
}

function processContributionData(graphqlData: any, username: string): ContributionData | null {
  if (!graphqlData.data || !graphqlData.data.user) {
    console.error('[API] No user data in GraphQL response');
    throw new Error('No user data returned from GitHub GraphQL API');
  }
  
  // Process the data
  const contributionCalendar = graphqlData.data.user.contributionsCollection.contributionCalendar;
  
  const processed: ContributionData = {
    totalContributions: contributionCalendar.totalContributions,
    weeks: contributionCalendar.weeks.map((week: any) => ({
      contributionDays: week.contributionDays.map((day: any) => ({
        date: day.date,
        count: day.contributionCount,
        level: day.contributionLevel === 'NONE' ? 0 :
               day.contributionLevel === 'FIRST_QUARTILE' ? 1 :
               day.contributionLevel === 'SECOND_QUARTILE' ? 2 :
               day.contributionLevel === 'THIRD_QUARTILE' ? 3 : 4
      }))
    })),
    user: {
      name: graphqlData.data.user.name,
      login: graphqlData.data.user.login,
      avatarUrl: graphqlData.data.user.avatarUrl,
      repositoriesContributedTo: graphqlData.data.user.repositoriesContributedTo
    }
  };

  console.log(`[API] Successfully processed GitHub data for ${username}`);
  return processed;
}
