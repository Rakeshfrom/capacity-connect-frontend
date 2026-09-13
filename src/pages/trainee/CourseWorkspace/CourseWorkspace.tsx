import { useEffect, useMemo, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  LinearProgress,
  Paper,
  Stack,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from '@mui/material';

import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import PlayCircleOutlineRoundedIcon from '@mui/icons-material/PlayCircleOutlineRounded';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';

import {
  getCourseById,
  getEnrollments,
  enrollInCourse,
  getAssessmentsByCourse,
  getMyCourseAssessments,
  getCourseResources,
  getMyCourseResources,
  getCourseModules,
  downloadTrainerResource,
  updateEnrollmentProgress,
} from '../../../services/api';

type Course = {
  id: number;
  title: string;
  category?: string | null;
  level?: string | null;
  durationHours?: number | null;
  description?: string | null;
  department?: string | null;
  trainerId?: number | null;
  status?: string | null;
};

type Enrollment = {
  id: number;
  courseId: number;
  status: string;
  progress: number;
};

type CourseModule = {
  id: number;
  courseId: number;
  title: string;
  description?: string | null;
  orderIndex: number;
  active: boolean;
};

type Resource = {
  id: number;
  courseId?: number;
  moduleId?: number;
  title: string;
  description?: string | null;
  resourceType: string;
  fileName?: string | null;
  active: boolean;
};

type Assessment = {
  id: number;
  title: string;
  description?: string | null;
  timeLimitMinutes: number;
  passingPercentage: number;
  status: string;
};

type WorkspaceTab = 'overview' | 'modules' | 'resources' | 'assessments';

const normalizeText = (value: unknown) =>
  String(value ?? '').trim();

const displayLevel = (value: unknown) => {
  const normalized = normalizeText(value).toLowerCase();

  if (normalized === 'beginner') return 'Beginner';
  if (normalized === 'advanced') return 'Advanced';
  if (normalized === 'intermediate') return 'Intermediate';

  return normalizeText(value) || 'Not specified';
};

const CourseWorkspace = () => {
  const { courseId } = useParams();
  const id = Number(courseId);

  const [course, setCourse] = useState<Course | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);

  const [activeTab, setActiveTab] =
    useState<WorkspaceTab>('overview');

  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(
    null
  );

  const [loading, setLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(false);
  const [savingProgress, setSavingProgress] = useState(false);
  const [enrollingCourse, setEnrollingCourse] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!Number.isFinite(id)) {
      setError('Invalid course.');
      setLoading(false);
      return;
    }

    const loadWorkspace = async () => {
      try {
        setError('');

        const [courseData, enrollmentData] = await Promise.all([
          getCourseById(id),
          getEnrollments(),
        ]);

        const currentEnrollment = Array.isArray(enrollmentData)
          ? enrollmentData.find(
              (item: Enrollment) => Number(item.courseId) === id
            ) || null
          : null;

        setCourse(courseData);
        setEnrollment(currentEnrollment);

        setContentLoading(true);

        const [
          resourceResult,
          moduleResult,
          assessmentResult,
        ] = await Promise.allSettled([
          currentEnrollment
            ? getMyCourseResources(id)
            : getCourseResources(id),
          getCourseModules(id),
          currentEnrollment
            ? getMyCourseAssessments(id)
            : getAssessmentsByCourse(id),
        ]);

        const moduleData =
          moduleResult.status === 'fulfilled'
            ? moduleResult.value
            : [];

        const resourceData =
          resourceResult.status === 'fulfilled'
            ? resourceResult.value
            : [];

        const assessmentData =
          assessmentResult.status === 'fulfilled'
            ? assessmentResult.value
            : [];

        if (resourceResult.status === 'rejected') {
          console.warn(
            'Unable to load course resources:',
            resourceResult.reason
          );
        }

        if (assessmentResult.status === 'rejected') {
          console.warn(
            'Unable to load course assessments:',
            assessmentResult.reason
          );
        }

        const activeModules = Array.isArray(moduleData)
          ? moduleData
              .filter((item: CourseModule) => item.active)
              .sort(
                (a: CourseModule, b: CourseModule) =>
                  a.orderIndex - b.orderIndex
              )
          : [];

        const activeResources = Array.isArray(resourceData)
          ? resourceData.filter(
              (item: Resource) => item.active !== false
            )
          : [];

        const activeAssessments = Array.isArray(assessmentData)
          ? assessmentData
          : [];

        setModules(activeModules);
        setResources(activeResources);
        setAssessments(activeAssessments);

        if (activeModules.length > 0) {
          setSelectedModuleId(activeModules[0].id);
        }
      } catch (err) {
        console.error('Failed to load course workspace:', err);
        setError(
          'Unable to load this course workspace. Please try again.'
        );
      } finally {
        setLoading(false);
        setContentLoading(false);
      }
    };

    loadWorkspace();
  }, [id]);

  const selectedModule = useMemo(
    () =>
      modules.find(
        (module) => module.id === selectedModuleId
      ) || null,
    [modules, selectedModuleId]
  );

  const selectedModuleResources = useMemo(
    () =>
      selectedModule
        ? resources.filter(
            (resource) => Number(resource.moduleId) === selectedModule.id
          )
        : [],
    [resources, selectedModule]
  );

  const unassignedResources = useMemo(
    () =>
      resources.filter(
        (resource) =>
          !resource.moduleId ||
          !modules.some(
            (module) => module.id === Number(resource.moduleId)
          )
      ),
    [resources, modules]
  );

  const completed = Number(enrollment?.progress) >= 100;
  const progress = Math.min(
    100,
    Math.max(0, Number(enrollment?.progress) || 0)
  );

  const completedModules = Math.round(
    (progress / 100) * modules.length
  );

  const handleDownload = async (
    resourceId: number,
    fileName?: string | null
  ) => {
    try {
      setError('');

      const blob = await downloadTrainerResource(resourceId);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');

      anchor.href = url;
      anchor.download = fileName || 'course-resource';
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Resource download failed:', err);
      setError('Unable to download this resource.');
    }
  };

  const handleModuleComplete = async () => {
    if (!selectedModule || !enrollment || modules.length === 0) {
      return;
    }

    const currentIndex = modules.findIndex(
      (module) => module.id === selectedModule.id
    );

    if (currentIndex < 0) {
      return;
    }

    try {
      setError('');
      setSavingProgress(true);

      const newProgress = Math.round(
        ((currentIndex + 1) / modules.length) * 100
      );

      const updatedEnrollment = await updateEnrollmentProgress(
        enrollment.id,
        newProgress
      );

      const updatedProgress = Number(
        updatedEnrollment?.progress ?? newProgress
      );

      setEnrollment({
        ...enrollment,
        ...updatedEnrollment,
        progress: updatedProgress,
        status:
          updatedProgress >= 100
            ? 'COMPLETED'
            : enrollment.status,
      });

      if (currentIndex < modules.length - 1) {
        setSelectedModuleId(modules[currentIndex + 1].id);
      }
    } catch (err) {
      console.error('Failed to update module progress:', err);
      setError(
        'Unable to save your learning progress. Please try again.'
      );
    } finally {
      setSavingProgress(false);
    }
  };

  const handleEnroll = async () => {
    if (enrollment || enrollingCourse) {
      return;
    }

    try {
      setError('');
      setEnrollingCourse(true);

      await enrollInCourse(id);

      const updatedEnrollments = await getEnrollments();

      const updatedEnrollment = Array.isArray(updatedEnrollments)
        ? updatedEnrollments.find(
            (item: Enrollment) => Number(item.courseId) === id
          ) || null
        : null;

      if (!updatedEnrollment) {
        throw new Error('Enrollment could not be confirmed.');
      }

      setEnrollment(updatedEnrollment);

      setActiveTab('modules');

      if (modules.length > 0) {
        setSelectedModuleId(modules[0].id);
      }
    } catch (err) {
      console.error('Course enrollment failed:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to enroll in this course. Please try again.'
      );
    } finally {
      setEnrollingCourse(false);
    }
  };

  const continueLearning = () => {
    setActiveTab('modules');

    if (modules.length > 0) {
      setSelectedModuleId(
        modules.find(
          (_, index) =>
            index >= completedModules
        )?.id || modules[0].id
      );
    }
  };

  if (loading) {
    return (
      <Container
        maxWidth="lg"
        sx={{
          py: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <CircularProgress sx={{ color: '#0B5A91' }} />

        <Typography
          sx={{
            mt: 2,
            color: '#657887',
          }}
        >
          Preparing your course workspace...
        </Typography>
      </Container>
    );
  }

  if (error || !course || !enrollment) {
    return (
      <Container maxWidth="lg" sx={{ py: 7 }}>
        <Alert severity="warning">
          {error || 'Course workspace unavailable.'}
        </Alert>

        <Button
          component={RouterLink}
          to="/trainee/courses"
          startIcon={<ArrowBackRoundedIcon />}
          sx={{
            mt: 3,
            textTransform: 'none',
            fontWeight: 700,
          }}
        >
          Back to Courses
        </Button>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        bgcolor: '#F4F8FB',
        minHeight: '100vh',
        py: { xs: 2.5, md: 4 },
      }}
    >
      <Container maxWidth="xl">
        <Stack spacing={2.5}>
          <Button
            component={RouterLink}
            to="/trainee/courses"
            startIcon={<ArrowBackRoundedIcon />}
            sx={{
              alignSelf: 'flex-start',
              color: '#0B5A91',
              textTransform: 'none',
              fontWeight: 700,
            }}
          >
            Back to Courses
          </Button>

          <Paper
            elevation={0}
            sx={{
              overflow: 'hidden',
              border: '1px solid #D9E5EC',
              borderRadius: 2.5,
            }}
          >
            <Box
              sx={{
                p: { xs: 2.3, md: 3.5 },
                background:
                  'linear-gradient(135deg, #0B5A91 0%, #173F60 100%)',
                color: '#fff',
              }}
            >
              <Stack spacing={2.2}>
                <Stack
                  direction="row"
                  sx={{
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: 2,
                    flexWrap: 'wrap',
                  }}
                >
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontSize: '.76rem',
                        letterSpacing: '.08em',
                        textTransform: 'uppercase',
                        fontWeight: 800,
                        opacity: .84,
                      }}
                    >
                      {normalizeText(course.category) || 'Learning Programme'}
                    </Typography>

                    <Typography
                      sx={{
                        mt: .8,
                        fontSize: {
                          xs: '1.65rem',
                          md: '2.25rem',
                        },
                        lineHeight: 1.2,
                        fontWeight: 800,
                      }}
                    >
                      {course.title}
                    </Typography>

                    <Typography
                      sx={{
                        mt: .8,
                        color: 'rgba(255,255,255,.82)',
                        maxWidth: 800,
                        lineHeight: 1.65,
                      }}
                    >
                      {normalizeText(course.description) ||
                        'Follow the learning path, complete course activities and build your professional capability.'}
                    </Typography>
                  </Box>

                  <Chip
                    icon={
                      <WorkspacePremiumOutlinedIcon
                        sx={{ color: 'inherit !important' }}
                      />
                    }
                    label={
                      completed
                        ? 'Course completed'
                        : enrollment
                          ? 'Active enrolment'
                          : 'Preview mode'
                    }
                    sx={{
                      color: '#fff',
                      borderColor: 'rgba(255,255,255,.32)',
                      bgcolor: 'rgba(255,255,255,.12)',
                      fontWeight: 700,
                    }}
                    variant="outlined"
                  />
                </Stack>

                <Stack
                  direction={{ xs: 'column', md: 'row' }}
                  sx={{
                    justifyContent: 'space-between',
                    alignItems: { md: 'center' },
                    gap: 2,
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1.5}
                    sx={{
                      flexWrap: 'wrap',
                      alignItems: 'center',
                    }}
                  >
                    <Chip
                      label={displayLevel(course.level)}
                      sx={{
                        color: '#fff',
                        bgcolor: 'rgba(255,255,255,.12)',
                        fontWeight: 700,
                      }}
                    />

                    <Typography
                      sx={{
                        color: 'rgba(255,255,255,.82)',
                        fontSize: '.85rem',
                      }}
                    >
                      {Number(course.durationHours) || 0} hours
                    </Typography>

                    {course.department && (
                      <Typography
                        sx={{
                          color: 'rgba(255,255,255,.82)',
                          fontSize: '.85rem',
                        }}
                      >
                        {course.department}
                      </Typography>
                    )}
                  </Stack>

                  <Button
                    variant="contained"
                    onClick={continueLearning}
                    startIcon={<PlayCircleOutlineRoundedIcon />}
                    sx={{
                      bgcolor: '#fff',
                      color: '#173F60',
                      textTransform: 'none',
                      fontWeight: 800,
                      borderRadius: 1.5,
                      px: 2.2,
                      '&:hover': {
                        bgcolor: '#F2F7FA',
                      },
                    }}
                  >
                    {enrollment
                      ? completed
                        ? 'Review course'
                        : 'Continue learning'
                      : 'Explore course'}
                  </Button>
                </Stack>
              </Stack>
            </Box>

            {!enrollment && (
              <Paper
                elevation={0}
                sx={{
                  mx: { xs: 2, md: 3 },
                  mb: 0,
                  p: { xs: 1.8, md: 2.2 },
                  border: '1px solid #D8E7F0',
                  borderRadius: 2,
                  bgcolor: '#F7FBFE',
                }}
              >
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  sx={{
                    justifyContent: 'space-between',
                    alignItems: { sm: 'center' },
                    gap: 1.5,
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        color: '#244A66',
                        fontWeight: 800,
                      }}
                    >
                      Course preview
                    </Typography>

                    <Typography
                      sx={{
                        mt: .3,
                        color: '#718594',
                        fontSize: '.79rem',
                        lineHeight: 1.55,
                      }}
                    >
                      Explore the course overview and learning path.
                      Enroll when you are ready to start learning and
                      track your progress.
                    </Typography>
                  </Box>

                  <Button
                    variant="contained"
                    onClick={handleEnroll}
                    disabled={enrollingCourse}
                    startIcon={<SchoolOutlinedIcon />}
                    sx={{
                      flexShrink: 0,
                      bgcolor: '#0B5A91',
                      textTransform: 'none',
                      fontWeight: 800,
                      borderRadius: 1.5,
                      '&:hover': {
                        bgcolor: '#084873',
                      },
                    }}
                  >
                    {enrollingCourse
                      ? 'Enrolling...'
                      : 'Enroll in course'}
                  </Button>
                </Stack>
              </Paper>
            )}

            <Box sx={{ p: { xs: 2, md: 3 } }}>
              <Stack spacing={1}>
                <Stack
                  direction="row"
                  sx={{
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography
                    sx={{
                      color: '#244A66',
                      fontWeight: 800,
                    }}
                  >
                    Overall progress
                  </Typography>

                  <Typography
                    sx={{
                      color: '#0B5A91',
                      fontWeight: 800,
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
                    borderRadius: 8,
                    bgcolor: '#E7EEF3',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 8,
                      bgcolor: '#0B5A91',
                    },
                  }}
                />

                <Typography
                  sx={{
                    color: '#718594',
                    fontSize: '.78rem',
                  }}
                >
                  {modules.length > 0
                    ? `${completedModules} of ${modules.length} learning modules completed`
                    : 'Learning path is being prepared'}
                </Typography>
              </Stack>
            </Box>
          </Paper>

          {error && (
            <Alert
              severity="error"
              onClose={() => setError('')}
            >
              {error}
            </Alert>
          )}

          <Paper
            elevation={0}
            sx={{
              border: '1px solid #D9E5EC',
              borderRadius: 2.5,
              overflow: 'hidden',
            }}
          >
            <Tabs
              value={activeTab}
              onChange={(_, value: WorkspaceTab) =>
                setActiveTab(value)
              }
              variant="scrollable"
              allowScrollButtonsMobile
              sx={{
                px: { xs: 1, md: 2 },
                '& .MuiTab-root': {
                  minHeight: 56,
                  textTransform: 'none',
                  fontWeight: 750,
                },
              }}
            >
              <Tab
                value="overview"
                label="Overview"
                icon={<SchoolOutlinedIcon />}
                iconPosition="start"
              />

              <Tab
                value="modules"
                label={`Learning Path (${modules.length})`}
                icon={<MenuBookOutlinedIcon />}
                iconPosition="start"
              />

              <Tab
                value="resources"
                label={`Resources (${resources.length})`}
                icon={<DescriptionOutlinedIcon />}
                iconPosition="start"
              />

              <Tab
                value="assessments"
                label={`Assessments (${assessments.length})`}
                icon={<AssignmentOutlinedIcon />}
                iconPosition="start"
              />
            </Tabs>

            <Divider />

            {activeTab === 'overview' && (
              <Box sx={{ p: { xs: 2, md: 3 } }}>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: '1fr',
                      md: '1.35fr .65fr',
                    },
                    gap: 2.5,
                  }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: { xs: 2, md: 2.5 },
                      border: '1px solid #E1E9EE',
                      borderRadius: 2,
                    }}
                  >
                    <Stack spacing={2}>
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{
                            color: '#173F60',
                            fontWeight: 800,
                          }}
                        >
                          Your learning path
                        </Typography>

                        <Typography
                          sx={{
                            mt: .5,
                            color: '#718594',
                            lineHeight: 1.65,
                          }}
                        >
                          Work through the modules in sequence and use
                          the resources provided by your trainer.
                        </Typography>
                      </Box>

                      {modules.length === 0 ? (
                        <Alert severity="info">
                          No active modules are available yet.
                        </Alert>
                      ) : (
                        <Stack spacing={1}>
                          {modules.slice(0, 5).map((module, index) => (
                            <Button
                              key={module.id}
                              variant="text"
                              onClick={() => {
                                setSelectedModuleId(module.id);
                                setActiveTab('modules');
                              }}
                              sx={{
                                p: 1.4,
                                justifyContent: 'flex-start',
                                textAlign: 'left',
                                textTransform: 'none',
                                border: '1px solid #E4EBF0',
                                borderRadius: 1.5,
                                color: '#244A66',
                              }}
                            >
                              <Box
                                sx={{
                                  minWidth: 34,
                                  height: 34,
                                  mr: 1.4,
                                  borderRadius: '50%',
                                  display: 'grid',
                                  placeItems: 'center',
                                  bgcolor:
                                    index < completedModules
                                      ? '#EAF5EF'
                                      : '#EEF6FC',
                                  color:
                                    index < completedModules
                                      ? '#28734A'
                                      : '#0B5A91',
                                  fontWeight: 800,
                                }}
                              >
                                {index < completedModules ? (
                                  <CheckCircleOutlineRoundedIcon
                                    sx={{ fontSize: 19 }}
                                  />
                                ) : (
                                  index + 1
                                )}
                              </Box>

                              <Box sx={{ minWidth: 0 }}>
                                <Typography
                                  sx={{
                                    fontWeight: 750,
                                    color: '#244A66',
                                  }}
                                >
                                  {module.title}
                                </Typography>

                                {module.description && (
                                  <Typography
                                    sx={{
                                      mt: .25,
                                      fontSize: '.76rem',
                                      color: '#7A8B96',
                                    }}
                                  >
                                    {module.description}
                                  </Typography>
                                )}
                              </Box>
                            </Button>
                          ))}
                        </Stack>
                      )}

                      {modules.length > 5 && (
                        <Button
                          onClick={() => setActiveTab('modules')}
                          endIcon={<ArrowForwardRoundedIcon />}
                          sx={{
                            alignSelf: 'flex-start',
                            textTransform: 'none',
                            fontWeight: 700,
                            color: '#0B5A91',
                          }}
                        >
                          View complete learning path
                        </Button>
                      )}
                    </Stack>
                  </Paper>

                  <Stack spacing={2}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2.4,
                        border: '1px solid #E1E9EE',
                        borderRadius: 2,
                      }}
                    >
                      <Typography
                        sx={{
                          color: '#173F60',
                          fontWeight: 800,
                        }}
                      >
                        Course snapshot
                      </Typography>

                      <Stack spacing={1.4} sx={{ mt: 1.8 }}>
                        <Stack
                          direction="row"
                          sx={{
                            justifyContent: 'space-between',
                          }}
                        >
                          <Typography
                            sx={{
                              color: '#718594',
                              fontSize: '.84rem',
                            }}
                          >
                            Modules
                          </Typography>

                          <Typography
                            sx={{
                              color: '#244A66',
                              fontWeight: 750,
                            }}
                          >
                            {modules.length}
                          </Typography>
                        </Stack>

                        <Stack
                          direction="row"
                          sx={{
                            justifyContent: 'space-between',
                          }}
                        >
                          <Typography
                            sx={{
                              color: '#718594',
                              fontSize: '.84rem',
                            }}
                          >
                            Resources
                          </Typography>

                          <Typography
                            sx={{
                              color: '#244A66',
                              fontWeight: 750,
                            }}
                          >
                            {resources.length}
                          </Typography>
                        </Stack>

                        <Stack
                          direction="row"
                          sx={{
                            justifyContent: 'space-between',
                          }}
                        >
                          <Typography
                            sx={{
                              color: '#718594',
                              fontSize: '.84rem',
                            }}
                          >
                            Assessments
                          </Typography>

                          <Typography
                            sx={{
                              color: '#244A66',
                              fontWeight: 750,
                            }}
                          >
                            {assessments.length}
                          </Typography>
                        </Stack>

                        <Stack
                          direction="row"
                          sx={{
                            justifyContent: 'space-between',
                          }}
                        >
                          <Typography
                            sx={{
                              color: '#718594',
                              fontSize: '.84rem',
                            }}
                          >
                            Level
                          </Typography>

                          <Typography
                            sx={{
                              color: '#244A66',
                              fontWeight: 750,
                            }}
                          >
                            {displayLevel(course.level)}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Paper>

                    <Paper
                      elevation={0}
                      sx={{
                        p: 2.4,
                        border: '1px solid #D8E7F0',
                        borderRadius: 2,
                        bgcolor: '#F6FBFE',
                      }}
                    >
                      <Stack
                        direction="row"
                        spacing={1.3}
                        sx={{
                          alignItems: 'flex-start',
                        }}
                      >
                        <AutoAwesomeRoundedIcon
                          sx={{
                            color: '#0B5A91',
                            mt: .2,
                          }}
                        />

                        <Box>
                          <Typography
                            sx={{
                              color: '#173F60',
                              fontWeight: 800,
                            }}
                          >
                            AI Learning Advisor
                          </Typography>

                          <Typography
                            sx={{
                              mt: .45,
                              color: '#6D8190',
                              fontSize: '.8rem',
                              lineHeight: 1.6,
                            }}
                          >
                            Ask for a personalized next step, explain a
                            topic or identify learning gaps.
                          </Typography>

                          <Button
                            component={RouterLink}
                            to={`/trainee/ai?courseId=${course.id}`}
                            size="small"
                            endIcon={<ArrowForwardRoundedIcon />}
                            sx={{
                              mt: 1,
                              px: 0,
                              textTransform: 'none',
                              fontWeight: 750,
                              color: '#0B5A91',
                            }}
                          >
                            Open AI Assistant
                          </Button>
                        </Box>
                      </Stack>
                    </Paper>
                  </Stack>
                </Box>
              </Box>
            )}

            {activeTab === 'modules' && (
              <Box
                sx={{
                  p: { xs: 1.5, md: 2.5 },
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    lg: '330px 1fr',
                  },
                  gap: 2,
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    border: '1px solid #E1E9EE',
                    borderRadius: 2,
                    overflow: 'hidden',
                    alignSelf: 'start',
                  }}
                >
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: '#F7FAFC',
                      borderBottom: '1px solid #E1E9EE',
                    }}
                  >
                    <Typography
                      sx={{
                        color: '#173F60',
                        fontWeight: 800,
                      }}
                    >
                      Learning Path
                    </Typography>

                    <Typography
                      sx={{
                        mt: .3,
                        color: '#7A8B96',
                        fontSize: '.75rem',
                      }}
                    >
                      {modules.length} modules
                    </Typography>
                  </Box>

                  {contentLoading ? (
                    <Box sx={{ p: 3, textAlign: 'center' }}>
                      <CircularProgress
                        size={24}
                        sx={{ color: '#0B5A91' }}
                      />
                    </Box>
                  ) : modules.length === 0 ? (
                    <Typography
                      sx={{
                        p: 2,
                        color: '#80909D',
                        fontSize: '.84rem',
                      }}
                    >
                      No modules available.
                    </Typography>
                  ) : (
                    <Stack>
                      {modules.map((module, index) => {
                        const active =
                          selectedModuleId === module.id;

                        return (
                          <Button
                            key={module.id}
                            onClick={() =>
                              setSelectedModuleId(module.id)
                            }
                            sx={{
                              p: 1.5,
                              justifyContent: 'flex-start',
                              textAlign: 'left',
                              textTransform: 'none',
                              borderRadius: 0,
                              borderBottom:
                                '1px solid #EDF2F5',
                              bgcolor: active
                                ? '#EEF6FC'
                                : '#fff',
                              color: '#244A66',
                              '&:hover': {
                                bgcolor: '#F5FAFD',
                              },
                            }}
                          >
                            <Box
                              sx={{
                                minWidth: 34,
                                height: 34,
                                mr: 1.2,
                                display: 'grid',
                                placeItems: 'center',
                                borderRadius: '50%',
                                bgcolor:
                                  index < completedModules
                                    ? '#EAF5EF'
                                    : active
                                      ? '#DCEFF9'
                                      : '#F0F4F7',
                                color:
                                  index < completedModules
                                    ? '#28734A'
                                    : '#0B5A91',
                                fontWeight: 800,
                              }}
                            >
                              {index < completedModules ? (
                                <CheckCircleOutlineRoundedIcon
                                  sx={{ fontSize: 18 }}
                                />
                              ) : (
                                index + 1
                              )}
                            </Box>

                            <Box sx={{ minWidth: 0 }}>
                              <Typography
                                sx={{
                                  fontWeight: active ? 800 : 700,
                                  fontSize: '.86rem',
                                }}
                              >
                                {module.title}
                              </Typography>

                              <Typography
                                sx={{
                                  mt: .15,
                                  color: '#83929D',
                                  fontSize: '.7rem',
                                }}
                              >
                                Module {index + 1}
                              </Typography>
                            </Box>
                          </Button>
                        );
                      })}
                    </Stack>
                  )}
                </Paper>

                <Paper
                  elevation={0}
                  sx={{
                    border: '1px solid #E1E9EE',
                    borderRadius: 2,
                    minHeight: 420,
                  }}
                >
                  {!selectedModule ? (
                    <Box sx={{ p: 4 }}>
                      <Alert severity="info">
                        Select a module to begin.
                      </Alert>
                    </Box>
                  ) : (
                    <Box sx={{ p: { xs: 2, md: 3 } }}>
                      <Stack spacing={2.2}>
                        <Box>
                          <Typography
                            sx={{
                              color: '#0B5A91',
                              fontSize: '.75rem',
                              fontWeight: 800,
                              letterSpacing: '.07em',
                              textTransform: 'uppercase',
                            }}
                          >
                            Module
                          </Typography>

                          <Typography
                            sx={{
                              mt: .55,
                              color: '#173F60',
                              fontSize: {
                                xs: '1.4rem',
                                md: '1.75rem',
                              },
                              fontWeight: 800,
                            }}
                          >
                            {selectedModule.title}
                          </Typography>

                          {selectedModule.description && (
                            <Typography
                              sx={{
                                mt: .7,
                                color: '#687D8C',
                                lineHeight: 1.7,
                              }}
                            >
                              {selectedModule.description}
                            </Typography>
                          )}
                        </Box>

                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            border: '1px solid #E1E9EE',
                            borderRadius: 1.7,
                            bgcolor: '#FBFCFD',
                          }}
                        >
                          <Stack
                            direction="row"
                            spacing={1.2}
                            sx={{
                              alignItems: 'center',
                            }}
                          >
                            <PlayCircleOutlineRoundedIcon
                              sx={{ color: '#0B5A91' }}
                            />

                            <Box>
                              <Typography
                                sx={{
                                  color: '#244A66',
                                  fontWeight: 750,
                                }}
                              >
                                Continue this module
                              </Typography>

                              <Typography
                                sx={{
                                  mt: .2,
                                  color: '#7A8B96',
                                  fontSize: '.76rem',
                                }}
                              >
                                Open the module content and continue
                                from your learning path.
                              </Typography>
                            </Box>
                          </Stack>
                        </Paper>

                        <Box>
                          <Typography
                            sx={{
                              color: '#244A66',
                              fontWeight: 800,
                              mb: 1.2,
                            }}
                          >
                            Module resources
                          </Typography>

                          {selectedModuleResources.length === 0 ? (
                            <Typography
                              sx={{
                                color: '#80909D',
                                fontSize: '.82rem',
                              }}
                            >
                              No resources are attached to this module.
                            </Typography>
                          ) : (
                            <Stack spacing={1}>
                              {selectedModuleResources.map((resource) => (
                                <Paper
                                  key={resource.id}
                                  elevation={0}
                                  sx={{
                                    p: 1.6,
                                    border:
                                      '1px solid #E3EBF0',
                                    borderRadius: 1.5,
                                  }}
                                >
                                  <Stack
                                    direction={{
                                      xs: 'column',
                                      sm: 'row',
                                    }}
                                    sx={{
                                      justifyContent:
                                        'space-between',
                                      alignItems: {
                                        sm: 'center',
                                      },
                                      gap: 1.5,
                                    }}
                                  >
                                    <Stack
                                      direction="row"
                                      spacing={1}
                                      sx={{
                                        alignItems: 'center',
                                      }}
                                    >
                                      <DescriptionOutlinedIcon
                                        sx={{
                                          color: '#0B5A91',
                                          fontSize: 20,
                                        }}
                                      />

                                      <Box>
                                        <Typography
                                          sx={{
                                            color: '#244A66',
                                            fontWeight: 700,
                                          }}
                                        >
                                          {resource.title}
                                        </Typography>

                                        <Typography
                                          sx={{
                                            color: '#83929D',
                                            fontSize: '.7rem',
                                            mt: .15,
                                          }}
                                        >
                                          {resource.resourceType}
                                        </Typography>
                                      </Box>
                                    </Stack>

                                    <Button
                                      size="small"
                                      variant="outlined"
                                      startIcon={
                                        <DownloadOutlinedIcon />
                                      }
                                      onClick={() =>
                                        handleDownload(
                                          resource.id,
                                          resource.fileName
                                        )
                                      }
                                      sx={{
                                        textTransform: 'none',
                                        color: '#0B5A91',
                                        borderColor: '#B7CAD6',
                                      }}
                                    >
                                      Download
                                    </Button>
                                  </Stack>
                                </Paper>
                              ))}
                            </Stack>
                          )}
                        </Box>

                        <Paper
                          elevation={0}
                          sx={{
                            p: 2,
                            border: '1px solid #D8E7F0',
                            borderRadius: 1.7,
                            bgcolor: '#F7FBFE',
                          }}
                        >
                          <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                            sx={{
                              justifyContent: 'space-between',
                              alignItems: { sm: 'center' },
                              gap: 1.5,
                            }}
                          >
                            <Box>
                              <Typography
                                sx={{
                                  color: '#244A66',
                                  fontWeight: 800,
                                }}
                              >
                                Finish this module
                              </Typography>

                              <Typography
                                sx={{
                                  mt: .3,
                                  color: '#718594',
                                  fontSize: '.76rem',
                                  lineHeight: 1.5,
                                }}
                              >
                                Mark the module complete after reviewing
                                its learning material and resources.
                              </Typography>
                            </Box>

                            <Button
                              variant="contained"
                              disabled={
                                enrollment
                                  ? savingProgress ||
                                    completedModules >=
                                      modules.findIndex(
                                        (module) =>
                                          module.id === selectedModule.id
                                      ) + 1
                                  : enrollingCourse
                              }
                              onClick={
                                enrollment
                                  ? handleModuleComplete
                                  : handleEnroll
                              }
                              startIcon={
                                enrollment ? (
                                  <CheckCircleOutlineRoundedIcon />
                                ) : (
                                  <SchoolOutlinedIcon />
                                )
                              }
                              sx={{
                                flexShrink: 0,
                                textTransform: 'none',
                                fontWeight: 800,
                                bgcolor: '#0B5A91',
                                '&:hover': {
                                  bgcolor: '#084873',
                                },
                              }}
                            >
                              {enrollment
                                ? savingProgress
                                  ? 'Saving...'
                                  : 'Mark module complete'
                                : enrollingCourse
                                  ? 'Enrolling...'
                                  : 'Enroll to start'}
                            </Button>
                          </Stack>
                        </Paper>

                        <Button
                          component={RouterLink}
                          to={`/trainee/ai?courseId=${course.id}&moduleId=${selectedModule.id}`}
                          variant="outlined"
                          startIcon={<SmartToyOutlinedIcon />}
                          sx={{
                            alignSelf: 'flex-start',
                            textTransform: 'none',
                            fontWeight: 750,
                            color: '#0B5A91',
                            borderColor: '#B7CAD6',
                          }}
                        >
                          Ask AI about this module
                        </Button>
                      </Stack>
                    </Box>
                  )}
                </Paper>
              </Box>
            )}

            {activeTab === 'resources' && (
              <Box sx={{ p: { xs: 1.5, md: 3 } }}>
                {resources.length === 0 ? (
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      textAlign: 'center',
                      border:
                        '1px solid #E1E9EE',
                      borderRadius: 2,
                    }}
                  >
                    <DescriptionOutlinedIcon
                      sx={{
                        fontSize: 46,
                        color: '#9DB1BF',
                      }}
                    />

                    <Typography
                      sx={{
                        mt: 1,
                        color: '#244A66',
                        fontWeight: 750,
                      }}
                    >
                      No course resources yet
                    </Typography>

                    <Typography
                      sx={{
                        mt: .5,
                        color: '#80909D',
                        fontSize: '.82rem',
                      }}
                    >
                      Your trainer has not published resources for
                      this course yet.
                    </Typography>
                  </Paper>
                ) : (
                  <Stack spacing={1.3}>
                    {resources.map((resource) => (
                      <Paper
                        key={resource.id}
                        elevation={0}
                        sx={{
                          p: { xs: 1.6, md: 2 },
                          border:
                            '1px solid #E1E9EE',
                          borderRadius: 1.7,
                        }}
                      >
                        <Stack
                          direction={{
                            xs: 'column',
                            md: 'row',
                          }}
                          sx={{
                            justifyContent:
                              'space-between',
                            alignItems: {
                              md: 'center',
                            },
                            gap: 2,
                          }}
                        >
                          <Stack
                            direction="row"
                            spacing={1.3}
                            sx={{
                              alignItems: 'flex-start',
                            }}
                          >
                            <DescriptionOutlinedIcon
                              sx={{
                                color: '#0B5A91',
                                mt: .2,
                              }}
                            />

                            <Box>
                              <Typography
                                sx={{
                                  color: '#244A66',
                                  fontWeight: 750,
                                }}
                              >
                                {resource.title}
                              </Typography>

                              <Typography
                                sx={{
                                  color: '#83929D',
                                  fontSize: '.73rem',
                                  mt: .25,
                                }}
                              >
                                {resource.resourceType}
                                {resource.fileName
                                  ? ` • ${resource.fileName}`
                                  : ''}
                              </Typography>

                              {resource.moduleId && (
                                <Chip
                                  size="small"
                                  label={
                                    modules.find(
                                      (module) =>
                                        module.id ===
                                        Number(resource.moduleId)
                                    )?.title ||
                                    'Course resource'
                                  }
                                  sx={{
                                    mt: .8,
                                    bgcolor:
                                      '#EEF6FC',
                                    color:
                                      '#0B5A91',
                                    fontWeight: 700,
                                  }}
                                />
                              )}

                              {resource.description && (
                                <Typography
                                  sx={{
                                    mt: .7,
                                    color: '#718594',
                                    fontSize: '.8rem',
                                    lineHeight: 1.5,
                                  }}
                                >
                                  {resource.description}
                                </Typography>
                              )}
                            </Box>
                          </Stack>

                          <Button
                            variant="outlined"
                            startIcon={
                              <DownloadOutlinedIcon />
                            }
                            onClick={() =>
                              handleDownload(
                                resource.id,
                                resource.fileName
                              )
                            }
                            sx={{
                              flexShrink: 0,
                              textTransform: 'none',
                              fontWeight: 700,
                              color: '#0B5A91',
                              borderColor: '#B7CAD6',
                            }}
                          >
                            Download
                          </Button>
                        </Stack>
                      </Paper>
                    ))}

                    {unassignedResources.length > 0 && (
                      <Typography
                        sx={{
                          color: '#83929D',
                          fontSize: '.75rem',
                          pt: 1,
                        }}
                      >
                        {unassignedResources.length} general course
                        resource
                        {unassignedResources.length === 1
                          ? ''
                          : 's'} not linked to a specific module.
                      </Typography>
                    )}
                  </Stack>
                )}
              </Box>
            )}

            {activeTab === 'assessments' && (
              <Box sx={{ p: { xs: 1.5, md: 3 } }}>
                {assessments.length === 0 ? (
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      textAlign: 'center',
                      border:
                        '1px solid #E1E9EE',
                      borderRadius: 2,
                    }}
                  >
                    <AssignmentOutlinedIcon
                      sx={{
                        fontSize: 46,
                        color: '#9DB1BF',
                      }}
                    />

                    <Typography
                      sx={{
                        mt: 1,
                        color: '#244A66',
                        fontWeight: 750,
                      }}
                    >
                      No assessments yet
                    </Typography>

                    <Typography
                      sx={{
                        mt: .5,
                        color: '#80909D',
                        fontSize: '.82rem',
                      }}
                    >
                      Assessments will appear here once published.
                    </Typography>
                  </Paper>
                ) : (
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: {
                        xs: '1fr',
                        md: 'repeat(2, 1fr)',
                      },
                      gap: 2,
                    }}
                  >
                    {assessments.map((assessment) => (
                      <Paper
                        key={assessment.id}
                        elevation={0}
                        sx={{
                          p: { xs: 2, md: 2.5 },
                          border:
                            '1px solid #E1E9EE',
                          borderRadius: 2,
                        }}
                      >
                        <Stack spacing={1.5}>
                          <Stack
                            direction="row"
                            sx={{
                              justifyContent:
                                'space-between',
                              alignItems: 'flex-start',
                              gap: 1,
                            }}
                          >
                            <Typography
                              sx={{
                                color: '#244A66',
                                fontWeight: 800,
                              }}
                            >
                              {assessment.title}
                            </Typography>

                            <Chip
                              label={
                                normalizeText(
                                  assessment.status
                                ) || 'Available'
                              }
                              size="small"
                              sx={{
                                bgcolor:
                                  '#EEF6FC',
                                color:
                                  '#0B5A91',
                                fontWeight: 700,
                              }}
                            />
                          </Stack>

                          {assessment.description && (
                            <Typography
                              sx={{
                                color: '#718594',
                                fontSize: '.82rem',
                                lineHeight: 1.6,
                              }}
                            >
                              {assessment.description}
                            </Typography>
                          )}

                          <Stack
                            direction="row"
                            spacing={2}
                            sx={{
                              flexWrap: 'wrap',
                            }}
                          >
                            <Tooltip title="Time limit">
                              <Stack
                                direction="row"
                                spacing={.6}
                                sx={{
                                  alignItems:
                                    'center',
                                }}
                              >
                                <ScheduleOutlinedIcon
                                  sx={{
                                    fontSize:
                                      17,
                                    color:
                                      '#708595',
                                  }}
                                />
                                <Typography
                                  sx={{
                                    fontSize:
                                      '.76rem',
                                    color:
                                      '#708595',
                                  }}
                                >
                                  {
                                    assessment.timeLimitMinutes
                                  }{' '}
                                  min
                                </Typography>
                              </Stack>
                            </Tooltip>

                            <Typography
                              sx={{
                                fontSize: '.76rem',
                                color: '#708595',
                              }}
                            >
                              Pass mark{' '}
                              {
                                assessment.passingPercentage
                              }%
                            </Typography>
                          </Stack>

                          <Button
                            component={RouterLink}
                            to={`/trainee/assessments/${assessment.id}`}
                            variant="contained"
                            startIcon={
                              <PlayCircleOutlineRoundedIcon />
                            }
                            disabled={!enrollment}
                            sx={{
                              mt: .3,
                              textTransform:
                                'none',
                              fontWeight: 750,
                              bgcolor:
                                enrollment
                                  ? '#0B5A91'
                                  : '#B9C7D0',
                              '&:hover': {
                                bgcolor:
                                  enrollment
                                    ? '#084873'
                                    : '#B9C7D0',
                              },
                            }}
                          >
                            {enrollment
                              ? 'Start Assessment'
                              : 'Enroll to access'}
                          </Button>
                        </Stack>
                      </Paper>
                    ))}
                  </Box>
                )}
              </Box>
            )}
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: { xs: 2, md: 2.6 },
              border: '1px solid #D8E7F0',
              borderRadius: 2.2,
              bgcolor: '#F7FBFE',
            }}
          >
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={1.5}
              sx={{
                justifyContent: 'space-between',
                alignItems: { md: 'center' },
              }}
            >
              <Stack
                direction="row"
                spacing={1.2}
                sx={{
                  alignItems: 'flex-start',
                }}
              >
                <SmartToyOutlinedIcon
                  sx={{
                    color: '#0B5A91',
                    mt: .15,
                  }}
                />

                <Box>
                  <Typography
                    sx={{
                      color: '#173F60',
                      fontWeight: 800,
                    }}
                  >
                    Need help with this course?
                  </Typography>

                  <Typography
                    sx={{
                      mt: .3,
                      color: '#6D8190',
                      fontSize: '.8rem',
                    }}
                  >
                    Ask the AI Learning Advisor about concepts,
                    resources, modules or your next learning step.
                  </Typography>
                </Box>
              </Stack>

              <Button
                component={RouterLink}
                to={`/trainee/ai?courseId=${course.id}`}
                variant="outlined"
                endIcon={<ArrowForwardRoundedIcon />}
                sx={{
                  textTransform: 'none',
                  fontWeight: 750,
                  color: '#0B5A91',
                  borderColor: '#B7CAD6',
                  flexShrink: 0,
                }}
              >
                Ask AI
              </Button>
            </Stack>
          </Paper>

          <Typography
            sx={{
              color: '#84929C',
              fontSize: '.73rem',
              display: 'flex',
              alignItems: 'center',
              gap: .5,
            }}
          >
            <WorkspacePremiumOutlinedIcon sx={{ fontSize: 16 }} />
            Course completion and certificate eligibility follow the
            programme requirements and assessment outcomes.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
};

export default CourseWorkspace;
