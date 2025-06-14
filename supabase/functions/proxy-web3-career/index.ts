
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
    const web3CareerToken = Deno.env.get("WEB3_CAREER_TOKEN");
    if (!web3CareerToken) {
      console.error('WEB3_CAREER_TOKEN is not set in Supabase secrets.');
      return new Response(JSON.stringify({ error: 'Server configuration error: Web3 Career API token not found.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    const { path } = await req.json();
    if (!path) {
      return new Response(JSON.stringify({ error: 'path is required' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    const apiUrl = `https://web3.career/api/${path}&token=${web3CareerToken}`;
    
    const response = await fetch(apiUrl, {
      headers: { 'Accept': 'application/json' },
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error(`Failed to fetch from web3.career:`, response.status, errorBody);
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
    console.error('Error in proxy-web3-career function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});

