import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import SwapHorizOutlinedIcon from '@mui/icons-material/SwapHorizOutlined';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import {
  updateCurrentUserProfile,
  getMyTrainerApplication,
  applyForTrainer,
  getCurrentUserProfilePhoto,
} from '../../../services/api';

const Profile = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const photoInputRef = useRef<HTMLInputElement>(null);

  const [editMode, setEditMode] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [department, setDepartment] = useState('');
  const [qualifications, setQualifications] = useState('');
  const [skills, setSkills] = useState('');
  const [experienceYears, setExperienceYears] = useState('');
  const [interests, setInterests] = useState('');
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const [application, setApplication] = useState<any>(null);
  const [applyOpen, setApplyOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [supportingDocumentUrl, setSupportingDocumentUrl] = useState('');
  const [supportingDocument, setSupportingDocument] = useState<File | null>(null);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    if (!user) return;

    setPhoneNumber(user.phoneNumber ?? '');
    setDepartment(user.department ?? '');
    setQualifications(user.qualifications ?? '');
    setSkills(user.skills ?? '');
    setExperienceYears(
      user.experienceYears !== undefined && user.experienceYears !== null
        ? String(user.experienceYears)
        : ''
    );
    setInterests(user.interests ?? '');
    setPhotoPreview('');

    let objectUrl: string | null = null;

    if (user.profilePicUrl) {
      getCurrentUserProfilePhoto()
        .then((blob) => {
          objectUrl = URL.createObjectURL(blob);
          setPhotoPreview(objectUrl);
        })
        .catch(() => {
          setPhotoPreview('');
        });
    }

    getMyTrainerApplication()
      .then((data) => setApplication(data))
      .catch(() => setApplication(null));

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [user]);

  if (loading) {
    return (
      <Box sx={{ minHeight: '60vh', display: 'grid', placeItems: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return null;
  }

  const fullName = `${user.firstName} ${user.lastName}`.trim() || 'Trainee';
  const initials =
    `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase() || 'TR';

  const roles = user.roles ?? [user.role];
  const isTrainer = roles.includes('TRAINER');

  const handlePhotoChange = (file: File | null) => {
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setMessage('Only JPG, PNG and WEBP images are allowed.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage('Profile photo must be smaller than 5 MB.');
      return;
    }

    setProfilePhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
    setMessage('');
  };

  const handleCancelEdit = () => {
    setPhoneNumber(user.phoneNumber ?? '');
    setDepartment(user.department ?? '');
    setQualifications(user.qualifications ?? '');
    setSkills(user.skills ?? '');
    setExperienceYears(
      user.experienceYears !== undefined && user.experienceYears !== null
        ? String(user.experienceYears)
        : ''
    );
    setInterests(user.interests ?? '');
    setProfilePhoto(null);
    setPhotoPreview(user.profilePicUrl ?? '');
    setMessage('');
    setEditMode(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    try {
      await updateCurrentUserProfile({
        phoneNumber,
        department,
        qualifications,
        skills,
        experienceYears: experienceYears ? Number(experienceYears) : undefined,
        interests,
        profilePhoto,
      });

      setMessage('Profile updated successfully.');
      setProfilePhoto(null);
      setEditMode(false);

      window.location.reload();
    } catch (error) {
      console.error('Failed to save profile:', error);
      setMessage('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleApplyForTrainer = async () => {
    setApplying(true);
    setMessage('');

    try {
      const data = await applyForTrainer({
        reason,
        supportingDocumentUrl,
        supportingDocument,
      });

      setApplication(data);
      setApplyOpen(false);
      setReason('');
      setSupportingDocumentUrl('');
      setSupportingDocument(null);
      setMessage('Trainer application submitted successfully.');
    } catch (error) {
      console.error('Failed to submit trainer application:', error);
      setMessage('Failed to submit trainer application.');
    } finally {
      setApplying(false);
    }
  };

  const renderValue = (value?: string | number | null, fallback = 'Not provided') => (
    <Typography
      sx={{
        color: value !== undefined && value !== null && String(value).trim()
          ? '#263746'
          : '#8A99A5',
        lineHeight: 1.7,
        whiteSpace: 'pre-wrap',
      }}
    >
      {value !== undefined && value !== null && String(value).trim()
        ? value
        : fallback}
    </Typography>
  );

  return (
    <Box sx={{ bgcolor: '#F4F8FB', minHeight: '100vh', py: { xs: 3, md: 5 } }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 2,
            flexWrap: 'wrap',
            mb: 4,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                color: '#173F60',
                fontWeight: 700,
                fontSize: { xs: '1.8rem', md: '2.2rem' },
              }}
            >
              My Profile
            </Typography>
            <Typography sx={{ mt: 0.7, color: '#657887' }}>
              View and manage your professional information.
            </Typography>
          </Box>

          {!editMode ? (
            <Button
              variant="contained"
              startIcon={<EditOutlinedIcon />}
              onClick={() => {
                setMessage('');
                setEditMode(true);
              }}
              sx={{
                bgcolor: '#0B5A91',
                textTransform: 'none',
                fontWeight: 700,
              }}
            >
              Edit Profile
            </Button>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<CloseOutlinedIcon />}
                onClick={handleCancelEdit}
                disabled={saving}
                sx={{
                  borderColor: '#9AAAB5',
                  color: '#536673',
                  textTransform: 'none',
                  fontWeight: 700,
                }}
              >
                Cancel
              </Button>

              <Button
                variant="contained"
                startIcon={<SaveOutlinedIcon />}
                onClick={handleSave}
                disabled={saving}
                sx={{
                  bgcolor: '#0B5A91',
                  textTransform: 'none',
                  fontWeight: 700,
                }}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </Box>
          )}
        </Box>

        {message && (
          <Alert
            severity={
              message.includes('successfully') ? 'success' : 'error'
            }
            sx={{ mb: 3 }}
          >
            {message}
          </Alert>
        )}

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '280px 1fr' },
            gap: 3,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 3,
              border: '1px solid #DCE6ED',
              borderRadius: 2,
              bgcolor: '#FFFFFF',
              height: 'fit-content',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Avatar
                src={photoPreview || undefined}
                sx={{
                  width: 112,
                  height: 112,
                  bgcolor: '#EAF3F9',
                  color: '#0B5A91',
                  fontSize: '2.4rem',
                  fontWeight: 700,
                }}
              >
                {!photoPreview ? initials : null}
              </Avatar>
            </Box>

            {editMode && (
              <>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<PhotoCameraOutlinedIcon />}
                  onClick={() => photoInputRef.current?.click()}
                  sx={{
                    mt: 2,
                    borderColor: '#0B5A91',
                    color: '#0B5A91',
                    textTransform: 'none',
                    fontWeight: 700,
                  }}
                >
                  Change Photo
                </Button>

                <input
                  ref={photoInputRef}
                  type="file"
                  hidden
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) =>
                    handlePhotoChange(e.target.files?.[0] ?? null)
                  }
                />
              </>
            )}

            <Typography
              align="center"
              sx={{
                mt: 2,
                color: '#173F60',
                fontWeight: 700,
                fontSize: '1.2rem',
              }}
            >
              {fullName}
            </Typography>

            <Typography align="center" sx={{ mt: 0.5, color: '#657887' }}>
              {user.role}
            </Typography>

            <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid #E5EDF2' }}>
              <Typography sx={{ color: '#657887', fontSize: '0.9rem' }}>
                Profile status
              </Typography>

              <Chip
                label={user.profileCompleted ? 'Completed' : 'Incomplete'}
                color={user.profileCompleted ? 'success' : 'warning'}
                size="small"
                sx={{ mt: 1 }}
              />
            </Box>

            {isTrainer && (
              <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid #E5EDF2' }}>
                <Typography
                  sx={{
                    color: '#173F60',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    mb: 1.5,
                  }}
                >
                  Active Role
                </Typography>

                <Box sx={{ display: 'grid', gap: 1 }}>
                  <Button
                    variant={user.role === 'TRAINEE' ? 'contained' : 'outlined'}
                    startIcon={<SwapHorizOutlinedIcon />}
                    onClick={() => navigate('/trainee/dashboard')}
                    sx={{
                      justifyContent: 'flex-start',
                      textTransform: 'none',
                      fontWeight: 700,
                      ...(user.role === 'TRAINEE'
                        ? { bgcolor: '#0B5A91' }
                        : {
                            color: '#0B5A91',
                            borderColor: '#B9CBD8',
                          }),
                    }}
                  >
                    Trainee Portal
                  </Button>

                  <Button
                    variant={user.role === 'TRAINER' ? 'contained' : 'outlined'}
                    startIcon={<SwapHorizOutlinedIcon />}
                    onClick={() => navigate('/trainer/dashboard')}
                    sx={{
                      justifyContent: 'flex-start',
                      textTransform: 'none',
                      fontWeight: 700,
                      ...(user.role === 'TRAINER'
                        ? { bgcolor: '#0B5A91' }
                        : {
                            color: '#0B5A91',
                            borderColor: '#B9CBD8',
                          }),
                    }}
                  >
                    Trainer Portal
                  </Button>
                </Box>
              </Box>
            )}
          </Paper>

          <Box sx={{ display: 'grid', gap: 3 }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.5, md: 3 },
                border: '1px solid #DCE6ED',
                borderRadius: 2,
                bgcolor: '#FFFFFF',
              }}
            >
              <Typography
                variant="h6"
                sx={{ color: '#173F60', fontWeight: 700, mb: 2.5 }}
              >
                Basic Information
              </Typography>

              {editMode ? (
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                    gap: 2,
                  }}
                >
                  <TextField
                    label="Full name"
                    value={fullName}
                    fullWidth
                    slotProps={{ input: { readOnly: true } }}
                  />

                  <TextField
                    label="Email address"
                    value={user.email}
                    fullWidth
                    slotProps={{ input: { readOnly: true } }}
                  />

                  <TextField
                    label="Phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    fullWidth
                  />

                  <TextField
                    label="Organization / Institution"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    fullWidth
                  />
                </Box>
              ) : (
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                    gap: 3,
                  }}
                >
                  <Box>
                    <Typography variant="caption" sx={{ color: '#718391' }}>
                      Full Name
                    </Typography>
                    {renderValue(fullName)}
                  </Box>

                  <Box>
                    <Typography variant="caption" sx={{ color: '#718391' }}>
                      Email Address
                    </Typography>
                    {renderValue(user.email)}
                  </Box>

                  <Box>
                    <Typography variant="caption" sx={{ color: '#718391' }}>
                      Phone Number
                    </Typography>
                    {renderValue(phoneNumber)}
                  </Box>

                  <Box>
                    <Typography variant="caption" sx={{ color: '#718391' }}>
                      Organization / Institution
                    </Typography>
                    {renderValue(department)}
                  </Box>
                </Box>
              )}
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.5, md: 3 },
                border: '1px solid #DCE6ED',
                borderRadius: 2,
                bgcolor: '#FFFFFF',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <SchoolOutlinedIcon sx={{ color: '#0B5A91' }} />
                <Typography variant="h6" sx={{ color: '#173F60', fontWeight: 700 }}>
                  Qualifications
                </Typography>
              </Box>

              {editMode ? (
                <TextField
                  label="Academic qualifications"
                  value={qualifications}
                  onChange={(e) => setQualifications(e.target.value)}
                  multiline
                  minRows={3}
                  fullWidth
                  placeholder="e.g. B.Sc. Meteorology, M.Sc. Atmospheric Science"
                />
              ) : (
                renderValue(qualifications)
              )}
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.5, md: 3 },
                border: '1px solid #DCE6ED',
                borderRadius: 2,
                bgcolor: '#FFFFFF',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <WorkOutlineOutlinedIcon sx={{ color: '#0B5A91' }} />
                <Typography variant="h6" sx={{ color: '#173F60', fontWeight: 700 }}>
                  Professional Experience
                </Typography>
              </Box>

              {editMode ? (
                <>
                  <TextField
                    label="Experience (years)"
                    type="number"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                    fullWidth
                    slotProps={{ htmlInput: { min: 0 } }}
                  />

                  <TextField
                    label="Experience and areas of work"
                    value={interests}
                    onChange={(e) => setInterests(e.target.value)}
                    multiline
                    minRows={3}
                    fullWidth
                    sx={{ mt: 2 }}
                    placeholder="Describe your professional experience and areas of work."
                  />
                </>
              ) : (
                <Box sx={{ display: 'grid', gap: 2 }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#718391' }}>
                      Experience
                    </Typography>
                    {renderValue(
                      experienceYears ? `${experienceYears} years` : '',
                    )}
                  </Box>

                  <Box>
                    <Typography variant="caption" sx={{ color: '#718391' }}>
                      Areas of Work / Interests
                    </Typography>
                    {renderValue(interests)}
                  </Box>
                </Box>
              )}
            </Paper>

            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.5, md: 3 },
                border: '1px solid #DCE6ED',
                borderRadius: 2,
                bgcolor: '#FFFFFF',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <VerifiedOutlinedIcon sx={{ color: '#0B5A91' }} />
                <Typography variant="h6" sx={{ color: '#173F60', fontWeight: 700 }}>
                  Skills
                </Typography>
              </Box>

              {editMode ? (
                <TextField
                  label="Skills"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  multiline
                  minRows={3}
                  fullWidth
                  placeholder="e.g. Weather Forecasting, Python, Data Analysis"
                />
              ) : (
                renderValue(skills)
              )}
            </Paper>

            {!isTrainer && (
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2.5, md: 3 },
                  border: '1px solid #DCE6ED',
                  borderRadius: 2,
                  bgcolor: '#FFFFFF',
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ color: '#173F60', fontWeight: 700, mb: 1 }}
                >
                  Become a Trainer
                </Typography>

                <Typography sx={{ color: '#657887', mb: 2 }}>
                  Apply to become a trainer and contribute to capacity-building
                  programs.
                </Typography>

                {application ? (
                  <Box>
                    <Chip
                      label={`Application: ${application.status}`}
                      color={
                        application.status === 'APPROVED'
                          ? 'success'
                          : application.status === 'REJECTED'
                            ? 'error'
                            : 'warning'
                      }
                    />

                    {application.adminComment && (
                      <Typography sx={{ mt: 1.5, color: '#657887' }}>
                        Admin comment: {application.adminComment}
                      </Typography>
                    )}
                  </Box>
                ) : (
                  <Button
                    variant="outlined"
                    onClick={() => setApplyOpen(true)}
                    sx={{
                      borderColor: '#0B5A91',
                      color: '#0B5A91',
                      textTransform: 'none',
                      fontWeight: 700,
                    }}
                  >
                    Apply for Trainer
                  </Button>
                )}
              </Paper>
            )}
          </Box>
        </Box>
      </Container>

      <Dialog
        open={applyOpen}
        onClose={() => !applying && setApplyOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ color: '#173F60', fontWeight: 700 }}>
          Apply for Trainer
        </DialogTitle>

        <DialogContent>
          <Typography sx={{ color: '#657887', mb: 2 }}>
            Submit your application for Admin review.
          </Typography>

          <TextField
            label="Why do you want to become a trainer?"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            multiline
            minRows={4}
            fullWidth
          />

          <TextField
            label="Supporting document URL (optional)"
            value={supportingDocumentUrl}
            onChange={(e) => setSupportingDocumentUrl(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
            placeholder="https://..."
          />

          <Box sx={{ mt: 2 }}>
            <Button
              component="label"
              variant="outlined"
              sx={{
                borderColor: '#0B5A91',
                color: '#0B5A91',
                textTransform: 'none',
                fontWeight: 700,
              }}
            >
              Choose supporting document
              <input
                type="file"
                hidden
                accept=".pdf,.ppt,.pptx,.doc,.docx,.txt,.mp4"
                onChange={(e) =>
                  setSupportingDocument(e.target.files?.[0] ?? null)
                }
              />
            </Button>

            {supportingDocument && (
              <Typography
                variant="body2"
                sx={{ mt: 1, color: '#657887' }}
              >
                Selected: {supportingDocument.name}
              </Typography>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setApplyOpen(false)}
            disabled={applying}
            sx={{ textTransform: 'none' }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleApplyForTrainer}
            disabled={applying}
            sx={{
              bgcolor: '#0B5A91',
              textTransform: 'none',
              fontWeight: 700,
            }}
          >
            {applying ? 'Submitting...' : 'Submit application'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Profile;
