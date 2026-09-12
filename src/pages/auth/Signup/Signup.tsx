import { useState, type FormEvent } from 'react';
import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import { Link as RouterLink } from 'react-router-dom';
import { getCurrentUser, registerAccount } from '../../../services/api';
import { loginWithCredentials } from '../../../services/auth';

const passwordRule =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

const Signup = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

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

      setSuccess('Account created successfully. Redirecting to your dashboard...');

      const dashboard =
        user.role === 'ADMIN'
          ? '/admin/dashboard'
          : user.role === 'TRAINER'
            ? '/trainer/dashboard'
            : '/trainee/dashboard';

      setTimeout(() => {
        window.location.replace(dashboard);
      }, 500);
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

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 160px)',
        bgcolor: '#F5F9FC',
        py: { xs: 4, sm: 6, md: 8 },
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, sm: 4, md: 5 },
            border: '1px solid #DCE6ED',
            borderRadius: 2,
            bgcolor: '#FFFFFF',
          }}
        >
          <Typography
            variant="h3"
            sx={{
              color: '#173F60',
              fontWeight: 700,
              fontSize: { xs: '2rem', sm: '2.4rem' },
            }}
          >
            Create account
          </Typography>

          <Typography
            sx={{
              mt: 1,
              color: '#657887',
              lineHeight: 1.7,
            }}
          >
            Register for access to CAPACITY CONNECT.
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2} sx={{ mt: 3.5 }}>
              {error && <Alert severity="error">{error}</Alert>}
              {success && <Alert severity="success">{success}</Alert>}

              <TextField
                fullWidth
                label="Full name"
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />

              <TextField
                fullWidth
                label="Email address"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <TextField
                fullWidth
                label="Password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                helperText="Min 8 characters: uppercase, lowercase, number and special character."
              />

              <TextField
                fullWidth
                label="Confirm password"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  py: 1.35,
                  bgcolor: '#0B5A91',
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 700,
                  '&:hover': {
                    bgcolor: '#084A78',
                  },
                }}
              >
                {loading ? 'Creating account...' : 'Create account'}
              </Button>
            </Stack>
          </Box>

          <Divider sx={{ my: 3 }}>
            <Typography sx={{ color: '#80909D', fontSize: '0.9rem' }}>
              OR CONTINUE WITH
            </Typography>
          </Divider>

          <Stack spacing={1.5}>
            <Button
              variant="outlined"
              fullWidth
              sx={{
                py: 1.15,
                borderColor: '#C5D3DD',
                color: '#244A66',
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              <Box component="span" sx={{ mr: 1, fontWeight: 800 }}>
                G
              </Box>
              Continue with Google
            </Button>

            <Button
              variant="outlined"
              fullWidth
              startIcon={<GitHubIcon />}
              sx={{
                py: 1.15,
                borderColor: '#C5D3DD',
                color: '#244A66',
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              Continue with GitHub
            </Button>

            <Button
              variant="outlined"
              fullWidth
              startIcon={<LinkedInIcon />}
              sx={{
                py: 1.15,
                borderColor: '#C5D3DD',
                color: '#244A66',
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              Continue with LinkedIn
            </Button>

            <Button
              variant="outlined"
              fullWidth
              startIcon={<PhoneOutlinedIcon />}
              sx={{
                py: 1.15,
                borderColor: '#C5D3DD',
                color: '#244A66',
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              Continue with Phone
            </Button>
          </Stack>

          <Typography
            sx={{
              mt: 3,
              textAlign: 'center',
              color: '#657887',
            }}
          >
            Already have an account?{' '}
            <Button
              component={RouterLink}
              to="/login"
              sx={{
                color: '#0B5A91',
                textTransform: 'none',
                fontWeight: 700,
                p: 0,
                minWidth: 'auto',
              }}
            >
              Sign in
            </Button>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default Signup;
