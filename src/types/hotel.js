/**
 * JSDoc type definitions for the HavenDesk hotel frontend.
 * Documentation only — they have no runtime effect in plain JavaScript.
 * Kept here so the API contracts (what the backend must return) are visible
 * in one place before the Django connection is wired up.
 */

/**
 * @typedef {Object} DashboardStats
 * @property {number} occupancy_rate
 * @property {number} available_rooms
 * @property {number} total_rooms
 * @property {number} ready_rooms
 * @property {number} cleaning_rooms
 * @property {number} arrivals_today
 * @property {number} revenue_today
 * @property {string} currency
 * @property {Array<{ day: string, date: string, occupancy: number }>} [weekly_occupancy]
 */

/**
 * @typedef {Object} Reservation
 * @property {number | string} id
 * @property {string} initials
 * @property {string} guest_name
 * @property {string} email
 * @property {string} room_type
 * @property {string} room_number
 * @property {string} check_in
 * @property {string} check_out
 * @property {string} status
 * @property {number | string} amount
 * @property {string} currency
 * @property {string} color
 */

/**
 * @typedef {Object} Arrival
 * @property {number | string} id
 * @property {string} initials
 * @property {string} guest_name
 * @property {string} room_type
 * @property {string} room_number
 * @property {string} arrival_time
 * @property {string} color
 */

/**
 * @typedef {Object} ModuleRow
 * @property {string | number} id
 * @property {string} status
 */

/** @typedef {'loading' | 'connected' | 'offline'} ApiState */
