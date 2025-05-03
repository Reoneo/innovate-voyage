
import { ContributionData } from '../types';

// GitHub API token for authenticated requests
const GITHUB_API_TOKEN = "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";

export const verifyGitHubUser = async (username: string): Promise<boolean> => {
  console.log(`Verifying GitHub user: ${username}`);
  try {
    const userResponse = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        'Authorization': `token ${GITHUB_API_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

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

    console.log('Sending GraphQL request for contributions');
    const graphqlResponse = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GITHUB_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query })
    });

    if (!graphqlResponse.ok) {
      const errorText = await graphqlResponse.text();
      console.error('GraphQL response not OK:', graphqlResponse.status, errorText);
      throw new Error(`GraphQL request failed: ${graphqlResponse.status} - ${errorText}`);
    }

    const graphqlData = await graphqlResponse.json();
    console.log('GraphQL response received:', graphqlData);
    
    if (graphqlData.errors) {
      console.error('GraphQL errors:', graphqlData.errors);
      throw new Error(graphqlData.errors[0].message);
    }

    if (!graphqlData.data || !graphqlData.data.user) {
      console.error('No user data in GraphQL response:', graphqlData);
      throw new Error('No user data returned from GitHub GraphQL API');
    }
    
    // Process the data
    const contributionCalendar = graphqlData.data.user.contributionsCollection.contributionCalendar;
    console.log('Raw contribution data:', contributionCalendar);
    
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

    console.log('Processed contribution data:', processed);
    return processed;
  } catch (err) {
    console.error('Error fetching GitHub contribution data:', err);
    return null;
  }
};
