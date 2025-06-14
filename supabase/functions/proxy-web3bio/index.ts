
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const API_KEY = Deno.env.get("WEB3_BIO_CONFIG_JWT");
const BASE_URL = "https://api.web3.bio";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { path } = await req.json();
    if (!path) {
        throw new Error("Path is required");
    }
    const fullUrl = `${BASE_URL}${path}`;
    
    const response = await fetch(fullUrl, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Accept': 'application/json'
      },
      cache: 'no-store'
    });

    if (!response.ok) {
        throw new Error(`Web3.bio API error: ${response.status} ${await response.text()}`);
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error("Error in web3bio-proxy:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
