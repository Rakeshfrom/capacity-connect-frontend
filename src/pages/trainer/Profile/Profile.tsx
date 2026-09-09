import { useEffect, useRef, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import {
  getTrainerProfile,
  updateTrainerProfile,
  getCurrentUserProfilePhoto,
  getCurrentUser,
  updateCurrentUserProfile,
} from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

type TrainerProfileData = {
  designation?: string;
  department?: string;
  specialization?: string;
  expertise?: string;
  experienceYears?: number;
  qualifications?: string;
  bio?: string;
};

const TrainerProfile = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [profile, setProfile] = useState<TrainerProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState<TrainerProfileData>({});
  const [photoPreview, setPhotoPreview] = useState('');
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (authLoading || !user) return;

    const loadProfile = async () => {
      try {
        const currentUser = await getCurrentUser();
        const data = await getTrainerProfile(currentUser.id);
        setProfile(data);

        if (currentUser.profilePicUrl) {
          try {
            const blob = await getCurrentUserProfilePhoto();
            setPhotoPreview(URL.createObjectURL(blob));
          } catch {
            setPhotoPreview('');
          }
        }
      } catch (error) {
        console.error('Failed to load trainer profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <Box
        sx={{
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography color="text.secondary">Loading profile...</Typography>
      </Box>
    );
  }

  const fullName = user
    ? `${user.firstName} ${user.lastName}`.trim()
    : 'Trainer';

  const initials = user
    ? `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase()
    : 'TR';

  const expertise = profile?.expertise
    ? profile.expertise.split(',').map((item) => item.trim()).filter(Boolean)
    : [];

  const openEdit = () => {
    setEditForm({ ...profile });
    setProfilePhoto(null);
    setEditOpen(true);
  };

  const handlePhotoChange = (file: File | null) => {
    setProfilePhoto(file);

    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (!user || saving) return;

    setSaving(true);

    try {
      const data = await updateTrainerProfile(user.id, {
        trainerId: user.id,
        designation: editForm.designation,
        department: editForm.department,
        specialization: editForm.specialization,
        expertise: editForm.expertise,
        experienceYears: editForm.experienceYears,
        qualifications: editForm.qualifications,
        bio: editForm.bio,
      });

      await updateCurrentUserProfile({
        department: editForm.department,
        qualifications: editForm.qualifications,
        experienceYears: editForm.experienceYears,
        profilePhoto,
      });

      setProfile(data);
      setProfilePhoto(null);
      setEditOpen(false);
    } catch (error) {
      console.error('Failed to update trainer profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const updateField = (
    field: keyof TrainerProfileData,
    value: string | number
  ) => {
    setEditForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  return (
    <Box sx={{ bgcolor: '#F5F8FA', minHeight: '100vh' }}>
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          sx={{
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'center' },
            gap: 2,
            mb: 4,
          }}
        >
          <Box>
            <Typography
              sx={{
                color: '#0B5A91',
                fontWeight: 700,
                fontSize: '0.82rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              Trainer Portal
            </Typography>

            <Typography
              sx={{
                color: '#173F60',
                fontWeight: 800,
                fontSize: { xs: '2rem', md: '2.6rem' },
                mt: 0.5,
              }}
            >
              My Profile
            </Typography>

            <Typography sx={{ color: '#657887', mt: 1 }}>
              View your professional information and trainer expertise.
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<EditOutlinedIcon />}
            onClick={openEdit}
            sx={{
              bgcolor: '#0B5A91',
              textTransform: 'none',
              fontWeight: 700,
              px: 2.5,
              py: 1.2,
              '&:hover': { bgcolor: '#084873' },
            }}
          >
            Edit Profile
          </Button>
        </Stack>

        <Card
          elevation={0}
          sx={{
            border: '1px solid #DCE8F0',
            borderRadius: 2,
            mb: 2.5,
          }}
        >
          <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              sx={{
                alignItems: { xs: 'flex-start', sm: 'center' },
                gap: 3,
              }}
            >
              <Avatar
                src={photoPreview || undefined}
                sx={{
                  width: 88,
                  height: 88,
                  bgcolor: '#0B5A91',
                  fontSize: '1.8rem',
                  fontWeight: 700,
                }}
              >
                {!photoPreview ? initials : null}
              </Avatar>

              <Box sx={{ flex: 1 }}>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  sx={{
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    gap: 1.5,
                  }}
                >
                  <Typography
                    sx={{
                      color: '#173F60',
                      fontSize: '1.6rem',
                      fontWeight: 800,
                    }}
                  >
                    {fullName}
                  </Typography>

                  <Chip
                    icon={<VerifiedOutlinedIcon />}
                    label="Verified Trainer"
                    size="small"
                    sx={{
                      bgcolor: '#EAF4FB',
                      color: '#0B5A91',
                      fontWeight: 700,
                    }}
                  />
                </Stack>

                <Typography sx={{ color: '#657887', mt: 0.5 }}>
                  {profile?.designation || 'Trainer'}
                </Typography>

                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  sx={{
                    gap: { xs: 0.8, sm: 2.5 },
                    mt: 1.5,
                  }}
                >
                  <Stack direction="row" sx={{ alignItems: 'center', gap: 0.7 }}>
                    <WorkOutlineOutlinedIcon
                      sx={{ fontSize: 18, color: '#718594' }}
                    />
                    <Typography sx={{ color: '#718594', fontSize: '0.88rem' }}>
                      {user?.department || profile?.department || 'IMD'}
                    </Typography>
                  </Stack>

                  <Stack direction="row" sx={{ alignItems: 'center', gap: 0.7 }}>
                    <LocationOnOutlinedIcon
                      sx={{ fontSize: 18, color: '#718594' }}
                    />
                    <Typography sx={{ color: '#718594', fontSize: '0.88rem' }}>
                      {profile?.specialization || 'Meteorology'}
                    </Typography>
                  </Stack>
                </Stack>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        <Card
          elevation={0}
          sx={{
            border: '1px solid #DCE8F0',
            borderRadius: 2,
            mb: 2.5,
          }}
        >
          <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
            <Typography
              sx={{
                color: '#173F60',
                fontWeight: 700,
                fontSize: '1.05rem',
                mb: 0.5,
              }}
            >
              Active Role
            </Typography>

            <Typography sx={{ color: '#718594', fontSize: '0.9rem', mb: 1.8 }}>
              Switch between your approved portal roles without signing out.
            </Typography>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1.2}
              sx={{ maxWidth: 520 }}
            >
              {user?.roles?.includes('TRAINEE') && (
                <Button
                  variant="outlined"
                  onClick={() => navigate('/trainee/dashboard')}
                  sx={{
                    flex: 1,
                    textTransform: 'none',
                    fontWeight: 700,
                    borderColor: '#B9D0E0',
                    color: '#0B5A91',
                  }}
                >
                  ↔ Trainee Portal
                </Button>
              )}

              {user?.roles?.includes('TRAINER') && (
                <Button
                  variant="contained"
                  onClick={() => navigate('/trainer/dashboard')}
                  sx={{
                    flex: 1,
                    textTransform: 'none',
                    fontWeight: 700,
                    bgcolor: '#0B5A91',
                    '&:hover': { bgcolor: '#084873' },
                  }}
                >
                  ↔ Trainer Portal
                </Button>
              )}
            </Stack>
          </CardContent>
        </Card>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '1.4fr 1fr' },
            gap: 2.5,
          }}
        >
          <Card
            elevation={0}
            sx={{
              border: '1px solid #DCE8F0',
              borderRadius: 2,
            }}
          >
            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
              <Typography
                sx={{
                  color: '#173F60',
                  fontWeight: 700,
                  fontSize: '1.15rem',
                  mb: 2.5,
                }}
              >
                Professional Information
              </Typography>

              <Stack spacing={2.2}>
                {[
                  ['Full Name', fullName],
                  ['Designation', profile?.designation || 'Not available'],
                  ['Department', user?.department || profile?.department || 'Not available'],
                  ['Organisation', 'India Meteorological Department'],
                  ['Email', user?.email || 'Not available'],
                  [
                    'Experience',
                    `${user?.experienceYears ?? profile?.experienceYears ?? 0} Years`,
                  ],
                ].map(([label, value]) => (
                  <Box key={label}>
                    <Typography
                      sx={{
                        color: '#718594',
                        fontSize: '0.82rem',
                        mb: 0.35,
                      }}
                    >
                      {label}
                    </Typography>
                    <Typography
                      sx={{
                        color: '#173F60',
                        fontWeight: 600,
                        fontSize: '0.98rem',
                      }}
                    >
                      {value}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>

          <Card
            elevation={0}
            sx={{
              border: '1px solid #DCE8F0',
              borderRadius: 2,
            }}
          >
            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
              <Typography
                sx={{
                  color: '#173F60',
                  fontWeight: 700,
                  fontSize: '1.15rem',
                  mb: 2,
                }}
              >
                Qualifications
              </Typography>

              <Stack direction="row" sx={{ gap: 1.5, alignItems: 'flex-start' }}>
                <SchoolOutlinedIcon sx={{ color: '#0B5A91', mt: 0.2 }} />
                <Typography sx={{ color: '#173F60', fontWeight: 600 }}>
                  {user?.qualifications || profile?.qualifications || 'Qualifications not available'}
                </Typography>
              </Stack>
            </CardContent>
          </Card>

          <Card
            elevation={0}
            sx={{
              border: '1px solid #DCE8F0',
              borderRadius: 2,
              gridColumn: { lg: '1 / -1' },
            }}
          >
            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
              <Typography
                sx={{
                  color: '#173F60',
                  fontWeight: 700,
                  fontSize: '1.15rem',
                }}
              >
                Areas of Expertise
              </Typography>

              <Typography sx={{ color: '#718594', mt: 0.5, mb: 2 }}>
                Subjects and competencies relevant to training assignments.
              </Typography>

              <Stack
                direction="row"
                sx={{ flexWrap: 'wrap', gap: 1 }}
              >
                {expertise.length > 0 ? (
                  expertise.map((skill) => (
                    <Chip
                      key={skill}
                      label={skill}
                      sx={{
                        bgcolor: '#EAF4FB',
                        color: '#0B5A91',
                        fontWeight: 600,
                      }}
                    />
                  ))
                ) : (
                  <Typography sx={{ color: '#718594' }}>
                    No expertise information available.
                  </Typography>
                )}
              </Stack>
            </CardContent>
          </Card>

          {profile?.bio && (
            <Card
              elevation={0}
              sx={{
                border: '1px solid #DCE8F0',
                borderRadius: 2,
                gridColumn: { lg: '1 / -1' },
              }}
            >
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <Typography
                  sx={{
                    color: '#173F60',
                    fontWeight: 700,
                    fontSize: '1.15rem',
                    mb: 1,
                  }}
                >
                  Professional Summary
                </Typography>
                <Typography sx={{ color: '#657887', lineHeight: 1.7 }}>
                  {profile.bio}
                </Typography>
              </CardContent>
            </Card>
          )}
        </Box>
      </Container>

      <Dialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle
          sx={{
            color: '#173F60',
            fontWeight: 800,
          }}
        >
          Edit Trainer Profile
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ pt: 3 }}>
          <Stack spacing={2.2}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              sx={{ alignItems: { xs: 'flex-start', sm: 'center' } }}
            >
              <Avatar
                src={photoPreview || undefined}
                sx={{
                  width: 84,
                  height: 84,
                  bgcolor: '#EAF3F9',
                  color: '#0B5A91',
                  fontSize: '1.8rem',
                  fontWeight: 700,
                }}
              >
                {!photoPreview ? initials : null}
              </Avatar>

              <Box>
                <Button
                  variant="outlined"
                  onClick={() => photoInputRef.current?.click()}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 700,
                    borderColor: '#0B5A91',
                    color: '#0B5A91',
                  }}
                >
                  Change Photo
                </Button>

                <input
                  ref={photoInputRef}
                  hidden
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                  onChange={(e) =>
                    handlePhotoChange(e.target.files?.[0] ?? null)
                  }
                />

                <Typography sx={{ color: '#718594', fontSize: '0.78rem', mt: 0.7 }}>
                  JPG, JPEG, PNG or WEBP · Max 5 MB
                </Typography>
              </Box>
            </Stack>

            <TextField
              label="Full Name"
              value={fullName}
              fullWidth
              disabled
            />

            <TextField
              label="Email"
              value={user?.email || ''}
              fullWidth
              disabled
            />

            <TextField
              label="Designation"
              value={editForm.designation || ''}
              onChange={(e) => updateField('designation', e.target.value)}
              fullWidth
            />

            <TextField
              label="Department"
              value={editForm.department || ''}
              onChange={(e) => updateField('department', e.target.value)}
              fullWidth
            />

            <TextField
              label="Specialization"
              value={editForm.specialization || ''}
              onChange={(e) => updateField('specialization', e.target.value)}
              fullWidth
            />

            <TextField
              label="Experience (Years)"
              type="number"
              value={editForm.experienceYears ?? ''}
              onChange={(e) =>
                updateField(
                  'experienceYears',
                  e.target.value === '' ? 0 : Number(e.target.value)
                )
              }
              fullWidth
            />

            <TextField
              label="Qualifications"
              value={editForm.qualifications || ''}
              onChange={(e) => updateField('qualifications', e.target.value)}
              fullWidth
            />

            <TextField
              label="Areas of Expertise"
              value={editForm.expertise || ''}
              onChange={(e) => updateField('expertise', e.target.value)}
              helperText="Separate multiple areas with commas."
              fullWidth
            />

            <TextField
              label="Professional Summary"
              value={editForm.bio || ''}
              onChange={(e) => updateField('bio', e.target.value)}
              multiline
              rows={4}
              fullWidth
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button
            onClick={() => setEditOpen(false)}
            sx={{ textTransform: 'none', color: '#526777' }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving}
            sx={{
              bgcolor: '#0B5A91',
              textTransform: 'none',
              '&:hover': { bgcolor: '#084873' },
            }}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TrainerProfile;
