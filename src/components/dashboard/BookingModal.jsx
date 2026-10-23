import { useApp } from '../../store/appContext.jsx';
import Modal from '../common/Modal.jsx';

/**
 * Create-reservation dialog. Submits to the Django API and falls back to
 * demo state when the backend is unavailable (handled in appContext).
 */
export default function BookingModal() {
  const { modalOpen, setModalOpen, submitReservation, saving, today } = useApp();

  if (!modalOpen) return null;

  const isToday = (value) => new Intl.DateTimeFormat('en-CA').format(new Date(Date.now() + value * 86400000));

  return (
    <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
      <section className="booking-modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
        <div className="modal-top">
          <span className="modal-mark">＋</span>
          <button onClick={() => setModalOpen(false)} aria-label="Close">×</button>
        </div>
        <h2 id="modalTitle">Create a reservation</h2>
        <p className="modal-intro">Add a new guest booking to Haven House.</p>

        <form onSubmit={submitReservation}>
          <label>Guest full name<input name="guest_name" placeholder="e.g. Nia Kamau" required /></label>
          <div className="form-row">
            <label>Room type<select name="room_type">
              <option>Deluxe King</option><option>Garden Room</option><option>Deluxe Twin</option><option>Ocean Suite</option>
            </select></label>
            <label>Number of guests<select name="guests" defaultValue="2">
              <option value="1">1 guest</option><option value="2">2 guests</option><option value="3">3 guests</option><option value="4">4 guests</option>
            </select></label>
          </div>
          <div className="form-row">
            <label>Check-in<input name="check_in" type="date" defaultValue={today} required /></label>
            <label>Check-out<input name="check_out" type="date" defaultValue={isToday(3)} required /></label>
          </div>
          <label>Email address<input name="email" type="email" placeholder="guest@example.com" /></label>
          <div className="modal-actions">
            <button type="button" className="cancel-button" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" className="primary-button" disabled={saving}>{saving ? 'Saving…' : <>Create reservation <span>→</span></>}</button>
          </div>
        </form>
      </section>
    </Modal>
  );
}
