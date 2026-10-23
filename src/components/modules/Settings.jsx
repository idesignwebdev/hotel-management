import { useEffect, useState } from 'react';
import { hotelApi } from '../../api/index.js';
import ModuleFrame from './ModuleFrame.jsx';

/**
 * Hotel settings page. Syncs with /api/settings/ when available, otherwise
 * previews are stored in localStorage only.
 */
export default function Settings({ notify }) {
  const [saved, setSaved] = useState(() => {
    try { return JSON.parse(localStorage.getItem('havendesk:settings') || '{}'); } catch { return {}; }
  });
  const [live, setLive] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    hotelApi.getModule('Settings')
      .then((payload) => { if (active) { setSaved((current) => ({ ...current, ...(payload?.settings || payload?.data || payload || {}) })); setLive(true); } })
      .catch(() => { if (active) setLive(false); });
    return () => { active = false; };
  }, []);

  const change = (e) => setSaved((v) => ({ ...v, [e.target.name]: e.target.value }));

  const save = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    setSaving(true);
    try {
      if (live) { await hotelApi.saveSettings(data); notify('Settings saved to the hotel system.'); }
      else { localStorage.setItem('havendesk:settings', JSON.stringify(data)); notify('Settings saved in this browser preview.'); }
      setSaved(data);
    } catch (error) {
      notify('Server did not save settings: ' + error.message + '. Your entered values remain available to retry.');
    } finally { setSaving(false); }
  };

  return (
    <ModuleFrame title="Hotel settings" subtitle="Manage property identity, operating rules and system configuration." live={live}>
      <div className="settings-layout">
        <nav className="settings-tabs">
          <a href="#property">Property profile</a>
          <a href="#operations">Operations</a>
          <a href="#staff">Staff & roles</a>
          <a href="#integrations">Integrations</a>
        </nav>
        <form className="panel settings-form" onSubmit={save}>
          <section id="property">
            <h2>Property profile</h2>
            <p>Details shown on invoices and operational screens.</p>
            <div className="settings-grid">
              <label>Hotel name<input name="hotel" value={saved.hotel ?? 'Haven House Hotel'} onChange={change} /></label>
              <label>Contact email<input name="email" type="email" value={saved.email ?? 'frontdesk@havenhouse.example'} onChange={change} /></label>
              <label>Timezone<select name="timezone" value={saved.timezone ?? 'Africa/Nairobi'} onChange={change}>
                <option>Africa/Nairobi</option><option>UTC</option>
              </select></label>
              <label>Currency<select name="currency" value={saved.currency ?? 'KES'} onChange={change}>
                <option>KES</option><option>USD</option><option>EUR</option>
              </select></label>
            </div>
          </section>
          <section id="operations">
            <h2>Operating rules</h2>
            <p>Local times and policies used by front desk workflows.</p>
            <div className="settings-grid">
              <label>Check-in time<input type="time" name="checkin" value={saved.checkin ?? '14:00'} onChange={change} /></label>
              <label>Check-out time<input type="time" name="checkout" value={saved.checkout ?? '10:00'} onChange={change} /></label>
              <label>Default tax (%)<input type="number" name="tax" min="0" value={saved.tax ?? '16'} onChange={change} /></label>
              <label>Cancellation policy<select name="cancellation" value={saved.cancellation ?? '24 hours'} onChange={change}>
                <option>24 hours</option><option>48 hours</option><option>Non-refundable</option>
              </select></label>
            </div>
          </section>
          <section id="staff">
            <h2>Staff & permissions</h2>
            <p>Use individual accounts and role-based access. The Django API must enforce permissions.</p>
            <span className="pill pill-ready">Server-side permission checks required</span>
          </section>
          <section id="integrations">
            <h2>Integrations</h2>
            <p>Payment provider credentials must stay on the server, never in browser storage.</p>
            <span className="pill pill-partial">M-Pesa · Not configured</span>
            <button type="button" className="text-link" onClick={() => notify('Configure payment credentials in Django environment variables.')}>Integration guidance →</button>
          </section>
          <div className="settings-actions">
            <span>{live ? 'Settings synced with Django.' : 'Preview settings are stored in this browser.'}</span>
            <button className="primary-button" disabled={saving}>{saving ? 'Saving…' : 'Save settings'}</button>
          </div>
        </form>
      </div>
    </ModuleFrame>
  );
}
