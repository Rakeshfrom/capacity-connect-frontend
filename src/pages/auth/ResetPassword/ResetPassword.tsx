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

import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom';

import { resetPassword } from '../../../services/api';

const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/;

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token')?.trim() || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!token) {
      setError('This password reset link is invalid.');
      return;
    }

    if (newPassword.length < 8 || !passwordPattern.test(newPassword)) {
      setError(
        'Password must be at least 8 characters and contain uppercase, lowercase, number and special character.'
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await resetPassword({ token, newPassword, confirmPassword });
      setSubmitted(true);
    } catch (err) {
      console.error('Password reset failed:', err);
      const message = err instanceof Error ? err.message : '';
      setError(
        /^API request failed: \d+$/.test(message)
          ? 'This password reset link is invalid or has expired.'
          : message || 'Unable to reset password.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 160px)',
        bgcolor: '#F5F9FC',
        py: { xs: 4, sm: 6, md: 8 },
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.7, sm: 4, md: 4.8 },
            border: '1px solid #DCE6ED',
            borderRadius: 2.5,
            bgcolor: '#FFFFFF',
          }}
        >
          {!submitted ? (
            <form onSubmit={handleSubmit}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 1.7,
                  bgcolor: '#EAF4FB',
                  color: '#0B5A91',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                }}
              >
                <LockResetRoundedIcon />
              </Box>

              <Typography
                sx={{
                  color: '#173F60',
                  fontWeight: 800,
                  fontSize: { xs: '2rem', sm: '2.35rem' },
                  lineHeight: 1.15,
                }}
              >
                Create a new password
              </Typography>

              <Typography sx={{ mt: 1, color: '#657887', lineHeight: 1.7 }}>
                Choose a new password for your CAPACITY CONNECT account.
              </Typography>

              <Stack spacing={2} sx={{ mt: 3.5 }}>
                {!token && <Alert severity="error">This password reset link is invalid.</Alert>}

                <TextField
                  fullWidth
                  required
                  type="password"
                  label="New password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  autoComplete="new-password"
                />

                <TextField
                  fullWidth
                  required
                  type="password"
                  label="Confirm new password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  autoComplete="new-password"
                />

                <Typography sx={{ color: '#657887', fontSize: '.8rem', lineHeight: 1.6 }}>
                  Use at least 8 characters with uppercase, lowercase, a number and a special character.
                </Typography>

                {error && <Alert severity="error">{error}</Alert>}

                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  disabled={submitting || !token}
                  sx={{
                    py: 1.35,
                    bgcolor: '#0B5A91',
                    textTransform: 'none',
                    fontSize: '.98rem',
                    fontWeight: 800,
                    borderRadius: 1.5,
                    '&:hover': { bgcolor: '#084A78' },
                  }}
                >
                  {submitting ? (
                    <>
                      <CircularProgress size={18} color="inherit" sx={{ mr: 1 }} />
                      Updating password...
                    </>
                  ) : (
                    'Update password'
                  )}
                </Button>
              </Stack>

              <Button
                component={RouterLink}
                to="/login"
                fullWidth
                sx={{ mt: 1.5, color: '#0B5A91', textTransform: 'none', fontWeight: 700 }}
              >
                Back to sign in
              </Button>
            </form>
          ) : (
            <Box sx={{ textAlign: 'center', py: 1 }}>
              <Box
                sx={{
                  width: 58,
                  height: 58,
                  mx: 'auto',
                  borderRadius: '50%',
                  bgcolor: '#EAF7EF',
                  color: '#17804B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CheckCircleOutlineRoundedIcon sx={{ fontSize: 32 }} />
              </Box>

              <Typography sx={{ mt: 2, color: '#173F60', fontSize: '1.45rem', fontWeight: 800 }}>
                Password updated
              </Typography>

              <Typography sx={{ mt: 1, color: '#657887', lineHeight: 1.7 }}>
                Your password has been reset successfully. You can now sign in with your new password.
              </Typography>

              <Button
                variant="contained"
                fullWidth
                onClick={() => navigate('/login')}
                sx={{
                  mt: 3,
                  py: 1.25,
                  bgcolor: '#0B5A91',
                  textTransform: 'none',
                  fontWeight: 800,
                  borderRadius: 1.5,
                  '&:hover': { bgcolor: '#084A78' },
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

export default ResetPassword;
