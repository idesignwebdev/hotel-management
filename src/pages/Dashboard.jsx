import { useApp } from '../store/appContext.jsx';
import WelcomeRow from '../components/dashboard/WelcomeRow.jsx';
import ApiNotice from '../components/dashboard/ApiNotice.jsx';
import StatsGrid from '../components/dashboard/StatsGrid.jsx';
import OccupancyPanel from '../components/dashboard/OccupancyPanel.jsx';
import ArrivalsPanel from '../components/dashboard/ArrivalsPanel.jsx';
import ReservationsPanel from '../components/dashboard/ReservationsPanel.jsx';
import BookingModal from '../components/dashboard/BookingModal.jsx';
import PageFooter from '../components/layout/PageFooter.jsx';
import Toast from '../components/common/Toast.jsx';

/**
 * Dashboard route. Renders welcome row, metrics, occupancy/arrivals panels and
 * the reservations table. Falls back to sample data when the Django API is
 * unavailable — connectivity state lives in appContext.
 */
export default function Dashboard() {
  const { toast, setModalOpen } = useApp();

  return (
    <>
      <WelcomeRow />
      <ApiNotice />

      <StatsGrid />

      <section className="dashboard-grid">
        <OccupancyPanel />
        <ArrivalsPanel />
      </section>

      <ReservationsPanel />

      <PageFooter />

      <BookingModal />
      <Toast message={toast} />
    </>
  );
}
