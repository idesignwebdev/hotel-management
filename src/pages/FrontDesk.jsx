import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { hotelApi } from '../api/index.js';
import { seed } from '../data/sample.js';
import { money, normalizeReservation } from '../utils/formatters.js';
import { useApp } from '../store/appContext.jsx';
import { PAGE_PERMISSIONS } from '../store/permissions.js';

/**
 * Front desk page — today's arrivals and quick check-in / check-out actions.
 * This is now a real route (/front-desk), not a scroll position on the dashboard.
 */
export default function FrontDesk() {
  const { apiState, setToast, role } = useApp();
  const navigate = useNavigate();
  const [arrivals, setArrivals] = useState(seed.Arrivals || []);
  const [live, setLive] = useState(false);

  if (!PAGE_PERMISSIONS['/front-desk']?.includes(role)) {
    navigate('/unauthorized', { replace: true });
    return null;
  }

  useEffect(() => {
    let active = true;
    hotelApi.getArrivals()
      .then((data) => {
        if (active) {
          const items = Array.isArray(data) ? data : (data?.results || data?.data || []);
          setArrivals(items.map((a, i) => ({
            ...a,
            id: a.id ?? i,
            guest_name: a.guest_name || a.guest?.full_name || a.guest?.name || 'Guest',
            room_type: a.room_type_name || a.room_type?.name || a.room_type || 'Room',
            room_number: a.room_number || a.room?.number || '—',
            arrival_time: a.arrival_time || a.check_in_time || '—',
            initials: a.initials || (a.guest_name ? a.guest_name.split(/\s+/).slice(0, 2).map((x) => x[0] || '').join('').toUpperCase() : ''),
            color: a.color || ['av-lilac', 'av-peach', 'av-sage', 'av-blue'][i % 4],
          })));
          setLive(true);
        }
      })
      .catch(() => { if (active) setLive(false); });
    return () => { active = false; };
  }, []);

  const handleCheckIn = (reservation) => {
    setToast(`Checked in ${reservation.guest_name} to room ${reservation.room_number}`);
  };

  const handleCheckOut = (reservation) => {
    setToast(`Checked out ${reservation.guest_name} from room ${reservation.room_number}`);
  };

  const colorStyle = (color) => {
    const map = {
      'av-lilac': { bg: '#eee9f4', fg: '#79658b' },
      'av-peach': { bg: '#f6e9df', fg: '#a87a57' },
      'av-sage': { bg: '#e7eee5', fg: '#5e785a' },
      'av-blue': { bg: '#e7edf1', fg: '#5c7484' },
    };
    return map[color] || { bg: '#e7eee5', fg: '#5e785a' };
  };

  return (
    <div className="front-desk-page">
      <div className="page-header">
        <h1>Front desk</h1>
        <p>Today's arrivals and room turns</p>
      </div>

      <div className="front-desk-grid">
        <section className="panel arrivals-today">
          <div className="panel-header">
            <div>
              <h2>Arrivals today <span className="count-pill">{arrivals.length}</span></h2>
              <p>Guests checking in</p>
            </div>
            <span className={`pill ${live ? 'pill-ready' : 'pill-normal'}`}>{live ? 'Connected' : 'Demo'}</span>
          </div>
          <div className="arrival-list">
            {arrivals.map((arrival) => {
              const style = colorStyle(arrival.color);
              return (
                <div className="arrival-item" key={arrival.id}>
                  <span className="guest-avatar" style={{ background: style.bg, color: style.fg }}>{arrival.initials}</span>
                  <div className="guest-info">
                    <b>{arrival.guest_name}</b>
                    <span>{arrival.room_type} · Room {arrival.room_number}</span>
                  </div>
                  <span className="arrival-time">{arrival.arrival_time}</span>
                  <div className="arrival-actions">
                    <button className="icon-button" onClick={() => handleCheckIn(arrival)}>✓</button>
                  </div>
                </div>
              );
            })}
            {!arrivals.length && <div className="empty-state">No arrivals today.</div>}
          </div>
        </section>

        <section className="panel quick-actions">
          <div className="panel-header">
            <div>
              <h2>Quick actions</h2>
              <p>Room turns and guest updates</p>
            </div>
          </div>
          <div className="quick-actions-grid">
            <button className="primary-button" onClick={() => navigate('/reservations')}>
              <span>＋</span> New reservation
            </button>
            <button className="select-button" disabled={!live} onClick={() => setToast('Room turn report coming soon')}>
              Room turn report
            </button>
            <button className="select-button" disabled={!live} onClick={() => setToast('Maintenance request coming soon')}>
              Maintenance request
            </button>
          </div>
          {apiState !== 'connected' && <p className="offline-hint">Some actions require the Django API.</p>}
        </section>
      </div>
    </div>
  );
}
