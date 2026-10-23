import { useApp } from '../../store/appContext.jsx';

/**
 * The four top-line hotel metric cards.
 */
export default function StatsGrid() {
  const { dashboard, arrivals } = useApp();

  return (
    <section className="stats-grid" id="roomsSection" aria-label="Today's hotel metrics">
      <article className="stat-card">
        <div className="stat-top"><span>Occupancy rate</span><span className="stat-icon occupancy-icon">⌂</span></div>
        <div className="stat-value">{dashboard.occupancy_rate ?? 0}<span className="unit">%</span></div>
        <div className="stat-foot">
          <span className="trend positive">↗ 8.2%</span><span>vs. last week</span>
          <span className="mini-bars"><i /><i /><i /><i /><i /><i /><i /></span>
        </div>
      </article>
      <article className="stat-card">
        <div className="stat-top"><span>Available rooms</span><span className="stat-icon rooms-icon">▣</span></div>
        <div className="stat-value">{dashboard.available_rooms ?? 0}<span className="unit muted-unit">/ {dashboard.total_rooms ?? 0}</span></div>
        <div className="stat-foot">
          <span className="status-chip green-chip"><i /> {dashboard.ready_rooms ?? 0} ready</span>
          <span className="status-chip amber-chip"><i /> {dashboard.cleaning_rooms ?? 0} cleaning</span>
        </div>
      </article>
      <article className="stat-card">
        <div className="stat-top"><span>Arrivals today</span><span className="stat-icon arrivals-icon">↘</span></div>
        <div className="stat-value">{dashboard.arrivals_today ?? arrivals.length}</div>
        <div className="stat-foot">
          <span className="avatar-stack"><i>JW</i><i>AO</i><i>+4</i></span>
          <span>{Math.max((dashboard.arrivals_today || arrivals.length) - arrivals.length, 0)} more expected</span>
          <span className="stat-spacer" /><span className="small-arrow">↗</span>
        </div>
      </article>
      <article className="stat-card">
        <div className="stat-top"><span>Revenue today</span><span className="stat-icon revenue-icon">◈</span></div>
        <div className="stat-value currency"><span>{dashboard.currency || 'KES'}</span> {Number(dashboard.revenue_today || 0).toLocaleString('en-KE')}</div>
        <div className="stat-foot">
          <span className="trend positive">↗ 12.5%</span><span>vs. last week</span>
          <span className="sparkline">
            <svg viewBox="0 0 82 24" preserveAspectRatio="none"><path d="M1 20 11 14 21 17 31 10 41 15 51 7 61 12 71 3 81 6" /></svg>
          </span>
        </div>
      </article>
    </section>
  );
}
