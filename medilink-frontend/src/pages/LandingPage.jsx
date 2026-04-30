import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Activity, 
  Zap, 
  Users, 
  ArrowRight, 
  Heart,
  Globe,
  Lock,
  Sparkles
} from 'lucide-react';
import Button from '../components/common/Button';

function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-medilink-canvas relative overflow-hidden">
      {/* Decorative Neural Grid Background */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_50%)]" />
        <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-medilink-mint/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[150px]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-50 px-8 py-6 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-medilink-mint rounded-xl flex items-center justify-center shadow-lg shadow-medilink-mint/20">
            <Activity className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-display font-black text-medilink-ink tracking-tighter">MEDILINK</span>
        </div>
        <div className="hidden md:flex items-center gap-10">
          <a href="#features" className="text-sm font-bold text-medilink-muted hover:text-medilink-ink transition-colors">Network</a>
          <a href="#security" className="text-sm font-bold text-medilink-muted hover:text-medilink-ink transition-colors">Protocol</a>
          <Link to="/demo" className="text-sm font-bold text-medilink-muted hover:text-medilink-ink transition-colors">Live Simulation</Link>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-black text-medilink-ink hover:text-medilink-mint transition-colors px-6">LOGIN</Link>
          <Link to="/register">
            <Button className="!h-11 !px-8 shadow-xl shadow-medilink-mint/20">JOIN NETWORK</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 pt-20 pb-32 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-3 px-6 py-2 bg-white rounded-full border border-medilink-border shadow-xl shadow-medilink-mint/5 mb-10"
        >
          <Sparkles className="w-4 h-4 text-medilink-mint" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-medilink-mint">Next-Gen Patient Consent Protocol</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-7xl md:text-8xl font-display font-black text-medilink-ink leading-[0.9] tracking-tight mb-10"
        >
          Unified Health <br />
          <span className="bg-gradient-to-r from-medilink-mint to-teal-500 bg-clip-text text-transparent italic">Neural Grid.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-medilink-muted font-medium max-w-2xl leading-relaxed mb-12"
        >
          Own your medical narrative. Medilink centralizes your clinical data under an immutable consent layer, ensuring your records are available only when and where you decide.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-6"
        >
          <Link to="/register">
            <Button className="!h-16 !px-12 text-lg shadow-2xl shadow-medilink-mint/30 flex items-center gap-4">
              Initialize My Identity
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Link to="/demo">
            <button className="h-16 px-10 rounded-3xl border-2 border-medilink-border font-black text-medilink-ink hover:bg-white transition-all flex items-center gap-4 group">
              View Protocol Demo
              <Activity className="w-5 h-5 text-medilink-mint opacity-40 group-hover:opacity-100 transition-opacity" />
            </button>
          </Link>
        </motion.div>

        {/* Floating UI Elements Simulation */}
        <div className="absolute top-1/2 left-0 -translate-x-full hidden lg:block">
           <motion.div 
             animate={{ y: [0, -20, 0] }}
             transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
             className="glass-card !p-6 border-medilink-mint/20 rotate-12"
           >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-medilink-mint/20 flex items-center justify-center">
                  <ShieldCheck className="text-medilink-mint w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-black uppercase text-medilink-mint">Consent Active</p>
                  <p className="text-xs font-bold text-medilink-ink">Dr. Priya Sharma</p>
                </div>
              </div>
           </motion.div>
        </div>

        <div className="absolute bottom-20 right-0 translate-x-full hidden lg:block">
           <motion.div 
             animate={{ y: [0, 20, 0] }}
             transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
             className="glass-card !p-6 border-medilink-coral/20 -rotate-6"
           >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-medilink-coral/20 flex items-center justify-center">
                  <Zap className="text-medilink-coral w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-black uppercase text-medilink-coral">Emergency Access</p>
                  <p className="text-xs font-bold text-medilink-ink">Bypass Logged</p>
                </div>
              </div>
           </motion.div>
        </div>
      </main>

      {/* Feature Grid */}
      <section id="features" className="relative z-10 px-8 py-32 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-4xl font-display font-black text-medilink-ink tracking-tight uppercase">Network Capabilities</h2>
            <p className="text-medilink-muted font-bold tracking-[0.2em] text-[10px] uppercase">The infrastructure of modern healthcare</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              { icon: ShieldCheck, title: "Zero-Trust Consent", desc: "No hospital can access your data without a cryptographically signed consent token.", color: "medilink-mint" },
              { icon: Zap, title: "Break-Glass Bypass", desc: "Emergency protocols allow instant access while notifying your family and logging every second.", color: "medilink-coral" },
              { icon: Globe, title: "Universal Portability", desc: "Take your clinical narrative across any healthcare provider in the MediLink network.", color: "blue-500" },
              { icon: Lock, title: "AES-256 Security", desc: "Bank-grade encryption for every lab report, prescription, and imaging scan.", color: "medilink-ink" },
              { icon: Heart, title: "Wellness Tracking", desc: "Intelligent analytics for your daily vitals and medication adherence.", color: "medilink-coral" },
              { icon: Users, title: "Provider Verification", desc: "Strict verification for every doctor and hospital entering the network.", color: "medilink-mint" }
            ].map((f, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="p-10 rounded-[3rem] border border-medilink-border bg-medilink-canvas/50 hover:bg-white hover:shadow-2xl transition-all duration-500"
              >
                <div className={`w-14 h-14 rounded-2xl bg-${f.color}/10 flex items-center justify-center border border-${f.color}/20 mb-8`}>
                  <f.icon className={`text-${f.color} w-7 h-7`} />
                </div>
                <h3 className="text-xl font-display font-black text-medilink-ink mb-4">{f.title}</h3>
                <p className="text-medilink-muted font-medium leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="relative z-10 px-8 py-32 bg-medilink-ink text-white overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-medilink-mint/10 rounded-full blur-[150px]" />
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-7xl font-display font-black mb-10 tracking-tight leading-none">
            Ready to secure your <br /> clinical narrative?
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/register">
              <button className="h-16 px-12 bg-medilink-mint rounded-3xl font-black text-white hover:bg-teal-400 transition-all shadow-2xl shadow-medilink-mint/30 flex items-center gap-4">
                CREATE HEALTH IDENTITY
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
            <Link to="/login" className="text-sm font-black uppercase tracking-[0.3em] hover:text-medilink-mint transition-colors">Already registered? Log in</Link>
          </div>
        </div>
      </section>

      <footer className="relative z-10 px-8 py-12 border-t border-medilink-border bg-white flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <Activity className="text-medilink-mint w-5 h-5" />
          <span className="text-sm font-black text-medilink-ink tracking-widest uppercase">MEDILINK PROTOCOL © 2026</span>
        </div>
        <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-widest text-medilink-muted">
          <a href="#" className="hover:text-medilink-mint transition-colors">Privacy</a>
          <a href="#" className="hover:text-medilink-mint transition-colors">Terms</a>
          <a href="#" className="hover:text-medilink-mint transition-colors">ABDM Compliance</a>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
