/**
 * Toast notification. Lifetime (auto-dismiss after 2.8s) is handled in
 * appContext; this component only renders the current toast message.
 */
export default function Toast({ message }) {
  if (!message) return null;
  return (
    <div className="toast show" role="status" aria-live="polite">
      <span>✓</span>
      <b>{message}</b>
    </div>
  );
}
