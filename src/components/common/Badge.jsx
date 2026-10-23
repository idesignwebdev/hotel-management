/**
 * Status / chip badge. Maps a status string to the correct `.pill-*` class
 * or renders a custom className directly.
 */
export default function Badge({ status, className = '', children }) {
  const map = {
    paid: 'pill-ready', partial: 'pill-partial', unpaid: 'pill-unpaid',
    ready: 'pill-ready', cleaning: 'pill-cleaning', occupied: 'pill-ready',
    reserved: 'pill-reserved', 'out of service': 'pill-out-of-service',
    queued: 'pill-queued', 'in progress': 'pill-in-progress',
    'awaiting inspection': 'pill-awaiting-inspection', blocked: 'pill-blocked',
    urgent: 'pill-urgent', high: 'pill-high', normal: 'pill-normal',
    confirmed: 'status-confirmed', pending: 'status-pending',
    'checked in': 'status-checked',
  };
  const key = String(status || '').toLowerCase();
  const cls = className || map[key] || 'pill-normal';
  return <span className={cls}>{children ?? status}</span>;
}
