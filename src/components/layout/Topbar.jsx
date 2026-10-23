import { useApp } from '../../store/appContext.jsx';

/**
 * Top app bar: mobile menu toggle, breadcrumbs, date picker, search toggle,
 * refresh button and profile avatar.
 */
export default function Topbar() {
  const {
    activePage, setSearchOpen, searchOpen, setGlobalQuery, globalQuery, setQuery,
    refresh, mobileNavOpen, setMobileNavOpen, todayLabel, setToast,
  } = useApp();

  return (
    <header className="topbar">
      <button className="mobile-menu" onClick={() => setMobileNavOpen((v) => !v)} aria-label="Open navigation">☰</button>

      <div className="breadcrumbs">Haven House <span>/</span> <b>{activePage}</b></div>

      <div className="top-actions">
        <button className="date-button" onClick={() => setToast('Today is ' + todayLabel)}>
          <span>◷</span> {todayLabel} <span className="down">⌄</span>
        </button>
        <button className="icon-button search-toggle" aria-label="Search" onClick={() => setSearchOpen((v) => !v)}>⌕</button>
        <button className="icon-button notification-button" aria-label="Refresh dashboard" onClick={refresh}>↻<i /></button>
        <span className="top-divider" />
        <span className="profile-avatar small-avatar">AM</span>

        {searchOpen && (
          <div className="search-bar open">
            <span>⌕</span>
            <input autoFocus value={globalQuery} onChange={(event) => { setGlobalQuery(event.target.value); setQuery(event.target.value); }} placeholder="Search guests, rooms, reservations..." />
            <kbd onClick={() => { setSearchOpen(false); setGlobalQuery(''); setQuery(''); }}>ESC</kbd>
          </div>
        )}
      </div>
    </header>
  );
}
