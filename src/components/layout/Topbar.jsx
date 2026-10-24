import { useLocation } from 'react-router-dom';
import { useApp } from '../../store/appContext.jsx';

/**
 * Top app bar: breadcrumbs, date picker, search toggle, refresh button.
 */
export default function Topbar() {
  const {
    setSearchOpen, searchOpen, setQuery, query,
    refresh, todayLabel, setToast,
  } = useApp();
  const location = useLocation();

  return (
    <header className="topbar">
      <div className="breadcrumbs">Haven House <span>/</span> <b>{location.pathname.replace('/', '').replace('-', ' ') || 'Dashboard'}</b></div>

      <div className="top-actions">
        <button className="date-button" onClick={() => setToast('Today is ' + todayLabel)}>
          <span>◷</span> {todayLabel} <span className="down">⌄</span>
        </button>
        <button className="icon-button search-toggle" aria-label="Search" onClick={() => setSearchOpen((v) => !v)}>⌕</button>
        <button className="icon-button notification-button" aria-label="Refresh" onClick={refresh}>↻<i /></button>
      </div>

      {searchOpen && (
        <div className="search-bar open">
          <span>⌕</span>
          <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search guests, rooms, reservations..." />
          <kbd onClick={() => { setSearchOpen(false); setQuery(''); }}>ESC</kbd>
        </div>
      )}
    </header>
  );
}
