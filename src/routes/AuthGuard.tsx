import { useEffect, useState, type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import keycloak, {
  getKeycloakInitPromise,
} from '../services/keycloak';
import { useAuth } from '../context/AuthContext';

type Role = 'TRAINEE' | 'TRAINER' | 'ADMIN';

interface AuthGuardProps {
  children: ReactNode;
  role?: Role;
}

const getDashboard = (roles: Role[]) => {
  if (roles.includes('ADMIN')) return '/admin/dashboard';
  if (roles.includes('TRAINER')) return '/trainer/dashboard';
  if (roles.includes('TRAINEE')) return '/trainee/dashboard';
  return '/';
};

const AuthGuard = ({ children, role }: AuthGuardProps) => {
  const { user, loading } = useAuth();
  const customToken = sessionStorage.getItem('capacity-connect.access-token');
  const [keycloakReady, setKeycloakReady] = useState(
    Boolean(customToken) || Boolean(keycloak.authenticated),
  );

  useEffect(() => {
    if (customToken || keycloak.authenticated) {
      setKeycloakReady(true);
      return;
    }

    let active = true;

    getKeycloakInitPromise().finally(() => {
      if (active) {
        setKeycloakReady(true);
      }
    });

    return () => {
      active = false;
    };
  }, [customToken]);

  if (!keycloakReady && !customToken) {
    return null;
  }

  if (!keycloak.authenticated && !customToken) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const roles: Role[] = user.roles?.length
    ? user.roles
    : [user.role];

  if (role && !roles.includes(role)) {
    return <Navigate to={getDashboard(roles)} replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;
