import { Box, CircularProgress, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import keycloak from '../../../services/keycloak';

const getDashboard = () => {
  const token = keycloak.tokenParsed as {
    realm_access?: { roles?: string[] };
    resource_access?: Record<string, { roles?: string[] }>;
  } | undefined;

  const roles = new Set([
    ...(token?.realm_access?.roles ?? []),
    ...(token?.resource_access?.['capacity-connect-frontend']?.roles ?? []),
  ]);

  if (roles.has('ADMIN')) return '/admin/dashboard';
  if (roles.has('TRAINER')) return '/trainer/dashboard';
  return '/trainee/dashboard';
};

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

      navigate(getDashboard(), { replace: true });
    };

    handleLogin().catch((error) => {
      console.error('Login failed:', error);
    });
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
        Signing you in...
      </Typography>
    </Box>
  );
};

export default Login;
