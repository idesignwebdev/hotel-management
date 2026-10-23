import { useApp } from './store/appContext.jsx';
import AppShell from './components/layout/AppShell.jsx';
import Dashboard from './pages/Dashboard.jsx';
import ModuleWorkspace from './pages/ModuleWorkspace.jsx';
import Reports from './components/modules/Reports.jsx';
import Settings from './components/modules/Settings.jsx';

/** Route the hotel workspace inside the shared navigation shell. */
export default function App() {
  const { activePage, setToast, permissions } = useApp();
  const visiblePage = permissions.pages.includes(activePage) ? activePage : permissions.pages[0];
  const isDashboardPage = ['Dashboard', 'Reservations', 'Front desk'].includes(visiblePage);

  return (
    <AppShell>
      {visiblePage === 'Reports' ? <Reports notify={setToast} />
        : visiblePage === 'Settings' ? <Settings notify={setToast} />
          : isDashboardPage ? <Dashboard />
            : <ModuleWorkspace page={visiblePage} />}
    </AppShell>
  );
}
