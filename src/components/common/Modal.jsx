/**
 * Accessible modal backdrop. Clicking the backdrop closes the modal;
 * children provide their own header/close control.
 */
export default function Modal({ open = false, onClose, children }) {
  return (
    open ? (
      <div className="modal-backdrop open" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }} role="presentation">
        {children}
      </div>
    ) : null
  );
}
