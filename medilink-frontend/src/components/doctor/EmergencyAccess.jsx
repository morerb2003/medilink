import { useState } from 'react';
import Button from '../common/Button.jsx';
import { validateHealthId } from '../../utils/validators';
import QRScanner from './QRScanner.jsx';

function EmergencyAccess({ onAccessByHealthId, onAccessByQr, isSubmitting }) {
  const [mode, setMode] = useState('healthId');
  const [healthId, setHealthId] = useState('');
  const [manualToken, setManualToken] = useState('');

  async function handleHealthIdSubmit(event) {
    event.preventDefault();
    if (!validateHealthId(healthId)) {
      return;
    }

    await onAccessByHealthId?.(healthId);
  }

  async function handleTokenSubmit(event) {
    event.preventDefault();
    if (!manualToken.trim()) {
      return;
    }

    await onAccessByQr?.(manualToken.trim());
  }

  return (
    <div className="surface-card space-y-5 p-6">
      <div>
        <h3 className="section-title">Emergency mode</h3>
        <p className="section-copy mt-1">
          Choose a direct Health ID lookup or scan the patient QR token when the patient cannot
          approve standard consent.
        </p>
      </div>

      <div className="inline-flex rounded-full border border-medilink-border bg-white p-1">
        {[
          { value: 'healthId', label: 'Health ID' },
          { value: 'qr', label: 'QR token' },
        ].map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setMode(item.value)}
            className={[
              'rounded-full px-4 py-2 text-sm font-semibold transition',
              mode === item.value
                ? 'bg-medilink-mint text-white'
                : 'text-medilink-muted hover:text-medilink-ink',
            ].join(' ')}
          >
            {item.label}
          </button>
        ))}
      </div>

      {mode === 'healthId' ? (
        <form className="space-y-4" onSubmit={handleHealthIdSubmit}>
          <label className="field-shell">
            <span className="field-label">14-digit Health ID</span>
            <input
              className="field-input"
              value={healthId}
              onChange={(event) => setHealthId(event.target.value)}
              placeholder="12345678901234"
            />
          </label>
          <Button type="submit" disabled={isSubmitting || !validateHealthId(healthId)}>
            {isSubmitting ? 'Accessing...' : 'Access emergency profile'}
          </Button>
        </form>
      ) : (
        <div className="space-y-4">
          <QRScanner enabled={mode === 'qr'} onScan={onAccessByQr} />
          <form className="space-y-4" onSubmit={handleTokenSubmit}>
            <label className="field-shell">
              <span className="field-label">Manual QR token fallback</span>
              <textarea
                className="field-input min-h-28"
                value={manualToken}
                onChange={(event) => setManualToken(event.target.value)}
                placeholder="Paste the signed QR token if the camera is unavailable."
              />
            </label>
            <Button type="submit" disabled={isSubmitting || !manualToken.trim()}>
              {isSubmitting ? 'Accessing...' : 'Submit token'}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}

export default EmergencyAccess;
