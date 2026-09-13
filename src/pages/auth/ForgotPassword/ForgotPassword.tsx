import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import LockResetRoundedIcon from '@mui/icons-material/LockResetRounded';

import {
  Link as RouterLink,
} from 'react-router-dom';

import {
  useState,
} from 'react';

import {
  requestPasswordReset,
} from '../../../services/api';

const ForgotPassword = () => {
  const [
    email,
    setEmail,
  ] = useState('');

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    submitted,
    setSubmitted,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState('');

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    const normalizedEmail =
      email.trim();

    if (!normalizedEmail) {
      setError(
        'Please enter your registered email address.'
      );
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      await requestPasswordReset(
        normalizedEmail
      );

      setSubmitted(true);
    } catch (err) {
      console.error(
        'Password reset request failed:',
        err
      );

      setError(
        'We could not process your request right now. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight:
          'calc(100vh - 160px)',
        bgcolor:
          '#F5F9FC',
        py: {
          xs: 4,
          sm: 6,
          md: 8,
        },
        display: 'flex',
        alignItems:
          'center',
      }}
    >
      <Container
        maxWidth="sm"
      >
        <Paper
          elevation={0}
          sx={{
            p: {
              xs: 2.7,
              sm: 4,
              md: 4.8,
            },
            border:
              '1px solid #DCE6ED',
            borderRadius: 2.5,
            bgcolor:
              '#FFFFFF',
          }}
        >
          {!submitted ? (
            <form
              onSubmit={
                handleSubmit
              }
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 1.7,
                  bgcolor:
                    '#EAF4FB',
                  color:
                    '#0B5A91',
                  display: 'flex',
                  alignItems:
                    'center',
                  justifyContent:
                    'center',
                  mb: 2,
                }}
              >
                <LockResetRoundedIcon />
              </Box>

              <Typography
                sx={{
                  color:
                    '#173F60',
                  fontWeight: 800,
                  fontSize: {
                    xs: '2rem',
                    sm: '2.35rem',
                  },
                  lineHeight:
                    1.15,
                }}
              >
                Forgot password?
              </Typography>

              <Typography
                sx={{
                  mt: 1,
                  color:
                    '#657887',
                  lineHeight: 1.7,
                }}
              >
                Enter your registered email
                address. We will send you a
                secure link to create a new
                password.
              </Typography>

              <Stack
                spacing={2}
                sx={{
                  mt: 3.5,
                }}
              >
                <TextField
                  fullWidth
                  required
                  autoFocus
                  type="email"
                  label="Email address"
                  value={email}
                  onChange={(event) =>
                    setEmail(
                      event.target.value
                    )
                  }
                  autoComplete="email"
                />

                {error && (
                  <Alert
                    severity="error"
                    sx={{
                      borderRadius: 1.5,
                    }}
                  >
                    {error}
                  </Alert>
                )}

                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  disabled={
                    submitting ||
                    !email.trim()
                  }
                  sx={{
                    py: 1.35,
                    bgcolor:
                      '#0B5A91',
                    textTransform:
                      'none',
                    fontSize:
                      '.98rem',
                    fontWeight:
                      800,
                    borderRadius:
                      1.5,
                    '&:hover': {
                      bgcolor:
                        '#084A78',
                    },
                  }}
                >
                  {submitting ? (
                    <>
                      <CircularProgress
                        size={18}
                        color="inherit"
                        sx={{
                          mr: 1,
                        }}
                      />
                      Sending reset link...
                    </>
                  ) : (
                    'Send reset link'
                  )}
                </Button>
              </Stack>

              <Button
                component={
                  RouterLink
                }
                to="/login"
                fullWidth
                sx={{
                  mt: 1.5,
                  color:
                    '#0B5A91',
                  textTransform:
                    'none',
                  fontWeight:
                    700,
                }}
              >
                Back to sign in
              </Button>
            </form>
          ) : (
            <Box
              sx={{
                textAlign:
                  'center',
                py: 1,
              }}
            >
              <Box
                sx={{
                  width: 58,
                  height: 58,
                  mx: 'auto',
                  borderRadius:
                    '50%',
                  bgcolor:
                    '#EAF7EF',
                  color:
                    '#17804B',
                  display: 'flex',
                  alignItems:
                    'center',
                  justifyContent:
                    'center',
                }}
              >
                <CheckCircleOutlineRoundedIcon
                  sx={{
                    fontSize: 32,
                  }}
                />
              </Box>

              <Typography
                sx={{
                  mt: 2,
                  color:
                    '#173F60',
                  fontSize:
                    '1.45rem',
                  fontWeight:
                    800,
                }}
              >
                Check your email
              </Typography>

              <Typography
                sx={{
                  mt: 1,
                  color:
                    '#657887',
                  lineHeight:
                    1.7,
                }}
              >
                If an account exists for{' '}
                <strong>
                  {email.trim()}
                </strong>
                , a password reset link
                has been sent.
              </Typography>

              <Typography
                sx={{
                  mt: 1,
                  color:
                    '#8A98A2',
                  fontSize:
                    '.78rem',
                  lineHeight:
                    1.6,
                }}
              >
                Open the email and follow
                the secure link to choose
                your new password.
              </Typography>

              <Button
                component={
                  RouterLink
                }
                to="/login"
                variant="contained"
                fullWidth
                sx={{
                  mt: 3,
                  py: 1.25,
                  bgcolor:
                    '#0B5A91',
                  textTransform:
                    'none',
                  fontWeight:
                    800,
                  borderRadius:
                    1.5,
                  '&:hover': {
                    bgcolor:
                      '#084A78',
                  },
                }}
              >
                Back to sign in
              </Button>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default ForgotPassword;
