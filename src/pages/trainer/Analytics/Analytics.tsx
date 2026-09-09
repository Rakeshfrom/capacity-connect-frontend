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
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import { useAuth } from '../../../context/AuthContext';
import { getTrainerAnalytics } from '../../../services/api';

interface CourseAnalytics {
  courseId: number;
  courseTitle: string;
  trainees: number;
  completion: number;
  averageScore: number;
}

interface TrainerAnalyticsData {
  trainerId: number;
  totalTrainees: number;
  averageCompletion: number;
  averageAssessmentScore: number;
  overallPerformance: number;
  courses: CourseAnalytics[];
}

const TrainerAnalytics = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<TrainerAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user?.id) return;

    getTrainerAnalytics(user.id)
      .then((data: TrainerAnalyticsData) => {
        setAnalytics(data);
        setError('');
      })
      .catch(() => setError('Unable to load analytics data.'))
      .finally(() => setLoading(false));
  }, [user?.id]);

  const stats = analytics
    ? [
        {
          label: 'Active Trainees',
          value: String(analytics.totalTrainees),
          change: 'Current total',
          icon: <PeopleOutlineOutlinedIcon />,
        },
        {
          label: 'Average Completion',
          value: `${analytics.averageCompletion}%`,
          change: 'Current average',
          icon: <SchoolOutlinedIcon />,
        },
        {
          label: 'Average Assessment Score',
          value: `${analytics.averageAssessmentScore}%`,
          change: 'Latest completed attempts',
          icon: <AssessmentOutlinedIcon />,
        },
        {
          label: 'Overall Performance',
          value: `${analytics.overallPerformance}%`,
          change: 'Completion + assessment',
          icon: <TrendingUpOutlinedIcon />,
        },
      ]
    : [];

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
            Analytics
          </Typography>

          <Typography sx={{ color: '#657887', mt: 1 }}>
            Monitor trainee participation, course progress and assessment performance.
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
                        fontSize: '0.82rem',
                        mt: 0.5,
                      }}
                    >
                      {stat.change}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      width: 46,
                      height: 46,
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

        {loading && (
          <Typography sx={{ color: '#657887', mb: 3 }}>
            Loading analytics...
          </Typography>
        )}

        {error && (
          <Typography sx={{ color: '#B42318', mb: 3 }}>
            {error}
          </Typography>
        )}

        {!loading && !error && analytics && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '1.5fr 1fr' },
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
              <Typography
                sx={{
                  color: '#173F60',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                }}
              >
                Course Performance
              </Typography>

              <Typography sx={{ color: '#657887', mt: 0.5, mb: 3 }}>
                Progress and assessment performance across your courses.
              </Typography>

              <Stack spacing={3}>
                {(analytics?.courses ?? []).map((course) => (
                  <Box key={course.courseId}>
                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      sx={{
                        justifyContent: 'space-between',
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      <Box>
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
                            fontSize: '0.85rem',
                            mt: 0.3,
                          }}
                        >
                          {course.trainees} trainees enrolled
                        </Typography>
                      </Box>

                      <Chip
                        label={`${course.averageScore}% avg. score`}
                        size="small"
                        sx={{
                          bgcolor: '#EAF4FB',
                          color: '#0B5A91',
                          fontWeight: 700,
                        }}
                      />
                    </Stack>

                    <Stack
                      direction="row"
                      sx={{
                        justifyContent: 'space-between',
                        mb: 0.6,
                      }}
                    >
                      <Typography
                        sx={{ color: '#657887', fontSize: '0.82rem' }}
                      >
                        Completion
                      </Typography>

                      <Typography
                        sx={{
                          color: '#0B5A91',
                          fontWeight: 700,
                          fontSize: '0.82rem',
                        }}
                      >
                        {course.completion}%
                      </Typography>
                    </Stack>

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
              <Typography
                sx={{
                  color: '#173F60',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                }}
              >
                Participation Overview
              </Typography>

              <Typography sx={{ color: '#657887', mt: 0.5 }}>
                Current trainee engagement indicators.
              </Typography>

              <Stack spacing={2.5} sx={{ mt: 3 }}>
                {(analytics
                  ? [
                      ['Course Participation', analytics.averageCompletion],
                      ['Assessment Participation', analytics.averageAssessmentScore],
                    ]
                  : []
                ).map(([label, value]) => (
                  <Box key={label}>
                    <Stack
                      direction="row"
                      sx={{
                        justifyContent: 'space-between',
                        mb: 0.7,
                      }}
                    >
                      <Typography
                        sx={{ color: '#657887', fontSize: '0.88rem' }}
                      >
                        {label}
                      </Typography>

                      <Typography
                        sx={{
                          color: '#173F60',
                          fontWeight: 700,
                          fontSize: '0.88rem',
                        }}
                      >
                        {value}%
                      </Typography>
                    </Stack>

                    <LinearProgress
                      variant="determinate"
                      value={Number(value)}
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
            </CardContent>
          </Card>
        </Box>
        )}
      </Container>
    </Box>
  );
};

export default TrainerAnalytics;
