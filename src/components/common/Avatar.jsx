/**
 * Circular avatar with initials. Variants: guest | table | mini | property | profile | small.
 * Color classes (av-lilac, av-peach, ...) are passed via the `color` prop.
 */
export default function Avatar({ variant = 'guest', label, color, className = '' }) {
  const base = { guest: 'guest-avatar', table: 'table-avatar', mini: 'mini-avatar', property: 'property-avatar', profile: 'profile-avatar', small: 'small-avatar' }[variant] || 'guest-avatar';
  return <span className={[base, color, className].filter(Boolean).join(' ')}>{label}</span>;
}
