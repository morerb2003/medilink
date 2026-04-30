import { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import heroImage from '../assets/hero.png';
import Button from '../components/common/Button.jsx';
import GlassBox from '../components/common/GlassBox.jsx';
import AnimatedPage from '../components/common/AnimatedPage.jsx';
import ImpactShowcase from '../components/common/ImpactShowcase.jsx';
import { NotificationContext } from '../context/NotificationContext.jsx';
import { useAuth } from '../hooks/useAuth';

const HOME_BY_ROLE = {
  PATIENT: '/patient',
  DOCTOR: '/doctor',
  ADMIN: '/admin',
};

function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const notifications = useContext(NotificationContext);
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(event) {
    const { name, value } = event.target;
    setCredentials((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await login(credentials);
      notifications?.notifySuccess('You are now signed in to MediLink.');
      const nextRoute = location.state?.from?.pathname || HOME_BY_ROLE[response.role] || '/';
      navigate(nextRoute, { replace: true });
    } catch (error) {
      notifications?.notifyError(
        error.response?.data?.message || 'Login failed. Check the backend and credentials.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-medilink-canvas overflow-y-auto custom-scrollbar">
        <div className="grid lg:grid-cols-[minmax(0,600px)_1fr] border-b border-medilink-border/30">
          <div className="flex flex-col items-center justify-center px-8 py-12 lg:px-16">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-md"
            >
              <div className="mb-12">
                <span className="inline-block px-3 py-1 text-[11px] font-bold uppercase tracking-[0.4em] text-medilink-mint bg-medilink-mint/10 rounded-full mb-6">
                  MediLink Portal
                </span>
                <h1 className="text-5xl font-display font-bold leading-tight tracking-tight text-medilink-ink">
                  Secure access to <br />
                  <span className="text-gradient">Health Intelligence</span>
                </h1>
                <p className="section-copy mt-6 opacity-70">
                  Manage medical records, verify consent, and coordinate emergency care through our encrypted clinical network.
                </p>
              </div>

              <GlassBox className="!bg-white/40 shadow-2xl backdrop-blur-3xl border-white/50">
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="field-shell">
                    <span className="field-label">Medical ID / Email</span>
                    <input
                      className="field-input"
                      type="email"
                      name="email"
                      value={credentials.email}
                      onChange={updateField}
                      placeholder="name@healthcare.org"
                      required
                    />
                  </div>

                  <div className="field-shell">
                    <span className="field-label">Access Key</span>
                    <input
                      className="field-input"
                      type="password"
                      name="password"
                      value={credentials.password}
                      onChange={updateField}
                      placeholder="Enter your password"
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full premium-button h-14 text-base" disabled={isSubmitting}>
                    {isSubmitting ? 'Verifying Identity...' : 'Authorize Access'}
                  </Button>

                  <div className="pt-4 text-center">
                    <p className="text-sm text-medilink-muted">
                      New to the network?{' '}
                      <Link className="font-bold text-medilink-mint hover:underline underline-offset-4" to="/register">
                        Request Enrollment
                      </Link>
                    </p>
                  </div>
                </form>
              </GlassBox>
            </motion.div>
          </div>

          <div className="relative hidden overflow-hidden lg:block">
            <motion.div
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.5 }}
              className="h-full w-full"
            >
              <img
                src={heroImage}
                alt="Healthcare professionals"
                className="h-full w-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-1000"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-tr from-medilink-mint/20 via-transparent to-medilink-gold/10 mix-blend-overlay" />
            <div className="absolute inset-0 bg-gradient-to-t from-medilink-canvas via-transparent to-transparent" />
            
            <div className="absolute bottom-12 left-12 right-12">
              <GlassBox className="bg-white/20 border-white/30 backdrop-blur-lg p-6 max-w-sm">
                <p className="text-white text-sm font-medium leading-relaxed italic">
                  "MediLink has reduced our emergency data retrieval time by 85%, ensuring critical patient info is available when seconds count."
                </p>
                <p className="text-white/70 text-xs mt-3 font-bold uppercase tracking-widest">
                  — Dr. Sarah Chen, ICU Lead
                </p>
              </GlassBox>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-8 py-20">
          <ImpactShowcase />
        </div>
      </div>
    </AnimatedPage>
  );
}

export default Login;
