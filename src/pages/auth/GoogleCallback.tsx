import { useEffect } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import keycloak from '../../services/keycloak';
import { getCurrentUser } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const GoogleCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const completeLogin = async () => {
      try {
        if (!keycloak.authenticated) {
          navigate('/login', { replace: true });
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

        navigate(dashboard, { replace: true });
      } catch (err) {
        console.error('Google authentication failed:', err);
        navigate('/login', { replace: true });
      }
    };

    completeLogin();
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
