export async function onRequestPost(context) {
  const { request, env } = context;

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  try {
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        { status: 400, headers: corsHeaders }
      );
    }

    const { prompt, useSearch } = body;

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'No prompt provided' }),
        { status: 400, headers: corsHeaders }
      );
    }

    if (!env.ANTHROPIC_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'API key not configured on server' }),
        { status: 500, headers: corsHeaders }
      );
    }

    const payload = {
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }],
    };

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: 'Anthropic error', detail: responseText }),
        { status: response.status, headers: corsHeaders }
      );
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      return new Response(
        JSON.stringify({ error: 'Bad response from API' }),
        { status: 500, headers: corsHeaders }
      );
    }

    const text = (data.content || [])
      .filter(b => b.type === 'text')
      .map(b => b.text || '')
      .join('');

    return new Response(
      JSON.stringify({ text }),
      { status: 200, headers: corsHeaders }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'Server error', detail: err.message }),
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
