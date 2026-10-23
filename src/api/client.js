/**
 * Low-level fetch client for the Django REST API.
 *
 * - Reads the Django `csrftoken` cookie and sends it as `X-CSRFToken` on
 *   unsafe requests (POST/PATCH/DELETE), matching the Django CSRF flow.
 * - Sends `credentials: 'include'` so session cookies travel with requests.
 * - Throws on non-ok responses so callers can fall back to sample data.
 *
 * The base URL and every path come from Vite env variables (see src/api/endpoints.js),
 * so no source change is needed to connect a backend.
 */

export function readCsrfToken() {
  const match = document.cookie.match(/(?:^|; )csrftoken=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : '';
}

export async function apiRequest(path, options = {}) {
  const base = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
  const headers = { Accept: 'application/json', ...options.headers };

  if (options.body instanceof FormData) {
    // Let the browser set the multipart boundary.
  } else if (options.body) {
    headers['Content-Type'] = 'application/json';
  }

  const token = readCsrfToken();
  const method = options.method || 'GET';
  if (token && !['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    headers['X-CSRFToken'] = token;
  }

  const response = await fetch(base + path, { credentials: 'include', ...options, headers });

  if (!response.ok) {
    let detail = '';
    try {
      detail = await response.text();
    } catch (_) {}
    const message = detail ? ` — ${detail.slice(0, 140)}` : '';
    throw new Error(`${response.status} ${response.statusText}${message}`);
  }

  if (response.status === 204) return null;
  return response.json();
}
