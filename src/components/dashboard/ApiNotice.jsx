import { useApp } from '../../store/appContext.jsx';

/**
 * Shown when the Django API could not be reached for one or more sections.
 */
export default function ApiNotice() {
  const { apiMessage, refresh } = useApp();
  if (!apiMessage) return null;
  return (
    <div className="api-notice">
      <span>ⓘ</span>
      {apiMessage}
      <button onClick={refresh}>Retry connection</button>
    </div>
  );
}
