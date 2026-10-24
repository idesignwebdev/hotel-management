/**
 * Low-level fetch client for the Django REST API.
 *
 * - Reads the Django `csrftoken` cookie and sends it as `X-CSRFToken` on
 *   unsafe requests (POST/PATCH/DELETE), matching the Django CSRF flow.
 * - Sends `credentials: 'include'` so session cookies travel with requests.
 * - Throws `ApiError` instances that carry the HTTP status so callers can
 *   distinguish session expiry (401/403) from server errors (5xx) and
 *   network failures.
 *
 * Editable local demo mode is opt-in: set VITE_DEMO_MODE=true in .env.local.
 * Without it, a failed backend means read-only offline (no local writes).
 */

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export function isDemoMode() {
  return import.meta.env.VITE_DEMO_MODE === 'true';
}

export function readCsrfToken() {
  const match = document.cookie.match(/(?:^|; )csrftoken=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : '';
}

function classifyError(error) {
  // 401 / 403 → session expired
  if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('havendesk:session-expired'));
    }
    return new ApiError('session expired', error.status);
  }
  // 5xx or network failure → read-only offline
  if (error instanceof ApiError && error.status >= 500) {
    return new ApiError('server error', error.status);
  }
  if (!(error instanceof ApiError)) {
    return new ApiError('network error', null);
  }
  return error;
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

  try {
    const response = await fetch(base + path, { credentials: 'include', ...options, headers });

    if (!response.ok) {
      let detail = '';
      try {
        detail = await response.text();
      } catch (_) {}
      const message = detail ? ` — ${detail.slice(0, 140)}` : '';
      throw new ApiError(`${response.status} ${response.statusText}${message}`, response.status);
    }

    if (response.status === 204) return null;
    return response.json();
  } catch (error) {
    throw classifyError(error);
  }
}
