
/**
 * Tally API client for making GraphQL requests
 */

const TALLY_API_ENDPOINT = 'https://api.withtally.com/query';

/**
 * Fetch data from Tally API using GraphQL
 */
export async function tallyFetcher({ query, variables = {} }: { query: string; variables?: any }) {
  const response = await fetch(TALLY_API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': '823049aef82691e85ae43e20d37e0d2f4b896dafdef53ea5dce0912d78bc1988'
    },
    body: JSON.stringify({
      query,
      variables
    })
  });

  if (!response.ok) {
    throw new Error(`Tally API error: ${response.status}`);
  }

  const data = await response.json();
  
  if (data.errors) {
    console.error('Tally GraphQL errors:', data.errors);
    throw new Error('GraphQL query failed');
  }

  return data.data;
}
