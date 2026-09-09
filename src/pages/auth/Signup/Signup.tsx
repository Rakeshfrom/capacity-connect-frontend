import {
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

const Signup = () => {
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

          <Stack spacing={2} sx={{ mt: 3.5 }}>
            <TextField
              fullWidth
              label="Full name"
              autoComplete="name"
            />

            <TextField
              fullWidth
              label="Email address"
              type="email"
              autoComplete="email"
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              autoComplete="new-password"
            />

            <TextField
              fullWidth
              label="Confirm password"
              type="password"
              autoComplete="new-password"
            />

            <Button
              variant="contained"
              fullWidth
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
              Create account
            </Button>
          </Stack>

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
