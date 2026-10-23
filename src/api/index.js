import { apiRequest } from './client.js';
import { ENDPOINTS, MODULE_ENDPOINT_KEYS } from './endpoints.js';

/**
 * Unwrap a Django REST Framework paginated response or a plain array.
 * Handles { results }, { data } and { items } shapes.
 */
export function unwrapList(payload) {
  if (Array.isArray(payload)) return payload;
  return payload?.results || payload?.data || payload?.items || [];
}

function modulePath(page) {
  const key = MODULE_ENDPOINT_KEYS[page];
  const path = key ? ENDPOINTS[key] : null;
  if (!path) throw new Error('No API endpoint configured for ' + page);
  return path;
}

/**
 * hotelApi — every call the frontend makes to the Django API.
 *
 * Each method rejects when the backend is unavailable, so callers can fall
 * back to sample/demo data (see src/store/appContext.jsx).
 */
export const hotelApi = {
  getDashboard: () => apiRequest(ENDPOINTS.dashboard),
  getReservations: () => apiRequest(ENDPOINTS.reservations),
  getArrivals: () => apiRequest(ENDPOINTS.arrivals),
  createReservation: (reservation) =>
    apiRequest(ENDPOINTS.reservations, { method: 'POST', body: JSON.stringify(reservation) }),
  getModule: (page, params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(modulePath(page) + (query ? '?' + query : ''));
  },
  createModule: (page, record) =>
    apiRequest(modulePath(page), { method: 'POST', body: JSON.stringify(record) }),
  updateModule: (page, id, record) =>
    apiRequest(modulePath(page) + encodeURIComponent(id) + '/', {
      method: 'PATCH',
      body: JSON.stringify(record),
    }),
  recordPayment: (folioId, payment) =>
    apiRequest(modulePath('Billing & Payments') + encodeURIComponent(folioId) + '/payments/', {
      method: 'POST',
      body: JSON.stringify(payment),
    }),
  saveSettings: (settings) =>
    apiRequest(ENDPOINTS.settings, { method: 'PATCH', body: JSON.stringify(settings) }),
};
