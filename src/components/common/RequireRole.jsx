import { Navigate, useLocation } from 'react-router-dom';
import { canAccess } from '../../store/permissions.js';
import { useApp } from '../../store/appContext.jsx';

/**
 * RequireRole wraps a route. It checks the current user's role against the
 * path's allowed roles and redirects to /unauthorized when access is denied.
 * Permissions are defined in one place: src/store/permissions.js.
 */
export default function RequireRole({ children, path }) {
  const { role } = useApp();
  const location = useLocation();

  if (!role || !canAccess(path, role)) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
