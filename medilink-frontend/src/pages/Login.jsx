import { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import heroImage from '../assets/hero.png';
import Button from '../components/common/Button.jsx';
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
    <div className="grid min-h-screen bg-medilink-canvas lg:grid-cols-[minmax(0,560px)_1fr]">
      <div className="flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-lg space-y-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-medilink-mint">
              MediLink
            </p>
            <h1 className="mt-4 text-4xl">Bring consent, records, and emergency access into one workflow.</h1>
            <p className="section-copy mt-3">
              Sign in with the role that matches your MediLink account to continue into the
              operational dashboard.
            </p>
          </div>

          <form className="surface-card space-y-5 p-8" onSubmit={handleSubmit}>
            <label className="field-shell">
              <span className="field-label">Email</span>
              <input
                className="field-input"
                type="email"
                name="email"
                value={credentials.email}
                onChange={updateField}
                placeholder="doctor@hospital.in"
                required
              />
            </label>

            <label className="field-shell">
              <span className="field-label">Password</span>
              <input
                className="field-input"
                type="password"
                name="password"
                value={credentials.password}
                onChange={updateField}
                placeholder="Enter your password"
                required
              />
            </label>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </Button>

            <p className="text-sm text-medilink-muted">
              Need a new account?{' '}
              <Link className="font-semibold text-medilink-mint" to="/register">
                Create one here
              </Link>
              .
            </p>
          </form>
        </div>
      </div>

      <div className="relative hidden overflow-hidden lg:block">
        <img
          src={heroImage}
          alt="Clinical team reviewing health records"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-medilink-ink/55 via-medilink-ink/10 to-transparent" />
      </div>
    </div>
  );
}

export default Login;
