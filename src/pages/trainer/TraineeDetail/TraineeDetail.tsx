import { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { getTrainerTraineeDetail } from '../../../services/api';

type AssessmentPerformance = {
  assessmentId: number;
  assessmentTitle: string;
  percentage: number | null;
  result: string;
};

type CoursePerformance = {
  courseId: number;
  courseTitle: string;
  enrollmentStatus: string;
  progress: number;
  assessments: AssessmentPerformance[];
};

type TraineeDetail = {
  traineeId: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  courses: CoursePerformance[];
};

const TraineeDetail = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { traineeId } = useParams();
  const [trainee, setTrainee] = useState<TraineeDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id || !traineeId) return;

    getTrainerTraineeDetail(user.id, Number(traineeId))
      .then((data) => setTrainee(data))
      .catch((error) =>
        console.error('Failed to load trainee details:', error)
      )
      .finally(() => setLoading(false));
  }, [user?.id, traineeId]);

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Typography>Loading trainee...</Typography>
      </Container>
    );
  }

  if (!trainee) {
    return (
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Typography sx={{ color: '#B42318' }}>
          Unable to load trainee details.
        </Typography>
      </Container>
    );
  }

  const name = `${trainee.firstName} ${trainee.lastName}`.trim();
  const initials = name
    .split(' ')
    .map((word) => word[0])
    .join('');

  return (
    <Box sx={{ bgcolor: '#F5F8FA', minHeight: '100vh' }}>
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
        <Typography
          onClick={() => navigate('/trainer/trainees')}
          sx={{
            color: '#0B5A91',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.7,
            mb: 3,
          }}
        >
          <ArrowBackOutlinedIcon fontSize="small" />
          Back to Trainees
        </Typography>

        <Card
          elevation={0}
          sx={{
            border: '1px solid #DCE8F0',
            borderRadius: 2,
            mb: 3,
          }}
        >
          <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              sx={{ alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2 }}
            >
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  bgcolor: '#0B5A91',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                }}
              >
                {initials}
              </Box>

              <Box>
                <Typography
                  sx={{
                    color: '#173F60',
                    fontWeight: 800,
                    fontSize: { xs: '1.7rem', md: '2rem' },
                  }}
                >
                  {name}
                </Typography>

                <Typography sx={{ color: '#718594', mt: 0.4 }}>
                  {trainee.email}
                </Typography>

                <Typography sx={{ color: '#718594', mt: 0.3 }}>
                  @{trainee.username}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        <Typography
          sx={{
            color: '#173F60',
            fontWeight: 800,
            fontSize: '1.4rem',
            mb: 2,
          }}
        >
          Course Performance
        </Typography>

        <Stack sx={{ gap: 2.5 }}>
          {trainee.courses.map((course) => (
            <Card
              key={course.courseId}
              elevation={0}
              sx={{
                border: '1px solid #DCE8F0',
                borderRadius: 2,
              }}
            >
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  sx={{
                    justifyContent: 'space-between',
                    gap: 2,
                  }}
                >
                  <Box>
                    <Stack
                      direction="row"
                      sx={{ alignItems: 'center', gap: 1 }}
                    >
                      <SchoolOutlinedIcon sx={{ color: '#0B5A91' }} />
                      <Typography
                        sx={{
                          color: '#173F60',
                          fontWeight: 700,
                          fontSize: '1.1rem',
                        }}
                      >
                        {course.courseTitle}
                      </Typography>
                    </Stack>

                    <Typography
                      sx={{
                        color: '#657887',
                        fontSize: '0.9rem',
                        mt: 1,
                      }}
                    >
                      Enrollment: {course.enrollmentStatus}
                    </Typography>
                  </Box>

                  <Chip
                    label={`${course.progress}% Complete`}
                    sx={{
                      bgcolor: '#EAF4FB',
                      color: '#0B5A91',
                      fontWeight: 700,
                    }}
                  />
                </Stack>

                <Typography
                  sx={{
                    color: '#657887',
                    fontSize: '0.9rem',
                    mt: 2,
                    mb: 0.7,
                  }}
                >
                  Course progress
                </Typography>

                <Box
                  sx={{
                    height: 8,
                    bgcolor: '#E1EAF0',
                    borderRadius: 5,
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      width: `${course.progress}%`,
                      height: '100%',
                      bgcolor: '#0B5A91',
                    }}
                  />
                </Box>

                <Divider sx={{ my: 3 }} />

                <Stack
                  direction="row"
                  sx={{ alignItems: 'center', gap: 1, mb: 2 }}
                >
                  <AssessmentOutlinedIcon sx={{ color: '#0B5A91' }} />
                  <Typography
                    sx={{ color: '#173F60', fontWeight: 700 }}
                  >
                    Assessments
                  </Typography>
                </Stack>

                {course.assessments.map((assessment) => (
                  <Box
                    key={assessment.assessmentId}
                    sx={{
                      border: '1px solid #E3EBF0',
                      borderRadius: 1.5,
                      p: 2,
                      mb: 1.5,
                    }}
                  >
                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      sx={{
                        justifyContent: 'space-between',
                        gap: 1,
                      }}
                    >
                      <Typography
                        sx={{ color: '#526B7A', fontWeight: 600 }}
                      >
                        {assessment.assessmentTitle}
                      </Typography>

                      <Chip
                        label={
                          assessment.percentage !== null
                            ? `${assessment.percentage}%`
                            : 'Not attempted'
                        }
                        size="small"
                        sx={{
                          bgcolor:
                            assessment.result === 'PASSED'
                              ? '#EAF6EF'
                              : '#FFF4E5',
                          color:
                            assessment.result === 'PASSED'
                              ? '#147A45'
                              : '#A35A00',
                          fontWeight: 700,
                        }}
                      />
                    </Stack>

                    <Typography
                      sx={{
                        color: '#718594',
                        fontSize: '0.85rem',
                        mt: 0.7,
                      }}
                    >
                      Result: {assessment.result}
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Container>
    </Box>
  );
};

export default TraineeDetail;
