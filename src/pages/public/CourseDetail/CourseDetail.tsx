import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import keycloak from '../../../services/keycloak';
import {
  enrollInCourse,
  getCourseById,
  getEnrollments,
} from '../../../services/api';
import CourseOverview from './components/CourseOverview';

type Course = {
  id: number;
  category?: string;
  title?: string;
  description?: string;
  durationHours?: number;
  duration?: string;
  level?: string;
};

const CourseDetail = () => {
  const { courseId } = useParams();

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const id = Number(courseId);

    if (!Number.isFinite(id)) {
      setLoading(false);
      return;
    }

    getCourseById(id)
      .then((data) => setCourse(data))
      .catch(() => setCourse(null))
      .finally(() => setLoading(false));

    if (keycloak.authenticated) {
      getEnrollments()
        .then((data) => {
          const exists = Array.isArray(data)
            && data.some(
              (enrollment: { courseId?: number }) =>
                Number(enrollment.courseId) === id
            );

          setEnrolled(exists);
        })
        .catch(() => setEnrolled(false));
    }
  }, [courseId]);

  const handleEnrollment = async () => {
    if (!course) return;

    if (!keycloak.authenticated) {
      await keycloak.login({
        redirectUri: window.location.href,
      });
      return;
    }

    setEnrolling(true);
    setError('');

    try {
      await enrollInCourse(course.id);
      setEnrolled(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : '';

      if (message.includes('409')) {
        setEnrolled(true);
      } else {
        setError('Unable to enrol in this course. Please try again.');
      }
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 10, textAlign: 'center' }}>
        <CircularProgress sx={{ color: '#0B5A91' }} />
        <Typography sx={{ color: '#657887', mt: 2 }}>
          Loading course details...
        </Typography>
      </Container>
    );
  }

  if (!course) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" sx={{ color: '#173F60', fontWeight: 700 }}>
          Course not found
        </Typography>

        <Button
          component={RouterLink}
          to="/courses"
          startIcon={<ArrowBackIcon />}
          sx={{ mt: 3, textTransform: 'none' }}
        >
          Back to courses
        </Button>
      </Container>
    );
  }

  const duration =
    course.duration ??
    (course.durationHours ? `${course.durationHours} Hours` : 'Self-paced');

  return (
    <Box sx={{ bgcolor: '#F5F8FA', minHeight: '100%' }}>
      <Box
        sx={{
          bgcolor: '#EAF4FB',
          borderBottom: '1px solid #DCE8F0',
          py: { xs: 5, md: 6 },
        }}
      >
        <Container maxWidth="xl">
          <Button
            component={RouterLink}
            to="/courses"
            startIcon={<ArrowBackIcon />}
            sx={{
              color: '#0B5A91',
              textTransform: 'none',
              fontWeight: 600,
              mb: 2,
            }}
          >
            Back to courses
          </Button>

          <Typography
            sx={{
              color: '#0B5A91',
              fontWeight: 700,
              fontSize: '0.82rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            {course.category ?? 'Learning Programme'}
          </Typography>

          <Typography
            variant="h1"
            sx={{
              color: '#173F60',
              fontWeight: 800,
              fontSize: { xs: '2rem', sm: '2.6rem', md: '3.3rem' },
              lineHeight: 1.15,
              maxWidth: 900,
              mt: 1,
            }}
          >
            {course.title ?? 'Untitled Course'}
          </Typography>

          <Typography
            sx={{
              color: '#657887',
              maxWidth: 800,
              mt: 2,
              lineHeight: 1.8,
              fontSize: { xs: '0.95rem', md: '1.05rem' },
            }}
          >
            {course.description ??
              'Structured learning programme available through Capacity Connect.'}
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
        <CourseOverview duration={duration} level={course.level ?? 'General'} />

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '1.5fr 0.7fr' },
            gap: { xs: 4, lg: 6 },
            mt: 5,
          }}
        >
          <Box>
            <Typography
              variant="h5"
              sx={{ color: '#173F60', fontWeight: 700, mb: 2 }}
            >
              About this course
            </Typography>

            <Typography sx={{ color: '#657887', lineHeight: 1.8 }}>
              {course.description ??
                'This programme provides a structured learning pathway through the Capacity Connect learning platform.'}
            </Typography>

            <Paper
              elevation={0}
              sx={{
                mt: 4,
                p: 3,
                border: '1px solid #DCE6ED',
                borderRadius: 2,
                bgcolor: '#fff',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  alignItems: 'flex-start',
                }}
              >
                <SchoolOutlinedIcon sx={{ color: '#0B5A91', mt: 0.3 }} />
                <Box>
                  <Typography
                    sx={{ color: '#244A66', fontWeight: 700 }}
                  >
                    Full learning content
                  </Typography>
                  <Typography
                    sx={{ color: '#657887', lineHeight: 1.7, mt: 0.5 }}
                  >
                    Course resources, assessments, progress tracking and
                    certification are available to authenticated enrolled
                    trainees.
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Box>

          <Box>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.5, sm: 3 },
                border: '1px solid #DCE6ED',
                borderRadius: 2,
                position: { lg: 'sticky' },
                top: { lg: 100 },
              }}
            >
              <Typography
                variant="h6"
                sx={{ color: '#244A66', fontWeight: 700 }}
              >
                {enrolled ? 'You are enrolled' : 'Ready to start learning?'}
              </Typography>

              <Typography
                variant="body2"
                sx={{ color: '#657887', lineHeight: 1.7, mt: 1 }}
              >
                {enrolled
                  ? 'Your course access is ready. Continue learning from your trainee dashboard.'
                  : 'View the course publicly and enrol securely when you are ready to begin.'}
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}

              {enrolled ? (
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  component={RouterLink}
                  to="/trainee/courses"
                  sx={{
                    mt: 3,
                    bgcolor: '#0B5A91',
                    py: 1.3,
                    textTransform: 'none',
                    fontWeight: 700,
                    '&:hover': { bgcolor: '#084873' },
                  }}
                >
                  Continue Learning
                </Button>
              ) : (
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleEnrollment}
                  disabled={enrolling}
                  startIcon={
                    keycloak.authenticated ? (
                      <SchoolOutlinedIcon />
                    ) : (
                      <LoginOutlinedIcon />
                    )
                  }
                  sx={{
                    mt: 3,
                    bgcolor: '#0B5A91',
                    py: 1.3,
                    textTransform: 'none',
                    fontWeight: 700,
                    '&:hover': { bgcolor: '#084873' },
                  }}
                >
                  {enrolling
                    ? 'Enrolling...'
                    : keycloak.authenticated
                      ? 'Enrol in course'
                      : 'Login to enrol'}
                </Button>
              )}

              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  textAlign: 'center',
                  color: '#80909D',
                  mt: 1.5,
                }}
              >
                Secure authentication required for enrolment
              </Typography>
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default CourseDetail;
