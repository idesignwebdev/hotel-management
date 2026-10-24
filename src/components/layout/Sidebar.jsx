import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../store/appContext.jsx';
import { navGroupsFor } from '../../store/permissions.js';

/**
 * Left navigation shell: brand, property switcher, workspace/manage nav groups,
 * settings, help card and profile. Uses React Router links.
 */
export default function Sidebar() {
  const { role, setRole, setToast, demoMode } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const groups = navGroupsFor(role);

  const selectNav = (path) => {
    navigate(path);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="sidebar">
      <Link to="/dashboard" className="brand" aria-label="Haven House dashboard">
        <span className="brand-mark">
          <svg viewBox="0 0 32 32" aria-hidden="true">
            <path d="M5 25V12.5L16 5l11 7.5V25H5Z" />
            <path d="M12 25v-8h8v8M10 13h.01M22 13h.01" />
          </svg>
        </span>
        <span><strong>haven house</strong><small>HOTEL &amp; RESIDENCE</small></span>
      </Link>

      <div className="property-switch">
        <span className="property-avatar">HH</span>
        <span><b>Haven House</b><small>Nairobi, Kenya</small></span>
        <span className="chevron">⌄</span>
      </div>

      {Object.entries(groups).map(([label, items]) => (
        <div key={label}>
          <div className={`nav-label ${label === 'MANAGE' ? 'manage-label' : ''}`}>{label}</div>
          <nav className="main-nav" aria-label={`${label.toLowerCase()} navigation`}>
            {items.map(({ page, path, label: itemLabel, icon }) => (
              <Link key={page} to={path} className={`nav-item ${isActive(path) ? 'active' : ''}`} onClick={() => selectNav(path)}>
                <span className="nav-icon">{icon}</span>
                {itemLabel}
              </Link>
            ))}
          </nav>
        </div>
      ))}

      <div className="sidebar-bottom">
        <Link to="/settings" className={`nav-item ${isActive('/settings') ? 'active' : ''}`} onClick={() => selectNav('/settings')}>
          <span className="nav-icon">⚙</span>Settings
        </Link>

        <div className="help-card">
          <span className="help-icon">✦</span>
          <b>Need a hand?</b>
          <p>Our support team is here to help you.</p>
          <button onClick={() => setToast('Contact your hotel system administrator for support.')}>Contact support <span>↗</span></button>
        </div>

        <div className="profile">
          <span className="profile-avatar">AM</span>
          {(demoMode || import.meta.env.DEV) && (
            <label className="profile-role"><small>Preview role</small><select aria-label="Preview role" value={role} onChange={(event) => setRole(event.target.value)}>
              {['Owner / Administrator', 'Hotel Manager', 'Reception / Front Desk', 'Housekeeping', 'Finance / Cashier', 'Read-only / Auditor'].map((name) => <option key={name}>{name}</option>)}
            </select></label>
          )}
          <span className="more">···</span>
          <button className="profile-logout" onClick={() => { setToast('Logged out.'); navigate('/login', { replace: true }); }}>Logout</button>
        </div>
      </div>
    </aside>
  );
}
