/**
 * Dashboard metric card.
 */
export default function StatCard({ label, value, unit, children }) {
  return (
    <article className="stat-card">
      <div className="stat-top">{label}</div>
      <div className="stat-value">{value}{unit ? <span className="unit">{unit}</span> : null}</div>
      <div className="stat-foot">{children}</div>
    </article>
  );
}
