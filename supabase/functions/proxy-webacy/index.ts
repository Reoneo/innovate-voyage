
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const API_KEY = Deno.env.get("WEBACY_API_KEY");
const BASE_URL = "https://api.webacy.com";

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
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'x-api-key': API_KEY,
      }
    });

    if (!response.ok) {
        throw new Error(`Webacy API error: ${response.status} ${await response.text()}`);
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error("Error in webacy-proxy:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
