import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Visibility, VisibilityOff, Google } from '@mui/icons-material';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import keycloak from '../../../services/keycloak';
import { loginWithCredentials } from '../../../services/auth';
import { getCurrentUser } from '../../../services/api';

const Login = () => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');

    if (!username.trim() || !password) {
      setError('Please enter your username/email and password.');
      return;
    }

    try {
      setLoading(true);

      await loginWithCredentials(
        username.trim(),
        password
      );

      const user = await getCurrentUser();
      
      if (user.role === 'ADMIN') {
        window.location.replace('/admin/dashboard');
      } else if (user.role === 'TRAINER') {
        window.location.replace('/trainer/dashboard');
      } else {
        window.location.replace('/trainee/dashboard');
      }

      const dashboard =
        user.role === 'ADMIN'
          ? '/admin/dashboard'
          : user.role === 'TRAINER'
            ? '/trainer/dashboard'
            : '/trainee/dashboard';

      window.location.replace(dashboard);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to sign in. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setGoogleLoading(true);
      sessionStorage.removeItem('capacity-connect.access-token');

      await keycloak.login({
        idpHint: 'google',
        redirectUri: `${window.location.origin}/auth/callback`,
      });
    } catch {
      setGoogleLoading(false);
      setError('Google sign-in could not be started.');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        py: 5,
        bgcolor: '#F5F8FA',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 460,
          p: { xs: 3, sm: 4.5 },
          borderRadius: 3,
          border: '1px solid #DCE6EC',
        }}
      >
        <Stack spacing={3}>
          <Box>
            <Typography
              sx={{
                color: '#0B5A91',
                fontWeight: 800,
                fontSize: '1.45rem',
                letterSpacing: '0.04em',
              }}
            >
              CAPACITY CONNECT
            </Typography>

            <Typography
              variant="h4"
              sx={{
                mt: 2,
                color: '#173F60',
                fontWeight: 800,
              }}
            >
              Welcome back
            </Typography>

            <Typography sx={{ mt: 0.8, color: '#718594' }}>
              Sign in to continue your learning journey.
            </Typography>
          </Box>

          {error && <Alert severity="error">{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2.2}>
              <TextField
                label="Username or email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                fullWidth
                autoComplete="username"
              />

              <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                autoComplete="current-password"
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            setShowPassword((value) => !value)
                          }
                          edge="end"
                        >
                          {showPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <Box sx={{ textAlign: 'right' }}>
                <Link
                  to="/forgot-password"
                  style={{
                    color: '#0B5A91',
                    textDecoration: 'none',
                    fontWeight: 600,
                  }}
                >
                  Forgot password?
                </Link>
              </Box>

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  py: 1.35,
                  textTransform: 'none',
                  fontWeight: 700,
                  bgcolor: '#0B5A91',
                  '&:hover': { bgcolor: '#084873' },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Sign In'
                )}
              </Button>
            </Stack>
          </Box>

          <Divider>or continue with</Divider>

          <Button
            variant="outlined"
            size="large"
            startIcon={<Google />}
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            sx={{
              py: 1.25,
              textTransform: 'none',
              fontWeight: 700,
            }}
          >
            {googleLoading ? 'Connecting...' : 'Continue with Google'}
          </Button>

          <Typography
            sx={{
              textAlign: 'center',
              color: '#718594',
            }}
          >
            Don't have an account?{' '}
            <Link
              to="/signup"
              style={{
                color: '#0B5A91',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              Create account
            </Link>
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
};

export default Login;
