import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SwapHorizOutlinedIcon from '@mui/icons-material/SwapHorizOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import {
  applyForTrainer,
  getMyTrainerApplication,
  getMyTrainerApplicationAssessment,
  submitMyTrainerApplicationAssessment,
  updateCurrentUserProfile,
} from '../../../services/api';

type AppStatus = 'PENDING' | 'ASSESSMENT_REQUIRED' | 'ASSESSMENT_SUBMITTED' | 'APPROVED' | 'REJECTED';
interface Application {
  id: number;
  status: AppStatus;
  reason?: string;
  adminComment?: string;
  assessmentScore?: number;
  assessmentPassed?: boolean;
}
interface Question {
  id: string;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
}
interface Assessment {
  status: AppStatus;
  score?: number;
  passed?: boolean;
  questions?: Question[];
}

const Profile = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const cvRef = useRef<HTMLInputElement>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('');
  const [qualification, setQualification] = useState('');
  const [skills, setSkills] = useState('');
  const [experience, setExperience] = useState('');
  const [interests, setInterests] = useState('');
  const [application, setApplication] = useState<Application | null>(null);
  const [applyOpen, setApplyOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [cv, setCv] = useState<File | null>(null);
  const [assessmentOpen, setAssessmentOpen] = useState(false);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user) return;
    setPhone(user.phoneNumber ?? '');
    setDepartment(user.department ?? '');
    setQualification(user.qualifications ?? '');
    setSkills(user.skills ?? '');
    setExperience(user.experienceYears == null ? '' : String(user.experienceYears));
    setInterests(user.interests ?? '');
    if (user.role === 'TRAINEE' || user.roles?.includes('TRAINEE')) {
      getMyTrainerApplication().then((data) => setApplication(data ?? null)).catch(() => setApplication(null));
    }
  }, [user]);

  const roles = useMemo(() => user?.roles?.length ? user.roles : user ? [user.role] : [], [user]);
  const dualRole = roles.includes('TRAINEE') && roles.includes('TRAINER');
  const traineeOnly = roles.includes('TRAINEE') && !roles.includes('TRAINER');

  if (loading) return <Box sx={{ minHeight: '60vh', display: 'grid', placeItems: 'center' }}><Typography color="text.secondary">Loading profile...</Typography></Box>;
  if (!user) return null;

  const fullName = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || 'User';
  const initials = `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase() || 'U';

  const saveProfile = async () => {
    try {
      setBusy(true);
      await updateCurrentUserProfile({
        phoneNumber: phone,
        department,
        qualifications: qualification,
        skills,
        experienceYears: experience ? Number(experience) : undefined,
        interests,
      });
      setEditOpen(false);
      window.location.reload();
    } catch {
      setMessage('Unable to update profile.');
    } finally {
      setBusy(false);
    }
  };

  const submitApplication = async () => {
    if (!qualification.trim() || !experience.trim() || !cv) {
      setMessage('Qualification, experience and CV are required.');
      return;
    }
    const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(cv.type)) {
      setMessage('CV must be PDF, DOC or DOCX.');
      return;
    }
    if (cv.size > 10 * 1024 * 1024) {
      setMessage('CV must be smaller than 10 MB.');
      return;
    }
    try {
      setBusy(true);
      setMessage('');
      await updateCurrentUserProfile({
        qualifications: qualification,
        experienceYears: Number(experience),
      });
      const data = await applyForTrainer({
        reason,
        supportingDocumentUrl: '',
        supportingDocument: cv,
      });
      setApplication(data);
      setApplyOpen(false);
      setReason('');
      setCv(null);
      if (cvRef.current) cvRef.current.value = '';
      setMessage('Trainer application submitted. Await administrator review and assessment.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to submit trainer application.');
    } finally {
      setBusy(false);
    }
  };

  const openAssessment = async () => {
    try {
      setBusy(true);
      const data = await getMyTrainerApplicationAssessment();
      setAssessment(data);
      setAnswers({});
      setAssessmentOpen(true);
    } catch {
      setMessage('Assessment is not available yet.');
    } finally {
      setBusy(false);
    }
  };

  const submitAssessment = async () => {
    if (!assessment?.questions?.length) return;
    if (assessment.questions.some((q) => !answers[q.id])) {
      setMessage('Please answer all questions.');
      return;
    }
    try {
      setBusy(true);
      const data = await submitMyTrainerApplicationAssessment(answers);
      setAssessment(data);
      setApplication((a) => a ? { ...a, status: 'ASSESSMENT_SUBMITTED', assessmentScore: data.score, assessmentPassed: data.passed } : a);
    } catch {
      setMessage('Unable to submit assessment.');
    } finally {
      setBusy(false);
    }
  };

  const statusText = !application
    ? 'Not submitted'
    : application.status === 'PENDING'
      ? 'Under admin review'
      : application.status === 'ASSESSMENT_REQUIRED'
        ? 'Assessment required'
        : application.status === 'ASSESSMENT_SUBMITTED'
          ? `Assessment ${application.assessmentPassed ? 'passed' : 'submitted'}${application.assessmentScore != null ? ` • ${application.assessmentScore}%` : ''}`
          : application.status === 'APPROVED'
            ? 'Approved • Verified Trainer'
            : 'Rejected • Reapply';

  return (
    <Box sx={{ bgcolor: '#F6F9FC', minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, mb: 3 }}>
          <Box>
            <Typography sx={{ color: '#0B5A91', fontSize: '.76rem', fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase' }}>Trainee Portal</Typography>
            <Typography sx={{ color: '#173F60', fontSize: { xs: '1.8rem', md: '2.25rem' }, fontWeight: 800, mt: .35 }}>My Profile</Typography>
            <Typography sx={{ color: '#657887', mt: .5 }}>Personal and professional learning information.</Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            {dualRole && <IconButton aria-label="Switch to trainer portal" onClick={() => navigate('/trainer/dashboard')} sx={{ border: '1px solid #BFD2DE', borderRadius: 1.5, color: '#0B5A91', bgcolor: '#fff' }}><SwapHorizOutlinedIcon /></IconButton>}
            <Button variant="contained" startIcon={<EditOutlinedIcon />} onClick={() => setEditOpen(true)} sx={{ bgcolor: '#0B5A91', textTransform: 'none', fontWeight: 700, borderRadius: 1.5 }}>Edit Profile</Button>
          </Stack>
        </Stack>

        {message && <Alert severity="info" sx={{ mb: 2 }}>{message}</Alert>}

        <Paper elevation={0} sx={{ p: { xs: 2, md: 2.5 }, border: '1px solid #D9E4EB', borderRadius: 2, mb: 2 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.2}>
            <Avatar sx={{ width: 80, height: 80, bgcolor: '#EAF3F9', color: '#0B5A91', fontSize: '1.75rem', fontWeight: 800 }}>{initials}</Avatar>
            <Box sx={{ flex: 1 }}>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
                <Typography sx={{ color: '#173F60', fontSize: '1.45rem', fontWeight: 800 }}>{fullName}</Typography>
                {user.role === 'TRAINER' && <Chip size="small" icon={<VerifiedOutlinedIcon />} label="Verified Trainer" color="success" />}
              </Stack>
              <Typography sx={{ color: '#657887', mt: .35 }}>{user.email}</Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.8} sx={{ mt: 1.1 }}>
                <Stack direction="row" spacing={.6}><WorkOutlineOutlinedIcon sx={{ fontSize: 17, color: '#7A8C99' }} /><Typography sx={{ fontSize: '.86rem', color: '#657887' }}>{user.department || 'Organisation not provided'}</Typography></Stack>
                <Stack direction="row" spacing={.6}><SchoolOutlinedIcon sx={{ fontSize: 17, color: '#7A8C99' }} /><Typography sx={{ fontSize: '.86rem', color: '#657887' }}>{user.qualifications || 'Qualification not provided'}</Typography></Stack>
              </Stack>
            </Box>
          </Stack>
        </Paper>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.2fr .8fr' }, gap: 2 }}>
          <Paper elevation={0} sx={{ p: { xs: 2, md: 2.5 }, border: '1px solid #D9E4EB', borderRadius: 2 }}>
            <Typography sx={{ color: '#173F60', fontWeight: 800, mb: 2 }}>Profile details</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, columnGap: 3, rowGap: 1.8 }}>
              {[
                ['Full name', fullName], ['Email', user.email], ['Phone', user.phoneNumber || 'Not provided'],
                ['Organisation', user.department || 'Not provided'], ['Qualification', user.qualifications || 'Not provided'],
                ['Experience', user.experienceYears == null ? 'Not provided' : `${user.experienceYears} years`],
                ['Skills', user.skills || 'Not provided'], ['Interests', user.interests || 'Not provided'],
              ].map(([label, value]) => <Box key={label}><Typography sx={{ color: '#7A8C99', fontSize: '.75rem' }}>{label}</Typography><Typography sx={{ color: '#243B4D', fontWeight: 600, mt: .3, fontSize: '.92rem' }}>{value}</Typography></Box>)}
            </Box>
          </Paper>

          <Paper elevation={0} sx={{ p: { xs: 2, md: 2.5 }, border: '1px solid #D9E4EB', borderRadius: 2 }}>
            <Typography sx={{ color: '#173F60', fontWeight: 800, mb: 1.2 }}>Trainer pathway</Typography>
            <Typography sx={{ color: '#657887', fontSize: '.88rem', lineHeight: 1.6 }}>Trainer access is reviewed by an administrator and confirmed through an AI-assisted competency assessment.</Typography>
            {traineeOnly ? <>
              <Chip label={statusText} size="small" sx={{ mt: 1.6, fontWeight: 700 }} color={application?.status === 'REJECTED' ? 'error' : application?.status === 'APPROVED' ? 'success' : 'default'} />
              {!application && <Button fullWidth variant="outlined" endIcon={<ArrowForwardRoundedIcon />} onClick={() => setApplyOpen(true)} sx={{ mt: 1.4, textTransform: 'none', fontWeight: 700, color: '#0B5A91', borderColor: '#B9CEDB' }}>Apply for Trainer</Button>}
              {application?.status === 'REJECTED' && <Button fullWidth variant="outlined" onClick={() => setApplyOpen(true)} sx={{ mt: 1.4, textTransform: 'none', fontWeight: 700, color: '#0B5A91' }}>Reapply</Button>}
              {application?.status === 'ASSESSMENT_REQUIRED' && <Button fullWidth variant="contained" startIcon={<QuizOutlinedIcon />} onClick={openAssessment} disabled={busy} sx={{ mt: 1.4, bgcolor: '#0B5A91', textTransform: 'none', fontWeight: 700 }}>Take assessment</Button>}
            </> : <Chip label={dualRole ? 'Trainee + Trainer' : statusText} sx={{ mt: 1.6, bgcolor: '#EAF4FB', color: '#0B5A91', fontWeight: 700 }} />}
          </Paper>
        </Box>
      </Container>

      <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ color: '#173F60', fontWeight: 800 }}>Edit profile</DialogTitle>
        <DialogContent><Stack spacing={1.6} sx={{ pt: 1 }}>
          <TextField label="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <TextField label="Organisation / Institution" value={department} onChange={(e) => setDepartment(e.target.value)} />
          <TextField label="Qualification" value={qualification} onChange={(e) => setQualification(e.target.value)} />
          <TextField label="Skills" value={skills} onChange={(e) => setSkills(e.target.value)} />
          <TextField label="Experience (years)" type="number" value={experience} onChange={(e) => setExperience(e.target.value)} />
          <TextField label="Areas of interest" value={interests} onChange={(e) => setInterests(e.target.value)} multiline minRows={2} />
        </Stack></DialogContent>
        <DialogActions sx={{ p: 2 }}><Button onClick={() => setEditOpen(false)}>Cancel</Button><Button variant="contained" onClick={saveProfile} disabled={busy}>Save changes</Button></DialogActions>
      </Dialog>

      <Dialog open={applyOpen} onClose={() => !busy && setApplyOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ color: '#173F60', fontWeight: 800 }}>Apply for Trainer</DialogTitle>
        <DialogContent><Stack spacing={1.6} sx={{ pt: 1 }}>
          <Alert severity="info">Submit your qualification, experience and CV. The administrator will review your profile before assigning the assessment.</Alert>
          <TextField required label="Qualification" value={qualification} onChange={(e) => setQualification(e.target.value)} />
          <TextField required label="Experience (years)" type="number" value={experience} onChange={(e) => setExperience(e.target.value)} />
          <TextField label="Reason for applying" value={reason} onChange={(e) => setReason(e.target.value)} multiline minRows={3} />
          <Button variant="outlined" startIcon={<UploadFileOutlinedIcon />} onClick={() => cvRef.current?.click()} sx={{ justifyContent: 'flex-start', textTransform: 'none' }}>{cv ? cv.name : 'Upload CV (PDF, DOC, DOCX)'}</Button>
          <input ref={cvRef} hidden type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={(e) => setCv(e.target.files?.[0] ?? null)} />
        </Stack></DialogContent>
        <DialogActions sx={{ p: 2 }}><Button onClick={() => setApplyOpen(false)} disabled={busy}>Cancel</Button><Button variant="contained" onClick={submitApplication} disabled={busy}>{busy ? 'Submitting...' : 'Submit application'}</Button></DialogActions>
      </Dialog>

      <Dialog open={assessmentOpen} onClose={() => !busy && setAssessmentOpen(false)} fullWidth maxWidth="md">
        <DialogTitle sx={{ color: '#173F60', fontWeight: 800 }}>Trainer competency assessment</DialogTitle>
        <DialogContent dividers>
          {assessment?.status === 'ASSESSMENT_SUBMITTED' ? <Box><Typography sx={{ color: '#173F60', fontWeight: 800 }}>Assessment submitted</Typography><Typography sx={{ color: '#657887', mt: .5 }}>Score: {assessment.score ?? 0}%</Typography><Chip sx={{ mt: 1 }} color={assessment.passed ? 'success' : 'error'} label={assessment.passed ? 'Passed • Awaiting admin approval' : 'Not passed'} /></Box> : <Stack spacing={2}>
            {assessment?.questions?.map((q, i) => <Box key={q.id}><Typography sx={{ color: '#173F60', fontWeight: 800 }}>{i + 1}. {q.questionText}</Typography><Stack spacing={.8} sx={{ mt: 1 }}>{(['A','B','C','D'] as const).map((option) => <Button key={option} variant={answers[q.id] === option ? 'contained' : 'outlined'} onClick={() => setAnswers((a) => ({ ...a, [q.id]: option }))} sx={{ justifyContent: 'flex-start', textTransform: 'none', textAlign: 'left' }}>{option}. {q[`option${option}`]}</Button>)}</Stack>{i < (assessment.questions?.length ?? 0) - 1 && <Divider sx={{ mt: 2 }} />}</Box>)}
          </Stack>}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}><Button onClick={() => setAssessmentOpen(false)}>Close</Button>{assessment?.status === 'ASSESSMENT_REQUIRED' && <Button variant="contained" onClick={submitAssessment} disabled={busy}>{busy ? 'Submitting...' : 'Submit assessment'}</Button>}</DialogActions>
      </Dialog>
    </Box>
  );
};

export default Profile;
