/**
 * API endpoint configuration.
 *
 * Every path is read from Vite env variables with sensible Django defaults.
 * Copy `.env.example` to `.env.local` and set `VITE_API_BASE_URL` to the
 * Django server URL to connect the backend — no source edits required.
 */

export const ENDPOINTS = {
  dashboard: import.meta.env.VITE_DASHBOARD_ENDPOINT || '/api/dashboard/',
  reservations: import.meta.env.VITE_RESERVATIONS_ENDPOINT || '/api/reservations/',
  arrivals: import.meta.env.VITE_ARRIVALS_ENDPOINT || '/api/arrivals/',
  rooms: import.meta.env.VITE_ROOMS_ENDPOINT || '/api/rooms/',
  guests: import.meta.env.VITE_GUESTS_ENDPOINT || '/api/guests/',
  billing: import.meta.env.VITE_BILLING_ENDPOINT || '/api/folios/',
  housekeeping: import.meta.env.VITE_HOUSEKEEPING_ENDPOINT || '/api/housekeeping/tasks/',
  reports: import.meta.env.VITE_REPORTS_ENDPOINT || '/api/reports/',
  settings: import.meta.env.VITE_SETTINGS_ENDPOINT || '/api/settings/',
};

export const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';

export const MODULE_ENDPOINT_KEYS = {
  Rooms: 'rooms',
  Guests: 'guests',
  'Billing & Payments': 'billing',
  Housekeeping: 'housekeeping',
  Reports: 'reports',
  Settings: 'settings',
};
