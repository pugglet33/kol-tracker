export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://mysticsocial.xyz';
// In production (Netlify), use empty string to make requests to same origin (/api/* routes)
// In development, use localhost backend
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ||
  (import.meta.env.DEV ? 'http://localhost:3001' : '');
