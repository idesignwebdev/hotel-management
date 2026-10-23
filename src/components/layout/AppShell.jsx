import Sidebar from './Sidebar.jsx';
import Topbar from './Topbar.jsx';

/**
 * Page shell: fixed sidebar + scrollable main content area with top bar.
 */
export default function AppShell({ children }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content">
        <Topbar />
        <div className="page-wrap">{children}</div>
      </main>
    </div>
  );
}
