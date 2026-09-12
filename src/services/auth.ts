const ACCESS_TOKEN_KEY = 'capacity-connect.access-token';

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

  return data;
};

export const logoutCustomAuth = () => {
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
};
