
/**
 * Tally API client for making GraphQL requests
 */

const TALLY_API_ENDPOINT = 'https://api.tally.xyz/query';

/**
 * Fetch data from Tally API using GraphQL
 */
export async function tallyFetcher({ query, variables = {} }: { query: string; variables?: any }) {
  console.log('Making Tally API request with variables:', variables);
  
  const response = await fetch(TALLY_API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Api-Key': '823049aef82691e85ae43e20d37e0d2f4b896dafdef53ea5dce0912d78bc1988'
    },
    body: JSON.stringify({
      query,
      variables
    })
  });

  console.log('Tally API response status:', response.status);

  if (!response.ok) {
    console.error('Tally API error:', response.status, response.statusText);
    const errorText = await response.text();
    console.error('Tally API error response:', errorText);
    throw new Error(`Tally API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  console.log('Tally API response data:', data);
  
  if (data.errors) {
    console.error('Tally GraphQL errors:', data.errors);
    throw new Error(`GraphQL query failed: ${JSON.stringify(data.errors)}`);
  }

  return data.data;
}
