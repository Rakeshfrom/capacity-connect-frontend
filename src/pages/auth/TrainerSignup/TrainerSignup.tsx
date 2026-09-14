import { useRef, useState, type FormEvent } from 'react';
import { Alert, Box, Button, Container, Divider, Paper, Stack, TextField, Typography } from '@mui/material';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import { Link as RouterLink } from 'react-router-dom';
import { applyForTrainer, registerAccount, updateCurrentUserProfile } from '../../../services/api';
import { loginWithCredentials, logoutCustomAuth } from '../../../services/auth';

const passwordRule = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

const TrainerSignup = () => {
  const cvRef = useRef<HTMLInputElement>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [qualification, setQualification] = useState('');
  const [experience, setExperience] = useState('');
  const [reason, setReason] = useState('');
  const [cv, setCv] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');

    if (!fullName.trim() || !email.trim() || !password || !confirmPassword || !qualification.trim() || !experience.trim() || !cv) {
      setError('Please complete all required fields and upload your CV.');
      return;
    }
    if (!passwordRule.test(password)) {
      setError('Password must be at least 8 characters and contain uppercase, lowercase, number and special character.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(cv.type)) {
      setError('CV must be PDF, DOC or DOCX.');
      return;
    }
    if (cv.size > 10 * 1024 * 1024) {
      setError('CV must be smaller than 10 MB.');
      return;
    }

    try {
      setBusy(true);
      const normalizedEmail = email.trim().toLowerCase();

      await registerAccount(fullName.trim(), normalizedEmail, password);
      await loginWithCredentials(normalizedEmail, password);

      await updateCurrentUserProfile({
        qualifications: qualification.trim(),
        experienceYears: Number(experience),
      });

      await applyForTrainer({
        reason: reason.trim(),
        supportingDocumentUrl: '',
        supportingDocument: cv,
      });

      logoutCustomAuth();
      setSuccess(true);
    } catch (err) {
      logoutCustomAuth();
      setError(err instanceof Error ? err.message : 'Unable to submit trainer application. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  if (success) {
    return (
      <Box sx={{ minHeight: 'calc(100vh - 120px)', bgcolor: '#F3F7FA', py: { xs: 4, md: 8 } }}>
        <Container maxWidth="sm">
          <Paper elevation={0} sx={{ p: { xs: 3, sm: 5 }, border: '1px solid #D8E4EB', borderRadius: 3, textAlign: 'center' }}>
            <VerifiedUserOutlinedIcon sx={{ fontSize: 52, color: '#2E7D32' }} />
            <Typography sx={{ mt: 1.5, color: '#173F60', fontWeight: 800, fontSize: '1.7rem' }}>
              Trainer application submitted
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1, lineHeight: 1.7 }}>
              Your account has been created and your trainer application is now pending administrator review. You will receive trainer access only after the required assessment and approval are completed.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.2} sx={{ mt: 3 }}>
              <Button component={RouterLink} to="/login" fullWidth variant="contained" sx={{ bgcolor: '#075B91', textTransform: 'none', fontWeight: 700 }}>
                Go to Login
              </Button>
              <Button component={RouterLink} to="/" fullWidth variant="outlined" sx={{ color: '#075B91', textTransform: 'none', fontWeight: 700 }}>
                Back to Home
              </Button>
            </Stack>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: 'calc(100vh - 120px)', bgcolor: '#F3F7FA', py: { xs: 4, md: 6 } }}>
      <Container maxWidth="sm">
        <Paper elevation={0} sx={{ overflow: 'hidden', border: '1px solid #D8E4EB', borderRadius: 3, boxShadow: '0 18px 50px rgba(19, 63, 96, 0.08)' }}>
          <Box sx={{ px: { xs: 2.5, sm: 4 }, pt: { xs: 3, sm: 4 }, pb: 2.5, borderBottom: '1px solid #E3EBF0' }}>
            <Typography sx={{ color: '#075B91', fontWeight: 800, fontSize: '1.45rem' }}>CAPACITY CONNECT</Typography>
            <Typography sx={{ mt: .5, color: '#6B7F8E', fontSize: '.82rem' }}>Trainer application</Typography>
            <Typography sx={{ mt: 2, color: '#173F60', fontWeight: 800, fontSize: { xs: '1.8rem', sm: '2.05rem' } }}>Apply as a Trainer</Typography>
            <Typography color="text.secondary" sx={{ mt: .7, lineHeight: 1.65 }}>
              Create your account and submit the information needed for administrator review. Trainer privileges are not granted at registration.
            </Typography>
          </Box>

          <Box component="form" onSubmit={submit} sx={{ px: { xs: 2.5, sm: 4 }, py: { xs: 3, sm: 4 } }}>
            <Stack spacing={1.8}>
              {error && <Alert severity="error">{error}</Alert>}

              <TextField fullWidth label="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} autoComplete="name" />
              <TextField fullWidth label="Email address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
              <TextField fullWidth label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} helperText="Minimum 8 characters with uppercase, lowercase, number and special character." autoComplete="new-password" />
              <TextField fullWidth label="Confirm password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} autoComplete="new-password" />
              <Divider />
              <TextField fullWidth label="Highest qualification" required value={qualification} onChange={(e) => setQualification(e.target.value)} />
              <TextField
                fullWidth
                label="Relevant experience (years)"
                required
                type="number"
                slotProps={{ htmlInput: { min: 0, max: 60 } }}
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              />
              <TextField fullWidth label="Why do you want to become a trainer?" value={reason} onChange={(e) => setReason(e.target.value)} multiline minRows={3} />

              <Button component="label" variant="outlined" startIcon={<UploadFileOutlinedIcon />} sx={{ justifyContent: 'flex-start', py: 1.2, color: '#075B91', borderColor: '#B9CEDB', textTransform: 'none', fontWeight: 700 }}>
                {cv ? cv.name : 'Upload CV (PDF, DOC or DOCX)'}
                <input ref={cvRef} hidden type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={(e) => setCv(e.target.files?.[0] ?? null)} />
              </Button>

              <Alert severity="info">
                After submission, an administrator reviews your application and assigns the trainer competency assessment. Trainer publishing privileges are available only after successful assessment and approval.
              </Alert>

              <Button type="submit" variant="contained" fullWidth size="large" disabled={busy} sx={{ py: 1.3, bgcolor: '#075B91', textTransform: 'none', fontWeight: 750, borderRadius: 1.5 }}>
                {busy ? 'Submitting application...' : 'Create account & apply'}
              </Button>

              <Typography sx={{ textAlign: 'center', color: '#718594', fontSize: '.9rem' }}>
                Looking for a trainee account?{' '}
                <Button component={RouterLink} to="/signup/trainee" sx={{ p: 0, minWidth: 0, color: '#075B91', textTransform: 'none', fontWeight: 750 }}>
                  Sign up as Trainee
                </Button>
              </Typography>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default TrainerSignup;
