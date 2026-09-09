import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Paper,
  Typography,
} from '@mui/material';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import { Link as RouterLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  getCourses,
  getEnrollments,
  getAttemptsByTrainee,
  getMyCertificates,
} from '../../../services/api';

interface Enrollment {
  id: number;
  courseId: number;
  progress?: number;
  status?: string;
}

interface Course {
  id: number;
  title: string;
  category?: string;
}

interface Attempt {
  id: number;
  assessmentId: number;
  result: string;
}

interface Certificate {
  id: number;
  status: string;
}

const Dashboard = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getEnrollments(),
      getCourses(),
      getAttemptsByTrainee(),
      getMyCertificates(),
    ])
      .then(([enrollmentData, courseData, attemptData, certificateData]) => {
        setEnrollments(enrollmentData);
        setCourses(courseData);
        setAttempts(attemptData);
        setCertificates(certificateData);
      })
      .catch((error) => {
        console.error('Failed to load trainee dashboard:', error);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '70vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const enrolledCourses = enrollments.map((enrollment) => {
    const course = courses.find(
      (item) => item.id === enrollment.courseId
    );

    return {
      ...enrollment,
      title: course?.title ?? `Course #${enrollment.courseId}`,
      category: course?.category ?? 'Learning',
      progress: enrollment.progress ?? 0,
    };
  });

  const totalProgress = enrolledCourses.length
    ? Math.round(
        enrolledCourses.reduce(
          (sum, course) => sum + course.progress,
          0
        ) / enrolledCourses.length
      )
    : 0;

  const upcomingAssessments = attempts.filter(
    (attempt) => attempt.result === 'PENDING'
  ).length;

  const issuedCertificates = certificates.filter(
    (certificate) => certificate.status === 'ISSUED'
  ).length;

  return (
    <Box sx={{ bgcolor: '#F4F8FB', minHeight: '100vh', py: { xs: 3, md: 5 } }}>
      <Container maxWidth="xl">
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              color: '#173F60',
              fontWeight: 700,
              fontSize: { xs: '1.8rem', md: '2.2rem' },
            }}
          >
            Welcome back
          </Typography>

          <Typography sx={{ mt: 0.7, color: '#657887' }}>
            Continue your learning and track your professional development.
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              lg: 'repeat(4, 1fr)',
            },
            gap: 2,
            mb: 4,
          }}
        >
          {[
            {
              icon: <SchoolOutlinedIcon />,
              value: enrolledCourses.length,
              label: 'Enrolled Courses',
            },
            {
              icon: <AccessTimeOutlinedIcon />,
              value: `${totalProgress}%`,
              label: 'Learning Progress',
            },
            {
              icon: <AssignmentOutlinedIcon />,
              value: upcomingAssessments,
              label: 'Pending Assessments',
            },
            {
              icon: <WorkspacePremiumOutlinedIcon />,
              value: issuedCertificates,
              label: 'Certificates',
            },
          ].map((item) => (
            <Paper
              key={item.label}
              elevation={0}
              sx={{
                p: 2.5,
                border: '1px solid #DCE6ED',
                borderRadius: 2,
                bgcolor: '#FFFFFF',
              }}
            >
              <Box sx={{ color: '#0B5A91', mb: 1 }}>
                {item.icon}
              </Box>

              <Typography
                sx={{
                  color: '#173F60',
                  fontSize: '1.7rem',
                  fontWeight: 700,
                }}
              >
                {item.value}
              </Typography>

              <Typography sx={{ color: '#657887', mt: 0.3 }}>
                {item.label}
              </Typography>
            </Paper>
          ))}
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
            gap: 3,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, md: 3 },
              border: '1px solid #DCE6ED',
              borderRadius: 2,
              bgcolor: '#FFFFFF',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 2,
                flexWrap: 'wrap',
                mb: 3,
              }}
            >
              <Box>
                <Typography
                  variant="h6"
                  sx={{ color: '#173F60', fontWeight: 700 }}
                >
                  My learning
                </Typography>

                <Typography sx={{ color: '#657887', mt: 0.5 }}>
                  Continue your enrolled programmes.
                </Typography>
              </Box>

              <Button
                component={RouterLink}
                to="/courses"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  color: '#0B5A91',
                  fontWeight: 700,
                  textTransform: 'none',
                }}
              >
                Browse courses
              </Button>
            </Box>

            {enrolledCourses.length === 0 ? (
              <Typography sx={{ color: '#657887' }}>
                You are not enrolled in any course yet.
              </Typography>
            ) : (
              enrolledCourses.map((course) => (
                <Box
                  key={course.id}
                  sx={{
                    py: 2.2,
                    borderTop: '1px solid #E5EDF2',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: 2,
                      flexWrap: 'wrap',
                    }}
                  >
                    <Box>
                      <Chip
                        label={course.category}
                        size="small"
                        sx={{
                          bgcolor: '#EEF6FC',
                          color: '#0B5A91',
                          fontWeight: 600,
                          mb: 1,
                        }}
                      />

                      <Typography
                        sx={{ color: '#244A66', fontWeight: 700 }}
                      >
                        {course.title}
                      </Typography>
                    </Box>

                    <Typography
                      sx={{
                        color: '#0B5A91',
                        fontWeight: 700,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {course.progress}%
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      height: 7,
                      bgcolor: '#E7EEF3',
                      borderRadius: 5,
                      mt: 1.5,
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      sx={{
                        width: `${course.progress}%`,
                        height: '100%',
                        bgcolor: '#0B5A91',
                        borderRadius: 5,
                      }}
                    />
                  </Box>
                </Box>
              ))
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
            <Typography
              variant="h6"
              sx={{ color: '#173F60', fontWeight: 700 }}
            >
              Assessment overview
            </Typography>

            <Typography sx={{ color: '#657887', mt: 1.5 }}>
              {upcomingAssessments > 0
                ? `You have ${upcomingAssessments} pending assessment${
                    upcomingAssessments > 1 ? 's' : ''
                  }.`
                : 'No pending assessments.'}
            </Typography>

            <Button
              component={RouterLink}
              to="/trainee/assessments"
              endIcon={<ArrowForwardIcon />}
              sx={{
                mt: 2.5,
                color: '#0B5A91',
                fontWeight: 700,
                textTransform: 'none',
              }}
            >
              View assessments
            </Button>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default Dashboard;
