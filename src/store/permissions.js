/**
 * Frontend role presentation rules. These hide irrelevant screens and controls;
 * Django must still enforce every permission on every API request.
 *
 * Each page maps to its URL path and the minimum role required to see it.
 * Page names no longer double as endpoint, storage and permission keys.
 */
export const ROLE_NAMES = [
  'Owner / Administrator',
  'Hotel Manager',
  'Reception / Front Desk',
  'Housekeeping',
  'Finance / Cashier',
  'Read-only / Auditor',
];

export const PAGES = {
  Dashboard: { path: '/dashboard', label: 'Dashboard', icon: '◫', group: 'WORKSPACE' },
  Reservations: { path: '/reservations', label: 'Reservations', icon: '▤', group: 'WORKSPACE' },
  FrontDesk: { path: '/front-desk', label: 'Front desk', icon: '▣', group: 'WORKSPACE' },
  Rooms: { path: '/rooms', label: 'Rooms', icon: '⌂', group: 'WORKSPACE' },
  Guests: { path: '/guests', label: 'Guests', icon: '♙', group: 'WORKSPACE' },
  Billing: { path: '/billing', label: 'Billing & Payments', icon: '◈', group: 'MANAGE' },
  Housekeeping: { path: '/housekeeping', label: 'Housekeeping', icon: '✳', group: 'MANAGE' },
  Reports: { path: '/reports', label: 'Reports', icon: '▥', group: 'MANAGE' },
  Settings: { path: '/settings', label: 'Settings', icon: '⚙', group: null },
};

const roleHierarchy = {
  'Read-only / Auditor': 0,
  'Housekeeping': 1,
  'Finance / Cashier': 2,
  'Reception / Front Desk': 3,
  'Hotel Manager': 4,
  'Owner / Administrator': 5,
};

export const PAGE_PERMISSIONS = {
  '/dashboard': ['Read-only / Auditor', 'Housekeeping', 'Finance / Cashier', 'Reception / Front Desk', 'Hotel Manager', 'Owner / Administrator'],
  '/reservations': ['Reception / Front Desk', 'Hotel Manager', 'Owner / Administrator'],
  '/front-desk': ['Reception / Front Desk', 'Hotel Manager', 'Owner / Administrator'],
  '/rooms': ['Reception / Front Desk', 'Hotel Manager', 'Owner / Administrator'],
  '/guests': ['Reception / Front Desk', 'Hotel Manager', 'Owner / Administrator'],
  '/billing': ['Finance / Cashier', 'Hotel Manager', 'Owner / Administrator'],
  '/housekeeping': ['Housekeeping', 'Hotel Manager', 'Owner / Administrator'],
  '/reports': ['Finance / Cashier', 'Read-only / Auditor', 'Hotel Manager', 'Owner / Administrator'],
  '/settings': ['Owner / Administrator'],
};

export const PAGE_ACTIONS = {
  '/dashboard': [],
  '/reservations': ['createReservation'],
  '/front-desk': ['checkIn', 'checkOut'],
  '/rooms': ['manageRooms'],
  '/guests': ['manageGuests'],
  '/billing': ['manageBilling'],
  '/housekeeping': ['manageHousekeeping'],
  '/reports': [],
  '/settings': ['manageSettings'],
};

export function canAccess(path, role) {
  const allowed = PAGE_PERMISSIONS[path] || [];
  return allowed.includes(role) || roleHierarchy[role] >= 3; // Hotel Manager and above bypass
}

export function actionsFor(path, role) {
  const base = PAGE_ACTIONS[path] || [];
  if (role === 'Owner / Administrator') return Object.values({}).concat(base);
  return base;
}

export function roleForPath(path) {
  const allowed = PAGE_PERMISSIONS[path] || [];
  return allowed[0] || 'Read-only / Auditor';
}

export function defaultLandingPath(role) {
  switch (role) {
    case 'Housekeeping': return '/housekeeping';
    case 'Finance / Cashier': return '/billing';
    case 'Read-only / Auditor': return '/reports';
    case 'Reception / Front Desk': return '/front-desk';
    default: return '/dashboard';
  }
}

export function navGroupsFor(role) {
  const groups = {};
  Object.entries(PAGES).forEach(([key, page]) => {
    if (!page.group) return;
    if (!canAccess(page.path, role)) return;
    if (!groups[page.group]) groups[page.group] = [];
    groups[page.group].push({ page, path: page.path, label: page.label, icon: page.icon });
  });
  return groups;
}
