
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const API_KEY = Deno.env.get("ETHERSCAN_API_KEY");
const BASE_URL = "https://api.etherscan.io/api";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { queryString } = await req.json();
    if (!queryString) {
        throw new Error("Query string is required");
    }

    const fullUrl = `${BASE_URL}?${queryString}&apikey=${API_KEY}`;
    
    const response = await fetch(fullUrl);

    if (!response.ok) {
        throw new Error(`Etherscan API error: ${response.status} ${await response.text()}`);
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error("Error in etherscan-proxy:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
