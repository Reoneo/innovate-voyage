
require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 4000;

// Enable CORS for frontend requests
app.use(cors());

const TOKEN = process.env.GITHUB_API_TOKEN;
if (!TOKEN) {
  console.error('❌ Missing GITHUB_API_TOKEN in .env');
  console.error('Create a .env file with your GitHub token');
  process.exit(1);
}

app.get('/api/github-contributions', async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: 'Username parameter is required' });
  }

  console.log(`Processing request for GitHub user: ${username}`);

  // First verify the user exists
  try {
    const userResponse = await fetch(`https://api.github.com/users/${username}`);
    if (!userResponse.ok) {
      console.error(`GitHub user API returned ${userResponse.status} for ${username}`);
      return res.status(404).json({ 
        error: `GitHub user ${username} does not exist or is not accessible` 
      });
    }
  } catch (error) {
    console.error('Error verifying GitHub user:', error);
    return res.status(500).json({ error: 'Failed to verify GitHub user' });
  }

  // Fetch contributions with GraphQL
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

  try {
    console.log(`Fetching GitHub contributions for ${username}`);
    
    const graphqlResponse = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query })
    });

    if (!graphqlResponse.ok) {
      const status = graphqlResponse.status;
      const errorText = await graphqlResponse.text();
      
      console.error(`GitHub API error: ${status}`, errorText);
      return res.status(status).json({ 
        error: `GitHub API returned error: ${status}`,
        details: errorText
      });
    }

    const graphqlData = await graphqlResponse.json();
    
    if (graphqlData.errors) {
      console.error('GitHub GraphQL errors:', graphqlData.errors);
      return res.status(400).json({ 
        error: 'GitHub GraphQL error',
        details: graphqlData.errors[0].message
      });
    }
    
    // Process the data
    const contributionCalendar = graphqlData.data.user.contributionsCollection.contributionCalendar;
    
    const processed = {
      totalContributions: contributionCalendar.totalContributions,
      weeks: contributionCalendar.weeks.map((week) => ({
        contributionDays: week.contributionDays.map((day) => ({
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
    return res.status(200).json(processed);
    
  } catch (err) {
    console.error('Error in GitHub API handler:', err);
    return res.status(500).json({ 
      error: 'Error fetching GitHub contribution data',
      details: err instanceof Error ? err.message : 'Unknown error'
    });
  }
});

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('Server is running');
});

app.listen(PORT, () => {
  console.log(`🚀 GitHub API proxy server running on http://localhost:${PORT}`);
  console.log(`Try: http://localhost:${PORT}/api/github-contributions?username=octocat`);
});
