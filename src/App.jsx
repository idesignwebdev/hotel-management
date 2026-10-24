import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useApp } from './store/appContext.jsx';
import RequireRole from './components/common/RequireRole.jsx';
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
 */
export default function AppRouter() {
  const { role } = useApp();
  const location = useLocation();

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
                <Dashboard />
              </RequireRole>
            }
          />
          <Route
            path="/reservations"
            element={
              <RequireRole path="/reservations">
                <Reservations />
              </RequireRole>
            }
          />
          <Route
            path="/front-desk"
            element={
              <RequireRole path="/front-desk">
                <FrontDesk />
              </RequireRole>
            }
          />
          <Route
            path="/rooms"
            element={
              <RequireRole path="/rooms">
                <ModuleWorkspace page="Rooms" />
              </RequireRole>
            }
          />
          <Route
            path="/guests"
            element={
              <RequireRole path="/guests">
                <ModuleWorkspace page="Guests" />
              </RequireRole>
            }
          />
          <Route
            path="/billing"
            element={
              <RequireRole path="/billing">
                <ModuleWorkspace page="Billing & Payments" />
              </RequireRole>
            }
          />
          <Route
            path="/housekeeping"
            element={
              <RequireRole path="/housekeeping">
                <ModuleWorkspace page="Housekeeping" />
              </RequireRole>
            }
          />
          <Route
            path="/reports"
            element={
              <RequireRole path="/reports">
                <Reports />
              </RequireRole>
            }
          />
          <Route
            path="/settings"
            element={
              <RequireRole path="/settings">
                <ModuleWorkspace page="Settings" />
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
