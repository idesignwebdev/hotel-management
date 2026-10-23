/**
 * Shared formatting helpers used across the dashboard and module pages.
 * Pure functions — safe to test and easy to swap for a library (date-fns,
 * numeral, etc.) later without touching any component.
 */

export const initialsFor = (name = '') =>
  name.trim().split(/\s+/).slice(0, 2).map((part) => part[0] || '').join('').toUpperCase();

export const initials = (s = '') =>
  s.split(/\s+/).slice(0, 2).map((x) => (x[0] || '')).join('').toUpperCase();

export const formatDate = (value) => {
  if (!value || value === '—') return '—';
  const parsed = new Date(`${String(value).slice(0, 10)}T12:00:00`);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
};

/**
 * Normalize a raw API reservation into the shape the UI expects.
 * Defensive against both flat and nested Django serializer shapes.
 */
export const normalizeReservation = (r, index = 0) => {
  const name = r.guest_name || r.guest?.full_name || r.guest?.name || r.name || 'Guest';
  const status = String(r.status || 'Pending').replaceAll('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    id: r.id ?? `row-${index}`,
    initials: r.initials || initialsFor(name),
    guest_name: name,
    email: r.email || r.guest?.email || '',
    room_type: r.room_type_name || r.room_type?.name || r.room_type || 'Room',
    room_number: r.room_number || r.room?.number || '—',
    check_in: r.check_in || r.checkin || '—',
    check_out: r.check_out || r.checkout || '—',
    status,
    amount: r.total_amount ?? r.amount ?? '—',
    currency: r.currency || 'KES',
    color: r.color || ['av-lilac', 'av-peach', 'av-sage', 'av-blue', 'av-yellow'][index % 5],
  };
};

export const money = (value, currency = 'KES') => {
  if (value === '—' || value == null || value === '') return '—';
  const amount = Number(value);
  return Number.isFinite(amount) ? `${currency} ${amount.toLocaleString('en-KE')}` : String(value);
};
