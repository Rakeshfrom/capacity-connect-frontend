import { useEffect } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import keycloak, {
  initKeycloakForCallback,
} from '../../services/keycloak';
import {
  cacheOptimisticUserFromAccessToken,
  getRolesFromAccessToken,
} from '../../services/auth';

const ACCESS_TOKEN_KEY = 'capacity-connect.access-token';

const GoogleCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    const completeLogin = async () => {
      try {
        await initKeycloakForCallback();

        if (!keycloak.authenticated || !keycloak.token) {
          throw new Error('Keycloak authentication was not completed.');
        }

        sessionStorage.setItem(ACCESS_TOKEN_KEY, keycloak.token);
        const optimisticUser = cacheOptimisticUserFromAccessToken();
        const roles = optimisticUser?.roles?.length
          ? optimisticUser.roles
          : getRolesFromAccessToken();

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
