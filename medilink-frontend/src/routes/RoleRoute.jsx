import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function RoleRoute({ allowedRoles, role: requiredRole, children }) {
  const { role } = useAuth();
  const normalizedAllowedRoles = Array.isArray(allowedRoles) && allowedRoles.length
    ? allowedRoles.map((item) => item.toUpperCase())
    : requiredRole
      ? [requiredRole.toUpperCase()]
      : [];

  if (!normalizedAllowedRoles.includes((role || '').toUpperCase())) {
    return <Navigate to="/403" replace />;
  }

  return children || <Outlet />;
}

export default RoleRoute;
