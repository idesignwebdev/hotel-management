import { useApp } from '../../store/appContext.jsx';
import { actionsFor } from '../../store/permissions.js';

/**
 * Dashboard header: date eyebrow, API status indicator, greeting and
 * "New reservation" action.
 */
export default function WelcomeRow() {
  const { todayEyebrow, apiState, apiMessage, refresh, setModalOpen, role } = useApp();
  const canCreate = actionsFor('/reservations', role).includes('createReservation');

  return (
    <section className="welcome-row" id="welcomeSection">
      <div>
        <div className="eyebrow">
          <span className="live-dot" />
          {todayEyebrow}
          <span className={`api-indicator ${apiState}`} title={apiMessage || 'Django API status'}>
            {apiState === 'connected' ? 'API connected' : apiState === 'loading' ? 'Connecting…' : 'Demo data'}
          </span>
        </div>
        <h1>Good morning, Amara <span className="wave">✳</span></h1>
        <p>Here’s what’s happening at your property today.</p>
      </div>
      {permissions.actions.includes('createReservation') && <button className="primary-button" onClick={() => setModalOpen(true)}>
        <span>＋</span> New reservation
      </button>}
    </section>
  );
}
