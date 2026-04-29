import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import Button from '../common/Button.jsx';

function QRCodeDisplay({ qrToken, qrImage }) {
  const [generatedImage, setGeneratedImage] = useState(null);

  useEffect(() => {
    let ignore = false;

    if (qrImage) {
      return undefined;
    }

    if (!qrToken) {
      return undefined;
    }

    QRCode.toDataURL(qrToken, {
      width: 280,
      margin: 1,
    }).then((dataUrl) => {
      if (!ignore) {
        setGeneratedImage(dataUrl);
      }
    });

    return () => {
      ignore = true;
    };
  }, [qrImage, qrToken]);

  const displayImage = qrImage || generatedImage;

  function downloadQrCode() {
    if (!displayImage) {
      return;
    }

    const link = document.createElement('a');
    link.href = displayImage;
    link.download = 'medilink-emergency-qr.png';
    link.click();
  }

  return (
    <div className="surface-card flex flex-col items-center gap-5 p-6 text-center">
      <div>
        <h3 className="section-title">Emergency QR</h3>
        <p className="section-copy mt-1">
          Print this or keep it on the lock screen so emergency staff can pull the minimum
          life-saving profile when the patient cannot speak for themselves.
        </p>
      </div>

      {displayImage ? (
        <img
          src={displayImage}
          alt="Emergency QR code"
          className="rounded-3xl border border-medilink-border bg-white p-4"
        />
      ) : (
        <div className="rounded-3xl border border-dashed border-medilink-border px-8 py-16 text-sm text-medilink-muted">
          Generate a QR code to view it here.
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-3">
        <Button onClick={downloadQrCode} disabled={!displayImage}>
          Download QR
        </Button>
      </div>
    </div>
  );
}

export default QRCodeDisplay;
