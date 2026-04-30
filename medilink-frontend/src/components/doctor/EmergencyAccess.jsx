import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, QrCode, Search, Terminal, Clock } from 'lucide-react';
import Button from '../common/Button.jsx';
import GlassBox from '../common/GlassBox.jsx';
import { validateHealthId } from '../../utils/validators';
import QRScanner from './QRScanner.jsx';

function EmergencyAccess({ onAccessByHealthId, onAccessByQr, isSubmitting }) {
  const [mode, setMode] = useState('healthId');
  const [healthId, setHealthId] = useState('');
  const [manualToken, setManualToken] = useState('');
  const [reason, setReason] = useState('');

  async function handleHealthIdSubmit(event) {
    event.preventDefault();
    if (!validateHealthId(healthId) || !reason.trim()) return;
    await onAccessByHealthId?.(healthId, reason);
  }

  async function handleTokenSubmit(event) {
    event.preventDefault();
    if (!manualToken.trim() || !reason.trim()) return;
    await onAccessByQr?.(manualToken.trim(), reason);
  }

  return (
    <GlassBox className="!p-10 border-medilink-coral/20 bg-white/40 shadow-2xl shadow-medilink-coral/5">
      <div className="mb-10 flex items-center gap-5">
        <div className="w-14 h-14 rounded-2xl bg-medilink-coral/10 flex items-center justify-center">
          <ShieldAlert className="text-medilink-coral w-8 h-8" />
        </div>
        <div>
          <h3 className="text-2xl font-display font-black text-medilink-ink tracking-tight uppercase">Critical Override</h3>
          <p className="text-medilink-muted text-sm font-bold opacity-70 mt-1 uppercase tracking-widest">Emergency Patient Access</p>
        </div>
      </div>

      <div className="mb-10 space-y-6">
        <div className="field-shell !bg-medilink-coral/5 border-medilink-coral/20">
          <span className="field-label text-medilink-coral">Clinical Justification (Mandatory)</span>
          <textarea
            className="field-input !h-24 py-3 placeholder:text-medilink-coral/30"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g., Patient unconscious after RTA, immediate vitals required..."
            required
          />
        </div>
        
        <div className="flex items-center gap-3 px-5 py-3 bg-amber-50 border border-amber-200 rounded-xl">
          <Clock className="w-4 h-4 text-amber-600" />
          <p className="text-[10px] font-black uppercase tracking-widest text-amber-700">
            Override grants a 30-minute encrypted session only
          </p>
        </div>
      </div>

      <div className="inline-flex rounded-2xl border border-medilink-border bg-medilink-canvas/50 p-1.5 w-full mb-10">
        {[
          { value: 'healthId', label: 'Health ID Search', icon: Search },
          { value: 'qr', label: 'Optical Token Scan', icon: QrCode },
        ].map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setMode(item.value)}
            className={`flex-1 flex items-center justify-center gap-3 rounded-[0.9rem] py-3.5 text-sm font-bold transition-all duration-300 ${
              mode === item.value
                ? 'bg-medilink-coral text-white shadow-lg shadow-medilink-coral/20'
                : 'text-medilink-muted hover:text-medilink-ink'
            }`}
          >
            <item.icon className="w-4 h-4" />
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {mode === 'healthId' ? (
          <motion.form 
            key="healthId"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-6" 
            onSubmit={handleHealthIdSubmit}
          >
            <div className="field-shell">
              <span className="field-label">14-Digit Universal Health ID</span>
              <div className="relative">
                <input
                  className="field-input !pl-12 !h-16 text-lg font-bold tracking-widest"
                  value={healthId}
                  onChange={(event) => setHealthId(event.target.value)}
                  placeholder="0000 0000 0000 00"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-medilink-muted opacity-40 w-5 h-5" />
              </div>
            </div>
            <Button 
              type="submit" 
              variant="danger"
              className="w-full premium-button h-16 text-base"
              disabled={isSubmitting || !validateHealthId(healthId)}
            >
              {isSubmitting ? 'Bypassing Security...' : 'Request Emergency Profile'}
            </Button>
          </motion.form>
        ) : (
          <motion.div 
            key="qr"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="space-y-8"
          >
            <QRScanner enabled={mode === 'qr'} onScan={onAccessByQr} />
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-medilink-border/50" /></div>
              <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.4em] text-medilink-muted/40"><span className="bg-white/40 backdrop-blur-xl px-4">Manual Override</span></div>
            </div>

            <form className="space-y-6" onSubmit={handleTokenSubmit}>
              <div className="field-shell">
                <span className="field-label">Signed Access Token</span>
                <div className="relative">
                  <textarea
                    className="field-input !pl-12 min-h-28 text-xs font-mono py-4"
                    value={manualToken}
                    onChange={(event) => setManualToken(event.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  />
                  <Terminal className="absolute left-4 top-5 text-medilink-muted opacity-40 w-5 h-5" />
                </div>
              </div>
              <Button 
                type="submit" 
                variant="danger"
                className="w-full premium-button h-14"
                disabled={isSubmitting || !manualToken.trim()}
              >
                {isSubmitting ? 'Verifying Token...' : 'Inject Token'}
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassBox>
  );
}

export default EmergencyAccess;
