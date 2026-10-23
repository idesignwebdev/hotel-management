/**
 * Frontend role presentation rules. These hide irrelevant screens and controls;
 * Django must still enforce every permission on every API request.
 */
export const ROLE_POLICIES = {
  'Owner / Administrator': {
    pages: ['Dashboard', 'Reservations', 'Front desk', 'Rooms', 'Guests', 'Billing & Payments', 'Housekeeping', 'Reports', 'Settings'],
    actions: ['createReservation', 'manageRooms', 'manageGuests', 'manageBilling', 'manageHousekeeping', 'manageSettings'],
  },
  'Hotel Manager': {
    pages: ['Dashboard', 'Reservations', 'Front desk', 'Rooms', 'Guests', 'Billing & Payments', 'Housekeeping', 'Reports'],
    actions: ['createReservation', 'manageRooms', 'manageGuests', 'manageBilling', 'manageHousekeeping'],
  },
  'Reception / Front Desk': {
    pages: ['Dashboard', 'Reservations', 'Front desk', 'Rooms', 'Guests', 'Billing & Payments'],
    actions: ['createReservation', 'manageGuests', 'manageBilling'],
  },
  Housekeeping: {
    pages: ['Housekeeping'],
    actions: ['manageHousekeeping'],
  },
  'Finance / Cashier': {
    pages: ['Billing & Payments', 'Reports'],
    actions: ['manageBilling'],
  },
  'Read-only / Auditor': {
    pages: ['Dashboard', 'Reservations', 'Reports'],
    actions: [],
  },
};

export const ROLE_NAMES = Object.keys(ROLE_POLICIES);

export function policyFor(role) {
  return ROLE_POLICIES[role] || ROLE_POLICIES['Read-only / Auditor'];
}
