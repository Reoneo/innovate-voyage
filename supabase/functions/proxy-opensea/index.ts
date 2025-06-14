
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const API_KEY = Deno.env.get("OPENSEA_API_KEY");
const BASE_URL = "https://api.opensea.io/api/v2";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { path } = await req.json();
    if (!path) {
        throw new Error("Path is required");
    }

    if (!API_KEY) {
        console.error("OpenSea API key not configured");
        throw new Error("OpenSea API key not configured");
    }

    const fullUrl = `${BASE_URL}${path}`;
    console.log(`Making request to OpenSea: ${fullUrl}`);
    
    const response = await fetch(fullUrl, {
      headers: {
        'X-API-KEY': API_KEY,
        'Accept': 'application/json'
      }
    });

    console.log(`OpenSea API response status: ${response.status}`);

    if (!response.ok) {
        const errorText = await response.text();
        console.error(`OpenSea API error: ${response.status} ${errorText}`);
        
        // Return empty data instead of throwing for 404s (no NFTs)
        if (response.status === 404) {
          return new Response(JSON.stringify({ nfts: [] }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          });
        }
        
        throw new Error(`OpenSea API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log(`OpenSea API returned ${data?.nfts?.length || 0} NFTs`);

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error("Error in opensea-proxy:", error);
    return new Response(JSON.stringify({ 
      error: error.message,
      nfts: [] // Return empty array to prevent UI breaks
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
