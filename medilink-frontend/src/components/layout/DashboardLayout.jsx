import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  FileText, 
  ShieldCheck, 
  QrCode, 
  LogOut, 
  User,
  Activity,
  AlertTriangle,
  History,
  Menu,
  X,
  Building2,
  Users
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useState } from 'react';
import ProfileOverlay from './ProfileOverlay';

const DashboardLayout = ({ children, role = 'patient' }) => {
  const { logout, userId } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = {
    patient: [
      { name: 'Dashboard', path: '/patient', icon: LayoutDashboard },
      { name: 'Records', path: '/patient/records', icon: FileText },
      { name: 'Consents', path: '/patient/consents', icon: ShieldCheck },
      { name: 'Digital ID', path: '/patient/qr', icon: QrCode },
    ],
    doctor: [
      { name: 'Portal', path: '/doctor', icon: LayoutDashboard },
      { name: 'Patients', path: '/doctor/records', icon: User },
      { name: 'Emergency', path: '/doctor/emergency', icon: AlertTriangle },
      { name: 'Audit', path: '/doctor/history', icon: History },
    ],
    admin: [
      { name: 'Ops Center', path: '/admin', icon: Activity },
      { name: 'Organizations', path: '/admin/organizations', icon: Building2 },
      { name: 'User Directory', path: '/admin/users', icon: Users },
      { name: 'System Audit', path: '/admin/audit', icon: History },
    ]
  };

  const currentNav = navItems[role] || [];

  return (
    <div className="flex min-h-screen bg-medilink-canvas text-medilink-ink selection:bg-medilink-mint/30">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-80 flex-col fixed inset-y-0 z-50 p-6">
        <div className="flex flex-col h-full glass-card !rounded-[3rem] border-white/40 shadow-2xl overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
          
          <div className="p-10 relative z-10">
            <div className="flex items-center gap-4 mb-14">
              <div className="w-12 h-12 bg-gradient-to-tr from-medilink-mint to-teal-400 rounded-2xl flex items-center justify-center shadow-xl shadow-medilink-mint/30 rotate-3 group-hover:rotate-0 transition-transform">
                <Activity className="text-white w-7 h-7" />
              </div>
              <div>
                <span className="text-2xl font-display font-black tracking-tighter block leading-none">MEDILINK</span>
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-medilink-mint block mt-1">Control Center</span>
              </div>
            </div>

            <nav className="space-y-3">
              {currentNav.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/patient' || item.path === '/doctor' || item.path === '/admin'}
                  className={({ isActive }) => `
                    group flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-500 font-bold text-sm relative overflow-hidden
                    ${isActive 
                      ? 'bg-medilink-mint text-white shadow-2xl shadow-medilink-mint/30 scale-[1.02]' 
                      : 'text-medilink-muted/80 hover:bg-white/50 hover:text-medilink-mint'}
                  `}
                >
                  {({ isActive }) => (
                    <>
                      <item.icon className={`w-5 h-5 transition-transform duration-500 group-hover:scale-110 ${isActive ? 'rotate-0' : 'opacity-70 group-hover:opacity-100'}`} />
                      <span>{item.name}</span>
                      {isActive && (
                        <motion.div 
                          layoutId="sidebar-active"
                          className="absolute left-0 w-1.5 h-6 bg-white rounded-r-full" 
                        />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="mt-auto p-8 relative z-10">
            <div className="glass bg-white/30 rounded-3xl p-6 mb-6">
              <p className="text-[10px] font-black uppercase tracking-widest text-medilink-mint mb-2">Network Status</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold opacity-70">Encrypted Cloud Active</span>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-4 px-6 py-4 w-full rounded-2xl text-medilink-coral/80 hover:bg-medilink-coralSoft hover:text-medilink-coral transition-all duration-300 font-bold text-sm group"
            >
              <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Terminate Session</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-80">
        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-medilink-canvas/80 backdrop-blur-md px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="lg:hidden w-10 h-10 bg-medilink-mint rounded-xl flex items-center justify-center" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="text-white w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-medilink-muted/50 mb-1">Current Portal</h4>
              <p className="text-lg font-bold text-medilink-ink flex items-center gap-2 capitalize">
                {role} Environment <span className="w-1.5 h-1.5 rounded-full bg-medilink-mint" />
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-sm font-black text-medilink-ink">Authenticated Hub</span>
              <span className="text-[10px] font-bold text-medilink-muted/60 uppercase tracking-widest">ID: {userId?.slice(0,8)}...</span>
            </div>
            <div 
              onClick={() => setIsProfileOpen(true)}
              className="w-12 h-12 rounded-2xl bg-white border border-medilink-border shadow-sm flex items-center justify-center hover:shadow-md hover:border-medilink-mint/50 transition-all cursor-pointer group"
            >
              <User className="text-medilink-muted group-hover:text-medilink-mint w-6 h-6 transition-colors" />
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="px-8 pb-12">
          <div className="max-w-[1400px] mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Drawer (simplified for brevity) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-medilink-ink/40 backdrop-blur-sm lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-80 h-full bg-white p-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Mobile nav content similar to desktop... */}
              <div className="flex justify-between items-center mb-10">
                <span className="font-display font-black text-xl">MEDILINK</span>
                <X className="w-6 h-6" onClick={() => setIsMobileMenuOpen(false)} />
              </div>
              <nav className="space-y-4">
                {currentNav.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) => `
                      flex items-center gap-4 p-5 rounded-2xl font-bold transition-all
                      ${isActive ? 'bg-medilink-mint text-white shadow-lg shadow-medilink-mint/20' : 'hover:bg-medilink-mintSoft text-medilink-muted'}
                    `}
                  >
                    <item.icon className="w-6 h-6" />
                    <span className="text-lg">{item.name}</span>
                  </NavLink>
                ))}
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isProfileOpen && (
          <ProfileOverlay 
            isOpen={isProfileOpen} 
            onClose={() => setIsProfileOpen(false)} 
            userId={userId}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardLayout;
