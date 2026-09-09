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
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import { useEffect, useState } from 'react';
import { getAdminAnalytics } from '../../../services/api';



const Analytics = () => {
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    getAdminAnalytics()
      .then(setAnalytics)
      .catch((error) => console.error('Failed to load analytics:', error));
  }, []);

  if (!analytics) {
    return (
      <Box sx={{ bgcolor: '#F5F8FA', minHeight: '100vh' }}>
        <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
          <LinearProgress />
        </Container>
      </Box>
    );
  }

  const courseData: Array<{
    courseId: number;
    courseTitle: string;
    enrolled: number;
    completion: number;
    averageScore: number;
  }> = analytics.courses ?? [];

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
            Platform Analytics
          </Typography>

          <Typography sx={{ color: '#657887', mt: 1 }}>
            Monitor platform participation, learning outcomes and course
            performance.
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
          {[
            ['Total Trainees', String(analytics.totalTrainees), 'Active trainees', PeopleOutlineOutlinedIcon],
            ['Active Courses', String(analytics.activeCourses), 'Published courses', MenuBookOutlinedIcon],
            ['Assessment Score', `${analytics.averageAssessmentScore}%`, 'Average score', AssessmentOutlinedIcon],
            ['Overall Completion', `${analytics.overallCompletion}%`, 'Average completion', TrendingUpOutlinedIcon],
          ].map(([label, value, trend, Icon]) => (
            <Card
              key={label as string}
              elevation={0}
              sx={{
                border: '1px solid #DCE8F0',
                borderRadius: 2,
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack
                  direction="row"
                  sx={{
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Box>
                    <Typography sx={{ color: '#657887' }}>
                      {label as string}
                    </Typography>

                    <Typography
                      sx={{
                        color: '#173F60',
                        fontWeight: 800,
                        fontSize: '2rem',
                        mt: 0.5,
                      }}
                    >
                      {value as string}
                    </Typography>

                    <Typography
                      sx={{
                        color: '#0B5A91',
                        fontWeight: 700,
                        fontSize: '0.88rem',
                        mt: 0.5,
                      }}
                    >
                      {trend as string}
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
                    }}
                  >
                    <Icon sx={{ color: '#0B5A91' }} />
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1.5fr 1fr' },
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
                  fontSize: '1.25rem',
                }}
              >
                Course Performance
              </Typography>

              <Typography sx={{ color: '#657887', mt: 0.5, mb: 3 }}>
                Completion and assessment performance across active courses.
              </Typography>

              <Stack spacing={3}>
                {courseData.map((course) => (
                  <Box key={course.courseTitle}>
                    <Stack
                      direction="row"
                      sx={{
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: 2,
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
                            fontSize: '0.9rem',
                            mt: 0.4,
                          }}
                        >
                          {course.enrolled} trainees enrolled
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
                        mt: 1.5,
                        mb: 0.7,
                      }}
                    >
                      <Typography
                        sx={{ color: '#657887', fontSize: '0.88rem' }}
                      >
                        Completion
                      </Typography>

                      <Typography
                        sx={{
                          color: '#0B5A91',
                          fontWeight: 700,
                          fontSize: '0.88rem',
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
                  fontSize: '1.25rem',
                }}
              >
                Platform Engagement
              </Typography>

              <Typography sx={{ color: '#657887', mt: 0.5, mb: 3 }}>
                Current learning and participation indicators.
              </Typography>

              {[
                ['Course Participation', analytics.courseParticipation],
                ['Assessment Participation', analytics.assessmentParticipation],
                ['Resource Engagement', analytics.resourceEngagement],
                ['Feedback Response', analytics.feedbackResponse],
              ].map(([label, value]) => (
                <Box key={label as string} sx={{ mb: 2.5 }}>
                  <Stack
                    direction="row"
                    sx={{ justifyContent: 'space-between', mb: 0.7 }}
                  >
                    <Typography sx={{ color: '#657887' }}>
                      {label as string}
                    </Typography>

                    <Typography
                      sx={{
                        color: '#173F60',
                        fontWeight: 700,
                      }}
                    >
                      {value as number}%
                    </Typography>
                  </Stack>

                  <LinearProgress
                    variant="determinate"
                    value={value as number}
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
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
};

export default Analytics;
