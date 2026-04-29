import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import heroImage from '../assets/hero.png';
import Button from '../components/common/Button.jsx';
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
    <div className="grid min-h-screen bg-medilink-canvas lg:grid-cols-[1fr_minmax(0,620px)]">
      <div className="relative hidden overflow-hidden lg:block">
        <img
          src={heroImage}
          alt="MediLink onboarding"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-medilink-mint/55 via-transparent to-medilink-coral/25" />
      </div>

      <div className="flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-xl space-y-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-medilink-coral">
              New workspace
            </p>
            <h1 className="mt-4 text-4xl">Create the right role-first account.</h1>
            <p className="section-copy mt-3">
              The form shifts between patient and doctor onboarding so the dashboard starts with
              the right data shape.
            </p>
          </div>

          <form className="surface-card space-y-5 p-8" onSubmit={handleSubmit}>
            <div className="inline-flex rounded-full border border-medilink-border bg-white p-1">
              {['PATIENT', 'DOCTOR'].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setRole(item)}
                  className={[
                    'rounded-full px-4 py-2 text-sm font-semibold transition',
                    role === item
                      ? 'bg-medilink-mint text-white'
                      : 'text-medilink-muted hover:text-medilink-ink',
                  ].join(' ')}
                >
                  {item === 'PATIENT' ? 'Patient' : 'Doctor'}
                </button>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="field-shell">
                <span className="field-label">Full name</span>
                <input
                  className="field-input"
                  name="fullName"
                  value={formState.fullName}
                  onChange={updateField}
                  required
                />
              </label>

              <label className="field-shell">
                <span className="field-label">Email</span>
                <input
                  className="field-input"
                  type="email"
                  name="email"
                  value={formState.email}
                  onChange={updateField}
                  required
                />
              </label>

              <label className="field-shell">
                <span className="field-label">Password</span>
                <input
                  className="field-input"
                  type="password"
                  name="password"
                  value={formState.password}
                  onChange={updateField}
                  required
                />
              </label>

              <label className="field-shell">
                <span className="field-label">Phone</span>
                <input
                  className="field-input"
                  name="phone"
                  value={formState.phone}
                  onChange={updateField}
                />
              </label>

              {role === 'PATIENT' ? (
                <label className="field-shell md:col-span-2">
                  <span className="field-label">Health ID</span>
                  <input
                    className="field-input"
                    name="healthId"
                    value={formState.healthId}
                    onChange={updateField}
                    placeholder="14-digit Ayushman Bharat Health ID"
                  />
                </label>
              ) : (
                <>
                  <label className="field-shell">
                    <span className="field-label">Specialization</span>
                    <input
                      className="field-input"
                      name="specialization"
                      value={formState.specialization}
                      onChange={updateField}
                    />
                  </label>
                  <label className="field-shell">
                    <span className="field-label">License number</span>
                    <input
                      className="field-input"
                      name="licenseNumber"
                      value={formState.licenseNumber}
                      onChange={updateField}
                    />
                  </label>
                </>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : `Create ${role.toLowerCase()} account`}
            </Button>

            <p className="text-sm text-medilink-muted">
              Already registered?{' '}
              <Link className="font-semibold text-medilink-mint" to="/login">
                Return to login
              </Link>
              .
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
