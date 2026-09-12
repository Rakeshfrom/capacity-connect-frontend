import { useEffect } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import keycloak from '../../services/keycloak';
import { getCurrentUser } from '../../services/api';

const GoogleCallback = () => {
  useEffect(() => {
    const completeLogin = async () => {
      try {
        if (!keycloak.authenticated) {
          window.location.replace('/login');
          return;
        }

        sessionStorage.removeItem('capacity-connect.access-token');

        const user = await getCurrentUser();

        const dashboard =
          user.role === 'ADMIN'
            ? '/admin/dashboard'
            : user.role === 'TRAINER'
              ? '/trainer/dashboard'
              : '/trainee/dashboard';

        window.location.replace(dashboard);
      } catch (err) {
        console.error('Google authentication failed:', err);
        window.location.replace('/login');
      }
    };

    completeLogin();
  }, []);

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
