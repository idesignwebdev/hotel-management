/**
 * Sample (demo) data shown while the Django API is unavailable.
 * Replace these imports with live API calls once the backend is connected.
 */

export const sampleDashboard = {
  occupancy_rate: 78,
  available_rooms: 18,
  total_rooms: 82,
  ready_rooms: 12,
  cleaning_rooms: 6,
  arrivals_today: 12,
  revenue_today: 248500,
  currency: 'KES',
  weekly_occupancy: [
    { day: 'Thu', date: '16', occupancy: 68 },
    { day: 'Fri', date: '17', occupancy: 82 },
    { day: 'Sat', date: '18', occupancy: 91 },
    { day: 'Sun', date: '19', occupancy: 76 },
    { day: 'Mon', date: '20', occupancy: 64 },
    { day: 'Tue', date: '21', occupancy: 73 },
    { day: 'Wed', date: '22', occupancy: 78 },
  ],
};

export const sampleArrivals = [
  { id: 1, initials: 'JW', guest_name: 'James Wilson', room_type: 'Deluxe King', room_number: '204', arrival_time: '10:30 AM', color: 'av-lilac' },
  { id: 2, initials: 'AO', guest_name: 'Amina Otieno', room_type: 'Ocean Suite', room_number: '501', arrival_time: '11:00 AM', color: 'av-peach' },
  { id: 3, initials: 'DK', guest_name: 'David Kimani', room_type: 'Garden Room', room_number: '112', arrival_time: '12:15 PM', color: 'av-sage' },
  { id: 4, initials: 'SC', guest_name: 'Sofia Chen', room_type: 'Deluxe Twin', room_number: '308', arrival_time: '1:00 PM', color: 'av-blue' },
];

export const sampleReservations = [
  { id: 1, initials: 'JW', guest_name: 'James Wilson', email: 'james.wilson@email.com', room_type: 'Deluxe King', room_number: '204', check_in: '2026-10-22', check_out: '2026-10-25', status: 'Checked in', amount: 48000, currency: 'KES', color: 'av-lilac' },
  { id: 2, initials: 'AO', guest_name: 'Amina Otieno', email: 'amina.otieno@email.com', room_type: 'Ocean Suite', room_number: '501', check_in: '2026-10-22', check_out: '2026-10-27', status: 'Confirmed', amount: 120000, currency: 'KES', color: 'av-peach' },
  { id: 3, initials: 'DK', guest_name: 'David Kimani', email: 'david.kimani@email.com', room_type: 'Garden Room', room_number: '112', check_in: '2026-10-22', check_out: '2026-10-24', status: 'Pending', amount: 32000, currency: 'KES', color: 'av-sage' },
  { id: 4, initials: 'SC', guest_name: 'Sofia Chen', email: 'sofia.chen@email.com', room_type: 'Deluxe Twin', room_number: '308', check_in: '2026-10-23', check_out: '2026-10-26', status: 'Confirmed', amount: 54000, currency: 'KES', color: 'av-blue' },
  { id: 5, initials: 'MK', guest_name: 'Michael Kamau', email: 'michael.kamau@email.com', room_type: 'Deluxe King', room_number: '216', check_in: '2026-10-23', check_out: '2026-10-28', status: 'Confirmed', amount: 80000, currency: 'KES', color: 'av-yellow' },
];

export const navGroups = [
  { label: 'WORKSPACE', items: [['Dashboard', '◫'], ['Reservations', '▤'], ['Front desk', '▣'], ['Rooms', '⌂'], ['Guests', '♙']] },
  { label: 'MANAGE', items: [['Billing & Payments', '◈'], ['Housekeeping', '✳'], ['Reports', '▥']] },
];

/**
 * Seed records for the operational modules (Rooms, Guests, Billing & Payments,
 * Housekeeping). Used as the demo preview until the matching Django endpoint
 * answers. Writes during preview are stored in `localStorage` only.
 */
