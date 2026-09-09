import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import keycloak from '../services/keycloak';
import { getCurrentUser } from '../services/api';

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

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!keycloak.authenticated) {
      setLoading(false);
      return;
    }

    getCurrentUser()
      .then((data) => setUser(data))
      .catch((error) => {
        console.error('Failed to load current user:', error);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
