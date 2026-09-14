const ACCESS_TOKEN_KEY = 'capacity-connect.access-token';
const REFRESH_TOKEN_KEY = 'capacity-connect.refresh-token';
const ID_TOKEN_KEY = 'capacity-connect.id-token';
const KEYCLOAK_TOKEN_URL = 'https://keycloak-production-66a8.up.railway.app/realms/capacity-connect/protocol/openid-connect/token';
const KEYCLOAK_CLIENT_ID = 'capacity-connect-frontend';

type Role = 'TRAINEE' | 'TRAINER' | 'ADMIN';

interface TokenClaims {
  sub?: string;
  email?: string;
  preferred_username?: string;
  given_name?: string;
  family_name?: string;
  name?: string;
  realm_access?: {
    roles?: string[];
  };
  resource_access?: Record<string, {
    roles?: string[];
  }>;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  idToken?: string;
  expiresIn?: number;
  refreshExpiresIn?: number;
  tokenType?: string;
  sessionState?: string;
}

export const getAccessToken = () =>
  sessionStorage.getItem(ACCESS_TOKEN_KEY);

export const getRefreshToken = () =>
  sessionStorage.getItem(REFRESH_TOKEN_KEY);

const decodeExp = (token: string) => {
  try {
    const payload = token.split('.')[1];
    if (!payload) return 0;
    const normalized = payload
      .replace(/-/g, '+')
      .replace(/_/g, '/')
      .padEnd(Math.ceil(payload.length / 4) * 4, '=');
    const claims = JSON.parse(atob(normalized)) as { exp?: number };
    return typeof claims.exp === 'number' ? claims.exp : 0;
  } catch {
    return 0;
  }
};

export const isAccessTokenExpiringSoon = (token = getAccessToken(), skewSeconds = 30) => {
  if (!token) return true;
  const exp = decodeExp(token);
  return !exp || exp <= Math.floor(Date.now() / 1000) + skewSeconds;
};

let customRefreshPromise: Promise<string | null> | null = null;

export const refreshCustomAccessToken = async (force = false) => {
  const currentToken = getAccessToken();
  const refreshToken = getRefreshToken();

  if (!refreshToken) return currentToken;
  if (!force && currentToken && !isAccessTokenExpiringSoon(currentToken)) {
    return currentToken;
  }
  if (customRefreshPromise) return customRefreshPromise;

  customRefreshPromise = (async () => {
    try {
      const body = new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: KEYCLOAK_CLIENT_ID,
        refresh_token: refreshToken,
      });

      const response = await fetch(KEYCLOAK_TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
      });

      if (!response.ok) {
        sessionStorage.removeItem(ACCESS_TOKEN_KEY);
        sessionStorage.removeItem(REFRESH_TOKEN_KEY);
        sessionStorage.removeItem(ID_TOKEN_KEY);
        return null;
      }

      const data = (await response.json()) as LoginResponse;
      if (!data.accessToken) return null;

      sessionStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
      if (data.refreshToken) {
        sessionStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
      }
      if (data.idToken) {
        sessionStorage.setItem(ID_TOKEN_KEY, data.idToken);
      }

      cacheOptimisticUserFromAccessToken();
      return data.accessToken;
    } catch {
      return null;
    } finally {
      customRefreshPromise = null;
    }
  })();

  return customRefreshPromise;
};

const decodeJwtPayload = (token: string): TokenClaims | null => {
  try {
    const payload = token.split('.')[1];

    if (!payload) {
      return null;
    }

    const normalized = payload
      .replace(/-/g, '+')
      .replace(/_/g, '/')
      .padEnd(Math.ceil(payload.length / 4) * 4, '=');

    const bytes = Uint8Array.from(
      atob(normalized),
      (character) => character.charCodeAt(0),
    );

    return JSON.parse(new TextDecoder().decode(bytes)) as TokenClaims;
  } catch {
    return null;
  }
};

export const getTokenClaims = (): TokenClaims | null => {
  const token = getAccessToken();
  return token ? decodeJwtPayload(token) : null;
};

export const getRolesFromAccessToken = (): Role[] => {
  const claims = getTokenClaims();

  if (!claims) {
    return [];
  }

  const roles = new Set<Role>();

  for (const role of claims.realm_access?.roles ?? []) {
    if (role === 'ADMIN' || role === 'TRAINER' || role === 'TRAINEE') {
      roles.add(role);
    }
  }

  for (const access of Object.values(claims.resource_access ?? {})) {
    for (const role of access.roles ?? []) {
      if (role === 'ADMIN' || role === 'TRAINER' || role === 'TRAINEE') {
        roles.add(role);
      }
    }
  }

  return Array.from(roles);
};

const getPrimaryRole = (roles: Role[]): Role | null => {
  if (roles.includes('ADMIN')) return 'ADMIN';
  if (roles.includes('TRAINER')) return 'TRAINER';
  if (roles.includes('TRAINEE')) return 'TRAINEE';
  return null;
};

export const getOptimisticUserFromAccessToken = () => {
  const claims = getTokenClaims();
  const roles = getRolesFromAccessToken();
  const role = getPrimaryRole(roles);

  if (!claims || !role) {
    return null;
  }

  const nameParts = (claims.name || '').trim().split(/\s+/).filter(Boolean);

  return {
    id: 0,
    username: claims.preferred_username || claims.email || '',
    email: claims.email || claims.preferred_username || '',
    firstName: claims.given_name || nameParts[0] || '',
    lastName:
      claims.family_name ||
      (nameParts.length > 1 ? nameParts.slice(1).join(' ') : ''),
    role,
    roles,
    status: 'ACTIVE',
  };
};

export const cacheOptimisticUserFromAccessToken = () => {
  const user = getOptimisticUserFromAccessToken();

  if (!user) {
    return null;
  }

  const claims = getTokenClaims();

  const key = claims?.sub
    ? `capacity-connect.current-user.${claims.sub}`
    : 'capacity-connect.current-user';

  const value = JSON.stringify(user);

  sessionStorage.setItem(key, value);
  localStorage.setItem(key, value);

  return user;
};

export const loginWithCredentials = async (
  username: string,
  password: string
) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL || ''}/api/auth/login`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    }
  );

  if (!response.ok) {
    throw new Error(
      response.status === 400 || response.status === 401
        ? 'Invalid username or password'
        : 'Unable to sign in. Please try again.'
    );
  }

  const data: LoginResponse = await response.json();

  sessionStorage.setItem(ACCESS_TOKEN_KEY, data.accessToken);
  if (data.refreshToken) {
    sessionStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
  }
  if (data.idToken) {
    sessionStorage.setItem(ID_TOKEN_KEY, data.idToken);
  }
  cacheOptimisticUserFromAccessToken();

  return data;
};

export const logoutCustomAuth = () => {
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  sessionStorage.removeItem(ID_TOKEN_KEY);

  for (const storage of [sessionStorage, localStorage]) {
    Object.keys(storage)
      .filter((key) => key.startsWith('capacity-connect.current-user'))
      .forEach((key) => storage.removeItem(key));
  }
};