export const seed = {
  Rooms: [
    { id: '101', room: '101', type: 'Deluxe King', floor: '1', capacity: 2, rate: 16000, status: 'Ready' },
    { id: '102', room: '102', type: 'Garden Room', floor: '1', capacity: 2, rate: 12000, status: 'Cleaning' },
    { id: '204', room: '204', type: 'Deluxe King', floor: '2', capacity: 2, rate: 16000, status: 'Occupied' },
    { id: '216', room: '216', type: 'Deluxe King', floor: '2', capacity: 2, rate: 16000, status: 'Reserved' },
    { id: '308', room: '308', type: 'Deluxe Twin', floor: '3', capacity: 3, rate: 18000, status: 'Ready' },
    { id: '501', room: '501', type: 'Ocean Suite', floor: '5', capacity: 4, rate: 32000, status: 'Out of service' },
  ],
  Guests: [
    { id: 'G-2041', name: 'James Wilson', email: 'james.wilson@email.com', phone: '+254 712 345 678', stays: 4, balance: 0 },
    { id: 'G-2040', name: 'Amina Otieno', email: 'amina.otieno@email.com', phone: '+254 722 810 422', stays: 2, balance: 12000 },
    { id: 'G-2039', name: 'David Kimani', email: 'david.kimani@email.com', phone: '+254 701 209 188', stays: 1, balance: 0 },
    { id: 'G-2038', name: 'Sofia Chen', email: 'sofia.chen@email.com', phone: '+254 733 110 204', stays: 3, balance: 5400 },
  ],
  'Billing & Payments': [
    { id: 'INV-2841', guest: 'James Wilson', room: '204', date: '2026-10-22', total: 48000, paid: 48000, method: 'M-Pesa', status: 'Paid' },
    { id: 'INV-2840', guest: 'Amina Otieno', room: '501', date: '2026-10-22', total: 120000, paid: 108000, method: 'Bank transfer', status: 'Partial' },
    { id: 'INV-2839', guest: 'David Kimani', room: '112', date: '2026-10-21', total: 32000, paid: 0, method: '—', status: 'Unpaid' },
    { id: 'INV-2838', guest: 'Sofia Chen', room: '308', date: '2026-10-20', total: 54000, paid: 48600, method: 'Card', status: 'Partial' },
  ],
  Housekeeping: [
    { id: 'HK-038', room: '102', type: 'Turnover clean', assignee: 'Lucy Wanjiku', priority: 'High', due: '10:30 AM', status: 'In progress' },
    { id: 'HK-037', room: '214', type: 'Turnover clean', assignee: 'Unassigned', priority: 'High', due: '11:00 AM', status: 'Queued' },
    { id: 'HK-036', room: '307', type: 'Guest request', assignee: 'Mary Njeri', priority: 'Normal', due: '12:00 PM', status: 'Awaiting inspection' },
    { id: 'HK-035', room: '119', type: 'Daily service', assignee: 'Peter Otieno', priority: 'Normal', due: '1:00 PM', status: 'Ready' },
    { id: 'HK-034', room: '501', type: 'Maintenance check', assignee: 'Maintenance', priority: 'Urgent', due: '2:00 PM', status: 'Blocked' },
  ],
};

export const pageInfo = {
  Rooms: ['Room inventory', 'Track room readiness, assignments and sellable inventory.', 'Add room'],
  Guests: ['Guest directory', 'Keep guest contact details and stay history together.', 'Add guest'],
  'Billing & Payments': ['Billing & payments', 'Review folios, posted payments and balances due.', 'Record payment'],
  Housekeeping: ['Housekeeping', 'Coordinate room turnover, inspection and maintenance blockers.', 'Create task'],
};

export const fields = {
  Rooms: [['room', 'Room number'], ['type', 'Room type'], ['floor', 'Floor'], ['capacity', 'Capacity'], ['rate', 'Nightly rate (KES)']],
  Guests: [['name', 'Full name'], ['email', 'Email address'], ['phone', 'Phone number']],
  'Billing & Payments': [['guest', 'Guest name'], ['room', 'Room number'], ['total', 'Invoice total (KES)'], ['paid', 'Amount received (KES)']],
  Housekeeping: [['room', 'Room number'], ['type', 'Task'], ['assignee', 'Assigned to'], ['due', 'Due time']],
};
