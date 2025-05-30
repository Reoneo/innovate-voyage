
/**
 * Tally API client for making GraphQL requests
 */

const TALLY_API_ENDPOINT = 'https://api.tally.xyz/query';

/**
 * Fetch data from Tally API using GraphQL
 */
export async function tallyFetcher({ query, variables = {} }: { query: string; variables?: any }) {
  console.log('🔄 Making Tally API request');
  console.log('📍 Endpoint:', TALLY_API_ENDPOINT);
  console.log('📝 Query:', query);
  console.log('🔧 Variables:', JSON.stringify(variables, null, 2));
  
  try {
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

    console.log('📊 Tally API response status:', response.status);
    console.log('📊 Tally API response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Tally API HTTP error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`Tally API HTTP error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ Tally API Full Response:', JSON.stringify(data, null, 2));
    
    if (data.errors) {
      console.error('❌ Tally GraphQL errors:', data.errors);
      data.errors.forEach((error: any, index: number) => {
        console.error(`Error ${index + 1}:`, {
          message: error.message,
          locations: error.locations,
          path: error.path,
          extensions: error.extensions
        });
      });
      throw new Error(`GraphQL query failed: ${JSON.stringify(data.errors)}`);
    }

    console.log('🎉 Tally API request successful, returning:', data.data);
    return data.data;
  } catch (error) {
    console.error('💥 Tally API request failed:', error);
    console.error('💥 Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
}
