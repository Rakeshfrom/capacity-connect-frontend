import { useEffect, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';

import {
  getCourseById,
  getEnrollments,
  getMyCourseAssessments,
  getMyCourseResources,
  getCourseModules,
  downloadTrainerResource,
} from '../../../services/api';

type Course = {
  id: number;
  title: string;
  category: string;
  level: string;
  durationHours: number;
  description?: string;
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
  description?: string;
  orderIndex: number;
  active: boolean;
};

type Resource = {
  id: number;
  courseId?: number;
  moduleId?: number;
  title: string;
  description?: string;
  resourceType: string;
  fileName?: string;
  active: boolean;
};

type Assessment = {
  id: number;
  title: string;
  description?: string;
  timeLimitMinutes: number;
  passingPercentage: number;
  status: string;
};

const CourseWorkspace = () => {
  const { courseId } = useParams();
  const id = Number(courseId);

  const [course, setCourse] = useState<Course | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!Number.isFinite(id)) {
      setError('Invalid course.');
      setLoading(false);
      return;
    }

    const loadWorkspace = async () => {
      try {
        const [courseData, enrollmentData] = await Promise.all([
          getCourseById(id),
          getEnrollments(),
        ]);

        const currentEnrollment = enrollmentData.find(
          (item: Enrollment) => Number(item.courseId) === id
        );

        if (!currentEnrollment) {
          setError('You are not enrolled in this course.');
          return;
        }

        setCourse(courseData);
        setEnrollment(currentEnrollment);
        setLoading(false);

        Promise.all([
          getMyCourseResources(id),
          getCourseModules(id),
          getMyCourseAssessments(id),
        ])
          .then(([resourceData, moduleData, assessmentData]) => {
            setResources(Array.isArray(resourceData) ? resourceData : []);
            setModules(
              Array.isArray(moduleData)
                ? moduleData.filter((item: CourseModule) => item.active)
                : []
            );
            setAssessments(
              Array.isArray(assessmentData) ? assessmentData : []
            );
          })
          .catch((err) => {
            console.error('Failed to load course content:', err);
          });
      } catch (err) {
        console.error('Failed to load course workspace:', err);
        setError(
          'Unable to load this course workspace. Please try again.'
        );
        setLoading(false);
      }
    };

    loadWorkspace();
  }, [id]);

  const handleDownload = async (resourceId: number, fileName?: string) => {
    try {
      const blob = await downloadTrainerResource(resourceId);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');

      anchor.href = url;
      anchor.download = fileName || 'resource';
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
    } catch {
      setError('Unable to download this resource.');
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 10, textAlign: 'center' }}>
        <CircularProgress sx={{ color: '#0B5A91' }} />
        <Typography sx={{ mt: 2, color: '#657887' }}>
          Loading course workspace...
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
          startIcon={<ArrowBackIcon />}
          sx={{ mt: 3, textTransform: 'none' }}
        >
          Back to My Courses
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: '#F4F8FB', minHeight: '100vh', py: { xs: 3, md: 5 } }}>
      <Container maxWidth="xl">
        <Button
          component={RouterLink}
          to="/trainee/courses"
          startIcon={<ArrowBackIcon />}
          sx={{
            color: '#0B5A91',
            textTransform: 'none',
            fontWeight: 700,
            mb: 2,
          }}
        >
          Back to My Courses
        </Button>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, md: 4 },
            border: '1px solid #DCE6ED',
            borderRadius: 2,
            bgcolor: '#fff',
          }}
        >
          <Stack spacing={1.5}>
            <Typography
              sx={{
                color: '#0B5A91',
                fontWeight: 700,
                fontSize: '0.8rem',
                letterSpacing: '0.07em',
                textTransform: 'uppercase',
              }}
            >
              {course.category}
            </Typography>

            <Typography
              variant="h4"
              sx={{
                color: '#173F60',
                fontWeight: 800,
                fontSize: { xs: '1.8rem', md: '2.4rem' },
              }}
            >
              {course.title}
            </Typography>

            {course.description && (
              <Typography sx={{ color: '#657887', lineHeight: 1.7 }}>
                {course.description}
              </Typography>
            )}

            <Box sx={{ mt: 1 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mb: 0.8,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: '#657887', fontWeight: 600 }}
                >
                  Course Progress
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ color: '#0B5A91', fontWeight: 700 }}
                >
                  {enrollment.progress}%
                </Typography>
              </Box>

              <Box
                sx={{
                  height: 8,
                  bgcolor: '#E7EEF3',
                  borderRadius: 5,
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    width: `${enrollment.progress}%`,
                    height: '100%',
                    bgcolor: '#0B5A91',
                    borderRadius: 5,
                  }}
                />
              </Box>
            </Box>
          </Stack>
        </Paper>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '1.2fr 0.8fr' },
            gap: 3,
            mt: 3,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, md: 3 },
              border: '1px solid #DCE6ED',
              borderRadius: 2,
            }}
          >
            <Stack
              direction="row"
              spacing={1.5}
              sx={{ alignItems: 'center', mb: 2.5 }}
            >
              <MenuBookOutlinedIcon sx={{ color: '#0B5A91' }} />
              <Typography
                variant="h6"
                sx={{ color: '#244A66', fontWeight: 700 }}
              >
                Learning Resources
              </Typography>
              <Chip
                label={resources.length}
                size="small"
                sx={{ ml: 'auto', color: '#0B5A91', bgcolor: '#EEF6FC' }}
              />
            </Stack>

            {resources.length === 0 ? (
              <Typography sx={{ color: '#80909D' }}>
                No learning resources have been published for this course yet.
              </Typography>
            ) : (
              <Stack spacing={1.5}>
                {resources.map((resource) => (
                  <Paper
                    key={resource.id}
                    elevation={0}
                    sx={{
                      p: 2,
                      border: '1px solid #E1E9EE',
                      borderRadius: 1.5,
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: 2,
                        alignItems: 'center',
                      }}
                    >
                      <Box sx={{ minWidth: 0 }}>
                        <Stack
                          direction="row"
                          spacing={1}
                          sx={{ alignItems: 'center' }}
                        >
                          <DescriptionOutlinedIcon
                            sx={{ color: '#0B5A91', fontSize: 20 }}
                          />
                          <Typography
                            sx={{
                              color: '#244A66',
                              fontWeight: 700,
                            }}
                          >
                            {resource.title}
                          </Typography>
                        </Stack>

                        <Typography
                          variant="caption"
                          sx={{
                            display: 'block',
                            color: '#80909D',
                            mt: 0.6,
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
                                (module) => module.id === resource.moduleId
                              )?.title || 'Course resource'
                            }
                            sx={{
                              mt: 0.8,
                              color: '#0B5A91',
                              bgcolor: '#EEF6FC',
                              fontWeight: 700,
                            }}
                          />
                        )}
                      </Box>

                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<DownloadOutlinedIcon />}
                        onClick={() =>
                          handleDownload(resource.id, resource.fileName)
                        }
                        sx={{
                          flexShrink: 0,
                          textTransform: 'none',
                          color: '#0B5A91',
                          borderColor: '#AFC2D0',
                        }}
                      >
                        Download
                      </Button>
                    </Box>

                    {resource.description && (
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#657887',
                          mt: 1,
                          lineHeight: 1.6,
                        }}
                      >
                        {resource.description}
                      </Typography>
                    )}
                  </Paper>
                ))}
              </Stack>
            )}
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, md: 3 },
              border: '1px solid #DCE6ED',
              borderRadius: 2,
            }}
          >
            <Stack
              direction="row"
              spacing={1.5}
              sx={{ alignItems: 'center', mb: 2.5 }}
            >
              <AssignmentOutlinedIcon sx={{ color: '#0B5A91' }} />
              <Typography
                variant="h6"
                sx={{ color: '#244A66', fontWeight: 700 }}
              >
                Assessments
              </Typography>
              <Chip
                label={assessments.length}
                size="small"
                sx={{ ml: 'auto', color: '#0B5A91', bgcolor: '#EEF6FC' }}
              />
            </Stack>

            {assessments.length === 0 ? (
              <Typography sx={{ color: '#80909D' }}>
                No assessments have been published for this course yet.
              </Typography>
            ) : (
              <Stack spacing={1.5}>
                {assessments.map((assessment) => (
                  <Paper
                    key={assessment.id}
                    elevation={0}
                    sx={{
                      p: 2,
                      border: '1px solid #E1E9EE',
                      borderRadius: 1.5,
                    }}
                  >
                    <Typography
                      sx={{ color: '#244A66', fontWeight: 700 }}
                    >
                      {assessment.title}
                    </Typography>

                    {assessment.description && (
                      <Typography
                        variant="body2"
                        sx={{ color: '#657887', mt: 0.6, lineHeight: 1.6 }}
                      >
                        {assessment.description}
                      </Typography>
                    )}

                    <Typography
                      variant="caption"
                      sx={{ display: 'block', color: '#80909D', mt: 1 }}
                    >
                      {assessment.timeLimitMinutes} min • Pass mark{' '}
                      {assessment.passingPercentage}%
                    </Typography>

                    <Button
                      fullWidth
                      variant="contained"
                      component={RouterLink}
                      to={`/trainee/assessments/${assessment.id}`}
                      startIcon={<PlayArrowOutlinedIcon />}
                      sx={{
                        mt: 1.5,
                        bgcolor: '#0B5A91',
                        textTransform: 'none',
                        fontWeight: 700,
                        '&:hover': { bgcolor: '#084873' },
                      }}
                    >
                      Start Assessment
                    </Button>
                  </Paper>
                ))}
              </Stack>
            )}
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default CourseWorkspace;
