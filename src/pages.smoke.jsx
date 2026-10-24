/**
 * CI smoke test — mounts every page and asserts it renders without crashing.
 * If a page throws during render, the test fails. This catches broken routes
 * before they reach production.
 *
 * The appContext module is mocked so pages render in isolation without a live
 * Django backend.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// ---------------------------------------------------------------------------
// Mock appContext — provides the shape useApp() expects.
// ---------------------------------------------------------------------------
const mockUseApp = vi.fn();
vi.mock('./store/appContext.jsx', () => ({
  useApp: () => mockUseApp(),
}));

const mockValue = {
  dashboard: { occupancy_rate: 78, available_rooms: 18, total_rooms: 82 },
  arrivals: [],
  reservations: [],
  role: 'Hotel Manager',
  demoMode: true,
  currency: 'KES',
  timezone: 'Africa/Nairobi',
  query: '',
  filter: 'all',
  pageSize: 5,
  currentPage: 1,
  modalOpen: false,
  toast: '',
  apiState: 'demo',
  apiMessage: '',
  saving: false,
  serverCount: 0,
  setApiState: vi.fn(),
  setToast: vi.fn(),
  setDashboard: vi.fn(),
  setArrivals: vi.fn(),
  setReservations: vi.fn(),
  setRole: vi.fn(),
  setCurrency: vi.fn(),
  setTimezone: vi.fn(),
  setQuery: vi.fn(),
  setFilter: vi.fn(),
  setCurrentPage: vi.fn(),
  setModalOpen: vi.fn(),
  setSaving: vi.fn(),
  setServerCount: vi.fn(),
  roleNames: ['Owner / Administrator', 'Hotel Manager'],
  permissions: { pages: ['/dashboard'], actions: [] },
  today: '2026-10-24',
  todayLabel: 'Saturday, 24 October, 2026',
  todayEyebrow: 'SATURDAY, OCTOBER 24, 2026',
  todayFor: () => '2026-10-24',
  refresh: vi.fn().mockResolvedValue(undefined),
  submitReservation: vi.fn(),
  handleLogout: vi.fn(),
  filteredReservations: [],
  pageCount: 1,
  visibleReservations: [],
  firstVisible: 0,
  lastVisible: 0,
  formatDate: (v) => v || '—',
  money: (v, c = 'KES') => `${c} ${v}`,
  normalizeReservation: (r) => r,
};

beforeEach(() => {
  mockUseApp.mockReturnValue(mockValue);
  vi.clearAllMocks();
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ---------------------------------------------------------------------------
// Pages under test
// ---------------------------------------------------------------------------
import Dashboard from './pages/Dashboard.jsx';
import Reservations from './pages/Reservations.jsx';
import FrontDesk from './pages/FrontDesk.jsx';
import Login from './pages/Login.jsx';
import Unauthorized from './pages/Unauthorized.jsx';
import NotFound from './pages/NotFound.jsx';
import ModuleWorkspace from './pages/ModuleWorkspace.jsx';
import Reports from './components/modules/Reports.jsx';

const PAGES = [
  { name: 'Dashboard', component: Dashboard, path: '/dashboard' },
  { name: 'Reservations', component: Reservations, path: '/reservations' },
  { name: 'FrontDesk', component: FrontDesk, path: '/front-desk' },
  { name: 'Login', component: Login, path: '/login' },
  { name: 'Unauthorized', component: Unauthorized, path: '/unauthorized' },
  { name: 'NotFound', component: NotFound, path: '/not-found' },
  { name: 'ModuleWorkspace Rooms', component: () => <ModuleWorkspace page="Rooms" />, path: '/rooms' },
  { name: 'ModuleWorkspace Guests', component: () => <ModuleWorkspace page="Guests" />, path: '/guests' },
  { name: 'ModuleWorkspace Billing', component: () => <ModuleWorkspace page="Billing & Payments" />, path: '/billing' },
  { name: 'ModuleWorkspace Housekeeping', component: () => <ModuleWorkspace page="Housekeeping" />, path: '/housekeeping' },
  { name: 'Reports', component: Reports, path: '/reports' },
];

describe('smoke: every page renders without crashing', () => {
  for (const { name, component, path } of PAGES) {
    it(`renders ${name} at ${path}`, () => {
      const Page = component;
      const { container } = render(
        <MemoryRouter initialEntries={[path]}>
          <Page />
        </MemoryRouter>
      );
      expect(container).toBeTruthy();
    });
  }
});
