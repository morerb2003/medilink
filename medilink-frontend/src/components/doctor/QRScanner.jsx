import { useEffect, useId, useState } from 'react';

function QRScanner({ enabled = true, onScan }) {
  const [status, setStatus] = useState('Preparing camera scanner...');
  const scannerId = useId().replaceAll(':', '');

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }

    let activeScanner = null;
    let cancelled = false;

    async function startScanner() {
      try {
        const { Html5Qrcode } = await import('html5-qrcode');
        if (cancelled) {
          return;
        }

        activeScanner = new Html5Qrcode(scannerId);
        await activeScanner.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 220, height: 220 } },
          (decodedText) => {
            setStatus('QR detected. Submitting token...');
            onScan?.(decodedText);
          },
          () => {},
        );
        setStatus('Point the camera at the patient QR code.');
      } catch {
        setStatus('Camera access is unavailable. Use the manual token field below.');
      }
    }

    startScanner();

    return () => {
      cancelled = true;

      if (activeScanner) {
        activeScanner
          .stop()
          .catch(() => {})
          .finally(() => {
            activeScanner.clear().catch(() => {});
          });
      }
    };
  }, [enabled, onScan, scannerId]);

  return (
    <div className="space-y-3">
      <div id={scannerId} className="overflow-hidden rounded-3xl border border-medilink-border" />
      <p className="text-sm text-medilink-muted">{status}</p>
    </div>
  );
}

export default QRScanner;
