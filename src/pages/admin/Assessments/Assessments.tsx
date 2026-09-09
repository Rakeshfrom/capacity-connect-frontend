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
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import {
  createAssessment,
  getAssessments,
  getCourses,
  updateAssessment,
} from '../../../services/api';

interface Assessment {
  id: number;
  title: string;
  description: string;
  courseId: number;
  timeLimitMinutes: number;
  passingPercentage: number;
  status: 'DRAFT' | 'PUBLISHED' | 'CLOSED';
  createdAt: string;
  updatedAt: string;
}

interface Course {
  id: number;
  title: string;
}

interface AssessmentForm {
  title: string;
  description: string;
  courseId: string;
  timeLimitMinutes: string;
  passingPercentage: string;
  status: Assessment['status'];
}

const emptyForm: AssessmentForm = {
  title: '',
  description: '',
  courseId: '',
  timeLimitMinutes: '30',
  passingPercentage: '50',
  status: 'DRAFT',
};

const AdminAssessments = () => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selectedAssessment, setSelectedAssessment] =
    useState<Assessment | null>(null);
  const [form, setForm] = useState<AssessmentForm>(emptyForm);
  const [openDialog, setOpenDialog] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      const [assessmentData, courseData] = await Promise.all([
        getAssessments(),
        getCourses(),
      ]);

      setAssessments(assessmentData as Assessment[]);
      setCourses(courseData as Course[]);
      setError('');
    } catch {
      setError('Unable to load assessment data from the backend.');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const courseName = (courseId: number) =>
    courses.find((course) => course.id === courseId)?.title ||
    `Course #${courseId}`;

  const filteredAssessments = useMemo(() => {
    const value = search.toLowerCase().trim();

    return assessments.filter((assessment) => {
      const matchesStatus =
        statusFilter === 'ALL' || assessment.status === statusFilter;

      const matchesSearch =
        !value ||
        assessment.title.toLowerCase().includes(value) ||
        courseName(assessment.courseId).toLowerCase().includes(value);

      return matchesStatus && matchesSearch;
    });
  }, [assessments, courses, search, statusFilter]);

  const openCreate = () => {
    setSelectedAssessment(null);
    setForm(emptyForm);
    setOpenDialog(true);
  };

  const openEdit = (assessment: Assessment) => {
    setSelectedAssessment(assessment);

    setForm({
      title: assessment.title,
      description: assessment.description || '',
      courseId: String(assessment.courseId),
      timeLimitMinutes: String(assessment.timeLimitMinutes),
      passingPercentage: String(assessment.passingPercentage),
      status: assessment.status,
    });

    setOpenDialog(true);
  };

  const closeDialog = () => {
    if (saving) return;

    setOpenDialog(false);
    setSelectedAssessment(null);
    setForm(emptyForm);
  };

  const updateForm = (
    field: keyof AssessmentForm,
    value: string,
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const saveAssessment = async () => {
    if (!form.title.trim() || !form.courseId) {
      setError('Assessment title and course are required.');
      return;
    }

    setSaving(true);
    setError('');

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      courseId: Number(form.courseId),
      timeLimitMinutes: Number(form.timeLimitMinutes) || 30,
      passingPercentage: Number(form.passingPercentage) || 50,
      status: form.status,
    };

    try {
      if (selectedAssessment) {
        await updateAssessment(selectedAssessment.id, payload);
      } else {
        await createAssessment(payload);
      }

      closeDialog();
      loadData();
    } catch {
      setError('Unable to save assessment.');
    } finally {
      setSaving(false);
    }
  };

  const published = assessments.filter(
    (assessment) => assessment.status === 'PUBLISHED',
  ).length;

  const drafts = assessments.filter(
    (assessment) => assessment.status === 'DRAFT',
  ).length;

  const closed = assessments.filter(
    (assessment) => assessment.status === 'CLOSED',
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
              Assessments
            </Typography>

            <Typography sx={{ color: '#657887', mt: 1 }}>
              Manage assessments, time limits, passing criteria and publication status.
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
            Add Assessment
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
            ['Closed', closed],
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
                    <AssessmentOutlinedIcon />
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
                label="Search assessments"
                placeholder="Assessment or course title"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />

              <FormControl sx={{ minWidth: 180 }}>
                <InputLabel>Status</InputLabel>

                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(event) =>
                    setStatusFilter(event.target.value)
                  }
                >
                  <MenuItem value="ALL">All status</MenuItem>
                  <MenuItem value="DRAFT">Draft</MenuItem>
                  <MenuItem value="PUBLISHED">Published</MenuItem>
                  <MenuItem value="CLOSED">Closed</MenuItem>
                </Select>
              </FormControl>
            </Stack>

            <Box sx={{ overflowX: 'auto' }}>
              <Box sx={{ minWidth: 900 }}>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns:
                      '2fr 2fr 1fr 1fr 1fr 90px',
                    gap: 2,
                    px: 2,
                    py: 1.5,
                    bgcolor: '#F5F8FA',
                    borderRadius: 1.5,
                  }}
                >
                  {[
                    'Assessment',
                    'Course',
                    'Time',
                    'Passing',
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

                {filteredAssessments.map((assessment) => (
                  <Box
                    key={assessment.id}
                    sx={{
                      display: 'grid',
                      gridTemplateColumns:
                        '2fr 2fr 1fr 1fr 1fr 90px',
                      gap: 2,
                      alignItems: 'center',
                      px: 2,
                      py: 2,
                      borderBottom: '1px solid #E4ECF1',
                    }}
                  >
                    <Box>
                      <Typography
                        sx={{
                          color: '#173F60',
                          fontWeight: 700,
                        }}
                      >
                        {assessment.title}
                      </Typography>

                      <Typography
                        sx={{
                          color: '#657887',
                          fontSize: '0.82rem',
                          mt: 0.3,
                        }}
                      >
                        Assessment #{assessment.id}
                      </Typography>
                    </Box>

                    <Typography
                      sx={{
                        color: '#657887',
                        fontSize: '0.9rem',
                      }}
                    >
                      {courseName(assessment.courseId)}
                    </Typography>

                    <Typography
                      sx={{
                        color: '#657887',
                        fontSize: '0.9rem',
                      }}
                    >
                      {assessment.timeLimitMinutes} min
                    </Typography>

                    <Typography
                      sx={{
                        color: '#657887',
                        fontSize: '0.9rem',
                      }}
                    >
                      {assessment.passingPercentage}%
                    </Typography>

                    <Chip
                      label={assessment.status}
                      size="small"
                      sx={{
                        width: 'fit-content',
                        bgcolor:
                          assessment.status === 'PUBLISHED'
                            ? '#EAF6EF'
                            : assessment.status === 'DRAFT'
                              ? '#FFF6E5'
                              : '#F1F3F5',
                        color:
                          assessment.status === 'PUBLISHED'
                            ? '#147A45'
                            : assessment.status === 'DRAFT'
                              ? '#9A6700'
                              : '#657887',
                        fontWeight: 700,
                      }}
                    />

                    <Button
                      size="small"
                      startIcon={<EditOutlinedIcon />}
                      onClick={() => openEdit(assessment)}
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

                {filteredAssessments.length === 0 && (
                  <Box sx={{ py: 6, textAlign: 'center' }}>
                    <Typography sx={{ color: '#657887' }}>
                      No assessments found.
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
          <DialogTitle
            sx={{
              color: '#173F60',
              fontWeight: 800,
            }}
          >
            {selectedAssessment
              ? 'Edit Assessment'
              : 'Add Assessment'}
          </DialogTitle>

          <DialogContent>
            <Stack spacing={2.2} sx={{ pt: 1 }}>
              <TextField
                label="Assessment Title"
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

              <FormControl fullWidth required>
                <InputLabel>Course</InputLabel>

                <Select
                  value={form.courseId}
                  label="Course"
                  onChange={(event) =>
                    updateForm('courseId', event.target.value)
                  }
                >
                  {courses.map((course) => (
                    <MenuItem
                      key={course.id}
                      value={String(course.id)}
                    >
                      {course.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
              >
                <TextField
                  label="Time Limit (minutes)"
                  type="number"
                  value={form.timeLimitMinutes}
                  onChange={(event) =>
                    updateForm(
                      'timeLimitMinutes',
                      event.target.value,
                    )
                  }
                  fullWidth
                />

                <TextField
                  label="Passing Percentage"
                  type="number"
                  value={form.passingPercentage}
                  onChange={(event) =>
                    updateForm(
                      'passingPercentage',
                      event.target.value,
                    )
                  }
                  fullWidth
                />
              </Stack>

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
                  <MenuItem value="PUBLISHED">
                    Published
                  </MenuItem>
                  <MenuItem value="CLOSED">Closed</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </DialogContent>

          <DialogActions sx={{ p: 2.5 }}>
            <Button
              onClick={closeDialog}
              sx={{
                color: '#657887',
                textTransform: 'none',
              }}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              onClick={saveAssessment}
              disabled={saving}
              sx={{
                bgcolor: '#0B5A91',
                textTransform: 'none',
                '&:hover': {
                  bgcolor: '#084A77',
                },
              }}
            >
              {saving ? 'Saving...' : 'Save Assessment'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default AdminAssessments;
