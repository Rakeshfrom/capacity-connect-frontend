import {
  Avatar, Box, Button, Card, CardContent, Chip, Container, Dialog,
  DialogActions, DialogContent, DialogTitle, IconButton, Stack, TextField, Typography,
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SwapHorizOutlinedIcon from '@mui/icons-material/SwapHorizOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { getCurrentUserProfilePhoto, getMyTrainerApplication, getTrainerProfile, updateCurrentUserProfile, updateTrainerProfile } from '../../../services/api';

type TrainerProfileData = { designation?: string; department?: string; specialization?: string; expertise?: string; experienceYears?: number; qualifications?: string; bio?: string };

const TrainerProfile = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<TrainerProfileData | null>(null);
  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [photoPreview, setPhotoPreview] = useState('');
  const [form, setForm] = useState<TrainerProfileData>({});

  const roles = useMemo(() => user?.roles?.length ? user.roles : user ? [user.role] : [], [user]);
  const dualRole = roles.includes('TRAINEE') && roles.includes('TRAINER');

  useEffect(() => {
    if (authLoading || !user) return;
    Promise.all([
      getTrainerProfile(user.id),
      getMyTrainerApplication().catch(() => null),
    ]).then(async ([p, a]) => {
      setProfile(p);
      setApplication(a);
      if (user.profilePicUrl) {
        try { setPhotoPreview(URL.createObjectURL(await getCurrentUserProfilePhoto())); } catch { setPhotoPreview(''); }
      }
    }).catch(() => {}).finally(() => setLoading(false));
  }, [user, authLoading]);

  if (authLoading || loading) return <Box sx={{ minHeight: '60vh', display: 'grid', placeItems: 'center' }}><Typography color="text.secondary">Loading profile...</Typography></Box>;
  if (!user) return null;

  const fullName = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || 'Trainer';
  const initials = `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase() || 'TR';
  const expertise = profile?.expertise ? profile.expertise.split(',').map((x) => x.trim()).filter(Boolean) : [];
  const verified = user.role === 'TRAINER' && (!application || application.status === 'APPROVED');

  const save = async () => {
    try {
      const data = await updateTrainerProfile(user.id, { trainerId: user.id, designation: form.designation, department: form.department, specialization: form.specialization, expertise: form.expertise, experienceYears: form.experienceYears, qualifications: form.qualifications, bio: form.bio });
      await updateCurrentUserProfile({ department: form.department, qualifications: form.qualifications, experienceYears: form.experienceYears });
      setProfile(data); setEditOpen(false); window.location.reload();
    } catch {}
  };

  return <Box sx={{ bgcolor: '#F6F9FC', minHeight: '100vh' }}><Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 } }}>
    <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, mb: 3 }}>
      <Box><Typography sx={{ color: '#0B5A91', fontSize: '.76rem', fontWeight: 800, letterSpacing: '.1em', textTransform: 'uppercase' }}>Trainer Portal</Typography><Typography sx={{ color: '#173F60', fontSize: { xs: '1.8rem', md: '2.25rem' }, fontWeight: 800, mt: .35 }}>My Profile</Typography></Box>
      <Stack direction="row" spacing={1}>{dualRole && <IconButton aria-label="Switch to trainee portal" onClick={() => navigate('/trainee/dashboard')} sx={{ border: '1px solid #BFD2DE', borderRadius: 1.5, color: '#0B5A91', bgcolor: '#fff' }}><SwapHorizOutlinedIcon /></IconButton>}<Button variant="contained" startIcon={<EditOutlinedIcon />} onClick={() => { setForm({ ...profile }); setEditOpen(true); }} sx={{ bgcolor: '#0B5A91', textTransform: 'none', fontWeight: 700, borderRadius: 1.5 }}>Edit Profile</Button></Stack>
    </Stack>

    <Card elevation={0} sx={{ border: '1px solid #D9E4EB', borderRadius: 2, mb: 2 }}><CardContent sx={{ p: { xs: 2, md: 2.5 } }}><Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.2}><Avatar src={photoPreview || undefined} sx={{ width: 82, height: 82, bgcolor: '#0B5A91', fontWeight: 800, fontSize: '1.8rem' }}>{photoPreview ? null : initials}</Avatar><Box sx={{ flex: 1 }}><Stack direction="row" sx={{ alignItems: 'center', flexWrap: 'wrap', gap: 1 }}><Typography sx={{ color: '#173F60', fontSize: '1.45rem', fontWeight: 800 }}>{fullName}</Typography>{verified && <Chip size="small" icon={<VerifiedOutlinedIcon />} label="Verified Trainer" color="success" />}</Stack><Typography sx={{ color: '#657887', mt: .35 }}>{profile?.designation || 'Trainer'}</Typography><Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.8} sx={{ mt: 1.1 }}><Stack direction="row" spacing={.6}><WorkOutlineOutlinedIcon sx={{ fontSize: 17, color: '#7A8C99' }}/><Typography sx={{ fontSize: '.86rem', color: '#657887' }}>{user.department || profile?.department || 'IMD'}</Typography></Stack><Stack direction="row" spacing={.6}><LocationOnOutlinedIcon sx={{ fontSize: 17, color: '#7A8C99' }}/><Typography sx={{ fontSize: '.86rem', color: '#657887' }}>{profile?.specialization || 'Meteorology'}</Typography></Stack></Stack></Box></Stack></CardContent></Card>

    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.2fr .8fr' }, gap: 2 }}>
      <Card elevation={0} sx={{ border: '1px solid #D9E4EB', borderRadius: 2 }}><CardContent sx={{ p: { xs: 2, md: 2.5 } }}><Typography sx={{ color: '#173F60', fontWeight: 800, mb: 2 }}>Professional details</Typography><Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, columnGap: 3, rowGap: 1.8 }}>{[['Full name', fullName],['Email', user.email],['Designation', profile?.designation || 'Not provided'],['Department', user.department || profile?.department || 'Not provided'],['Qualification', user.qualifications || profile?.qualifications || 'Not provided'],['Experience', user.experienceYears == null && profile?.experienceYears == null ? 'Not provided' : `${user.experienceYears ?? profile?.experienceYears} years`]].map(([label,value]) => <Box key={label}><Typography sx={{ color: '#7A8C99', fontSize: '.75rem' }}>{label}</Typography><Typography sx={{ color: '#243B4D', mt: .3, fontWeight: 600, fontSize: '.92rem' }}>{value}</Typography></Box>)}</Box></CardContent></Card>
      <Card elevation={0} sx={{ border: '1px solid #D9E4EB', borderRadius: 2 }}><CardContent sx={{ p: { xs: 2, md: 2.5 } }}><Typography sx={{ color: '#173F60', fontWeight: 800, mb: 1.4 }}>Qualifications</Typography><Stack direction="row" spacing={1}><SchoolOutlinedIcon sx={{ color: '#0B5A91' }}/><Typography sx={{ color: '#304B5F', lineHeight: 1.6 }}>{user.qualifications || profile?.qualifications || 'Not provided'}</Typography></Stack>{expertise.length > 0 && <><Typography sx={{ color: '#173F60', fontWeight: 800, mt: 2.2, mb: 1 }}>Areas of expertise</Typography><Stack direction="row" sx={{ flexWrap: 'wrap', gap: .7 }}>{expertise.map((e) => <Chip size="small" key={e} label={e} sx={{ bgcolor: '#EAF4FB', color: '#0B5A91', fontWeight: 600 }}/>)}</Stack></>}{profile?.bio && <><Typography sx={{ color: '#173F60', fontWeight: 800, mt: 2.2, mb: .5 }}>About</Typography><Typography sx={{ color: '#657887', lineHeight: 1.6, fontSize: '.9rem' }}>{profile.bio}</Typography></>}</CardContent></Card>
    </Box>
  </Container>

  <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="sm"><DialogTitle sx={{ color: '#173F60', fontWeight: 800 }}>Edit trainer profile</DialogTitle><DialogContent><Stack spacing={1.6} sx={{ pt: 1 }}><TextField label="Designation" value={form.designation ?? ''} onChange={(e) => setForm((f) => ({ ...f, designation: e.target.value }))}/><TextField label="Department" value={form.department ?? ''} onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}/><TextField label="Specialization" value={form.specialization ?? ''} onChange={(e) => setForm((f) => ({ ...f, specialization: e.target.value }))}/><TextField label="Areas of expertise" value={form.expertise ?? ''} onChange={(e) => setForm((f) => ({ ...f, expertise: e.target.value }))} multiline minRows={2}/><TextField label="Experience (years)" type="number" value={form.experienceYears ?? ''} onChange={(e) => setForm((f) => ({ ...f, experienceYears: e.target.value ? Number(e.target.value) : undefined }))}/><TextField label="Qualification" value={form.qualifications ?? ''} onChange={(e) => setForm((f) => ({ ...f, qualifications: e.target.value }))}/><TextField label="Bio" value={form.bio ?? ''} onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))} multiline minRows={3}/></Stack></DialogContent><DialogActions sx={{ p: 2 }}><Button onClick={() => setEditOpen(false)}>Cancel</Button><Button variant="contained" onClick={save}>Save changes</Button></DialogActions></Dialog>
  </Box>;
};
export default TrainerProfile;
