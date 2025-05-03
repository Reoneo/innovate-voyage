
import { ContributionData } from '../types';

// Use the new GitHub API token for authenticated requests
const GITHUB_API_TOKEN = "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";

export const verifyGitHubUser = async (username: string): Promise<boolean> => {
  console.log(`Verifying GitHub user: ${username}`);
  try {
    // First try without authentication
    let userResponse = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        'User-Agent': 'TalentProtocol-App'
      }
    });
    
    // If we hit rate limits or other issues, retry with token
    if (!userResponse.ok && userResponse.status === 403) {
      console.log('Rate limited on unauthenticated request, trying with token...');
      userResponse = await fetch(`https://api.github.com/users/${username}`, {
        headers: {
          'Authorization': `token ${GITHUB_API_TOKEN}`,
          'User-Agent': 'TalentProtocol-App'
        }
      });
    }

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
    
    // Try first without a token (might work for public profiles with no rate limiting)
    let graphqlResponse;
    let useToken = false;
    
    try {
      graphqlResponse = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'TalentProtocol-App'
        },
        body: JSON.stringify({ query })
      });
      
      // If we get rate limited or unauthorized, we'll retry with token
      if (graphqlResponse.status === 401 || graphqlResponse.status === 403) {
        useToken = true;
      }
    } catch (err) {
      console.log('Error with unauthenticated request, falling back to token');
      useToken = true;
    }
    
    // If needed, retry with authentication token
    if (useToken) {
      console.log('Using authentication token for GraphQL request');
      graphqlResponse = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `bearer ${GITHUB_API_TOKEN}`,
          'User-Agent': 'TalentProtocol-App'
        },
        body: JSON.stringify({ query })
      });
    }
    
    // Handle error responses
    if (!graphqlResponse.ok) {
      const errorText = await graphqlResponse.text();
      console.error('GitHub API error:', graphqlResponse.status, errorText);
      throw new Error(`GitHub API error: ${graphqlResponse.status} - ${errorText}`);
    }

    const graphqlData = await graphqlResponse.json();
    console.log('GitHub API response received');
    
    if (graphqlData.errors) {
      console.error('GitHub GraphQL errors:', graphqlData.errors);
      throw new Error(graphqlData.errors[0].message);
    }

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
  } catch (err) {
    console.error('Error fetching GitHub contribution data:', err);
    throw err; // Let the error propagate so we can show appropriate error messages
  }
};
