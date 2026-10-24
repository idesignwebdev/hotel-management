import { createContext, useContext, useCallback, useEffect, useState, useMemo } from 'react';
import { hotelApi, unwrapList, ApiError } from '../api/index.js';
import { isDemoMode } from '../api/client.js';
import {
  sampleDashboard,
  sampleArrivals,
  sampleReservations,
} from '../data/sample.js';
import { initialsFor, formatDate, money, normalizeReservation } from '../utils/formatters.js';

const AppContext = createContext(null);

/**
 * Single source of truth for shell state:
 * dashboard metrics, arrivals, reservations, search, filters, pagination,
 * modal/toast state, auth role, currency/timezone, and API connectivity.
 *
 * Routing (active page) is handled by React Router — not here.
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
  const [role, setRole] = useState(() => {
    try {
      const stored = localStorage.getItem('havendesk:preview-role');
      return ['Owner / Administrator', 'Hotel Manager', 'Reception / Front Desk', 'Housekeeping', 'Finance / Cashier', 'Read-only / Auditor'].includes(stored)
        ? stored : 'Hotel Manager';
    } catch { return 'Hotel Manager'; }
  });
  const [currency, setCurrency] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('havendesk:settings') || '{}');
      return saved.currency || 'KES';
    } catch { return 'KES'; }
  });
  const [timezone, setTimezone] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('havendesk:settings') || '{}');
      return saved.timezone || 'Africa/Nairobi';
    } catch { return 'Africa/Nairobi'; }
  });
  const demoMode = isDemoMode();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const pageSize = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [apiState, setApiState] = useState('loading');
  const [apiMessage, setApiMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [serverCount, setServerCount] = useState(0);

  const todayFor = useCallback(
    (tz = timezone) => new Intl.DateTimeFormat('en-CA', { timeZone: tz }).format(new Date()),
    [timezone]
  );
  const today = todayFor(timezone);
  const todayLabel = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
    timeZone: timezone,
  }).format(new Date());
  const todayEyebrow = new Intl.DateTimeFormat('en-US', {
    weekday: 'long', month: 'long', day: '2-digit', year: 'numeric',
    timeZone: timezone,
  }).format(new Date()).toUpperCase();

  const moneyWithCurrency = useCallback((value) => money(value, currency), [currency]);

  const filteredReservations = useMemo(() => reservations.filter((r) => {
    const matchesText = `${r.guest_name} ${r.email} ${r.room_type} ${r.room_number} ${r.status}`.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = filter === 'all' || r.status.toLowerCase() === filter;
    return matchesText && matchesStatus;
  }), [reservations, query, filter]);

  const pageCount = Math.max(1, Math.ceil(Math.max(filteredReservations.length, serverCount) / pageSize));
  const visibleReservations = filteredReservations.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const firstVisible = filteredReservations.length ? (currentPage - 1) * pageSize + 1 : 0;
  const lastVisible = Math.min(currentPage * pageSize, filteredReservations.length);

  useEffect(() => { setCurrentPage(1); }, [query, filter]);

  const handleLogout = () => {
    try {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('havendesk:')) localStorage.removeItem(key);
      });
    } catch (_) {}
    setRole('Read-only / Auditor');
    setReservations([]);
    setDashboard(sampleDashboard);
    setArrivals([]);
    setApiState('offline');
    setApiMessage('Logged out. Local demo data cleared.');
    setToast('Logged out.');
  };

  const refresh = useCallback(async () => {
    setApiState('loading');
    const results = await Promise.allSettled([
      hotelApi.getDashboard(),
      hotelApi.getReservations(),
      hotelApi.getArrivals(),
    ]);
    let failures = 0;
    if (results[0].status === 'fulfilled') {
      const d = results[0].value;
      if (d.currency) setCurrency(d.currency);
      if (d.timezone) setTimezone(d.timezone);
      setDashboard((current) => ({ ...current, ...d }));
    } else failures++;
    if (results[1].status === 'fulfilled') {
      const { items, count } = unwrapList(results[1].value);
      setReservations(items.map(normalizeReservation));
      setServerCount(count);
    } else failures++;
    if (results[2].status === 'fulfilled') {
      const { items } = unwrapList(results[2].value);
      setArrivals(items.map((a, i) => ({
        ...a,
        id: a.id ?? i,
        guest_name: a.guest_name || a.guest?.full_name || a.guest?.name || 'Guest',
        room_type: a.room_type_name || a.room_type?.name || a.room_type || 'Room',
        room_number: a.room_number || a.room?.number || '—',
        arrival_time: a.arrival_time || a.check_in_time || '—',
        initials: a.initials || initialsFor(a.guest_name || a.guest?.name),
        color: a.color || ['av-lilac', 'av-peach', 'av-sage', 'av-blue'][i % 4],
      })));
    } else failures++;

    const authFail = results.some((r) => r.status === 'rejected' && r.reason instanceof ApiError && (r.reason.status === 401 || r.reason.status === 403));
    if (authFail) {
      setApiState('offline');
      setApiMessage('Session expired. Please sign in again.');
    } else if (results.some((r) => r.status === 'rejected')) {
      setApiState(demoMode ? 'demo' : 'offline');
      setApiMessage(demoMode
        ? 'Running in local demo mode. Connect the Django API to sync.'
        : 'Could not reach the Django API. Running read-only until it is available.');
    } else {
      setApiState(failures === 0 ? 'connected' : 'offline');
      setApiMessage(failures === 0 ? '' : 'Could not load all Django API data. Showing sample data for unavailable sections.');
    }
  }, [demoMode, currency, timezone, normalizeReservation]);

  const submitReservation = async (event) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const checkIn = form.get('check_in');
    const checkOut = form.get('check_out');
    if (new Date(`${checkOut}T00:00:00`) <= new Date(`${checkIn}T00:00:00`)) {
      setToast('Check-out must be after check-in.');
      formElement.elements.check_out.focus();
      return;
    }
    const todayLocal = todayFor(timezone);
    if (String(checkIn).slice(0, 10) < todayLocal) {
      setToast('Check-in cannot be in the past.');
      formElement.elements.check_in.focus();
      return;
    }
    const payload = {
      guest_name: String(form.get('guest_name')).trim(),
      email: String(form.get('email')).trim(),
      room_type: form.get('room_type'),
      guests: Number(form.get('guests')),
      check_in: checkIn,
      check_out: checkOut,
    };
    if (!demoMode) delete payload.id;
    else payload.id = crypto.randomUUID();

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
      if (error instanceof ApiError && error.status === 401) {
        setApiMessage('Session expired. Please sign in again.');
      }
      setToast(`Could not save reservation: ${error.message}`);
      setApiState(demoMode ? 'demo' : 'offline');
    } finally { setSaving(false); }
  };

  useEffect(() => { refresh(); }, [refresh]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(''), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const onKey = (event) => { if (event.key === 'Escape') setModalOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const value = {
    dashboard, setDashboard,
    arrivals, setArrivals,
    reservations, setReservations,
    role, setRole, demoMode,
    currency, setCurrency, timezone, setTimezone,
    query, setQuery,
    filter, setFilter,
    pageSize, currentPage, setCurrentPage,
    modalOpen, setModalOpen,
    toast, setToast,
    apiState, apiMessage,
    saving, setSaving,
    serverCount, setServerCount,
    today, todayLabel, todayEyebrow, todayFor,
    refresh, submitReservation, handleLogout,
    filteredReservations, pageCount, visibleReservations, firstVisible, lastVisible,
    formatDate, money: moneyWithCurrency, normalizeReservation,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
