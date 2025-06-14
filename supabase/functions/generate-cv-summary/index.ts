
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get("OpenAI");

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    const { passportData } = await req.json();

    if (!passportData) {
      throw new Error("Passport data is required");
    }

    const skills = passportData.skills && passportData.skills.length > 0 ? passportData.skills.map((s: any) => s.name).join(', ') : 'Not specified';
    const github = passportData.socials?.github || 'Not specified';

    const prompt = `
      Based on the following professional web3 profile data, write a compelling and professional summary for a CV. 
      The summary should be concise (3-4 sentences), highlight key strengths, and be tailored for a web3/blockchain role.
      The tone should be professional and confident.
      Do not use markdown, just plain text.
      
      Profile Data:
      - Name/ENS: ${passportData.name || passportData.owner_address}
      - Bio: ${passportData.bio || 'No biography provided.'}
      - Skills: ${skills}
      - GitHub username: ${github}

      Generate the professional summary based on the provided data. If some data is not available, create a more general but still positive summary.
    `;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a professional CV writer for the web3 industry.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 200,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status} ${await response.text()}`);
    }

    const data = await response.json();
    const summary = data.choices[0].message.content.trim();

    return new Response(JSON.stringify({ summary }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error("Error in generate-cv-summary:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
