import { useEffect, useState } from 'react';
import { hotelApi } from '../../api/index.js';
import ModuleFrame from './ModuleFrame.jsx';

/**
 * Reports & analytics page. Fetches metrics from /api/reports/ and falls
 * back to sample figures until the endpoint is available.
 */
export default function Reports({ notify }) {
  const [basis, setBasis] = useState('Stay dates');
  const [start, setStart] = useState(new Intl.DateTimeFormat('en-CA').format(new Date(new Date().getFullYear(), new Date().getMonth(), 1)));
  const [end, setEnd] = useState(new Intl.DateTimeFormat('en-CA').format(new Date()));
  const [live, setLive] = useState(false);
  const [metrics, setMetrics] = useState({});

  useEffect(() => {
    let active = true;
    hotelApi.getModule('Reports', { start_date: start, end_date: end, date_basis: basis.toLowerCase().replace(' ', '_') })
      .then((payload) => { if (active) { setMetrics(payload?.metrics || payload?.data || payload || {}); setLive(true); } })
      .catch(() => { if (active) setLive(false); });
    return () => { active = false; };
  }, [start, end, basis]);

  const exportCsv = () => {
    const csv = [['Metric', 'Value', 'Basis'],
      ['Occupancy', metrics.occupancy_rate ?? metrics.occupancy ?? '78%', basis],
      ['ADR', metrics.adr ?? 'KES 18,420', basis],
      ['RevPAR', metrics.revpar ?? 'KES 14,368', basis],
      ['Outstanding balances', metrics.outstanding_balance ?? 'KES 37,400', basis]]
      .map((r) => r.join(',')).join('\r\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = 'havendesk-report.csv';
    a.click();
    URL.revokeObjectURL(a.href);
    notify('Report exported as CSV.');
  };

  return (
    <ModuleFrame title="Reports & analytics" subtitle="Understand occupancy, room revenue and hotel operations." live={live}>
      <div className="panel report-filters">
        <label>From<input type="date" value={start} onChange={(e) => setStart(e.target.value)} /></label>
        <label>To<input type="date" value={end} onChange={(e) => setEnd(e.target.value)} /></label>
        <label>Date basis<select value={basis} onChange={(e) => setBasis(e.target.value)}>
          <option>Stay dates</option><option>Booking dates</option><option>Payment dates</option>
        </select></label>
        <button className="primary-button" onClick={exportCsv}>↓ Export CSV</button>
      </div>
      <div className="module-stats report-stats">
        {[['Occupancy', metrics.occupancy_rate ?? metrics.occupancy ?? '78%', metrics.occupancy_note || 'Occupied nights ÷ sellable nights'],
          ['ADR', metrics.adr ?? 'KES 18,420', 'Room revenue ÷ rooms sold'],
          ['RevPAR', metrics.revpar ?? 'KES 14,368', 'Room revenue ÷ available nights'],
          ['Outstanding', metrics.outstanding_balance ?? 'KES 37,400', 'Posted folio balances']]
          .map(([a, b, c]) => (
            <article className="module-stat" key={a}><span>{a}</span><strong>{b}</strong><small>{c}</small></article>
          ))}
      </div>
      <div className="report-grid">
        <section className="panel report-chart">
          <header className="panel-header"><div><h2>Occupancy by day</h2><p>{start} to {end} · {basis.toLowerCase()}</p></div><span className="pill pill-ready">KES</span></header>
          <div className="report-bars">
            {(metrics.weekly_occupancy || [58, 68, 82, 75, 92, 87, 72, 66, 78, 90, 84, 76]).map((entry, i) => {
              const value = typeof entry === 'number' ? entry : Number(entry.occupancy ?? entry.rate ?? 0);
              return <div key={i}><i style={{ height: value + '%' }} /><small>{entry.day || i + 1}</small></div>;
            })}
          </div>
        </section>
        <section className="panel report-notes">
          <h2>Metric definitions</h2>
          <p>Occupancy uses occupied room nights over sellable room nights. Rooms blocked for maintenance are excluded.</p>
          <p>ADR and RevPAR use room revenue. Pending payment attempts are not counted as collected funds.</p>
          <button className="text-link" onClick={() => notify(live ? 'Report date basis and selected period are sent to Django.' : 'Report figures are sample values until /api/reports/ is connected.')}>About these figures →</button>
        </section>
      </div>
    </ModuleFrame>
  );
}
