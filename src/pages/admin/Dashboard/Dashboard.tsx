import { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import PendingActionsOutlinedIcon from '@mui/icons-material/PendingActionsOutlined';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import { getAdminDashboard } from '../../../services/api';

interface DashboardData {
  totalUsers: number;
  trainees: number;
  trainers: number;
  admins: number;
  totalCourses: number;
  publishedCourses: number;
  totalEnrollments: number;
  totalAssessments: number;
  courses: {
    courseId: number;
    courseTitle: string;
    enrollments: number;
    completion: number;
  }[];
}

const activities = [
  {
    title: 'Dashboard data synchronized',
    detail: 'Live platform statistics loaded from the backend',
    status: 'Completed',
  },
  {
    title: 'Course performance updated',
    detail: 'Enrollment and completion metrics are now live',
    status: 'Updated',
  },
  {
    title: 'Assessment statistics available',
    detail: 'Current assessment count is shown from the platform',
    status: 'Updated',
  },
];

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getAdminDashboard()
      .then((data: DashboardData) => {
        setDashboard(data);
        setError('');
      })
      .catch(() => {
        setError('Unable to load dashboard data.');
      });
  }, []);

  const stats = dashboard
    ? [
        {
          label: 'Total Users',
          value: String(dashboard.totalUsers),
          change: `${dashboard.trainees} trainees`,
          icon: <PeopleOutlineOutlinedIcon />,
        },
        {
          label: 'Active Courses',
          value: String(dashboard.totalCourses),
          change: `${dashboard.publishedCourses} published`,
          icon: <MenuBookOutlinedIcon />,
        },
        {
          label: 'Enrollments',
          value: String(dashboard.totalEnrollments),
          change: 'Total enrollments',
          icon: <PendingActionsOutlinedIcon />,
        },
        {
          label: 'Assessments',
          value: String(dashboard.totalAssessments),
          change: 'Total assessments',
          icon: <WorkspacePremiumOutlinedIcon />,
        },
      ]
    : [];

  const courses = dashboard?.courses ?? [];

  const averageCompletion =
    courses.length > 0
      ? Math.round(
          courses.reduce((sum, course) => sum + course.completion, 0) /
            courses.length,
        )
      : 0;

  const participation =
    dashboard && dashboard.totalUsers > 0
      ? Math.round(
          (dashboard.totalEnrollments / dashboard.totalUsers) * 100,
        )
      : 0;

  return (
    <Box sx={{ bgcolor: '#F5F8FA', minHeight: '100vh' }}>
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
        <Box sx={{ mb: 4 }}>
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
            Dashboard
          </Typography>

          <Typography sx={{ color: '#657887', mt: 1 }}>
            Monitor users, courses, assessments and platform activity.
          </Typography>
        </Box>

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
              sm: 'repeat(2, 1fr)',
              lg: 'repeat(4, 1fr)',
            },
            gap: 2.5,
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
              }}
            >
              <CardContent sx={{ p: 2.8 }}>
                <Stack
                  direction="row"
                  sx={{
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                  }}
                >
                  <Box>
                    <Typography sx={{ color: '#657887' }}>
                      {stat.label}
                    </Typography>

                    <Typography
                      sx={{
                        color: '#173F60',
                        fontWeight: 800,
                        fontSize: '2rem',
                        mt: 0.5,
                      }}
                    >
                      {stat.value}
                    </Typography>

                    <Typography
                      sx={{
                        color: '#0B5A91',
                        fontWeight: 700,
                        fontSize: '0.84rem',
                        mt: 0.8,
                      }}
                    >
                      {stat.change}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 1.5,
                      bgcolor: '#EAF4FB',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#0B5A91',
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
            gridTemplateColumns: { xs: '1fr', lg: '1.4fr 1fr' },
            gap: 2.5,
          }}
        >
          <Card
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
                  alignItems: 'center',
                  mb: 3,
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      color: '#173F60',
                      fontWeight: 800,
                      fontSize: '1.2rem',
                    }}
                  >
                    Course & Enrollment Overview
                  </Typography>

                  <Typography sx={{ color: '#657887', mt: 0.5 }}>
                    Current platform course performance.
                  </Typography>
                </Box>

                <MenuBookOutlinedIcon sx={{ color: '#0B5A91' }} />
              </Stack>

              {courses.length === 0 ? (
                <Typography sx={{ color: '#657887' }}>
                  No course data available.
                </Typography>
              ) : (
                <Stack spacing={2.8}>
                  {courses.map((course) => (
                    <Box key={course.courseId}>
                      <Stack
                        direction="row"
                        sx={{
                          justifyContent: 'space-between',
                          gap: 2,
                          mb: 0.8,
                        }}
                      >
                        <Typography
                          sx={{
                            color: '#173F60',
                            fontWeight: 700,
                            fontSize: '0.95rem',
                          }}
                        >
                          {course.courseTitle}
                        </Typography>

                        <Typography
                          sx={{
                            color: '#0B5A91',
                            fontWeight: 700,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {course.completion}%
                        </Typography>
                      </Stack>

                      <Typography
                        sx={{
                          color: '#657887',
                          fontSize: '0.84rem',
                          mb: 0.8,
                        }}
                      >
                        {course.enrollments} enrolled
                      </Typography>

                      <LinearProgress
                        variant="determinate"
                        value={course.completion}
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
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>

          <Card
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
                  alignItems: 'center',
                  mb: 3,
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      color: '#173F60',
                      fontWeight: 800,
                      fontSize: '1.2rem',
                    }}
                  >
                    Recent Activity
                  </Typography>

                  <Typography sx={{ color: '#657887', mt: 0.5 }}>
                    Latest administrative actions.
                  </Typography>
                </Box>

                <TrendingUpOutlinedIcon sx={{ color: '#0B5A91' }} />
              </Stack>

              <Stack spacing={2.2}>
                {activities.map((activity) => (
                  <Box
                    key={activity.title}
                    sx={{
                      pb: 2,
                      borderBottom: '1px solid #E4ECF1',
                      '&:last-child': {
                        pb: 0,
                        borderBottom: 'none',
                      },
                    }}
                  >
                    <Stack
                      direction="row"
                      sx={{
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: 1,
                      }}
                    >
                      <Box>
                        <Typography
                          sx={{
                            color: '#173F60',
                            fontWeight: 700,
                          }}
                        >
                          {activity.title}
                        </Typography>

                        <Typography
                          sx={{
                            color: '#657887',
                            fontSize: '0.86rem',
                            mt: 0.5,
                          }}
                        >
                          {activity.detail}
                        </Typography>
                      </Box>

                      <Chip
                        label={activity.status}
                        size="small"
                        sx={{
                          bgcolor:
                            activity.status === 'Completed'
                              ? '#EAF6EF'
                              : '#EAF4FB',
                          color:
                            activity.status === 'Completed'
                              ? '#147A45'
                              : '#0B5A91',
                          fontWeight: 700,
                        }}
                      />
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Box>

        <Box
          sx={{
            mt: 2.5,
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            gap: 2.5,
          }}
        >
          <Card
            elevation={0}
            sx={{
              border: '1px solid #DCE8F0',
              borderRadius: 2,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack
                direction="row"
                spacing={2}
                sx={{ alignItems: 'center' }}
              >
                <AssessmentOutlinedIcon sx={{ color: '#0B5A91' }} />

                <Box>
                  <Typography sx={{ color: '#173F60', fontWeight: 800 }}>
                    Course Completion
                  </Typography>

                  <Typography sx={{ color: '#657887', mt: 0.5 }}>
                    Average completion across courses
                  </Typography>
                </Box>

                <Typography
                  sx={{
                    marginLeft: 'auto',
                    color: '#0B5A91',
                    fontWeight: 800,
                    fontSize: '1.5rem',
                  }}
                >
                  {dashboard ? `${averageCompletion}%` : '--'}
                </Typography>
              </Stack>
            </CardContent>
          </Card>

          <Card
            elevation={0}
            sx={{
              border: '1px solid #DCE8F0',
              borderRadius: 2,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack
                direction="row"
                spacing={2}
                sx={{ alignItems: 'center' }}
              >
                <PeopleOutlineOutlinedIcon sx={{ color: '#0B5A91' }} />

                <Box>
                  <Typography sx={{ color: '#173F60', fontWeight: 800 }}>
                    Enrollment Participation
                  </Typography>

                  <Typography sx={{ color: '#657887', mt: 0.5 }}>
                    Enrollment-to-user participation ratio
                  </Typography>
                </Box>

                <Typography
                  sx={{
                    marginLeft: 'auto',
                    color: '#0B5A91',
                    fontWeight: 800,
                    fontSize: '1.5rem',
                  }}
                >
                  {dashboard ? `${participation}%` : '--'}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
};

export default AdminDashboard;
