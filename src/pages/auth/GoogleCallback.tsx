import { useEffect } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import keycloak from '../../services/keycloak';

const ACCESS_TOKEN_KEY = 'capacity-connect.access-token';

const GoogleCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    const completeLogin = async () => {
      try {
        if (!keycloak.authenticated || !keycloak.token) {
          throw new Error('Keycloak authentication was not completed.');
        }

        const accessToken = keycloak.token;

        sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);

        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';
        const response = await fetch(`${apiBaseUrl}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Unable to load current user: ${response.status}`);
        }

        const user = await response.json();

        const cacheKey = keycloak.subject
          ? `capacity-connect.current-user.${keycloak.subject}`
          : 'capacity-connect.current-user';

        const userJson = JSON.stringify(user);

        sessionStorage.setItem(cacheKey, userJson);
        localStorage.setItem(cacheKey, userJson);

        const roles = user.roles?.length ? user.roles : [user.role];

        const dashboard = roles.includes('ADMIN')
          ? '/admin/dashboard'
          : roles.includes('TRAINER')
            ? '/trainer/dashboard'
            : '/trainee/dashboard';

        if (active) {
          window.location.replace(dashboard);
        }
      } catch (err) {
        console.error('Google authentication failed:', err);
        sessionStorage.removeItem(ACCESS_TOKEN_KEY);

        if (active) {
          navigate('/login', { replace: true });
        }
      }
    };

    completeLogin();

    return () => {
      active = false;
    };
  }, [navigate]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
      }}
    >
      <CircularProgress />
      <Typography>Signing you in...</Typography>
    </Box>
  );
};

export default GoogleCallback;
