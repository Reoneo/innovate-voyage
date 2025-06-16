
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const etherscanApiKey = Deno.env.get("ETHERSCAN_API_KEY");
    if (!etherscanApiKey) {
      console.error('ETHERSCAN_API_KEY is not set in Supabase secrets.');
      return new Response(JSON.stringify({ error: 'Server configuration error: Etherscan API key not found.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    const { params } = await req.json();
    if (!params) {
      return new Response(JSON.stringify({ error: 'params are required' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    const apiUrl = `https://api.etherscan.io/api?${params}&apikey=${etherscanApiKey}`;
    
    const response = await fetch(apiUrl, {
      headers: { 'Accept': 'application/json' },
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error(`Failed to fetch from Etherscan:`, response.status, errorBody);
        return new Response(JSON.stringify({ error: 'Failed to fetch from upstream API', details: errorBody }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: response.status,
        });
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error in proxy-etherscan function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});

