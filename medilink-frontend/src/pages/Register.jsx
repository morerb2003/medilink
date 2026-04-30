import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import heroImage from '../assets/hero.png';
import Button from '../components/common/Button.jsx';
import GlassBox from '../components/common/GlassBox.jsx';
import AnimatedPage from '../components/common/AnimatedPage.jsx';
import { NotificationContext } from '../context/NotificationContext.jsx';
import * as authService from '../services/authService';
import { validateEmail } from '../utils/validators';

function Register() {
  const notifications = useContext(NotificationContext);
  const [role, setRole] = useState('PATIENT');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formState, setFormState] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    healthId: '',
    abhaId: '',
    specialization: '',
    licenseNumber: '',
  });

  function updateField(event) {
    const { name, value } = event.target;
    setFormState((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!validateEmail(formState.email)) {
      notifications?.notifyError('Enter a valid email before creating the account.');
      return;
    }

    setIsSubmitting(true);

    try {
      await authService.register({
        ...formState,
        role,
      });
      notifications?.notifySuccess('Registration request submitted.');
    } catch (error) {
      notifications?.notifyError(
        error.response?.data?.message ||
          'Registration is scaffolded on the frontend, but the backend endpoint is not live yet.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AnimatedPage>
      <div className="grid min-h-screen bg-medilink-canvas lg:grid-cols-[1fr_minmax(0,680px)] overflow-hidden">
        {/* Left Side: Mockup Image */}
        <div className="relative hidden overflow-hidden lg:block">
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="h-full w-full"
          >
            <img
              src={heroImage}
              alt="MediLink onboarding"
              className="h-full w-full object-cover"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-tr from-medilink-mint/40 via-transparent to-medilink-coral/20 mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-l from-medilink-canvas to-transparent" />
        </div>

        {/* Right Side: Registration Form */}
        <div className="relative flex items-center justify-center px-8 py-12 lg:px-16 overflow-y-auto max-h-screen custom-scrollbar">
          <div className="w-full max-w-xl space-y-10">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="inline-block px-3 py-1 text-[11px] font-bold uppercase tracking-[0.4em] text-medilink-coral bg-medilink-coral/10 rounded-full mb-6">
                System Enrollment
              </span>
              <h1 className="text-4xl font-display font-bold leading-tight tracking-tight text-medilink-ink">
                Create your <span className="text-gradient">Professional Identity</span>
              </h1>
              <p className="section-copy mt-4 opacity-70">
                Join the unified healthcare network. Select your role to unlock specialized tools and encrypted data access.
              </p>
            </motion.div>

            <GlassBox className="!bg-white/40 shadow-2xl backdrop-blur-3xl border-white/50 !p-10">
              <form className="space-y-8" onSubmit={handleSubmit}>
                {/* Role Toggler */}
                <div className="flex flex-col gap-3">
                  <span className="field-label">Account Designation</span>
                  <div className="inline-flex rounded-2xl border border-medilink-border bg-medilink-canvas/50 p-1.5 w-full">
                    {['PATIENT', 'DOCTOR'].map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setRole(item)}
                        className={`flex-1 rounded-[0.9rem] py-3 text-sm font-bold transition-all duration-300 ${
                          role === item
                            ? 'bg-medilink-mint text-white shadow-lg shadow-medilink-mint/20'
                            : 'text-medilink-muted hover:text-medilink-ink'
                        }`}
                      >
                        {item === 'PATIENT' ? 'Patient Enrollment' : 'Doctor Credentials'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="field-shell">
                    <span className="field-label">Full Legal Name</span>
                    <input
                      className="field-input"
                      name="fullName"
                      placeholder="Dr. Sarah Connor"
                      value={formState.fullName}
                      onChange={updateField}
                      required
                    />
                  </div>

                  <div className="field-shell">
                    <span className="field-label">Verified Email</span>
                    <input
                      className="field-input"
                      type="email"
                      name="email"
                      placeholder="sarah@hospital.org"
                      value={formState.email}
                      onChange={updateField}
                      required
                    />
                  </div>

                  <div className="field-shell">
                    <span className="field-label">Secure Passkey</span>
                    <input
                      className="field-input"
                      type="password"
                      name="password"
                      placeholder="••••••••••••"
                      value={formState.password}
                      onChange={updateField}
                      required
                    />
                  </div>

                  <div className="field-shell">
                    <span className="field-label">Contact Number</span>
                    <input
                      className="field-input"
                      name="phone"
                      placeholder="+91 98765 43210"
                      value={formState.phone}
                      onChange={updateField}
                    />
                  </div>

                  <AnimatePresence mode="wait">
                    {role === 'PATIENT' ? (
                      <motion.div
                        key="patient-fields"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6"
                      >
                        <div className="field-shell">
                          <span className="field-label">MediLink Health ID</span>
                          <input
                            className="field-input"
                            name="healthId"
                            value={formState.healthId}
                            onChange={updateField}
                            placeholder="Unique username/ID"
                          />
                        </div>
                        <div className="field-shell">
                          <span className="field-label">ABHA ID (India)</span>
                          <input
                            className="field-input"
                            name="abhaId"
                            value={formState.abhaId}
                            onChange={updateField}
                            placeholder="14-digit ABHA number"
                          />
                        </div>
                      </motion.div>
                    ) : (
                      <>
                        <motion.div
                          key="specialization"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="field-shell"
                        >
                          <span className="field-label">Field of Practice</span>
                          <input
                            className="field-input"
                            name="specialization"
                            placeholder="Cardiology"
                            value={formState.specialization}
                            onChange={updateField}
                          />
                        </motion.div>
                        <motion.div
                          key="license"
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="field-shell"
                        >
                          <span className="field-label">Medical License No.</span>
                          <input
                            className="field-input"
                            name="licenseNumber"
                            placeholder="REG-1029384756"
                            value={formState.licenseNumber}
                            onChange={updateField}
                          />
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>

                <Button type="submit" className="w-full h-14 text-base premium-button shadow-xl shadow-medilink-mint/10" disabled={isSubmitting}>
                  {isSubmitting ? 'Registering...' : `Complete ${role === 'PATIENT' ? 'Patient' : 'Practitioner'} Setup`}
                </Button>

                <div className="pt-2 text-center">
                  <p className="text-sm text-medilink-muted">
                    Already a member of the network?{' '}
                    <Link className="font-bold text-medilink-mint hover:underline underline-offset-4" to="/login">
                      Access your portal
                    </Link>
                  </p>
                </div>
              </form>
            </GlassBox>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}

export default Register;
