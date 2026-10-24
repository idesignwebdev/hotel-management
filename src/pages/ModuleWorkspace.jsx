import { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { hotelApi, unwrapList, ApiError } from '../api/index.js';
import { isDemoMode } from '../api/client.js';
import { seed, pageInfo, fields } from '../data/sample.js';
import { money, normalizeFolio } from '../utils/formatters.js';
import { useApp } from '../store/appContext.jsx';
import { PAGES, actionsFor } from '../store/permissions.js';
import ModuleFrame from '../components/modules/ModuleFrame.jsx';
import TaskBoard from '../components/modules/TaskBoard.jsx';

const badge = (s = '') => 'pill pill-' + String(s).toLowerCase().replaceAll(/[^a-z0-9]+/g, '-');
const initials = (s = '') => s.split(/\s+/).slice(0, 2).map((x) => x[0] || '').join('').toUpperCase();

/**
 * Operational module workspace: Rooms, Guests, Billing & Payments,
 * Housekeeping. Each module talks to its matching Django endpoint via
 * hotelApi; until then it shows seeded sample data.
 *
 * Write rules:
 *  - API reachable → server is source of truth, client sends no ID on create.
 *  - VITE_DEMO_MODE=true → localStorage edits allowed, labelled as demo.
 *  - API unreachable and no demo mode → read-only offline (no local writes).
 */
export default function ModuleWorkspace({ page }) {
  const { setToast, demoMode, apiState, setApiState, apiMessage, role } = useApp();
  const modalRef = useRef(null);
  const firstInputRef = useRef(null);
  const [rows, setRows] = useState(seed[page] || []);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');
  const [modal, setModal] = useState(false);
  const [busy, setBusy] = useState(false);
  const [live, setLive] = useState(false);
  const [serverCount, setServerCount] = useState(0);

  useEffect(() => {
    let alive = true;
    setRows(seed[page] || []);
    try {
      const cached = localStorage.getItem('havendesk:' + page);
      if (cached) setRows(JSON.parse(cached));
    } catch (_) {}
    hotelApi.getModule(page, { page: 1, search: '', status: '' })
      .then((data) => {
        if (alive) {
          setRows(data.items);
          setServerCount(data.count);
          setLive(true);
          setApiState('connected');
          setApiMessage('');
        }
      })
      .catch((error) => {
        if (!alive) return;
        setLive(false);
        if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
          setApiState('offline');
          setApiMessage('Session expired. Please sign in again.');
        } else if (demoMode) {
          setApiState('demo');
          setApiMessage('Running in local demo mode. Connect the Django API to sync.');
        } else {
          setApiState('offline');
          setApiMessage('Could not reach the Django API. Running read-only until it is available.');
        }
      });
    return () => { alive = false; };
  }, [page, demoMode, setApiState, setApiMessage]);

  // Re-fetch when search, status or page changes (server-side filtering/pagination).
  useEffect(() => {
    let alive = true;
    hotelApi.getModule(page, { page: 1, search: query, status: status === 'All' ? '' : status })
      .then((data) => {
        if (alive) {
          setRows(data.items);
          setServerCount(data.count);
        }
      })
      .catch(() => { /* keep last-known rows on filter refetch failure */ });
    return () => { alive = false; };
  }, [page, query, status]);

  const visible = useMemo(() => rows.filter((r) =>
    Object.values(r).join(' ').toLowerCase().includes(query.toLowerCase())
    && (status === 'All' || String(r.status || '').toLowerCase() === status.toLowerCase())
  ), [rows, query, status]);

  const canWrite = live || demoMode;
  const isReadOnly = !live && !demoMode;

  const persist = useCallback(async (next, record, patch = false, payment = null) => {
    if (!canWrite) {
      setToast('The Django API is unavailable. Changes are read-only until it is back online.');
      return false;
    }
    setBusy(true);
    try {
      if (live) {
        if (payment) {
          await hotelApi.recordPayment(record.id, payment);
          try {
            const refreshed = await hotelApi.getModule(page, { page: 1, search: '', status: '' });
            setRows(refreshed.items);
            setServerCount(refreshed.count);
            setToast('Payment recorded and folio refreshed from the hotel system.');
          } catch {
            setToast('Payment recorded. The folio could not refresh; reload to see the latest balance.');
          }
          return true;
        } else if (patch) {
          await hotelApi.updateModule(page, record.id, record);
        } else {
          // Live mode: send no ID — the server assigns it.
          const recordWithoutId = { ...record };
          delete recordWithoutId.id;
          const created = await hotelApi.createModule(page, recordWithoutId);
          const savedRecord = created && typeof created === 'object' ? { ...record, ...created } : record;
          setRows((current) => [savedRecord, ...current]);
          setServerCount((c) => c + 1);
          setToast('Changes saved to the hotel system.');
          return true;
        }
        setRows(next);
        setToast('Changes saved to the hotel system.');
        return true;
      } else {
        // Demo mode: localStorage only.
        setRows(next);
        localStorage.setItem('havendesk:' + page, JSON.stringify(next));
        setServerCount(next.length);
        setToast('Saved in this browser demo. Connect the Django endpoint to sync.');
        return true;
      }
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        setApiState('offline');
        setApiMessage('Session expired. Please sign in again.');
      }
      setToast('Server did not save the change: ' + error.message + '. Your form data is still available to retry.');
      return false;
    } finally { setBusy(false); }
  }, [live, demoMode, canWrite, page, setApiState, setApiMessage]);

  const submit = async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));

    if (page === 'Billing & Payments') {
      const invoice = rows.find((r) => String(r.id) === data.invoice_id);
      const amount = Number(data.amount);
      if (!invoice || amount <= 0) return setToast('Choose an invoice and enter a positive payment amount.');
      const folio = normalizeFolio(invoice);
      const due = Number(folio.total || 0) - Number(folio.paid || 0);
      if (amount > due) return setToast('Payment cannot exceed the outstanding invoice balance.');
      const updated = { ...invoice, paid: Number(invoice.paid || 0) + amount, method: data.method, status: Number(invoice.paid || 0) + amount >= Number(invoice.total) ? 'Paid' : 'Partial' };
      const ok = await persist(rows.map((r) => r.id === invoice.id ? updated : r), updated, true, { amount, method: data.method });
      if (ok) setModal(false);
      return;
    }

    // Demo mode: stable client ID. Live mode: ID stripped by persist() — server assigns.
    let item = demoMode ? { ...data, id: crypto.randomUUID() } : { ...data };
    if (page === 'Rooms') item = { ...item, capacity: Number(item.capacity), rate: Number(item.rate), status: item.status || 'Ready' };
    if (page === 'Guests') item = { ...item, stays: 0, balance: 0 };
    if (page === 'Housekeeping') item = { ...item, priority: 'Normal', status: 'Queued' };
    const ok = await persist([item, ...rows], item);
    if (ok) setModal(false);
  };

  const advance = async (task) => {
    const steps = ['Queued', 'In progress', 'Awaiting inspection', 'Ready'];
    if (task.status === 'Blocked') return setToast('Resolve the maintenance blocker before advancing.');
    const updated = { ...task, status: steps[Math.min(steps.indexOf(task.status) + 1, 3)] };
    await persist(rows.map((r) => r.id === task.id ? updated : r), updated, true);
  };

  const openModal = useCallback(() => {
    setModal(true);
    // Focus first input after the modal mounts.
    setTimeout(() => firstInputRef.current?.focus(), 50);
  }, []);

  const closeModal = useCallback(() => { setModal(false); }, []);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape' && modal) closeModal();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [modal, closeModal]);

  if (page === 'Reports') return null; // handled by dedicated Reports page
  if (page === 'Settings') return null; // handled by dedicated Settings page

  const info = pageInfo[page] || pageInfo.Rooms;
  const pagePath = PAGES[page]?.path;
  const actionByPage = { Rooms: 'manageRooms', Guests: 'manageGuests', 'Billing & Payments': 'manageBilling', Housekeeping: 'manageHousekeeping' };
  const canManage = pagePath ? actionsFor(pagePath, role).includes(actionByPage[page]) : false;
  const statuses = page === 'Rooms' ? ['Ready', 'Occupied', 'Cleaning', 'Reserved', 'Out of service']
    : page === 'Billing & Payments' ? ['Paid', 'Partial', 'Unpaid']
    : page === 'Housekeeping' ? ['Queued', 'In progress', 'Awaiting inspection', 'Ready', 'Blocked']
    : [];

  const stats = page === 'Rooms'
    ? [['Total rooms', rows.length, 'Inventory tracked'], ['Ready to sell', rows.filter((r) => r.status === 'Ready').length, 'Inspected and available'], ['Needs attention', rows.filter((r) => ['Cleaning', 'Out of service'].includes(r.status)).length, 'Cleaning or blocked']]
    : page === 'Guests'
    ? [['Guest profiles', rows.length, 'Searchable profiles'], ['Repeat guests', rows.filter((r) => Number(r.stays) > 1).length, 'More than one stay'], ['Open balances', rows.filter((r) => Number(r.balance) > 0).length, 'Needs follow-up']]
    : page === 'Billing & Payments'
    ? (() => {
      const invoiced = rows.reduce((s, r) => s + Number(normalizeFolio(r).total || 0), 0);
      const outstanding = rows.reduce((sum, r) => sum + Math.max(Number(normalizeFolio(r).total || 0) - Number(normalizeFolio(r).paid || 0), 0), 0);
      const collected = rows.reduce((s, r) => s + Number(normalizeFolio(r).paid || 0), 0);
      return [['Invoiced', money(invoiced), rows.length + ' folios'], ['Outstanding', money(outstanding), 'Open guest balances'], ['Collected', money(collected), 'Recorded payments']];
    })()
    : [['Open tasks', rows.filter((r) => r.status !== 'Ready').length, 'Still in workflow'], ['Awaiting inspection', rows.filter((r) => r.status === 'Awaiting inspection').length, 'Supervisor review'], ['Blocked rooms', rows.filter((r) => r.status === 'Blocked').length, 'Maintenance attention']];

  return (
    <>
      <ModuleFrame
        title={info[0]}
        subtitle={info[1]}
        action={canManage ? info[2] : null}
        live={live || demoMode}
        previewMessage={isReadOnly ? 'The Django API is unavailable. This workspace is read-only until it is back online.' : null}
        onAction={canManage ? openModal : null}
      >
        <div className="module-stats">
          {stats.map(([a, b, c]) => (
            <article className="module-stat" key={a}><span>{a}</span><strong>{b}</strong><small>{c}</small></article>
          ))}
        </div>
        <div className="panel module-panel">
          <div className="module-toolbar">
            <label className="table-search"><span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={`Search ${page.toLowerCase()}…`} /></label>
            {statuses.length > 0 && <select className="module-filter" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option>All</option>{statuses.map((s) => <option key={s}>{s}</option>)}
            </select>}
            <span className="module-result">{serverCount || visible.length} records</span>
          </div>

          {page === 'Housekeeping'
            ? <TaskBoard rows={rows} visible={visible} statuses={statuses} status={status} busy={busy} advance={advance} canManage={canManage} canWrite={canWrite} />
            : (
              <div className="table-scroll">
                <table className="module-table">
                  <thead>
                    <tr>
                      {(page === 'Rooms' ? ['ROOM', 'TYPE', 'FLOOR', 'CAPACITY', 'BASE RATE', 'STATUS']
                        : page === 'Guests' ? ['GUEST', 'CONTACT', 'STAYS', 'BALANCE']
                        : ['INVOICE', 'GUEST / ROOM', 'DATE', 'TOTAL', 'PAID', 'STATUS']).map((x) => <th key={x}>{x}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map((r) => (
                      <tr key={r.id}>
                        {page === 'Rooms'
                          ? (<><td><b className="module-primary">{r.room || r.room_number}</b></td><td>{r.type || r.room_type || '—'}</td><td>{r.floor || '—'}</td><td>{r.capacity || '—'} guests</td><td>{money(r.rate || r.base_rate)}</td><td><span className={badge(r.status)}>{r.status}</span></td></>)
                          : page === 'Guests'
                          ? (<><td><div className="module-guest"><span className="mini-avatar">{initials(r.name || r.full_name)}</span><span><b>{r.name || r.full_name}</b><small>{r.id}</small></span></div></td><td>{r.email || '—'}<small className="cell-sub">{r.phone || ''}</small></td><td>{r.stays ?? r.reservation_count ?? 0}</td><td>{money(r.balance)}</td></>)
                          : (<>
                            <td><b className="module-primary">{r.id}</b></td>
                            <td>{r.guest || r.guest_name || 'Guest'}<small className="cell-sub">Room {r.room || r.room_number || '—'}</small></td>
                            <td>{r.date || r.created_at?.slice(0, 10) || '—'}</td>
                            <td>{money(normalizeFolio(r).total)}</td>
                            <td>{money(normalizeFolio(r).paid)}</td>
                            <td><span className={badge(normalizeFolio(r).status)}>{normalizeFolio(r).status}</span></td>
                          </>)}
                      </tr>
                    ))}
                    {!visible.length && <tr><td className="empty-state" colSpan="6">No {page.toLowerCase()} match these filters.</td></tr>}
                  </tbody>
                </table>
              </div>
            )}
          <div className="table-footer"><span>{live ? 'Connected to Django' : demoMode ? 'Demo mode — browser-only edits' : 'Read-only offline'}</span><span>{serverCount || visible.length} results</span></div>
        </div>
      </ModuleFrame>

      {modal && canManage && (
        <div className="modal-backdrop open" onMouseDown={(event) => { if (event.target === event.currentTarget) closeModal(); }} role="presentation">
          <section className="booking-modal module-modal" role="dialog" aria-modal="true" ref={modalRef}>
            <div className="modal-top"><span className="modal-mark">＋</span><button onClick={closeModal} aria-label="Close">×</button></div>
            <h2>{info[2]}</h2>
            <p className="modal-intro">Add the details to your workspace.</p>
            <form onSubmit={submit}>
              {page === 'Billing & Payments'
                ? (<>
                  <label>Invoice<select name="invoice_id" required>{rows.filter((r) => Number(normalizeFolio(r).total || 0) > Number(normalizeFolio(r).paid || 0)).map((r) => {
                    const folio = normalizeFolio(r);
                    return <option key={r.id} value={r.id}>{r.id} — {folio.guest} · {money(folio.total - folio.paid)} due</option>;
                  })}</select></label>
                  <label>Payment amount (KES)<input ref={firstInputRef} name="amount" type="number" min="1" required /></label>
                  </>)
                : fields[page].map(([key, label]) => (
                  <label key={key}>{label}<input key={key} name={key} ref={key === fields[page][0][0] ? firstInputRef : undefined} type={['capacity', 'rate', 'total', 'paid'].includes(key) ? 'number' : 'text'} min={['capacity', 'rate', 'total', 'paid'].includes(key) ? '0' : undefined} required={key !== 'paid'} /></label>
                ))}
              {page === 'Rooms' && <label>Room status<select name="status"><option>Ready</option><option>Occupied</option><option>Cleaning</option><option>Reserved</option><option>Out of service</option></select></label>}
              {page === 'Billing & Payments' && <label>Payment method<select name="method"><option>M-Pesa</option><option>Cash</option><option>Bank transfer</option><option>Card</option></select></label>}
              <div className="modal-actions"><button type="button" className="cancel-button" onClick={closeModal}>Cancel</button><button className="primary-button" disabled={busy || !canWrite}>{busy ? 'Saving…' : !canWrite ? 'Offline' : 'Save'}</button></div>
            </form>
          </section>
        </div>
      )}
    </>
  );
}
