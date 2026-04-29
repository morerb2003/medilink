import { NavLink } from 'react-router-dom';
import Button from './Button.jsx';
import Badge from './Badge.jsx';
import { useAuth } from '../../hooks/useAuth';
import { formatRole } from '../../utils/formatters';

const LINKS_BY_ROLE = {
  PATIENT: [
    { to: '/patient', label: 'Dashboard' },
    { to: '/patient/records', label: 'Records' },
    { to: '/patient/consent', label: 'Consent' },
    { to: '/patient/qr', label: 'QR' },
  ],
  DOCTOR: [
    { to: '/doctor', label: 'Dashboard' },
    { to: '/doctor/emergency', label: 'Emergency' },
    { to: '/doctor/history', label: 'Access history' },
  ],
  ADMIN: [
    { to: '/admin', label: 'Dashboard' },
    { to: '/admin/users', label: 'Manage users' },
    { to: '/admin/audit-logs', label: 'Audit logs' },
  ],
};

function Navbar() {
  const { role, logout } = useAuth();
  const links = LINKS_BY_ROLE[role] || [];

  return (
    <header className="border-b border-medilink-border/80 bg-white/75 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4">
        <div className="flex items-center gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-medilink-mint">
              MediLink
            </p>
            <h1 className="text-lg font-semibold">Clinical access control</h1>
          </div>
          {role ? <Badge tone="success">{formatRole(role)}</Badge> : null}
        </div>

        <nav className="hidden items-center gap-4 lg:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                [
                  'rounded-full px-3 py-2 text-sm font-medium transition',
                  isActive
                    ? 'bg-medilink-mintSoft text-medilink-mint'
                    : 'text-medilink-muted hover:text-medilink-ink',
                ].join(' ')
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <Button variant="ghost" onClick={logout}>
          Log out
        </Button>
      </div>
    </header>
  );
}

export default Navbar;
