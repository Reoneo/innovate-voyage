
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

// Middleware to log all requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Simple rate limiting to avoid token expiration
const requestsMap = new Map();
const MAX_REQUESTS_PER_MINUTE = 50; // GitHub's rate limit is 60/hour for unauthenticated requests
const RATE_LIMIT_WINDOW = 60000; // 1 minute

function rateLimitMiddleware(req, res, next) {
  const now = Date.now();
  const clientIp = req.ip;
  
  // Clean up old entries
  for (const [key, timestamp] of requestsMap.entries()) {
    if (now - timestamp > RATE_LIMIT_WINDOW) {
      requestsMap.delete(key);
    }
  }
  
  const requestCount = Array.from(requestsMap.values()).filter(
    timestamp => now - timestamp < RATE_LIMIT_WINDOW
  ).length;
  
  if (requestCount >= MAX_REQUESTS_PER_MINUTE) {
    console.warn(`Rate limit exceeded: ${requestCount} requests in the last minute`);
    return res.status(429).json({ 
      error: 'Rate limit exceeded. Please try again later.',
      retryAfter: '60 seconds'
    });
  }
  
  requestsMap.set(`${clientIp}:${now}`, now);
  next();
}

app.use(rateLimitMiddleware);

app.get('/api/github-contributions', async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: 'Username parameter is required' });
  }

  console.log(`Processing request for GitHub user: ${username}`);

  // First verify the user exists
  try {
    const userResponse = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Accept': 'application/json',
        'User-Agent': 'GitHub-Contribution-Tracker'
      }
    });
    
    if (userResponse.status === 401 || userResponse.status === 403) {
      console.error(`Authentication error: ${userResponse.status}. Token may be expired or invalid.`);
      return res.status(401).json({ 
        error: 'GitHub API token is invalid or expired', 
        tokenStatus: 'invalid'
      });
    }
    
    if (!userResponse.ok) {
      console.error(`GitHub user API returned ${userResponse.status} for ${username}`);
      return res.status(404).json({ 
        error: `GitHub user ${username} does not exist or is not accessible` 
      });
    }
    
    const userData = await userResponse.json();
    console.log(`Verified GitHub user: ${userData.login} (${userData.name || 'No name'})`);
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
        'Content-Type': 'application/json',
        'User-Agent': 'GitHub-Contribution-Tracker'
      },
      body: JSON.stringify({ query })
    });

    if (graphqlResponse.status === 401 || graphqlResponse.status === 403) {
      console.error(`Authentication error: ${graphqlResponse.status}. Token may be expired or invalid.`);
      return res.status(401).json({ 
        error: 'GitHub API token is invalid or expired',
        tokenStatus: 'invalid'
      });
    }

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
      // Check if error is related to authentication
      if (graphqlData.errors.some(err => err.type === 'UNAUTHORIZED' || err.message.includes('token') || err.message.includes('auth'))) {
        return res.status(401).json({ 
          error: 'GitHub API token is invalid or expired',
          tokenStatus: 'invalid',
          details: graphqlData.errors[0].message
        });
      }
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
    
    // Add caching headers
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
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
  res.status(200).json({ 
    status: 'running',
    tokenAvailable: !!TOKEN,
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 GitHub API proxy server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Try: http://localhost:${PORT}/api/github-contributions?username=octocat`);
});
