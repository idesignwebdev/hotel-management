import { useApp } from '../store/appContext.jsx';
import ReservationsPanel from '../components/dashboard/ReservationsPanel.jsx';
import Toast from '../components/common/Toast.jsx';

/**
 * Reservations page — full page view at /reservations.
 * Renders the reservations table with search, status filter and pagination.
 */
export default function Reservations() {
  const { toast } = useApp();

  return (
    <div className="reservations-page">
      <div className="page-header">
        <h1>Reservations</h1>
        <p>Keep track of the latest bookings at your property</p>
      </div>
      <ReservationsPanel />
      <Toast message={toast} />
    </div>
  );
}
