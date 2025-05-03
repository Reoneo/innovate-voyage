
# GitHub Contributions Local Server

This is a local Express server that acts as a proxy for fetching GitHub contribution data. It keeps your GitHub API token secure by storing it server-side.

## Setup

### 1. Create a .env file in the root directory:
```
GITHUB_API_TOKEN=your_github_personal_access_token_here
```

Replace the placeholder with your GitHub token: `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`

### 2. Install dependencies:
```bash
npm install
```

### 3. Start the server:
```bash
node server.js
```

The server will run on http://localhost:4000 by default.

## GitHub Token Guidelines

GitHub personal access tokens may be revoked if:
- They are pushed to a public repository
- They are not used for a year
- They reach their expiration date
- They are revoked manually or by GitHub's security systems

If your token stops working, simply create a new one on GitHub and update your .env file.

## Usage

### Endpoints:

* GET `/api/github-contributions?username=octocat`
  * Returns GitHub contributions data for the specified username
  * Response includes totalContributions, weekly contribution data, and user information
  
* GET `/health`
  * Health check endpoint that also verifies token availability
