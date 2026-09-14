import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import keycloak, { initKeycloak } from '../services/keycloak';
import { getCurrentUser } from '../services/api';
import {
  getAccessToken,
  getOptimisticUserFromAccessToken,
  cacheOptimisticUserFromAccessToken,
  refreshCustomAccessToken,
  clearAuthStorage,
} from '../services/auth';

export interface CurrentUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'TRAINEE' | 'TRAINER' | 'ADMIN';
  roles?: ('TRAINEE' | 'TRAINER' | 'ADMIN')[];
  department?: string;
  phoneNumber?: string;
  qualifications?: string;
  skills?: string;
  experienceYears?: number;
  interests?: string;
  profilePicUrl?: string;
  profileCompleted?: boolean;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthContextValue {
  user: CurrentUser | null;
  loading: boolean;
}

const getCacheKey = () =>
  keycloak.subject
    ? `capacity-connect.current-user.${keycloak.subject}`
    : 'capacity-connect.current-user';

const readCachedUser = (): CurrentUser | null => {
  try {
    const value =
      sessionStorage.getItem(getCacheKey()) ||
      localStorage.getItem(getCacheKey());

    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
};

const getInitialUser = (): CurrentUser | null => {
  const cached = readCachedUser();

  if (cached) {
    return cached;
  }

  const optimistic = getOptimisticUserFromAccessToken();

  if (optimistic) {
    cacheOptimisticUserFromAccessToken();
    return optimistic as CurrentUser;
  }

  return null;
};

const requiresKeycloak = (pathname: string) =>
  pathname === '/auth/callback' ||
  pathname.startsWith('/trainee/') ||
  pathname.startsWith('/trainer/') ||
  pathname.startsWith('/admin/');

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const initialUser = getInitialUser();
  const [user, setUser] = useState<CurrentUser | null>(initialUser);
  const [loading, setLoading] = useState(!initialUser);

  useEffect(() => {
    let active = true;

    const refreshCurrentUserInBackground = () => {
      getCurrentUser()
        .then((data) => {
          if (!active) return;

          setUser(data);
          const value = JSON.stringify(data);
          sessionStorage.setItem(getCacheKey(), value);
          localStorage.setItem(getCacheKey(), value);
        })
        .catch((error) => {
          console.error('Failed to refresh current user:', error);
        });
    };

    const handleAuthExpired = () => {
      clearAuthStorage();
      if (!active) return;
      setUser(null);
      setLoading(false);
      if (requiresKeycloak(window.location.pathname)) {
        window.location.assign('/login');
      }
    };

    const bootstrapAuth = async () => {
      try {
        let customToken = getAccessToken();
        const protectedRoute = requiresKeycloak(window.location.pathname);

        if (!customToken) {
          customToken = await refreshCustomAccessToken(false);
        }

        if (!customToken && protectedRoute && !keycloak.authenticated) {
          try {
            await initKeycloak();
          } catch (error) {
            console.error('Keycloak initialization failed:', error);
          }
        }

        if (!active) return;

        const hasAuthentication = Boolean(
          getAccessToken() || keycloak.authenticated,
        );

        if (!hasAuthentication) {
          setUser(null);
          setLoading(false);
          return;
        }

        const optimistic = getInitialUser();
        if (optimistic) {
          setUser((current) => current ?? optimistic);
        }

        // Never block protected pages on /auth/me.
        setLoading(false);
        refreshCurrentUserInBackground();

        const refreshTimer = window.setInterval(() => {
          void refreshCustomAccessToken(false);
        }, 2 * 60 * 1000);

        return refreshTimer;
      } catch (error) {
        console.error('Authentication bootstrap failed:', error);
        if (active) setLoading(false);
        return undefined;
      }
    };

    window.addEventListener('capacity-connect:auth-expired', handleAuthExpired);

    let refreshTimer: number | undefined;
    void bootstrapAuth().then((timer) => {
      if (typeof timer === 'number') refreshTimer = timer;
    });

    return () => {
      active = false;
      window.removeEventListener('capacity-connect:auth-expired', handleAuthExpired);
      if (refreshTimer) window.clearInterval(refreshTimer);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
