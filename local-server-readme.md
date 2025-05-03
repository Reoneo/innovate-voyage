
# GitHub Contributions Local Server

This is a local Express server that acts as a proxy for fetching GitHub contribution data. It keeps your GitHub API token secure by storing it server-side.

## Setup

### 1. Create a .env file in the root directory:
```
GITHUB_API_TOKEN=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
```

### 2. Install dependencies:
```bash
npm install
```

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

The React hook `useGitHubContributions.ts` is already configured to use this local server.
