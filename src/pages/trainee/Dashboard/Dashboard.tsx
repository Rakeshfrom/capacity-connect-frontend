import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  LinearProgress,
  Paper,
  Typography,
} from '@mui/material';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined';
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import PlayCircleOutlineOutlinedIcon from '@mui/icons-material/PlayCircleOutlineOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import RadioButtonUncheckedOutlinedIcon from '@mui/icons-material/RadioButtonUncheckedOutlined';
import { Link as RouterLink } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
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

const statCardSx = {
  p: 2.5,
  border: '1px solid #DCE6ED',
  borderRadius: 3,
  bgcolor: '#FFFFFF',
  transition: 'all .2s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 24px rgba(23,63,96,.08)',
  },
};

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

  const enrolledCourses = useMemo(
    () =>
      enrollments.map((enrollment) => {
        const course = courses.find(
          (item) => item.id === enrollment.courseId
        );

        return {
          ...enrollment,
          title: course?.title ?? `Course #${enrollment.courseId}`,
          category: course?.category ?? 'Learning',
          progress: Math.min(100, Math.max(0, enrollment.progress ?? 0)),
        };
      }),
    [enrollments, courses]
  );

  const totalProgress = enrolledCourses.length
    ? Math.round(
        enrolledCourses.reduce((sum, course) => sum + course.progress, 0) /
          enrolledCourses.length
      )
    : 0;

  const pendingAssessments = attempts.filter(
    (attempt) => attempt.result?.toUpperCase() === 'PENDING'
  ).length;

  const passedAssessments = attempts.filter((attempt) =>
    ['PASSED', 'PASS', 'COMPLETED'].includes(attempt.result?.toUpperCase())
  ).length;

  const issuedCertificates = certificates.filter(
    (certificate) => certificate.status?.toUpperCase() === 'ISSUED'
  ).length;

  const completedCourses = enrolledCourses.filter(
    (course) => course.progress >= 100
  ).length;

  const activeCourses = enrolledCourses.filter(
    (course) => course.progress > 0 && course.progress < 100
  );

  const nextCourse = [...enrolledCourses]
    .filter((course) => course.progress < 100)
    .sort((a, b) => b.progress - a.progress)[0];

  const progressLabel =
    totalProgress === 0
      ? 'Ready to start'
      : totalProgress < 40
        ? 'Getting started'
        : totalProgress < 75
          ? 'Good momentum'
          : totalProgress < 100
            ? 'Almost there'
            : 'All caught up';

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '75vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#F4F8FB',
        }}
      >
        <CircularProgress sx={{ color: '#0B5A91' }} />
      </Box>
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
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'center' },
            gap: 2,
            flexWrap: 'wrap',
            mb: 3,
          }}
        >
          <Box>
            <Typography
              sx={{
                color: '#173F60',
                fontWeight: 800,
                fontSize: { xs: '1.7rem', md: '2.15rem' },
                letterSpacing: '-.02em',
              }}
            >
              Welcome back 👋
            </Typography>

            <Typography
              sx={{
                mt: 0.7,
                color: '#657887',
                fontSize: { xs: '.92rem', md: '1rem' },
              }}
            >
              Continue your learning journey and build your professional
              capabilities.
            </Typography>
          </Box>

          <Button
            component={RouterLink}
            to="/ai-assistant"
            variant="contained"
            startIcon={<AutoAwesomeOutlinedIcon />}
            sx={{
              bgcolor: '#0B5A91',
              borderRadius: 2,
              px: 2.2,
              py: 1.1,
              textTransform: 'none',
              fontWeight: 700,
              boxShadow: 'none',
              '&:hover': {
                bgcolor: '#084873',
                boxShadow: 'none',
              },
            }}
          >
            Ask AI Assistant
          </Button>
        </Box>

        {/* Summary cards */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              lg: 'repeat(4, 1fr)',
            },
            gap: 2,
            mb: 3,
          }}
        >
          <Paper elevation={0} sx={statCardSx}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar
                sx={{
                  bgcolor: '#E8F3FA',
                  color: '#0B5A91',
                  width: 46,
                  height: 46,
                }}
              >
                <SchoolOutlinedIcon />
              </Avatar>
              <Box>
                <Typography
                  sx={{ color: '#173F60', fontSize: '1.65rem', fontWeight: 800 }}
                >
                  {enrolledCourses.length}
                </Typography>
                <Typography sx={{ color: '#657887', fontSize: '.88rem' }}>
                  Enrolled courses
                </Typography>
              </Box>
            </Box>
          </Paper>

          <Paper elevation={0} sx={statCardSx}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar
                sx={{
                  bgcolor: '#EAF6F0',
                  color: '#2E7D57',
                  width: 46,
                  height: 46,
                }}
              >
                <TrendingUpOutlinedIcon />
              </Avatar>
              <Box>
                <Typography
                  sx={{ color: '#173F60', fontSize: '1.65rem', fontWeight: 800 }}
                >
                  {totalProgress}%
                </Typography>
                <Typography sx={{ color: '#657887', fontSize: '.88rem' }}>
                  Overall progress
                </Typography>
              </Box>
            </Box>
          </Paper>

          <Paper elevation={0} sx={statCardSx}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar
                sx={{
                  bgcolor: '#FFF4E5',
                  color: '#B56A00',
                  width: 46,
                  height: 46,
                }}
              >
                <AssignmentOutlinedIcon />
              </Avatar>
              <Box>
                <Typography
                  sx={{ color: '#173F60', fontSize: '1.65rem', fontWeight: 800 }}
                >
                  {pendingAssessments}
                </Typography>
                <Typography sx={{ color: '#657887', fontSize: '.88rem' }}>
                  Pending assessments
                </Typography>
              </Box>
            </Box>
          </Paper>

          <Paper elevation={0} sx={statCardSx}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar
                sx={{
                  bgcolor: '#F2ECFA',
                  color: '#7050A5',
                  width: 46,
                  height: 46,
                }}
              >
                <WorkspacePremiumOutlinedIcon />
              </Avatar>
              <Box>
                <Typography
                  sx={{ color: '#173F60', fontSize: '1.65rem', fontWeight: 800 }}
                >
                  {issuedCertificates}
                </Typography>
                <Typography sx={{ color: '#657887', fontSize: '.88rem' }}>
                  Certificates earned
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* Main overview */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '1.7fr 1fr' },
            gap: 3,
            mb: 3,
          }}
        >
          {/* Continue learning */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, md: 3 },
              border: '1px solid #DCE6ED',
              borderRadius: 3,
              bgcolor: '#FFFFFF',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 2,
                mb: 2.5,
              }}
            >
              <Box>
                <Typography
                  sx={{ color: '#173F60', fontWeight: 800, fontSize: '1.15rem' }}
                >
                  Continue learning
                </Typography>
                <Typography sx={{ color: '#657887', mt: .4, fontSize: '.88rem' }}>
                  Pick up where you left off.
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
                  whiteSpace: 'nowrap',
                }}
              >
                My courses
              </Button>
            </Box>

            {nextCourse ? (
              <Box
                sx={{
                  p: 2.2,
                  borderRadius: 2.5,
                  bgcolor: '#F5F9FC',
                  border: '1px solid #E0EAF0',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 2,
                    justifyContent: 'space-between',
                    alignItems: { xs: 'stretch', sm: 'center' },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Avatar
                      variant="rounded"
                      sx={{
                        bgcolor: '#DCEEF8',
                        color: '#0B5A91',
                        width: 50,
                        height: 50,
                      }}
                    >
                      <MenuBookOutlinedIcon />
                    </Avatar>

                    <Box>
                      <Typography
                        sx={{
                          color: '#173F60',
                          fontWeight: 750,
                          lineHeight: 1.3,
                        }}
                      >
                        {nextCourse.title}
                      </Typography>
                      <Typography
                        sx={{ color: '#718392', fontSize: '.82rem', mt: .3 }}
                      >
                        {nextCourse.category}
                      </Typography>
                    </Box>
                  </Box>

                  <Chip
                    label={`${nextCourse.progress}% complete`}
                    sx={{
                      alignSelf: { xs: 'flex-start', sm: 'center' },
                      bgcolor: '#E8F3FA',
                      color: '#0B5A91',
                      fontWeight: 700,
                    }}
                  />
                </Box>

                <Box sx={{ mt: 2 }}>
                  <LinearProgress
                    variant="determinate"
                    value={nextCourse.progress}
                    sx={{
                      height: 8,
                      borderRadius: 10,
                      bgcolor: '#DCE7EE',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 10,
                        bgcolor: '#0B5A91',
                      },
                    }}
                  />
                </Box>

                <Button
                  component={RouterLink}
                  to={`/courses/${nextCourse.courseId}`}
                  variant="contained"
                  startIcon={<PlayCircleOutlineOutlinedIcon />}
                  sx={{
                    mt: 2,
                    bgcolor: '#0B5A91',
                    textTransform: 'none',
                    fontWeight: 700,
                    boxShadow: 'none',
                    '&:hover': {
                      bgcolor: '#084873',
                      boxShadow: 'none',
                    },
                  }}
                >
                  Continue course
                </Button>
              </Box>
            ) : (
              <Box
                sx={{
                  py: 5,
                  textAlign: 'center',
                  border: '1px dashed #C9D8E2',
                  borderRadius: 2.5,
                  bgcolor: '#FAFCFD',
                }}
              >
                <MenuBookOutlinedIcon
                  sx={{ fontSize: 42, color: '#9BB0BE', mb: 1 }}
                />
                <Typography sx={{ color: '#173F60', fontWeight: 700 }}>
                  Start your learning journey
                </Typography>
                <Typography
                  sx={{ color: '#718392', fontSize: '.88rem', mt: .5 }}
                >
                  Explore available courses and enroll in a programme.
                </Typography>
                <Button
                  component={RouterLink}
                  to="/courses"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    mt: 1.5,
                    color: '#0B5A91',
                    fontWeight: 700,
                    textTransform: 'none',
                  }}
                >
                  Browse courses
                </Button>
              </Box>
            )}
          </Paper>

          {/* Progress ring */}
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, md: 3 },
              border: '1px solid #DCE6ED',
              borderRadius: 3,
              bgcolor: '#FFFFFF',
            }}
          >
            <Typography
              sx={{ color: '#173F60', fontWeight: 800, fontSize: '1.15rem' }}
            >
              Learning overview
            </Typography>
            <Typography sx={{ color: '#657887', mt: .4, fontSize: '.88rem' }}>
              Your current training progress.
            </Typography>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                py: 2.5,
                position: 'relative',
              }}
            >
              <Box
                sx={{
                  width: 154,
                  height: 154,
                  borderRadius: '50%',
                  background: `conic-gradient(#0B5A91 ${totalProgress * 3.6}deg, #E4EDF2 0deg)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Box
                  sx={{
                    width: 124,
                    height: 124,
                    borderRadius: '50%',
                    bgcolor: '#FFFFFF',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '2rem',
                      fontWeight: 800,
                      color: '#173F60',
                      lineHeight: 1,
                    }}
                  >
                    {totalProgress}%
                  </Typography>
                  <Typography sx={{ color: '#718392', fontSize: '.75rem', mt: .5 }}>
                    overall
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Typography
              sx={{
                textAlign: 'center',
                color: '#0B5A91',
                fontWeight: 700,
                mb: 2,
              }}
            >
              {progressLabel}
            </Typography>

            <Divider sx={{ mb: 2 }} />

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography sx={{ color: '#657887', fontSize: '.86rem' }}>
                  Active courses
                </Typography>
                <Typography sx={{ color: '#173F60', fontWeight: 700 }}>
                  {activeCourses.length}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography sx={{ color: '#657887', fontSize: '.86rem' }}>
                  Completed courses
                </Typography>
                <Typography sx={{ color: '#173F60', fontWeight: 700 }}>
                  {completedCourses}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography sx={{ color: '#657887', fontSize: '.86rem' }}>
                  Passed assessments
                </Typography>
                <Typography sx={{ color: '#173F60', fontWeight: 700 }}>
                  {passedAssessments}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* Course progress + quick links */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '1.7fr 1fr' },
            gap: 3,
            mb: 3,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, md: 3 },
              border: '1px solid #DCE6ED',
              borderRadius: 3,
              bgcolor: '#FFFFFF',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2.5,
              }}
            >
              <Box>
                <Typography
                  sx={{ color: '#173F60', fontWeight: 800, fontSize: '1.15rem' }}
                >
                  Course progress
                </Typography>
                <Typography sx={{ color: '#657887', mt: .4, fontSize: '.88rem' }}>
                  Track progress across your enrolled courses.
                </Typography>
              </Box>
            </Box>

            {enrolledCourses.length ? (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.2 }}>
                {enrolledCourses.slice(0, 5).map((course) => (
                  <Box key={course.id}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 2,
                        mb: .7,
                      }}
                    >
                      <Typography
                        sx={{
                          color: '#294C65',
                          fontWeight: 650,
                          fontSize: '.9rem',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {course.title}
                      </Typography>

                      <Typography
                        sx={{
                          color: '#0B5A91',
                          fontWeight: 750,
                          fontSize: '.82rem',
                          flexShrink: 0,
                        }}
                      >
                        {course.progress}%
                      </Typography>
                    </Box>

                    <LinearProgress
                      variant="determinate"
                      value={course.progress}
                      sx={{
                        height: 7,
                        borderRadius: 10,
                        bgcolor: '#E5EDF2',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 10,
                          bgcolor:
                            course.progress >= 100 ? '#3A8F62' : '#0B5A91',
                        },
                      }}
                    />
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography sx={{ color: '#718392', py: 3 }}>
                Your course progress will appear here after you enroll in a
                course.
              </Typography>
            )}

            {enrolledCourses.length > 5 && (
              <Button
                component={RouterLink}
                to="/courses"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  mt: 2.5,
                  color: '#0B5A91',
                  fontWeight: 700,
                  textTransform: 'none',
                }}
              >
                View all courses
              </Button>
            )}
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, md: 3 },
              border: '1px solid #DCE6ED',
              borderRadius: 3,
              bgcolor: '#FFFFFF',
            }}
          >
            <Typography
              sx={{ color: '#173F60', fontWeight: 800, fontSize: '1.15rem' }}
            >
              Quick access
            </Typography>
            <Typography sx={{ color: '#657887', mt: .4, fontSize: '.88rem' }}>
              Jump directly to your learning tools.
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.1, mt: 2.2 }}>
              {[
                {
                  label: 'My Courses',
                  description: 'Continue enrolled courses',
                  icon: <MenuBookOutlinedIcon />,
                  to: '/courses',
                },
                {
                  label: 'Assessments',
                  description: 'View tests and results',
                  icon: <QuizOutlinedIcon />,
                  to: '/assessments',
                },
                {
                  label: 'Resources',
                  description: 'Study material and references',
                  icon: <LibraryBooksOutlinedIcon />,
                  to: '/resources',
                },
                {
                  label: 'Certificates',
                  description: 'View earned certificates',
                  icon: <WorkspacePremiumOutlinedIcon />,
                  to: '/certificates',
                },
                {
                  label: 'AI Assistant',
                  description: 'Ask questions and get guidance',
                  icon: <AutoAwesomeOutlinedIcon />,
                  to: '/ai-assistant',
                },
              ].map((item) => (
                <Button
                  key={item.label}
                  component={RouterLink}
                  to={item.to}
                  sx={{
                    justifyContent: 'flex-start',
                    textAlign: 'left',
                    textTransform: 'none',
                    p: 1.25,
                    borderRadius: 2,
                    color: '#173F60',
                    '&:hover': {
                      bgcolor: '#F2F7FA',
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      mr: 1.4,
                      bgcolor: '#EAF3F8',
                      color: '#0B5A91',
                    }}
                  >
                    {item.icon}
                  </Avatar>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: '.86rem' }}>
                      {item.label}
                    </Typography>
                    <Typography
                      sx={{
                        color: '#7A8B98',
                        fontSize: '.74rem',
                        mt: .15,
                      }}
                    >
                      {item.description}
                    </Typography>
                  </Box>
                  <ArrowForwardIcon
                    sx={{ ml: 'auto', fontSize: 18, color: '#9AAAB5' }}
                  />
                </Button>
              ))}
            </Box>
          </Paper>
        </Box>

        {/* Bottom insights */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: 3,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              border: '1px solid #DCE6ED',
              borderRadius: 3,
              bgcolor: '#FFFFFF',
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Avatar
                sx={{
                  bgcolor: '#E8F3FA',
                  color: '#0B5A91',
                  width: 42,
                  height: 42,
                }}
              >
                <AccessTimeOutlinedIcon />
              </Avatar>
              <Box>
                <Typography sx={{ color: '#173F60', fontWeight: 750 }}>
                  Keep your momentum
                </Typography>
                <Typography sx={{ color: '#718392', fontSize: '.8rem', mt: .25 }}>
                  {totalProgress > 0
                    ? `You are ${totalProgress}% through your current learning journey.`
                    : 'Enroll in a course to start tracking your progress.'}
                </Typography>
              </Box>
            </Box>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              border: '1px solid #DCE6ED',
              borderRadius: 3,
              bgcolor: '#FFFFFF',
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Avatar
                sx={{
                  bgcolor: '#EAF6F0',
                  color: '#2E7D57',
                  width: 42,
                  height: 42,
                }}
              >
                <CheckCircleOutlineOutlinedIcon />
              </Avatar>
              <Box>
                <Typography sx={{ color: '#173F60', fontWeight: 750 }}>
                  Assessment performance
                </Typography>
                <Typography sx={{ color: '#718392', fontSize: '.8rem', mt: .25 }}>
                  {attempts.length
                    ? `${passedAssessments} successful assessment${passedAssessments === 1 ? '' : 's'} recorded.`
                    : 'Your assessment activity will appear here.'}
                </Typography>
              </Box>
            </Box>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              border: '1px solid #DCE6ED',
              borderRadius: 3,
              bgcolor: '#FFFFFF',
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Avatar
                sx={{
                  bgcolor: '#F2ECFA',
                  color: '#7050A5',
                  width: 42,
                  height: 42,
                }}
              >
                {issuedCertificates > 0 ? (
                  <WorkspacePremiumOutlinedIcon />
                ) : (
                  <RadioButtonUncheckedOutlinedIcon />
                )}
              </Avatar>
              <Box>
                <Typography sx={{ color: '#173F60', fontWeight: 750 }}>
                  Certification
                </Typography>
                <Typography sx={{ color: '#718392', fontSize: '.8rem', mt: .25 }}>
                  {issuedCertificates
                    ? `${issuedCertificates} certificate${issuedCertificates === 1 ? '' : 's'} available.`
                    : 'Complete eligible learning programmes to earn certificates.'}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default Dashboard;
