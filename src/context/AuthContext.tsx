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
  const [user, setUser] = useState<CurrentUser | null>(getInitialUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const bootstrapAuth = async () => {
      try {
        const customToken = getAccessToken();

        if (!customToken && requiresKeycloak(window.location.pathname)) {
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
          return;
        }

        try {
          const data = await getCurrentUser();
          if (!active) return;

          setUser(data);

          const value = JSON.stringify(data);
          sessionStorage.setItem(getCacheKey(), value);
          localStorage.setItem(getCacheKey(), value);
        } catch (error) {
          console.error('Failed to refresh current user:', error);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    bootstrapAuth();

    return () => {
      active = false;
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
