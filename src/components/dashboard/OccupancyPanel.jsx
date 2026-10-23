import { useApp } from '../../store/appContext.jsx';

/**
 * Weekly occupancy chart panel.
 */
export default function OccupancyPanel() {
  const { dashboard, setToast, refresh } = useApp();

  return (
    <article className="panel occupancy-panel" id="occupancySection">
      <div className="panel-header">
        <div>
          <h2>Occupancy overview</h2>
          <p>Room performance over the past 7 days</p>
        </div>
        <div className="panel-tools">
          <button className="select-button" onClick={() => setToast('The Django API currently provides a weekly occupancy series.')}>
            This week <span>⌄</span>
          </button>
          <button className="more-button" aria-label="More options" onClick={refresh}>···</button>
        </div>
      </div>

      <div className="chart-legend">
        <span><i className="legend-dot booked" /> Occupied</span>
        <span><i className="legend-dot available" /> Available</span>
        <span className="occupancy-average">Average occupancy <b>{dashboard.occupancy_rate ?? 0}%</b></span>
      </div>
      <div className="chart-wrap">
        <div className="y-axis"><span>100%</span><span>75%</span><span>50%</span><span>25%</span><span>0%</span></div>
        <div className="chart" aria-label="Weekly occupancy chart">
          <div className="grid-lines"><i /><i /><i /><i /><i /></div>
          {(dashboard.weekly_occupancy || []).map((day, i) => (
            <div className={`bar-group ${i === 6 ? 'today' : ''}`} key={`${day.day}-${day.date}`}>
              <div className="bar" style={{ '--v': `${Math.min(Number(day.occupancy || day.rate || 0), 100)}%` }}>
                <i /><b>{day.occupancy ?? day.rate}%</b>
              </div>
              <span>{day.day}</span>
              <small>{day.date}</small>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
