
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
    const web3BioApiKey = Deno.env.get("WEB3_BIO_API_KEY");
    if (!web3BioApiKey) {
      console.error('WEB3_BIO_API_KEY is not set in Supabase secrets.');
      return new Response(JSON.stringify({ error: 'Server configuration error: web3.bio API key not found.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    const { path } = await req.json(); // e.g., path: "profile/0x123..."
    if (!path) {
      return new Response(JSON.stringify({ error: 'path is required' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    const apiUrl = `https://api.web3.bio/${path}`;
    
    const response = await fetch(apiUrl, {
      headers: { 
        'Authorization': `Bearer ${web3BioApiKey}`,
        'Accept': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      },
      cache: 'no-store'
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error(`Failed to fetch from web3.bio:`, response.status, errorBody);
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
    console.error('Error in proxy-web3-bio function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
