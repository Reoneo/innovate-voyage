
import { ContributionData } from '../types';

// Using the new GitHub API token
const GITHUB_API_TOKEN = "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";

export const verifyGitHubUser = async (username: string): Promise<boolean> => {
  console.log(`Verifying GitHub user: ${username}`);
  try {
    // Make an unauthenticated request first to avoid rate limits for simple user checks
    const userResponse = await fetch(`https://api.github.com/users/${username}`);

    if (!userResponse.ok) {
      console.error(`GitHub API returned ${userResponse.status} for ${username}`);
      const errorText = await userResponse.text();
      console.error('Error response:', errorText);
      return false;
    }
    
    const userData = await userResponse.json();
    console.log(`Found GitHub user: ${userData.login} (${userData.name || 'No name'})`);
    return true;
  } catch (error) {
    console.error('Error verifying GitHub user:', error);
    return false;
  }
};

export const fetchGitHubContributions = async (username: string): Promise<ContributionData | null> => {
  try {
    // First verify the user exists
    const userExists = await verifyGitHubUser(username);
    if (!userExists) {
      console.error(`GitHub user ${username} does not exist or is not accessible`);
      return null;
    }
    
    // Now fetch the contributions data with GraphQL
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

    console.log(`Fetching GitHub contributions for ${username}`);
    
    // First try with authentication
    try {
      const graphqlResponse = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GITHUB_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query })
      });
      
      if (graphqlResponse.ok) {
        const graphqlData = await graphqlResponse.json();
        console.log('GitHub API response received with auth');
        
        if (graphqlData.errors) {
          console.error('GitHub GraphQL errors (with auth):', graphqlData.errors);
          throw new Error(graphqlData.errors[0].message);
        }
        
        return processContributionData(graphqlData, username);
      } else {
        console.warn(`Authenticated request failed with status: ${graphqlResponse.status}. Will try unauthenticated.`);
        throw new Error(`GitHub API error: ${graphqlResponse.status}`);
      }
    } catch (authError) {
      // If authentication fails (token expired, etc), try without auth
      console.warn('Authenticated request failed, trying unauthenticated request:', authError);
      
      // Attempting an unauthenticated request
      // Note: This might hit rate limits quickly, but is a fallback
      const unauthResponse = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query })
      });

      if (!unauthResponse.ok) {
        const errorText = await unauthResponse.text();
        console.error('Unauthenticated GitHub API error:', unauthResponse.status, errorText);
        throw new Error(`GitHub API error: ${unauthResponse.status} - ${errorText}`);
      }

      const graphqlData = await unauthResponse.json();
      console.log('GitHub API response received (unauth)');
      
      if (graphqlData.errors) {
        console.error('GitHub GraphQL errors (unauth):', graphqlData.errors);
        throw new Error(graphqlData.errors[0].message);
      }
      
      return processContributionData(graphqlData, username);
    }
  } catch (err) {
    console.error('Error fetching GitHub contribution data:', err);
    return null;
  }
};

function processContributionData(graphqlData: any, username: string): ContributionData | null {
  if (!graphqlData.data || !graphqlData.data.user) {
    console.error('No user data in GraphQL response');
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

  console.log(`Successfully processed GitHub data for ${username}`);
  return processed;
}
