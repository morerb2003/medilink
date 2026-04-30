import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const LINKS_BY_ROLE = {
  PATIENT: [
    { to: '/patient', label: 'Overview' },
    { to: '/patient/records', label: 'My records' },
    { to: '/patient/consents', label: 'Consent requests' },
    { to: '/patient/qr', label: 'Generate QR' },
  ],
  DOCTOR: [
    { to: '/doctor', label: 'Overview' },
    { to: '/doctor/emergency', label: 'Emergency access' },
    { to: '/doctor/history', label: 'Access history' },
  ],
  ADMIN: [
    { to: '/admin', label: 'Overview' },
    { to: '/admin/users', label: 'Manage users' },
    { to: '/admin/audit', label: 'Audit logs' },
    { to: '/admin/emergency-logs', label: 'Emergency logs' },
  ],
};

function Sidebar() {
  const { role } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const links = LINKS_BY_ROLE[role] || [];

  return (
    <aside
      className={[
        'surface-card hidden h-fit shrink-0 flex-col overflow-hidden p-3 lg:flex',
        collapsed ? 'w-24' : 'w-72',
      ].join(' ')}
    >
      <button
        type="button"
        onClick={() => setCollapsed((current) => !current)}
        className="mb-4 rounded-2xl px-3 py-2 text-left text-sm font-semibold text-medilink-muted transition hover:bg-medilink-mintSoft hover:text-medilink-mint"
      >
        {collapsed ? 'Expand' : 'Collapse'}
      </button>

      <div className="space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              [
                'block rounded-2xl px-4 py-3 text-sm font-medium transition',
                isActive
                  ? 'bg-medilink-mint text-white'
                  : 'text-medilink-muted hover:bg-medilink-mintSoft hover:text-medilink-ink',
              ].join(' ')
            }
          >
            {collapsed ? link.label.slice(0, 1) : link.label}
          </NavLink>
        ))}
      </div>
    </aside>
  );
}

export default Sidebar;
