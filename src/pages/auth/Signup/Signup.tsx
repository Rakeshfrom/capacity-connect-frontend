import { useState, type FormEvent } from 'react';
import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
  IconButton,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Google,
  SecurityOutlined,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { getCurrentUser, registerAccount } from '../../../services/api';
import { loginWithCredentials } from '../../../services/auth';
import keycloak from '../../../services/keycloak';

const passwordRule =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

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

const Signup = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

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
    setSuccess('');

    if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (!passwordRule.test(password)) {
      setError(
        'Password must be at least 8 characters and contain uppercase, lowercase, number and special character.'
      );
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);

      const normalizedEmail = email.trim().toLowerCase();

      await registerAccount(
        fullName.trim(),
        normalizedEmail,
        password
      );

      await loginWithCredentials(normalizedEmail, password);

      const user = await getCurrentUser();

      setSuccess(
        'Account created successfully. Redirecting to your dashboard...'
      );

      redirectByRole(user);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to create account. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setError('');
      setGoogleLoading(true);
      sessionStorage.removeItem('capacity-connect.access-token');

      await keycloak.login({
        idpHint: 'google',
        redirectUri: `${window.location.origin}/auth/callback`,
      });
    } catch (err) {
      console.error('Google signup failed:', err);
      setGoogleLoading(false);
      setError('Google sign-up could not be started. Please try again.');
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
                fontSize: { xs: '1.9rem', sm: '2.15rem' },
                lineHeight: 1.2,
              }}
            >
              Create your account
            </Typography>

            <Typography
              sx={{
                mt: 0.8,
                color: '#718594',
                lineHeight: 1.65,
              }}
            >
              Register securely to access CAPACITY CONNECT learning,
              assessments and professional development services.
            </Typography>

            <Stack spacing={2} sx={{ mt: 3 }}>
              {error && (
                <Alert severity="error" sx={{ borderRadius: 1.5 }}>
                  {error}
                </Alert>
              )}

              {success && (
                <Alert severity="success" sx={{ borderRadius: 1.5 }}>
                  {success}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={2}>
                  <TextField
                    fullWidth
                    label="Full name"
                    autoComplete="name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    sx={fieldSx}
                  />

                  <TextField
                    fullWidth
                    label="Email address"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={fieldSx}
                  />

                  <TextField
                    fullWidth
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    helperText="Use at least 8 characters with uppercase, lowercase, number and special character."
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

                  <TextField
                    fullWidth
                    label="Confirm password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    sx={fieldSx}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              edge="end"
                              aria-label={
                                showConfirmPassword
                                  ? 'Hide confirm password'
                                  : 'Show confirm password'
                              }
                              onClick={() =>
                                setShowConfirmPassword((value) => !value)
                              }
                            >
                              {showConfirmPassword ? (
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

                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={loading || googleLoading}
                    sx={{
                      mt: 0.5,
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
                    {loading ? 'Creating account...' : 'Create account'}
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
                onClick={handleGoogleSignup}
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
                  Your account is protected using secure authentication
                  provided by CAPACITY CONNECT.
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
              Already have an account?{' '}
              <Button
                component={RouterLink}
                to="/login"
                sx={{
                  color: '#075B91',
                  textTransform: 'none',
                  fontWeight: 750,
                  p: 0,
                  minWidth: 'auto',
                  verticalAlign: 'baseline',
                }}
              >
                Sign in
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

export default Signup;
