import { useApp } from '../../store/appContext.jsx';

/**
 * The four top-line hotel metric cards.
 * Trends and charts only render when the API provides them — no hard-coded
 * sample values are presented as live data.
 */
export default function StatsGrid() {
  const { dashboard, arrivals } = useApp();

  const occupancyTrend = dashboard.occupancy_trend ? (
    <span className={`trend ${dashboard.occupancy_trend > 0 ? 'positive' : 'negative'}`}>
      {dashboard.occupancy_trend > 0 ? '↗' : '↘'} {Math.abs(dashboard.occupancy_trend)}%
    </span>
  ) : null;

  const revenueTrend = dashboard.revenue_trend ? (
    <span className={`trend ${dashboard.revenue_trend > 0 ? 'positive' : 'negative'}`}>
      {dashboard.revenue_trend > 0 ? '↗' : '↘'} {Math.abs(dashboard.revenue_trend)}%
    </span>
  ) : null;

  const arrivalAvatars = arrivals.slice(0, 3).map((a) => (
    <span key={a.id} className="mini-avatar" style={{ background: { 'av-lilac': '#eee9f4', 'av-peach': '#f6e9df', 'av-sage': '#e7eee5', 'av-blue': '#e7edf1' }[a.color] || '#e7eee5', color: { 'av-lilac': '#79658b', 'av-peach': '#a87a57', 'av-sage': '#5e785a', 'av-blue': '#5c7484' }[a.color] || '#5e785a' }}>{a.initials}</span>
  ));

  return (
    <section className="stats-grid" id="roomsSection" aria-label="Today's hotel metrics">
      <article className="stat-card">
        <div className="stat-top"><span>Occupancy rate</span><span className="stat-icon occupancy-icon">⌂</span></div>
        <div className="stat-value">{dashboard.occupancy_rate ?? 0}<span className="unit">%</span></div>
        <div className="stat-foot">
          {occupancyTrend}
          {occupancyTrend && <span>vs. last week</span>}
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
          <span className="avatar-stack">{arrivalAvatars}</span>
          <span className="stat-spacer" /></div>
      </article>
      <article className="stat-card">
        <div className="stat-top"><span>Revenue today</span><span className="stat-icon revenue-icon">◈</span></div>
        <div className="stat-value currency"><span>{dashboard.currency || 'KES'}</span> {Number(dashboard.revenue_today || 0).toLocaleString('en-KE')}</div>
        <div className="stat-foot">
          {revenueTrend}
          {revenueTrend && <span>vs. last week</span>}
        </div>
      </article>
    </section>
  );
}
