import { Box, CircularProgress, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import keycloak from '../../../services/keycloak';
import { getCurrentUser } from '../../../services/api';

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogin = async () => {
      if (!keycloak.authenticated) {
        await keycloak.login({
          prompt: 'login',
          redirectUri: `${window.location.origin}/login`,
        });
        return;
      }

      try {
        const user = await getCurrentUser();

        if (user.role === 'ADMIN') {
          navigate('/admin/dashboard', { replace: true });
        } else if (user.role === 'TRAINER') {
          navigate('/trainer/dashboard', { replace: true });
        } else {
          navigate('/trainee/dashboard', { replace: true });
        }
      } catch (error) {
        console.error('Failed to load authenticated user:', error);
      }
    };

    handleLogin();
  }, [navigate]);

  return (
    <Box
      sx={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <CircularProgress />
      <Typography color="text.secondary">
        Loading your account...
      </Typography>
    </Box>
  );
};

export default Login;
