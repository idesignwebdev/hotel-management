import { useApp } from '../../store/appContext.jsx';
import Avatar from '../common/Avatar.jsx';

/**
 * Today's arrivals strip with a link to the front desk.
 */
export default function ArrivalsPanel() {
  const { arrivals, selectNav, dashboard } = useApp();

  return (
    <article className="panel arrivals-panel" id="frontDeskSection">
      <div className="panel-header">
        <div>
          <h2>Today’s arrivals <span className="count-pill">{dashboard.arrivals_today ?? arrivals.length}</span></h2>
          <p>Guests checking in today</p>
        </div>
        <button className="text-link" onClick={() => selectNav('Front desk')}>View all <span>→</span></button>
      </div>

      <div className="arrival-list">
        {arrivals.slice(0, 4).map((arrival) => (
          <div className="arrival-item" key={arrival.id}>
            <Avatar variant="guest" label={arrival.initials} color={arrival.color} />
            <div className="guest-info">
              <b>{arrival.guest_name}</b>
              <span>{arrival.room_type} · <em>Room {arrival.room_number}</em></span>
            </div>
            <span className="arrival-time">{arrival.arrival_time}</span>
          </div>
        ))}
      </div>
      <button className="bottom-link" onClick={() => selectNav('Front desk')}>
        See all {dashboard.arrivals_today ?? arrivals.length} arrivals <span>→</span>
      </button>
    </article>
  );
}
