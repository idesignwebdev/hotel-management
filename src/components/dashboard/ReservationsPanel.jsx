import { useNavigate } from 'react-router-dom';
import { useApp } from '../../store/appContext.jsx';
import { actionsFor } from '../../store/permissions.js';
import { formatDate, money } from '../../utils/formatters.js';
import SearchInput from '../common/SearchInput.jsx';
import Pagination from '../common/Pagination.jsx';

/**
 * Recent reservations table with inline search, status filter and pagination.
 */
export default function ReservationsPanel() {
  const navigate = useNavigate();
  const {
    visibleReservations, filteredReservations, query, setQuery, filter, setFilter,
    currentPage, setCurrentPage, pageCount, firstVisible, lastVisible,
    setToast, role,
  } = useApp();
  const canCreate = actionsFor('/reservations', role).includes('createReservation');

  return (
    <section className="panel reservations-panel" id="reservationsSection">
      <div className="panel-header reservations-heading">
        <div>
          <h2>Recent reservations</h2>
          <p>Keep track of the latest bookings at your property</p>
        </div>
        <div className="reservation-actions">
          <SearchInput value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search bookings" />
          <button className="select-button filter-button" onClick={() => setFilter((f) => (f === 'all' ? 'pending' : f === 'pending' ? 'confirmed' : 'all'))}>
            ☷ <span>{filter === 'all' ? 'Filter' : filter[0].toUpperCase() + filter.slice(1)}</span>
            <b className="down">⌄</b>
          </button>
          <button className="text-link desktop-view-all" onClick={() => navigate('/reservations')}>View all <span>→</span></button>
        </div>
      </div>

      <div className="table-scroll">
        <table>
          <thead>
            <tr><th>GUEST</th><th>ROOM TYPE</th><th>CHECK-IN</th><th>CHECK-OUT</th><th>STATUS</th><th>AMOUNT</th><th /></tr>
          </thead>
          <tbody>
            {visibleReservations.map((r) => (
              <tr key={r.id}>
                <td>
                  <div className="guest-cell">
                    <span className={`table-avatar ${r.color}`}>{r.initials}</span>
                    <span>{r.guest_name}</span>
                  </div>
                </td>
                <td><span className="room-type">{r.room_type}</span></td>
                <td>{formatDate(r.check_in)}</td>
                <td>{formatDate(r.check_out)}</td>
                <td><span className={`status-badge status-${r.status.toLowerCase().replaceAll(' ', '-')}`}>{r.status}</span></td>
                <td><span className="amount">{money(r.amount, r.currency)}</span></td>
                <td>{canCreate && <button className="row-more" aria-label={`More options for ${r.guest_name}`} onClick={() => setToast(`Reservation for ${r.guest_name}`)}>···</button>}</td>
              </tr>
            ))}
            {visibleReservations.length === 0 && (
              <tr><td colSpan="7" className="empty-state">No reservations match that search.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="table-footer">
        <span>Showing {firstVisible}–{lastVisible} of {filteredReservations.length} reservations</span>
        <Pagination currentPage={currentPage} pageCount={pageCount} onPrev={() => setCurrentPage((p) => Math.max(1, p - 1))} onNext={() => setCurrentPage((p) => Math.min(pageCount, p + 1))} />
      </div>
    </section>
  );
}
