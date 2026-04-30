import { useEffect, useId, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, CameraOff, RefreshCw } from 'lucide-react';

function QRScanner({ enabled = true, onScan }) {
  const [status, setStatus] = useState('Preparing optical sensor...');
  const [hasError, setHasError] = useState(false);
  const scannerId = useId().replaceAll(':', '');
  const scannerRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    let activeScanner = null;
    let cancelled = false;

    async function startScanner() {
      // Small delay to ensure DOM is ready
      await new Promise(r => setTimeout(r, 100));
      
      const container = document.getElementById(scannerId);
      if (!container || cancelled) return;

      try {
        const { Html5Qrcode } = await import('html5-qrcode');
        if (cancelled) return;

        activeScanner = new Html5Qrcode(scannerId);
        await activeScanner.start(
          { facingMode: 'environment' },
          { 
            fps: 15, 
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0
          },
          (decodedText) => {
            setStatus('Identity Token Detected');
            onScan?.(decodedText);
          },
          () => {} // Silent failures for frame-by-frame
        );
        setStatus('Ready to scan Patient ID');
        setHasError(false);
      } catch (err) {
        console.error('QR Scanner Error:', err);
        setStatus('Hardware access denied or unavailable');
        setHasError(true);
      }
    }

    startScanner();

    return () => {
      cancelled = true;
      if (activeScanner) {
        activeScanner.stop()
          .catch(() => {})
          .finally(() => {
            try {
              activeScanner.clear();
            } catch (e) {}
          });
      }
    };
  }, [enabled, onScan, scannerId]);

  return (
    <div className="relative group">
      <div 
        id={scannerId} 
        className="overflow-hidden rounded-[2rem] border-2 border-dashed border-medilink-border bg-medilink-canvas/50 aspect-square flex items-center justify-center relative z-10"
      >
        <AnimatePresence>
          {hasError && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-3 text-medilink-coral p-8 text-center"
            >
              <CameraOff className="w-10 h-10 opacity-50" />
              <p className="text-xs font-bold uppercase tracking-widest leading-relaxed">
                Optical sensor <br /> offline
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Decorative scanning line effect */}
      {enabled && !hasError && (
        <motion.div 
          animate={{ top: ['10%', '90%', '10%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute left-4 right-4 h-0.5 bg-medilink-mint/50 blur-sm z-20 pointer-events-none"
        />
      )}

      <div className="mt-4 flex items-center gap-3 px-2">
        <div className={`w-2 h-2 rounded-full ${hasError ? 'bg-medilink-coral' : 'bg-medilink-mint'} animate-pulse`} />
        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-medilink-muted/80">
          {status}
        </p>
      </div>
    </div>
  );
}

export default QRScanner;
