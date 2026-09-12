import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
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

  const login = async (idpHint?: string) => {
    try {
      if (keycloak.authenticated) {
        navigate(getDashboard(), { replace: true });
        return;
      }

      await keycloak.login({
        prompt: 'login',
        ...(idpHint ? { idpHint } : {}),
        redirectUri: `${window.location.origin}/login`,
      });
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 120px)',
        bgcolor: '#F4F8FB',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        py: { xs: 4, md: 7 },
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 460,
          p: { xs: 3, sm: 4.5 },
          border: '1px solid #D9E5EC',
          borderRadius: 3,
          bgcolor: '#fff',
        }}
      >
        <Stack spacing={0.8} sx={{ mb: 3.5 }}>
          <Typography
            sx={{
              color: '#0B5A91',
              fontWeight: 800,
              fontSize: '0.85rem',
              letterSpacing: 1,
            }}
          >
            CAPACITY CONNECT
          </Typography>

          <Typography
            variant="h4"
            sx={{
              color: '#173F60',
              fontWeight: 800,
              fontSize: { xs: '1.9rem', sm: '2.2rem' },
            }}
          >
            Welcome back
          </Typography>

          <Typography sx={{ color: '#687B89', lineHeight: 1.6 }}>
            Sign in to continue your learning journey.
          </Typography>
        </Stack>

        <Stack spacing={2}>
          <TextField
            fullWidth
            label="Email or username"
            placeholder="Enter your email or username"
            autoComplete="username"
            disabled
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            disabled
          />

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <FormControlLabel
              control={<Checkbox size="small" />}
              label={
                <Typography sx={{ fontSize: '0.9rem', color: '#607583' }}>
                  Remember me
                </Typography>
              }
            />

            <Button
              size="small"
              sx={{
                color: '#0B5A91',
                textTransform: 'none',
                fontWeight: 700,
              }}
            >
              Forgot password?
            </Button>
          </Box>

          <Button
            fullWidth
            variant="contained"
            endIcon={<ArrowForwardRoundedIcon />}
            onClick={() => login()}
            sx={{
              py: 1.35,
              bgcolor: '#0B5A91',
              borderRadius: 1.5,
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '1rem',
              '&:hover': { bgcolor: '#084A78' },
            }}
          >
            Continue to secure login
          </Button>
        </Stack>

        <Divider sx={{ my: 3 }}>
          <Typography sx={{ color: '#8A9AA5', fontSize: '0.8rem' }}>
            OR
          </Typography>
        </Divider>

        <Button
          fullWidth
          variant="outlined"
          startIcon={<GoogleIcon />}
          onClick={() => login('google')}
          sx={{
            py: 1.25,
            borderColor: '#CBD8E0',
            color: '#244A66',
            borderRadius: 1.5,
            textTransform: 'none',
            fontWeight: 700,
          }}
        >
          Continue with Google
        </Button>

        <Typography
          sx={{
            mt: 3,
            textAlign: 'center',
            color: '#657887',
            fontSize: '0.95rem',
          }}
        >
          New to CAPACITY CONNECT?{' '}
          <Button
            component={RouterLink}
            to="/signup"
            sx={{
              color: '#0B5A91',
              textTransform: 'none',
              fontWeight: 800,
              p: 0,
              minWidth: 'auto',
            }}
          >
            Create account
          </Button>
        </Typography>

        <Typography
          sx={{
            mt: 2.5,
            textAlign: 'center',
            color: '#8A9AA5',
            fontSize: '0.75rem',
          }}
        >
          Secure authentication powered by CAPACITY CONNECT
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;
