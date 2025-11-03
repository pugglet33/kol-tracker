/**
 * Netlify Function - MysticSocial API Proxy
 *
 * Proxies requests to MysticSocial API to avoid CORS issues
 */

export default async (req) => {
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

    // Get query parameters
    const page = url.searchParams.get('page') || '1';
    const limit = url.searchParams.get('limit') || '50';
    const search = url.searchParams.get('search') || '';
    const weekly = url.searchParams.get('weekly') || 'false';

    // Build MysticSocial API URL
    const apiParams = new URLSearchParams({
      page,
      limit,
      ...(search && { search }),
      ...(weekly === 'true' && { weekly: 'true' }),
    });

    const apiUrl = `https://mysticsocial.xyz/api/mana?${apiParams.toString()}`;

    console.log(`[PROXY] Fetching from MysticSocial API: ${apiUrl}`);

    // Make request to MysticSocial API
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`MysticSocial API returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers
    });

  } catch (error) {
    console.error('[PROXY] Error fetching from MysticSocial API:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
    }), {
      status: 500,
      headers
    });
  }
};

export const config = {
  path: "/api/mysticsocial/mana"
};
