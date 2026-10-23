/**
 * Prev / Next pagination with a centered page indicator.
 */
export default function Pagination({ currentPage, pageCount, onPrev, onNext }) {
  return (
    <div className="pagination">
      <button aria-label="Previous page" disabled={currentPage <= 1} onClick={onPrev}>←</button>
      <button className="current-page" aria-current="page">{currentPage} / {pageCount}</button>
      <button aria-label="Next page" disabled={currentPage >= pageCount} onClick={onNext}>→</button>
    </div>
  );
}
