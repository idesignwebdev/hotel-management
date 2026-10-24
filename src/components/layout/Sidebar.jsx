import { useApp } from '../../store/appContext.jsx';
import { isDemoMode } from '../../api/client.js';
import { navGroups } from '../../data/sample.js';

/**
 * Left navigation shell: brand, property switcher, workspace/manage nav groups,
 * settings, help card and profile.
 */
export default function Sidebar() {
  const { activePage, setActivePage, mobileNavOpen, setMobileNavOpen, role, setRole, roleNames, permissions, selectNav, setToast, demoMode } = useApp();

  const showRoleSwitcher = demoMode || import.meta.env.DEV;

  return (
    <aside className={`sidebar ${mobileNavOpen ? 'open' : ''}`}>
      <a className="brand" href="#dashboard" onClick={(event) => { event.preventDefault(); selectNav('Dashboard'); }} aria-label="Haven House dashboard">
        <span className="brand-mark">
          <svg viewBox="0 0 32 32" aria-hidden="true">
            <path d="M5 25V12.5L16 5l11 7.5V25H5Z" />
            <path d="M12 25v-8h8v8M10 13h.01M22 13h.01" />
          </svg>
        </span>
        <span><strong>haven house</strong><small>HOTEL &amp; RESIDENCE</small></span>
      </a>

      <div className="property-switch">
        <span className="property-avatar">HH</span>
        <span><b>Haven House</b><small>Nairobi, Kenya</small></span>
        <span className="chevron">⌄</span>
      </div>

      {navGroups.map((group) => {
        const items = group.items.filter(([page]) => permissions.pages.includes(page));
        if (!items.length) return null;
        return (
        <div key={group.label}>
          <div className={`nav-label ${group.label === 'MANAGE' ? 'manage-label' : ''}`}>{group.label}</div>
          <nav className="main-nav" aria-label={`${group.label.toLowerCase()} navigation`}>
            {items.map(([page, icon]) => (
              <a key={page} className={`nav-item ${activePage === page ? 'active' : ''}`} href={`#${page.toLowerCase().replaceAll(' ', '-')}`} onClick={(event) => { event.preventDefault(); selectNav(page); }}>
                <span className="nav-icon">{icon}</span>
                {page}
                {page === 'Housekeeping' && <span className="tiny-dot" />}
              </a>
            ))}
          </nav>
        </div>
      );})}

      <div className="sidebar-bottom">
        {permissions.pages.includes('Settings') && <a className={`nav-item ${activePage === 'Settings' ? 'active' : ''}`} href="#settings" onClick={(event) => { event.preventDefault(); selectNav('Settings'); }}>
          <span className="nav-icon">⚙</span>Settings
        </a>}

        <div className="help-card">
          <span className="help-icon">✦</span>
          <b>Need a hand?</b>
          <p>Our support team is here to help you.</p>
          <button onClick={() => setToast('Contact your hotel system administrator for support.')}>Contact support <span>↗</span></button>
        </div>

        <div className="profile">
          <span className="profile-avatar">AM</span>
          {showRoleSwitcher && (
            <label className="profile-role"><small>Preview role</small><select aria-label="Preview role" value={role} onChange={(event) => setRole(event.target.value)}>
              {roleNames.map((name) => <option key={name}>{name}</option>)}
            </select></label>
          )}
          <span className="profile-server-role">{!showRoleSwitcher && role}</span>
          <span className="more">···</span>
        </div>
      </div>
    </aside>
  );
}
