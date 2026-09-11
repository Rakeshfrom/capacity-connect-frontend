import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  LinearProgress,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import { useNavigate, useParams } from 'react-router-dom';
import {
  getCourseById,
  getTrainerAnalytics,
  updateCourse,
} from '../../../../services/api';
import { useAuth } from '../../../../context/AuthContext';

type Course = {
  id: number;
  title: string;
  description?: string;
  category?: string;
  durationHours?: number;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  trainerId?: number;
};

type CourseAnalytics = {
  courseId: number;
  courseTitle: string;
  trainees: number;
  completion: number;
  averageScore: number;
};

type CourseForm = {
  title: string;
  description: string;
  category: string;
  durationHours: string;
  level: Course['level'];
  status: Course['status'];
};

const ManageCourse = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { user, loading: authLoading } = useAuth();

  const [course, setCourse] = useState<Course | null>(null);
  const [analytics, setAnalytics] = useState<CourseAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState<CourseForm>({
    title: '',
    description: '',
    category: '',
    durationHours: '',
    level: 'BEGINNER',
    status: 'DRAFT',
  });

  useEffect(() => {
    if (authLoading || !user || !courseId) return;

    const loadCourse = async () => {
      try {
        const [courseData, analyticsData] = await Promise.all([
          getCourseById(Number(courseId)),
          getTrainerAnalytics(user.id),
        ]);

        setCourse(courseData);

        const courseAnalytics = analyticsData.courses?.find(
          (item: CourseAnalytics) => item.courseId === Number(courseId)
        );

        setAnalytics(courseAnalytics ?? null);
      } catch (error) {
        console.error('Failed to load course:', error);
        setError('Unable to load course details.');
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [courseId, user, authLoading]);

  const openEdit = () => {
    if (!course) return;

    setForm({
      title: course.title,
      description: course.description ?? '',
      category: course.category ?? '',
      durationHours: String(course.durationHours ?? ''),
      level: course.level,
      status: course.status,
    });

    setError('');
    setOpenDialog(true);
  };

  const closeDialog = () => {
    if (saving) return;
    setOpenDialog(false);
    setError('');
  };

  const updateField = (field: keyof CourseForm, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const saveCourse = async () => {
    if (!course) return;

    if (!form.title.trim()) {
      setError('Course title is required.');
      return;
    }

    if (!form.durationHours || Number(form.durationHours) < 1) {
      setError('Duration must be at least 1 hour.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const updatedCourse = await updateCourse(course.id, {
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category.trim(),
        durationHours: Number(form.durationHours),
        level: form.level,
        status: form.status,
      });

      setCourse(updatedCourse);
      setOpenDialog(false);
    } catch (error) {
      console.error('Failed to update course:', error);
      setError('Unable to update course. Please try again.');
    } finally {
      setSaving(false);
    }
  };

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
        <CircularProgress />
      </Box>
    );
  }

  if (!course) {
    return (
      <Box sx={{ bgcolor: '#F5F8FA', minHeight: '100vh' }}>
        <Container maxWidth="xl" sx={{ py: 6 }}>
          <Button
            startIcon={<ArrowBackOutlinedIcon />}
            onClick={() => navigate('/trainer/courses')}
            sx={{
              color: '#0B5A91',
              textTransform: 'none',
              fontWeight: 700,
            }}
          >
            Back to My Courses
          </Button>

          <Typography sx={{ color: '#B42318', mt: 4 }}>
            {error || 'Course not found.'}
          </Typography>
        </Container>
      </Box>
    );
  }

  const trainees = analytics?.trainees ?? 0;
  const progress = analytics?.completion ?? 0;

  return (
    <Box sx={{ bgcolor: '#F5F8FA', minHeight: '100vh' }}>
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
        <Button
          startIcon={<ArrowBackOutlinedIcon />}
          onClick={() => navigate('/trainer/courses')}
          sx={{
            color: '#0B5A91',
            textTransform: 'none',
            fontWeight: 700,
            mb: 3,
          }}
        >
          Back to My Courses
        </Button>

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
              Course Management
            </Typography>

            <Typography
              sx={{
                color: '#173F60',
                fontWeight: 800,
                fontSize: { xs: '2rem', md: '2.6rem' },
                mt: 0.5,
              }}
            >
              {course.title}
            </Typography>

            <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
              <Chip
                label={course.category || 'General'}
                size="small"
                sx={{
                  bgcolor: '#EAF4FB',
                  color: '#0B5A91',
                  fontWeight: 700,
                }}
              />

              <Chip
                label={course.status}
                size="small"
                sx={{
                  bgcolor:
                    course.status === 'PUBLISHED' ? '#EAF6EF' : '#FFF4E5',
                  color:
                    course.status === 'PUBLISHED' ? '#147A45' : '#A35A00',
                  fontWeight: 700,
                }}
              />
            </Stack>
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
            Edit Course
          </Button>
        </Stack>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: 2.5,
            mb: 3,
          }}
        >
          {[
            {
              label: 'Enrolled Trainees',
              value: trainees,
              icon: <PeopleOutlineOutlinedIcon />,
            },
            {
              label: 'Average Progress',
              value: `${progress}%`,
              icon: <MenuBookOutlinedIcon />,
            },
            {
              label: 'Average Assessment Score',
              value: `${analytics?.averageScore ?? 0}%`,
              icon: <AssessmentOutlinedIcon />,
            },
          ].map((item) => (
            <Card
              key={item.label}
              elevation={0}
              sx={{
                border: '1px solid #DCE8F0',
                borderRadius: 2,
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Stack
                  direction="row"
                  sx={{
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Box>
                    <Typography sx={{ color: '#657887', fontSize: '0.9rem' }}>
                      {item.label}
                    </Typography>

                    <Typography
                      sx={{
                        color: '#173F60',
                        fontSize: '1.8rem',
                        fontWeight: 800,
                        mt: 0.5,
                      }}
                    >
                      {item.value}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 1.5,
                      bgcolor: '#EAF4FB',
                      color: '#0B5A91',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {item.icon}
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1.5fr 1fr' },
            gap: 2.5,
          }}
        >
          <Card
            elevation={0}
            sx={{ border: '1px solid #DCE8F0', borderRadius: 2 }}
          >
            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
              <Typography
                sx={{
                  color: '#173F60',
                  fontWeight: 800,
                  fontSize: '1.25rem',
                }}
              >
                Course Overview
              </Typography>

              <Typography sx={{ color: '#657887', mt: 1.5, lineHeight: 1.7 }}>
                {course.description || 'No course description available.'}
              </Typography>

              <Divider sx={{ my: 3 }} />

              <Typography sx={{ color: '#173F60', fontWeight: 700 }}>
                Course Details
              </Typography>

              <Stack spacing={1.2} sx={{ mt: 1.5 }}>
                <Typography sx={{ color: '#657887' }}>
                  Duration: <strong>{course.durationHours ?? 0} hours</strong>
                </Typography>

                <Typography sx={{ color: '#657887' }}>
                  Level: <strong>{course.level}</strong>
                </Typography>
              </Stack>

              <Divider sx={{ my: 3 }} />

              <Typography sx={{ color: '#173F60', fontWeight: 700, mb: 1 }}>
                Average Trainee Progress
              </Typography>

              <Stack
                direction="row"
                sx={{ justifyContent: 'space-between', mb: 0.8 }}
              >
                <Typography sx={{ color: '#657887', fontSize: '0.9rem' }}>
                  Overall completion
                </Typography>

                <Typography
                  sx={{
                    color: '#0B5A91',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                  }}
                >
                  {progress}%
                </Typography>
              </Stack>

              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: 8,
                  borderRadius: 5,
                  bgcolor: '#E2EBF1',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: '#0B5A91',
                    borderRadius: 5,
                  },
                }}
              />
            </CardContent>
          </Card>

          <Card
            elevation={0}
            sx={{ border: '1px solid #DCE8F0', borderRadius: 2 }}
          >
            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
              <Typography
                sx={{
                  color: '#173F60',
                  fontWeight: 800,
                  fontSize: '1.25rem',
                }}
              >
                Course Content
              </Typography>

              <Button
                fullWidth
                variant="contained"
                startIcon={<EditOutlinedIcon />}
                onClick={() => navigate(`/trainer/courses/${course.id}/builder`)}
                sx={{
                  mt: 2,
                  mb: 1.5,
                  py: 1.2,
                  bgcolor: '#0B5A91',
                  textTransform: 'none',
                  fontWeight: 700,
                  '&:hover': { bgcolor: '#084873' },
                }}
              >
                Open Course Builder
              </Button>

              {[
                {
                  label: 'Learning Resources',
                  icon: <FolderOutlinedIcon />,
                },
                {
                  label: 'Assessments',
                  icon: <AssessmentOutlinedIcon />,
                },
                {
                  label: 'Trainee Participation',
                  icon: <PeopleOutlineOutlinedIcon />,
                },
              ].map((item, index) => (
                <Box key={item.label}>
                  <Button
                    fullWidth
                    startIcon={item.icon}
                    onClick={() => {
                      if (item.label === 'Learning Resources') {
                        navigate(`/trainer/courses/${course.id}/builder`);
                      }
                    }}
                    sx={{
                      justifyContent: 'flex-start',
                      color: '#0B5A91',
                      textTransform: 'none',
                      fontWeight: 700,
                      py: 1.5,
                    }}
                  >
                    {item.label}
                  </Button>

                  {index < 2 && <Divider />}
                </Box>
              ))}
            </CardContent>
          </Card>
        </Box>
      </Container>

      <Dialog
        open={openDialog}
        onClose={closeDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ color: '#173F60', fontWeight: 800 }}>
          Edit Course
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2.2} sx={{ pt: 1 }}>
            <TextField
              label="Course Title"
              required
              fullWidth
              value={form.title}
              onChange={(e) => updateField('title', e.target.value)}
            />

            <TextField
              label="Description"
              fullWidth
              multiline
              minRows={4}
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
            />

            <TextField
              label="Category"
              fullWidth
              value={form.category}
              onChange={(e) => updateField('category', e.target.value)}
            />

            <TextField
              label="Duration (hours)"
              type="number"
              required
              fullWidth
              slotProps={{ htmlInput: { min: 1 } }}
              value={form.durationHours}
              onChange={(e) =>
                updateField('durationHours', e.target.value)
              }
            />

            <TextField
              select
              label="Level"
              fullWidth
              value={form.level}
              onChange={(e) => updateField('level', e.target.value)}
            >
              <MenuItem value="BEGINNER">Beginner</MenuItem>
              <MenuItem value="INTERMEDIATE">Intermediate</MenuItem>
              <MenuItem value="ADVANCED">Advanced</MenuItem>
            </TextField>

            <TextField
              select
              label="Status"
              fullWidth
              value={form.status}
              onChange={(e) => updateField('status', e.target.value)}
            >
              <MenuItem value="DRAFT">Draft</MenuItem>
              <MenuItem value="PUBLISHED">Published</MenuItem>
              <MenuItem value="ARCHIVED">Archived</MenuItem>
            </TextField>

            {error && (
              <Typography sx={{ color: '#B42318', fontSize: '0.9rem' }}>
                {error}
              </Typography>
            )}
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button
            onClick={closeDialog}
            disabled={saving}
            sx={{ textTransform: 'none' }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={saveCourse}
            disabled={saving}
            sx={{
              bgcolor: '#0B5A91',
              textTransform: 'none',
              fontWeight: 700,
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

export default ManageCourse;
