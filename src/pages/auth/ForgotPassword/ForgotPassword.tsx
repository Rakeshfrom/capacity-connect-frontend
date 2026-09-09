import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const ForgotPassword = () => {
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
            Forgot password?
          </Typography>

          <Typography
            sx={{
              mt: 1,
              color: '#657887',
              lineHeight: 1.7,
            }}
          >
            Enter your registered email address and we will help you reset
            your password.
          </Typography>

          <Stack spacing={2.5} sx={{ mt: 3.5 }}>
            <TextField
              fullWidth
              label="Email address"
              type="email"
              autoComplete="email"
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
              Continue
            </Button>
          </Stack>

          <Button
            component={RouterLink}
            to="/login"
            fullWidth
            sx={{
              mt: 2,
              color: '#0B5A91',
              textTransform: 'none',
              fontWeight: 700,
            }}
          >
            Back to sign in
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default ForgotPassword;
