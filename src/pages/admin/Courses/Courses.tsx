import { useEffect, useMemo, useState } from 'react';
import {
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
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import {
  createCourse,
  getCourses,
  updateCourse,
} from '../../../services/api';

interface Course {
  id: number;
  title: string;
  description: string;
  category: string;
  durationHours: number;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  trainerId: number | null;
  createdAt: string;
  updatedAt: string;
}

interface CourseForm {
  title: string;
  description: string;
  category: string;
  durationHours: string;
  level: Course['level'];
  status: Course['status'];
  trainerId: string;
}

const emptyForm: CourseForm = {
  title: '',
  description: '',
  category: '',
  durationHours: '',
  level: 'BEGINNER',
  status: 'DRAFT',
  trainerId: '',
};

const AdminCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [levelFilter, setLevelFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [form, setForm] = useState<CourseForm>(emptyForm);
  const [openDialog, setOpenDialog] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadCourses = () => {
    getCourses()
      .then((data: Course[]) => {
        setCourses(data);
        setError('');
      })
      .catch(() => {
        setError('Unable to load courses from the backend.');
      });
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const filteredCourses = useMemo(() => {
    const value = search.toLowerCase().trim();

    return courses.filter((course) => {
      const matchesStatus =
        statusFilter === 'ALL' || course.status === statusFilter;

      const matchesLevel =
        levelFilter === 'ALL' || course.level === levelFilter;

      const matchesSearch =
        !value ||
        course.title.toLowerCase().includes(value) ||
        course.category.toLowerCase().includes(value);

      return matchesStatus && matchesLevel && matchesSearch;
    });
  }, [courses, search, statusFilter, levelFilter]);

  const openCreate = () => {
    setSelectedCourse(null);
    setForm(emptyForm);
    setOpenDialog(true);
  };

  const openEdit = (course: Course) => {
    setSelectedCourse(course);
    setForm({
      title: course.title,
      description: course.description || '',
      category: course.category,
      durationHours: String(course.durationHours),
      level: course.level,
      status: course.status,
      trainerId: course.trainerId ? String(course.trainerId) : '',
    });
    setOpenDialog(true);
  };

  const closeDialog = () => {
    if (saving) return;
    setOpenDialog(false);
    setSelectedCourse(null);
    setForm(emptyForm);
  };

  const updateForm = (field: keyof CourseForm, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const saveCourse = async () => {
    if (!form.title.trim() || !form.category.trim()) {
      setError('Course title and category are required.');
      return;
    }

    setSaving(true);
    setError('');

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category.trim(),
      durationHours: Number(form.durationHours) || 0,
      level: form.level,
      status: form.status,
      trainerId: form.trainerId ? Number(form.trainerId) : null,
    };

    try {
      if (selectedCourse) {
        await updateCourse(selectedCourse.id, payload);
      } else {
        await createCourse(payload);
      }

      closeDialog();
      loadCourses();
    } catch {
      setError('Unable to save course.');
    } finally {
      setSaving(false);
    }
  };

  const published = courses.filter(
    (course) => course.status === 'PUBLISHED',
  ).length;

  const drafts = courses.filter(
    (course) => course.status === 'DRAFT',
  ).length;

  const archived = courses.filter(
    (course) => course.status === 'ARCHIVED',
  ).length;

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
              Admin Portal
            </Typography>

            <Typography
              sx={{
                color: '#173F60',
                fontWeight: 800,
                fontSize: { xs: '2rem', md: '2.6rem' },
                mt: 0.5,
              }}
            >
              Courses
            </Typography>

            <Typography sx={{ color: '#657887', mt: 1 }}>
              Manage learning courses, publication status and course details.
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
              '&:hover': {
                bgcolor: '#084A77',
              },
            }}
          >
            Add Course
          </Button>
        </Stack>

        {error && (
          <Box
            sx={{
              mb: 2.5,
              p: 2,
              borderRadius: 2,
              bgcolor: '#FFF4F2',
              border: '1px solid #F3C7C1',
            }}
          >
            <Typography sx={{ color: '#B42318', fontWeight: 600 }}>
              {error}
            </Typography>
          </Box>
        )}

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(3, 1fr)',
            },
            gap: 2.5,
            mb: 3,
          }}
        >
          {[
            ['Published', published],
            ['Drafts', drafts],
            ['Archived', archived],
          ].map(([label, value]) => (
            <Card
              key={label}
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
                    <Typography sx={{ color: '#657887' }}>
                      {label}
                    </Typography>
                    <Typography
                      sx={{
                        color: '#173F60',
                        fontWeight: 800,
                        fontSize: '1.8rem',
                        mt: 0.4,
                      }}
                    >
                      {value}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      width: 46,
                      height: 46,
                      borderRadius: 1.5,
                      bgcolor: '#EAF4FB',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#0B5A91',
                    }}
                  >
                    <MenuBookOutlinedIcon />
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Box>

        <Card
          elevation={0}
          sx={{
            border: '1px solid #DCE8F0',
            borderRadius: 2,
          }}
        >
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={2}
              sx={{ mb: 3 }}
            >
              <TextField
                fullWidth
                label="Search courses"
                placeholder="Course title or category"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />

              <FormControl sx={{ minWidth: 170 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(event) => setStatusFilter(event.target.value)}
                >
                  <MenuItem value="ALL">All status</MenuItem>
                  <MenuItem value="DRAFT">Draft</MenuItem>
                  <MenuItem value="PUBLISHED">Published</MenuItem>
                  <MenuItem value="ARCHIVED">Archived</MenuItem>
                </Select>
              </FormControl>

              <FormControl sx={{ minWidth: 180 }}>
                <InputLabel>Level</InputLabel>
                <Select
                  value={levelFilter}
                  label="Level"
                  onChange={(event) => setLevelFilter(event.target.value)}
                >
                  <MenuItem value="ALL">All levels</MenuItem>
                  <MenuItem value="BEGINNER">Beginner</MenuItem>
                  <MenuItem value="INTERMEDIATE">Intermediate</MenuItem>
                  <MenuItem value="ADVANCED">Advanced</MenuItem>
                </Select>
              </FormControl>
            </Stack>

            <Box sx={{ overflowX: 'auto' }}>
              <Box sx={{ minWidth: 850 }}>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1.3fr 1fr 1fr 1fr 90px',
                    gap: 2,
                    px: 2,
                    py: 1.5,
                    bgcolor: '#F5F8FA',
                    borderRadius: 1.5,
                  }}
                >
                  {[
                    'Course',
                    'Category',
                    'Duration',
                    'Level',
                    'Status',
                    'Action',
                  ].map((heading) => (
                    <Typography
                      key={heading}
                      sx={{
                        color: '#657887',
                        fontWeight: 700,
                        fontSize: '0.82rem',
                      }}
                    >
                      {heading}
                    </Typography>
                  ))}
                </Box>

                {filteredCourses.map((course) => (
                  <Box
                    key={course.id}
                    sx={{
                      display: 'grid',
                      gridTemplateColumns:
                        '2fr 1.3fr 1fr 1fr 1fr 90px',
                      gap: 2,
                      alignItems: 'center',
                      px: 2,
                      py: 2,
                      borderBottom: '1px solid #E4ECF1',
                    }}
                  >
                    <Box>
                      <Typography
                        sx={{ color: '#173F60', fontWeight: 700 }}
                      >
                        {course.title}
                      </Typography>
                      <Typography
                        sx={{
                          color: '#657887',
                          fontSize: '0.82rem',
                          mt: 0.3,
                        }}
                      >
                        Course #{course.id}
                      </Typography>
                    </Box>

                    <Typography
                      sx={{ color: '#657887', fontSize: '0.9rem' }}
                    >
                      {course.category}
                    </Typography>

                    <Typography
                      sx={{ color: '#657887', fontSize: '0.9rem' }}
                    >
                      {course.durationHours} hours
                    </Typography>

                    <Chip
                      label={course.level}
                      size="small"
                      sx={{
                        width: 'fit-content',
                        bgcolor: '#EAF4FB',
                        color: '#0B5A91',
                        fontWeight: 700,
                      }}
                    />

                    <Chip
                      label={course.status}
                      size="small"
                      sx={{
                        width: 'fit-content',
                        bgcolor:
                          course.status === 'PUBLISHED'
                            ? '#EAF6EF'
                            : course.status === 'DRAFT'
                              ? '#FFF6E5'
                              : '#F1F3F5',
                        color:
                          course.status === 'PUBLISHED'
                            ? '#147A45'
                            : course.status === 'DRAFT'
                              ? '#9A6700'
                              : '#657887',
                        fontWeight: 700,
                      }}
                    />

                    <Button
                      size="small"
                      startIcon={<EditOutlinedIcon />}
                      onClick={() => openEdit(course)}
                      sx={{
                        color: '#0B5A91',
                        fontWeight: 700,
                        textTransform: 'none',
                      }}
                    >
                      Edit
                    </Button>
                  </Box>
                ))}

                {filteredCourses.length === 0 && (
                  <Box sx={{ py: 6, textAlign: 'center' }}>
                    <Typography sx={{ color: '#657887' }}>
                      No courses found.
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Dialog
          open={openDialog}
          onClose={closeDialog}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle sx={{ color: '#173F60', fontWeight: 800 }}>
            {selectedCourse ? 'Edit Course' : 'Add Course'}
          </DialogTitle>

          <DialogContent>
            <Stack spacing={2.2} sx={{ pt: 1 }}>
              <TextField
                label="Course Title"
                value={form.title}
                onChange={(event) =>
                  updateForm('title', event.target.value)
                }
                fullWidth
                required
              />

              <TextField
                label="Description"
                value={form.description}
                onChange={(event) =>
                  updateForm('description', event.target.value)
                }
                fullWidth
                multiline
                minRows={3}
              />

              <TextField
                label="Category"
                value={form.category}
                onChange={(event) =>
                  updateForm('category', event.target.value)
                }
                fullWidth
                required
              />

              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
              >
                <TextField
                  label="Duration (hours)"
                  type="number"
                  value={form.durationHours}
                  onChange={(event) =>
                    updateForm('durationHours', event.target.value)
                  }
                  fullWidth
                />

                <TextField
                  label="Trainer ID"
                  type="number"
                  value={form.trainerId}
                  onChange={(event) =>
                    updateForm('trainerId', event.target.value)
                  }
                  fullWidth
                />
              </Stack>

              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
              >
                <FormControl fullWidth>
                  <InputLabel>Level</InputLabel>
                  <Select
                    value={form.level}
                    label="Level"
                    onChange={(event) =>
                      updateForm('level', event.target.value)
                    }
                  >
                    <MenuItem value="BEGINNER">Beginner</MenuItem>
                    <MenuItem value="INTERMEDIATE">
                      Intermediate
                    </MenuItem>
                    <MenuItem value="ADVANCED">Advanced</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={form.status}
                    label="Status"
                    onChange={(event) =>
                      updateForm('status', event.target.value)
                    }
                  >
                    <MenuItem value="DRAFT">Draft</MenuItem>
                    <MenuItem value="PUBLISHED">Published</MenuItem>
                    <MenuItem value="ARCHIVED">Archived</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </Stack>
          </DialogContent>

          <DialogActions sx={{ p: 2.5 }}>
            <Button
              onClick={closeDialog}
              sx={{ color: '#657887', textTransform: 'none' }}
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
                '&:hover': { bgcolor: '#084A77' },
              }}
            >
              {saving ? 'Saving...' : 'Save Course'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default AdminCourses;
