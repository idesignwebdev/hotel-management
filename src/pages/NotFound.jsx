import { Link } from 'react-router-dom';

/**
 * 404 page — shown for unknown routes.
 */
export default function NotFound() {
  return (
    <div className="not-found-page">
      <div className="not-found-card">
        <h1>404</h1>
        <p>Page not found.</p>
        <Link to="/dashboard">Return to dashboard</Link>
      </div>
    </div>
  );
}
