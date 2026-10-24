import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROLE_NAMES, defaultLandingPath } from '../store/permissions.js';

/**
 * Login page. In production this authenticates against Django and the role
 * comes from the server. In demo/dev mode it lets you pick a preview role.
 */
export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState(ROLE_NAMES[0]);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || defaultLandingPath(role);

  const handleLogin = (event) => {
    event.preventDefault();
    localStorage.setItem('havendesk:preview-role', role);
    navigate(from, { replace: true });
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <span className="brand-mark">HH</span>
          <div>
            <strong>Haven House</strong>
            <small>Hotel &amp; Residence — Sign in</small>
          </div>
        </div>
        {error && <div className="login-error">{error}</div>}
        <form onSubmit={handleLogin}>
          <label>Role<select value={role} onChange={(e) => setRole(e.target.value)}>
            {ROLE_NAMES.map((name) => <option key={name} value={name}>{name}</option>)}
          </select></label>
          <p className="login-hint">Choose your role to enter the workspace. In production, Django authenticates and assigns this.</p>
          <button type="submit" className="primary-button">Enter workspace</button>
        </form>
        <div className="login-footer">
          <span>Running in {import.meta.env.DEV || import.meta.env.VITE_DEMO_MODE === 'true' ? 'demo' : 'production'} mode</span>
        </div>
      </div>
    </div>
  );
}
