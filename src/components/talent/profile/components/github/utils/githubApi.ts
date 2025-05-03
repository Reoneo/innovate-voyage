
import { ContributionData } from '../types';

// For public repositories and profiles, we can often work without a token
// Only use a token when absolutely necessary to avoid rate limits
const GITHUB_API_TOKEN = ""; // Removing the token - we'll first try without one

export const verifyGitHubUser = async (username: string): Promise<boolean> => {
  console.log(`Verifying GitHub user: ${username}`);
  try {
    // Make an unauthenticated request for public user profiles
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
    
    // First try without any token for public profiles
    let graphqlResponse = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query })
    });
    
    // If we hit rate limits, use a fallback mechanism
    if (graphqlResponse.status === 401 || graphqlResponse.status === 403) {
      console.log('Unauthenticated request failed, trying alternative approach...');
      
      // For public profiles, we could try using the scraping approach as fallback
      // This involves fetching the public contribution graph from the user's profile page
      // However, this would require a more complex implementation to parse HTML
      
      // For now, we'll provide a more meaningful error
      throw new Error(`GitHub API authentication required. Rate limit may have been reached.`);
    }

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
    return null;
  }
};
