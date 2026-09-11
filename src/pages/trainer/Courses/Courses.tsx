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
  LinearProgress,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { useNavigate } from 'react-router-dom';
import {
  createCourse,
  getTrainerCourses,
  getTrainerAnalytics,
  getDepartments,
} from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';

type Course = {
  id: number;
  title: string;
  category?: string;
  status?: string;
  departmentId?: number;
};

type Department = {
  id: number;
  name: string;
  code: string;
};

type CourseAnalytics = {
  courseId: number;
  courseTitle: string;
  trainees: number;
  completion: number;
};

type CourseForm = {
  title: string;
  description: string;
  category: string;
  durationHours: string;
  level: string;
  status: string;
  departmentId: string;
};

const initialForm: CourseForm = {
  title: '',
  description: '',
  category: '',
  durationHours: '',
  level: 'BEGINNER',
  status: 'DRAFT',
  departmentId: '',
};

const TrainerCourses = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [courses, setCourses] = useState<Course[]>([]);
  const [analytics, setAnalytics] = useState<CourseAnalytics[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState<CourseForm>(initialForm);

  const loadCourses = async () => {
    if (!user) return;

    try {
      const [courseData, analyticsData, departmentData] = await Promise.all([
        getTrainerCourses(user.id),
        getTrainerAnalytics(user.id),
        getDepartments(),
      ]);

      setCourses(courseData);
      setAnalytics(analyticsData.courses ?? []);
      setDepartments(departmentData ?? []);
    } catch (error) {
      console.error('Failed to load trainer courses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading || !user) return;
    loadCourses();
  }, [user, authLoading]);

  const openCreate = () => {
    setForm(initialForm);
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
    if (!form.title.trim()) {
      setError('Course title is required.');
      return;
    }

    if (!form.durationHours || Number(form.durationHours) < 1) {
      setError('Duration must be at least 1 hour.');
      return;
    }

    if (!form.departmentId) {
      setError('Department is required.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      await createCourse({
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category.trim(),
        durationHours: Number(form.durationHours),
        level: form.level,
        status: form.status,
        departmentId: Number(form.departmentId),
      });

      setOpenDialog(false);
      setForm(initialForm);
      await loadCourses();
    } catch (error) {
      console.error('Failed to create course:', error);
      setError('Unable to create course. Please try again.');
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
              My Courses
            </Typography>

            <Typography sx={{ color: '#657887', mt: 1 }}>
              Manage your training programmes and monitor trainee participation.
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddOutlinedIcon />}
            onClick={openCreate}
            sx={{
              bgcolor: '#0B5A91',
              textTransform: 'none',
              fontWeight: 700,
              px: 2.5,
              py: 1.2,
              '&:hover': { bgcolor: '#084873' },
            }}
          >
            Create New Course
          </Button>
        </Stack>

        {courses.length === 0 ? (
          <Card
            elevation={0}
            sx={{
              border: '1px solid #DCE8F0',
              borderRadius: 2,
              textAlign: 'center',
            }}
          >
            <CardContent sx={{ py: 7 }}>
              <MenuBookOutlinedIcon
                sx={{ fontSize: 48, color: '#9AAAB5', mb: 1 }}
              />
              <Typography
                sx={{ color: '#173F60', fontWeight: 700, fontSize: '1.15rem' }}
              >
                No courses assigned to you
              </Typography>
              <Typography sx={{ color: '#657887', mt: 0.8 }}>
                Create your first training programme to get started.
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
              gap: 2.5,
            }}
          >
            {courses.map((course) => {
              const courseAnalytics = analytics.find(
                (item) => item.courseId === course.id
              );

              const trainees = courseAnalytics?.trainees ?? 0;
              const progress = courseAnalytics?.completion ?? 0;
              const status = course.status || 'DRAFT';

              return (
                <Card
                  key={course.id}
                  elevation={0}
                  sx={{
                    border: '1px solid #DCE8F0',
                    borderRadius: 2,
                  }}
                >
                  <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                    <Stack
                      direction="row"
                      sx={{
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: 2,
                      }}
                    >
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 1.5,
                          bgcolor: '#EAF4FB',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <MenuBookOutlinedIcon sx={{ color: '#0B5A91' }} />
                      </Box>

                      <Chip
                        label={status}
                        size="small"
                        sx={{
                          bgcolor:
                            status === 'PUBLISHED' ? '#EAF6EF' : '#FFF4E5',
                          color:
                            status === 'PUBLISHED' ? '#147A45' : '#A35A00',
                          fontWeight: 700,
                        }}
                      />
                    </Stack>

                    <Typography
                      sx={{
                        color: '#173F60',
                        fontWeight: 700,
                        fontSize: '1.15rem',
                        mt: 2.5,
                      }}
                    >
                      {course.title}
                    </Typography>

                    <Chip
                      label={course.category || 'General'}
                      size="small"
                      sx={{
                        mt: 1,
                        bgcolor: '#EAF4FB',
                        color: '#0B5A91',
                        fontWeight: 600,
                      }}
                    />

                    <Stack
                      direction="row"
                      sx={{
                        alignItems: 'center',
                        gap: 1,
                        mt: 2.5,
                      }}
                    >
                      <PeopleOutlineOutlinedIcon
                        sx={{ fontSize: 20, color: '#718594' }}
                      />
                      <Typography sx={{ color: '#657887' }}>
                        {trainees} trainees enrolled
                      </Typography>
                    </Stack>

                    {status === 'PUBLISHED' && (
                      <Box sx={{ mt: 2 }}>
                        <Stack
                          direction="row"
                          sx={{
                            justifyContent: 'space-between',
                            mb: 0.8,
                          }}
                        >
                          <Typography
                            sx={{ color: '#657887', fontSize: '0.88rem' }}
                          >
                            Average course progress
                          </Typography>

                          <Typography
                            sx={{
                              color: '#0B5A91',
                              fontWeight: 700,
                              fontSize: '0.88rem',
                            }}
                          >
                            {progress}%
                          </Typography>
                        </Stack>

                        <LinearProgress
                          variant="determinate"
                          value={progress}
                          sx={{
                            height: 7,
                            borderRadius: 5,
                            bgcolor: '#E2EBF1',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: '#0B5A91',
                              borderRadius: 5,
                            },
                          }}
                        />
                      </Box>
                    )}

                    <Button
                      variant="outlined"
                      startIcon={<EditOutlinedIcon />}
                      onClick={() =>
                        navigate(`/trainer/courses/${course.id}`)
                      }
                      fullWidth
                      sx={{
                        mt: 2.5,
                        borderColor: '#BCD2E2',
                        color: '#0B5A91',
                        textTransform: 'none',
                        fontWeight: 700,
                        '&:hover': {
                          borderColor: '#0B5A91',
                          bgcolor: '#F5F9FC',
                        },
                      }}
                    >
                      Manage Course
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        )}
      </Container>

      <Dialog
        open={openDialog}
        onClose={closeDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ color: '#173F60', fontWeight: 800 }}>
          Create New Course
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
              select
              required
              label="Department"
              fullWidth
              value={form.departmentId}
              onChange={(e) => updateField('departmentId', e.target.value)}
            >
              {departments.map((department) => (
                <MenuItem key={department.id} value={department.id}>
                  {department.name}
                </MenuItem>
              ))}
            </TextField>

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
            {saving ? 'Saving...' : 'Save Course'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TrainerCourses;
