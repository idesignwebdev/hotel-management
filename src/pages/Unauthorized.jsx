import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../store/appContext.jsx';

/**
 * Unauthorized page — shown when the current role cannot access a route.
 */
export default function Unauthorized() {
  const { role, handleLogout } = useApp();
  const location = useLocation();
  const from = location.state?.from?.pathname;

  return (
    <div className="unauthorized-page">
      <div className="unauthorized-card">
        <h1>Not authorized</h1>
        <p>
          Your role <strong>{role}</strong> does not have access to{from ? ` <strong>{from}</strong>` : 'this page'}.
        </p>
        {from && (
          <p>If you believe this is a mistake, sign in with a different role or contact your administrator.</p>
        )}
        <div className="unauthorized-actions">
          <Link to="/login">Sign in with a different role</Link>
          <button className="primary-button" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </div>
  );
}
