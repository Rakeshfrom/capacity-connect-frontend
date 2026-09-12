import { useState, type FormEvent } from 'react';
import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Google,
  SecurityOutlined,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import keycloak from '../../../services/keycloak';
import { loginWithCredentials } from '../../../services/auth';
import { getCurrentUser } from '../../../services/api';

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 1.5,
    bgcolor: '#FFFFFF',
    '& fieldset': {
      borderColor: '#CBD9E3',
    },
    '&:hover fieldset': {
      borderColor: '#8EA9BA',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#075B91',
      borderWidth: 1,
    },
  },
  '& .MuiInputLabel-root': {
    color: '#64798B',
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#075B91',
  },
};

const Login = () => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const redirectByRole = (user: { role?: string }) => {
    const dashboard =
      user.role === 'ADMIN'
        ? '/admin/dashboard'
        : user.role === 'TRAINER'
          ? '/trainer/dashboard'
          : '/trainee/dashboard';

    window.location.replace(dashboard);
  };

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

      redirectByRole(user);
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
      setError('');
      setGoogleLoading(true);
      sessionStorage.removeItem('capacity-connect.access-token');

      await keycloak.login({
        idpHint: 'google',
        redirectUri: `${window.location.origin}/auth/callback`,
      });
    } catch (err) {
      console.error('Google sign-in failed:', err);
      setGoogleLoading(false);
      setError('Google sign-in could not be started. Please try again.');
    }
  };

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 120px)',
        bgcolor: '#F3F7FA',
        py: { xs: 4, sm: 6, md: 8 },
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            overflow: 'hidden',
            borderRadius: 3,
            border: '1px solid #D8E4EB',
            bgcolor: '#FFFFFF',
            boxShadow: '0 18px 50px rgba(19, 63, 96, 0.08)',
          }}
        >
          <Box
            sx={{
              px: { xs: 2.5, sm: 4.5 },
              pt: { xs: 3, sm: 4 },
              pb: 2.5,
              textAlign: 'center',
              borderBottom: '1px solid #E3EBF0',
            }}
          >
            <Box
              component="img"
              src="/logo/imd-logo.webp"
              alt="India Meteorological Department"
              sx={{
                width: 64,
                height: 64,
                objectFit: 'contain',
                mb: 1.25,
              }}
            />

            <Typography
              sx={{
                color: '#075B91',
                fontWeight: 800,
                fontSize: { xs: '1.25rem', sm: '1.4rem' },
                letterSpacing: '0.025em',
              }}
            >
              CAPACITY CONNECT
            </Typography>

            <Typography
              sx={{
                mt: 0.55,
                color: '#6B7F8E',
                fontSize: '0.78rem',
              }}
            >
              Digital Capacity Building & Learning Management Portal
            </Typography>

            <Box
              sx={{
                mt: 1.6,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.9,
                px: 1.4,
                py: 0.65,
                borderRadius: 99,
                bgcolor: '#F1F7FB',
                border: '1px solid #D9E7EF',
              }}
            >
              <Box
                component="img"
                src="/logo/india-emblem.png"
                alt="Government of India"
                sx={{
                  width: 16,
                  height: 22,
                  objectFit: 'contain',
                }}
              />

              <Typography
                sx={{
                  color: '#35556B',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                }}
              >
                Government of India
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              px: { xs: 2.5, sm: 4.5 },
              py: { xs: 3, sm: 4 },
            }}
          >
            <Typography
              sx={{
                color: '#173F60',
                fontWeight: 800,
                fontSize: { xs: '1.95rem', sm: '2.2rem' },
                lineHeight: 1.2,
              }}
            >
              Welcome back
            </Typography>

            <Typography
              sx={{
                mt: 0.8,
                color: '#718594',
                lineHeight: 1.65,
              }}
            >
              Sign in securely to continue your learning journey with
              CAPACITY CONNECT.
            </Typography>

            <Stack spacing={2} sx={{ mt: 3 }}>
              {error && (
                <Alert severity="error" sx={{ borderRadius: 1.5 }}>
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={2}>
                  <TextField
                    fullWidth
                    label="Username or email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                    sx={fieldSx}
                  />

                  <TextField
                    fullWidth
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    sx={fieldSx}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              edge="end"
                              aria-label={
                                showPassword
                                  ? 'Hide password'
                                  : 'Show password'
                              }
                              onClick={() =>
                                setShowPassword((value) => !value)
                              }
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
                        color: '#075B91',
                        textDecoration: 'none',
                        fontWeight: 650,
                        fontSize: '0.9rem',
                      }}
                    >
                      Forgot password?
                    </Link>
                  </Box>

                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={loading || googleLoading}
                    sx={{
                      py: 1.35,
                      borderRadius: 1.5,
                      bgcolor: '#075B91',
                      textTransform: 'none',
                      fontWeight: 750,
                      fontSize: '1rem',
                      boxShadow: '0 7px 18px rgba(7,91,145,0.18)',
                      '&:hover': {
                        bgcolor: '#064A75',
                      },
                    }}
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </Stack>
              </Box>

              <Divider sx={{ color: '#7B8C98', fontSize: '0.8rem' }}>
                OR CONTINUE WITH
              </Divider>

              <Button
                variant="outlined"
                fullWidth
                size="large"
                startIcon={<Google />}
                onClick={handleGoogleLogin}
                disabled={loading || googleLoading}
                sx={{
                  py: 1.25,
                  borderRadius: 1.5,
                  borderColor: '#C8D7E1',
                  color: '#183F5E',
                  textTransform: 'none',
                  fontWeight: 700,
                  '&:hover': {
                    borderColor: '#8DAABD',
                    bgcolor: '#F8FBFD',
                  },
                }}
              >
                {googleLoading
                  ? 'Connecting to Google...'
                  : 'Continue with Google'}
              </Button>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 1,
                  px: 1.25,
                  py: 1.1,
                  borderRadius: 1.5,
                  bgcolor: '#F7FAFC',
                  border: '1px solid #E1EAF0',
                }}
              >
                <SecurityOutlined
                  sx={{
                    mt: 0.1,
                    fontSize: 19,
                    color: '#0B5A91',
                  }}
                />

                <Typography
                  sx={{
                    color: '#637888',
                    fontSize: '0.76rem',
                    lineHeight: 1.55,
                  }}
                >
                  Authentication is securely handled through CAPACITY
                  CONNECT identity services.
                </Typography>
              </Box>
            </Stack>

            <Typography
              sx={{
                mt: 3,
                textAlign: 'center',
                color: '#718594',
                fontSize: '0.92rem',
              }}
            >
              Don't have an account?{' '}
              <Button
                component={Link}
                to="/signup"
                sx={{
                  color: '#075B91',
                  textTransform: 'none',
                  fontWeight: 750,
                  p: 0,
                  minWidth: 'auto',
                  verticalAlign: 'baseline',
                }}
              >
                Create account
              </Button>
            </Typography>
          </Box>

          <Box
            sx={{
              px: 2.5,
              py: 1.75,
              bgcolor: '#F7FAFC',
              borderTop: '1px solid #E3EBF0',
              textAlign: 'center',
            }}
          >
            <Typography
              sx={{
                color: '#7A8A96',
                fontSize: '0.7rem',
              }}
            >
              Ministry of Earth Sciences • India Meteorological Department
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
