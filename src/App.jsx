import { useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from './store/appContext.jsx';
import RequireRole from './components/common/RequireRole.jsx';
import ErrorBoundary from './components/common/ErrorBoundary.jsx';
import AppShell from './components/layout/AppShell.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Reservations from './pages/Reservations.jsx';
import FrontDesk from './pages/FrontDesk.jsx';
import ModuleWorkspace from './pages/ModuleWorkspace.jsx';
import Reports from './components/modules/Reports.jsx';
import Login from './pages/Login.jsx';
import Unauthorized from './pages/Unauthorized.jsx';
import NotFound from './pages/NotFound.jsx';

/**
 * App router — one URL per page:
 * /login, /dashboard, /reservations, /front-desk, /rooms, /guests,
 * /billing, /housekeeping, /reports, /settings, /unauthorized, plus 404.
 *
 * RequireRole wraps each route and redirects to /unauthorized when the
 * current role cannot access it. Permissions live in src/store/permissions.js.
 *
 * ErrorBoundary wraps every route so a crashing page never takes down the
 * whole dashboard — the sidebar stays visible and only the broken page
 * shows the fallback. A havendesk:session-expired event (dispatched by the
 * API client on 401/403) redirects to /login with the current path as
 * ?return=.
 */
export default function AppRouter() {
  const { role } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSessionExpired = useCallback(() => {
    navigate(`/login?return=${encodeURIComponent(location.pathname)}`, { replace: true });
  }, [navigate, location.pathname]);

  useEffect(() => {
    window.addEventListener('havendesk:session-expired', handleSessionExpired);
    return () => window.removeEventListener('havendesk:session-expired', handleSessionExpired);
  }, [handleSessionExpired]);

  // Redirect to login when no role is set and we're not already on login.
  if (!role && location.pathname !== '/login') {
    return <Navigate to="/login" replace />;
  }

  // After login, go to the role's default landing page.
  if (location.pathname === '/login' && role) {
    return <Navigate to={defaultLandingPathFor(role)} replace />;
  }

  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <RequireRole path="/dashboard">
                <ErrorBoundary><Dashboard /></ErrorBoundary>
              </RequireRole>
            }
          />
          <Route
            path="/reservations"
            element={
              <RequireRole path="/reservations">
                <ErrorBoundary><Reservations /></ErrorBoundary>
              </RequireRole>
            }
          />
          <Route
            path="/front-desk"
            element={
              <RequireRole path="/front-desk">
                <ErrorBoundary><FrontDesk /></ErrorBoundary>
              </RequireRole>
            }
          />
          <Route
            path="/rooms"
            element={
              <RequireRole path="/rooms">
                <ErrorBoundary><ModuleWorkspace page="Rooms" /></ErrorBoundary>
              </RequireRole>
            }
          />
          <Route
            path="/guests"
            element={
              <RequireRole path="/guests">
                <ErrorBoundary><ModuleWorkspace page="Guests" /></ErrorBoundary>
              </RequireRole>
            }
          />
          <Route
            path="/billing"
            element={
              <RequireRole path="/billing">
                <ErrorBoundary><ModuleWorkspace page="Billing & Payments" /></ErrorBoundary>
              </RequireRole>
            }
          />
          <Route
            path="/housekeeping"
            element={
              <RequireRole path="/housekeeping">
                <ErrorBoundary><ModuleWorkspace page="Housekeeping" /></ErrorBoundary>
              </RequireRole>
            }
          />
          <Route
            path="/reports"
            element={
              <RequireRole path="/reports">
                <ErrorBoundary><Reports /></ErrorBoundary>
              </RequireRole>
            }
          />
          <Route
            path="/settings"
            element={
              <RequireRole path="/settings">
                <ErrorBoundary><ModuleWorkspace page="Settings" /></ErrorBoundary>
              </RequireRole>
            }
          />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}

function defaultLandingPathFor(role) {
  switch (role) {
    case 'Housekeeping': return '/housekeeping';
    case 'Finance / Cashier': return '/billing';
    case 'Read-only / Auditor': return '/reports';
    case 'Reception / Front Desk': return '/front-desk';
    default: return '/dashboard';
  }
}
