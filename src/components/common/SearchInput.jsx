/**
 * Compact search field with icon, used in table toolbars.
 */
export default function SearchInput({ value, onChange, placeholder, width = '162px' }) {
  return (
    <label className="table-search" style={{ width }} aria-label={placeholder || 'Search'}>
      <span>⌕</span>
      <input value={value} onChange={onChange} placeholder={placeholder} aria-label={placeholder || 'Search'} />
    </label>
  );
}
