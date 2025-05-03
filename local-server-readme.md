
# GitHub Contributions Local Server

This is a local Express server that acts as a proxy for fetching GitHub contribution data. It keeps your GitHub API token secure by storing it server-side.

## Setup

### 1. Install dependencies:
```bash
npm install express node-fetch dotenv cors
```

### 2. Create a .env file in the root directory:
```
GITHUB_API_TOKEN=your_github_personal_access_token_here
```

Make sure to replace the placeholder with your actual GitHub Personal Access Token.

### 3. Start the server:
```bash
node server.js
```

The server will run on http://localhost:4000 by default.

## Usage

### Endpoints:

* GET `/api/github-contributions?username=octocat`
  * Returns GitHub contributions data for the specified username
  * Response includes totalContributions, weekly contribution data, and user information
  
* GET `/health`
  * Simple health check endpoint

## Integration with the Frontend

Update the `useGitHubContributions.ts` hook to use this local endpoint instead of the Vercel serverless function.

## Security Notes

* Do not commit your .env file to version control
* Keep your GitHub token secure
* For production, consider using proper authentication and more robust security measures
