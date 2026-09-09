import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import {
  getTrainerCourses,
  getTrainerAnalytics,
  getAssessmentsByCourse,
} from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';

type CourseAnalytics = {
  courseId: number;
  courseTitle: string;
  trainees: number;
  completion: number;
  averageScore: number;
};

type Analytics = {
  totalTrainees: number;
  overallPerformance: number;
  courses: CourseAnalytics[];
};

type Assessment = {
  id: number;
  title: string;
  courseId: number;
  createdAt: string;
  status?: string;
};

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();

  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [courses, setCourses] = useState<CourseAnalytics[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !user) return;

    const loadDashboard = async () => {
      try {
        const trainerId = user.id;

        const [analyticsData, courseData] = await Promise.all([
          getTrainerAnalytics(trainerId),
          getTrainerCourses(trainerId),
        ]);

        const analyticsCourses =
          analyticsData.courses ?? [];

        setAnalytics(analyticsData);
        setCourses(analyticsCourses);

        const assessmentResults = await Promise.all(
          courseData.map((course: { id: number }) =>
            getAssessmentsByCourse(course.id)
          )
        );

        setAssessments(
          assessmentResults.flat().slice(0, 5)
        );
      } catch (error) {
        console.error('Failed to load trainer dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [user, authLoading]);

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

  const stats = [
    {
      label: 'Active Trainees',
      value: analytics?.totalTrainees ?? 0,
      change: 'Current participation',
      icon: <PeopleOutlineOutlinedIcon />,
    },
    {
      label: 'Courses',
      value: courses.length,
      change: 'Assigned programmes',
      icon: <MenuBookOutlinedIcon />,
    },
    {
      label: 'Assessments',
      value: assessments.length,
      change: 'Available assessments',
      icon: <AssignmentOutlinedIcon />,
    },
    {
      label: 'Average Performance',
      value: `${analytics?.overallPerformance ?? 0}%`,
      change: 'Overall trainee performance',
      icon: <TrendingUpOutlinedIcon />,
    },
  ];

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
              Trainer Dashboard
            </Typography>

            <Typography sx={{ color: '#657887', mt: 1 }}>
              Manage your training programmes, assessments and trainee
              performance.
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddOutlinedIcon />}
            sx={{
              bgcolor: '#0B5A91',
              textTransform: 'none',
              fontWeight: 700,
              px: 2.5,
              py: 1.2,
              '&:hover': { bgcolor: '#084873' },
            }}
          >
            Create Assessment
          </Button>
        </Stack>

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
          {stats.map((stat) => (
            <Card
              key={stat.label}
              elevation={0}
              sx={{
                border: '1px solid #DCE8F0',
                borderRadius: 2,
                bgcolor: '#FFFFFF',
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Stack
                  direction="row"
                  sx={{
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                  }}
                >
                  <Box>
                    <Typography sx={{ color: '#657887', fontSize: '0.9rem' }}>
                      {stat.label}
                    </Typography>

                    <Typography
                      sx={{
                        color: '#173F60',
                        fontSize: '2rem',
                        fontWeight: 800,
                        mt: 0.5,
                      }}
                    >
                      {stat.value}
                    </Typography>

                    <Typography
                      sx={{
                        color: '#0B5A91',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        mt: 0.5,
                      }}
                    >
                      {stat.change}
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
                    {stat.icon}
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '1.45fr 1fr' },
            gap: 2.5,
          }}
        >
          <Card
            elevation={0}
            sx={{
              border: '1px solid #DCE8F0',
              borderRadius: 2,
              bgcolor: '#FFFFFF',
            }}
          >
            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
              <Stack
                direction="row"
                sx={{
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      color: '#173F60',
                      fontWeight: 700,
                      fontSize: '1.25rem',
                    }}
                  >
                    My Courses
                  </Typography>

                  <Typography sx={{ color: '#718594', mt: 0.5 }}>
                    Current trainee participation
                  </Typography>
                </Box>

                <Button
                  endIcon={<ArrowForwardOutlinedIcon />}
                  sx={{
                    color: '#0B5A91',
                    textTransform: 'none',
                    fontWeight: 700,
                  }}
                >
                  View all
                </Button>
              </Stack>

              {courses.length === 0 ? (
                <Typography sx={{ color: '#718594' }}>
                  No courses assigned.
                </Typography>
              ) : (
                courses.map((course, index) => (
                  <Box key={course.courseId}>
                    {index > 0 && <Divider sx={{ my: 2 }} />}

                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      sx={{
                        justifyContent: 'space-between',
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        gap: 2,
                      }}
                    >
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          sx={{
                            color: '#173F60',
                            fontWeight: 700,
                          }}
                        >
                          {course.courseTitle}
                        </Typography>

                        <Typography
                          sx={{
                            color: '#718594',
                            fontSize: '0.88rem',
                            mt: 0.5,
                          }}
                        >
                          {course.trainees} trainees enrolled
                        </Typography>

                        <Box
                          sx={{
                            height: 7,
                            bgcolor: '#E5EDF2',
                            borderRadius: 5,
                            mt: 1.5,
                            overflow: 'hidden',
                          }}
                        >
                          <Box
                            sx={{
                              width: `${course.completion}%`,
                              height: '100%',
                              bgcolor: '#0B5A91',
                              borderRadius: 5,
                            }}
                          />
                        </Box>
                      </Box>

                      <Chip
                        label={`${course.completion}%`}
                        size="small"
                        sx={{
                          bgcolor: '#EAF4FB',
                          color: '#0B5A91',
                          fontWeight: 700,
                        }}
                      />
                    </Stack>
                  </Box>
                ))
              )}
            </CardContent>
          </Card>

          <Card
            elevation={0}
            sx={{
              border: '1px solid #DCE8F0',
              borderRadius: 2,
              bgcolor: '#FFFFFF',
            }}
          >
            <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
              <Typography
                sx={{
                  color: '#173F60',
                  fontWeight: 700,
                  fontSize: '1.25rem',
                }}
              >
                Upcoming Assessments
              </Typography>

              <Typography sx={{ color: '#718594', mt: 0.5, mb: 2 }}>
                Available assessments
              </Typography>

              {assessments.length === 0 ? (
                <Typography sx={{ color: '#718594' }}>
                  No assessments available.
                </Typography>
              ) : (
                assessments.map((assessment, index) => (
                  <Box key={assessment.id}>
                    {index > 0 && <Divider sx={{ my: 2 }} />}

                    <Typography
                      sx={{
                        color: '#173F60',
                        fontWeight: 700,
                      }}
                    >
                      {assessment.title}
                    </Typography>

                    <Stack
                      direction="row"
                      sx={{
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mt: 1.5,
                      }}
                    >
                      <Typography
                        sx={{
                          color: '#718594',
                          fontSize: '0.82rem',
                        }}
                      >
                        {assessment.createdAt
                          ? new Date(
                              assessment.createdAt
                            ).toLocaleDateString('en-IN')
                          : 'Available'}
                      </Typography>

                      <Chip
                        label={assessment.status || 'Available'}
                        size="small"
                        sx={{
                          bgcolor: '#EAF4FB',
                          color: '#0B5A91',
                          fontWeight: 700,
                        }}
                      />
                    </Stack>
                  </Box>
                ))
              )}
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
};

export default Dashboard;
