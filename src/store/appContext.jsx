import { createContext, useContext, useCallback, useEffect, useState, useMemo } from 'react';
import { hotelApi, unwrapList } from '../api/index.js';
import {
  sampleDashboard,
  sampleArrivals,
  sampleReservations,
  navGroups,
} from '../data/sample.js';
import { initialsFor, formatDate, money, normalizeReservation } from '../utils/formatters.js';
import { policyFor, ROLE_NAMES } from './permissions.js';

const todayDate = new Date();
export const today = new Intl.DateTimeFormat('en-CA').format(todayDate);
export const todayLabel = new Intl.DateTimeFormat('en-GB', {
  weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
}).format(todayDate);
export const todayEyebrow = new Intl.DateTimeFormat('en-US', {
  weekday: 'long', month: 'long', day: '2-digit', year: 'numeric',
}).format(todayDate).toUpperCase();

const AppContext = createContext(null);

/**
 * Single source of truth for the shell state:
 * dashboard metrics, arrivals, reservations, navigation, search, filters,
 * pagination, modal/toast state and Django connectivity status.
 *
 * Components consume this through `useApp()` — no prop drilling.
 */
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within an AppProvider');
  return ctx;
}

export function AppProvider({ children }) {
  const [dashboard, setDashboard] = useState(sampleDashboard);
  const [arrivals, setArrivals] = useState(sampleArrivals);
  const [reservations, setReservations] = useState(sampleReservations);
  const [activePage, setActivePage] = useState('Dashboard');
  const [role, setRole] = useState(() => {
    try {
      const stored = localStorage.getItem('havendesk:preview-role');
      return ROLE_NAMES.includes(stored) ? stored : 'Hotel Manager';
    } catch { return 'Hotel Manager'; }
  });
  const [query, setQuery] = useState('');
  const [globalQuery, setGlobalQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const pageSize = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [apiState, setApiState] = useState('loading');
  const [apiMessage, setApiMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const filteredReservations = useMemo(() => reservations.filter((r) => {
    const matchesText = `${r.guest_name} ${r.email} ${r.room_type} ${r.room_number} ${r.status}`.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = filter === 'all' || r.status.toLowerCase() === filter;
    return matchesText && matchesStatus;
  }), [reservations, query, filter]);

  const pageCount = Math.max(1, Math.ceil(filteredReservations.length / pageSize));
  const permissions = useMemo(() => policyFor(role), [role]);
  const visibleReservations = filteredReservations.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const firstVisible = filteredReservations.length ? (currentPage - 1) * pageSize + 1 : 0;
  const lastVisible = Math.min(currentPage * pageSize, filteredReservations.length);

  useEffect(() => { setCurrentPage(1); }, [query, filter]);

  useEffect(() => {
    try { localStorage.setItem('havendesk:preview-role', role); } catch (_) {}
    if (!permissions.pages.includes(activePage)) setActivePage(permissions.pages[0] || 'Dashboard');
    if (!permissions.actions.includes('createReservation')) setModalOpen(false);
  }, [role, permissions, activePage]);

  const refresh = useCallback(async () => {
    setApiState('loading');
    const results = await Promise.allSettled([
      hotelApi.getDashboard(),
      hotelApi.getReservations(),
      hotelApi.getArrivals(),
    ]);
    let failures = 0;
    if (results[0].status === 'fulfilled') setDashboard((current) => ({ ...current, ...results[0].value })); else failures++;
    if (results[1].status === 'fulfilled') setReservations(unwrapList(results[1].value).map(normalizeReservation)); else failures++;
    if (results[2].status === 'fulfilled') setArrivals(unwrapList(results[2].value).map((a, i) => ({
      ...a,
      id: a.id ?? i,
      guest_name: a.guest_name || a.guest?.full_name || a.guest?.name || 'Guest',
      room_type: a.room_type_name || a.room_type?.name || a.room_type || 'Room',
      room_number: a.room_number || a.room?.number || '—',
      arrival_time: a.arrival_time || a.check_in_time || '—',
      initials: a.initials || initialsFor(a.guest_name || a.guest?.name),
      color: a.color || ['av-lilac', 'av-peach', 'av-sage', 'av-blue'][i % 4],
    }))); else failures++;
    setApiState(failures === 0 ? 'connected' : 'offline');
    setApiMessage(failures === 0 ? '' : 'Could not load all Django API data. Showing sample data for unavailable sections.');
  }, []);

  const submitReservation = async (event) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const payload = {
      guest_name: String(form.get('guest_name')).trim(),
      email: String(form.get('email')).trim(),
      room_type: form.get('room_type'),
      guests: Number(form.get('guests')),
      check_in: form.get('check_in'),
      check_out: form.get('check_out'),
    };
    if (new Date(`${payload.check_out}T00:00:00`) <= new Date(`${payload.check_in}T00:00:00`)) {
      setToast('Check-out must be after check-in.');
      formElement.elements.check_out.focus();
      return;
    }
    setSaving(true);
    try {
      const created = await hotelApi.createReservation(payload);
      setReservations((current) => [normalizeReservation(created || { ...payload, status: 'Pending' }, 0), ...current]);
      setApiState('connected');
      setApiMessage('');
      setToast(`Reservation created for ${payload.guest_name}`);
      formElement.reset();
      setModalOpen(false);
    } catch (error) {
      setToast(`Could not save reservation: ${error.message}`);
      setApiState('offline');
    } finally { setSaving(false); }
  };

  function selectNav(page) {
    setActivePage(page);
    setMobileNavOpen(false);
    const targets = { Dashboard: 'welcomeSection', Reservations: 'reservationsSection', 'Front desk': 'frontDeskSection' };
    const target = targets[page] ? document.getElementById(targets[page]) : null;
    if (target) target.scrollIntoView({ behavior: 'smooth', block: page === 'Dashboard' ? 'start' : 'center' });
  }

  useEffect(() => { refresh(); }, [refresh]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(''), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const onKey = (event) => { if (event.key === 'Escape') { setModalOpen(false); setSearchOpen(false); } };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const value = {
    dashboard, setDashboard,
    arrivals, setArrivals,
    reservations, setReservations,
    activePage, setActivePage,
    role, setRole, roleNames: ROLE_NAMES, permissions,
    query, setQuery,
    globalQuery, setGlobalQuery,
    searchOpen, setSearchOpen,
    filter, setFilter,
    pageSize, currentPage, setCurrentPage,
    modalOpen, setModalOpen,
    mobileNavOpen, setMobileNavOpen,
    toast, setToast,
    apiState, apiMessage,
    saving, setSaving,
    today, todayLabel, todayEyebrow,
    refresh, submitReservation, selectNav,
    filteredReservations, pageCount, visibleReservations, firstVisible, lastVisible,
    navGroups,
    formatDate, money, normalizeReservation,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
