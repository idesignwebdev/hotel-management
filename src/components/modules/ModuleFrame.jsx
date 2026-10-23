/**
 * Standard module page header: title, subtitle, action button and a demo
 * note when the Django endpoint is not yet connected.
 */
export default function ModuleFrame({ title, subtitle, action, onAction, live, previewMessage, children }) {
  return (
    <>
      <section className="module-heading">
        <div>
          <div className="eyebrow"><span className="live-dot" /> {live ? 'CONNECTED WORKSPACE' : 'WORKSPACE PREVIEW'}</div>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
        {action && onAction && <button className="primary-button" onClick={onAction}><span>＋</span>{action}</button>}
      </section>
      {!live && <div className="module-demo-note">ⓘ &nbsp; {previewMessage || 'Sample data is shown until this Django API endpoint is available. Demo changes stay in this browser.'}</div>}
      {children}
    </>
  );
}
