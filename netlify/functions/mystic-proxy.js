/**
 * Netlify Function to Proxy MysticSocial API
 *
 * This bypasses CORS issues by making the request server-side
 */

export default async (req, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers });
  }

  try {
    const url = new URL(req.url);
    const params = url.searchParams;

    // Build the mysticsocial.xyz API URL with query parameters
    const apiUrl = new URL('https://mysticsocial.xyz/api/mana');
    params.forEach((value, key) => {
      apiUrl.searchParams.append(key, value);
    });

    // Fetch from mysticsocial.xyz (server-side, no CORS issues)
    const response = await fetch(apiUrl.toString());

    if (!response.ok) {
      throw new Error(`MysticSocial API returned ${response.status}`);
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers,
    });

  } catch (error) {
    console.error('Proxy Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
    }), {
      status: 500,
      headers,
    });
  }
};

export const config = {
  path: "/api/mystic-proxy"
};
