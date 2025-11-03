/**
 * Netlify Function - MysticSocial API Proxy
 *
 * Proxies requests to MysticSocial API to avoid CORS issues
 */

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    // Get query parameters
    const params = event.queryStringParameters || {};
    const page = params.page || '1';
    const limit = params.limit || '50';
    const search = params.search || '';
    const weekly = params.weekly || 'false';

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

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data)
    };

  } catch (error) {
    console.error('[PROXY] Error fetching from MysticSocial API:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message,
      })
    };
  }
};
