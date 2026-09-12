import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Chip,
  Container,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import {
  getAttemptsByTrainee,
  getCourses,
  getEnrollments,
  getMyCourseAssessments,
} from '../../../services/api';

type Assessment = {
  id: number;
  title: string;
  description: string;
  courseId: number;
  timeLimitMinutes: number;
  passingPercentage: number;
  status: string;
  createdAt: string;
};

type Course = {
  id: number;
  title: string;
};

type Enrollment = {
  id: number;
  traineeId: number;
  courseId: number;
  status: string;
  progress: number;
};

type Attempt = {
  id: number;
  assessmentId: number;
  score: number;
  totalMarks: number;
  percentage: number;
  result: string;
  startedAt: string;
  submittedAt: string | null;
};

const Assessments = () => {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [enrollmentData, courseData, attemptData] =
          await Promise.all([
            getEnrollments(),
            getCourses(),
            getAttemptsByTrainee(),
          ]);

        const enrolledCourseIds = (enrollmentData as Enrollment[])
          .filter((enrollment) => enrollment.status !== 'DROPPED')
          .map((enrollment) => enrollment.courseId);

        const enrolledCourses = (courseData as Course[]).filter((course) =>
          enrolledCourseIds.includes(course.id)
        );

        setCourses(enrolledCourses);
        setAttempts(attemptData);
        setLoading(false);

        Promise.all(
          enrolledCourseIds.map((courseId) =>
            getMyCourseAssessments(courseId)
          )
        )
          .then((assessmentLists) => {
            const enrolledAssessments = assessmentLists
              .flat()
              .filter(
                (assessment: Assessment) =>
                  assessment.status === 'PUBLISHED'
              )
              .filter(
                (assessment: Assessment, index: number, array: Assessment[]) =>
                  array.findIndex((item) => item.id === assessment.id) === index
              );

            setAssessments(enrolledAssessments);
          })
          .catch((error) => {
            console.error('Failed to load trainee assessments:', error);
          });
      } catch (error) {
        console.error('Failed to load assessments:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getCourseTitle = (courseId: number) => {
    return (
      courses.find((course) => course.id === courseId)?.title ||
      'Course'
    );
  };

  const getAttempt = (assessmentId: number) => {
    return attempts
      .filter((attempt) => attempt.assessmentId === assessmentId)
      .sort(
        (a, b) =>
          new Date(b.startedAt).getTime() -
          new Date(a.startedAt).getTime()
      )[0];
  };

  return (
    <Box sx={{ bgcolor: '#F5F8FA', minHeight: '100%' }}>
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
        <Typography
          variant="h3"
          sx={{
            color: '#173F60',
            fontWeight: 700,
            fontSize: { xs: '2rem', md: '2.5rem' },
          }}
        >
          Assessments
        </Typography>

        <Typography sx={{ mt: 1, color: '#657887' }}>
          View your upcoming and completed assessments.
        </Typography>

        {loading ? (
          <Typography sx={{ mt: 4, color: '#657887' }}>
            Loading assessments...
          </Typography>
        ) : assessments.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              mt: 4,
              p: 5,
              textAlign: 'center',
              border: '1px solid #DCE6ED',
              borderRadius: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{ color: '#244A66', fontWeight: 700 }}
            >
              No assessments available
            </Typography>

            <Typography sx={{ mt: 1, color: '#657887' }}>
              Your available assessments will appear here.
            </Typography>
          </Paper>
        ) : (
          <Stack spacing={2} sx={{ mt: 4 }}>
            {assessments.map((assessment) => {
              const attempt = getAttempt(assessment.id);
              const completed = attempt?.result === 'PASSED' ||
                attempt?.result === 'FAILED';

              return (
                <Paper
                  key={assessment.id}
                  elevation={0}
                  sx={{
                    p: { xs: 2.5, md: 3 },
                    border: '1px solid #DCE6ED',
                    borderRadius: 2,
                  }}
                >
                  <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={2}
                    sx={{
                      alignItems: { xs: 'flex-start', md: 'center' },
                      justifyContent: 'space-between',
                    }}
                  >
                    <Box>
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{ alignItems: 'center' }}
                      >
                        <AssignmentOutlinedIcon
                          sx={{ color: '#0B5A91' }}
                        />

                        <Typography
                          sx={{ color: '#0B5A91', fontWeight: 700 }}
                        >
                          {getCourseTitle(assessment.courseId)}
                        </Typography>
                      </Stack>

                      <Typography
                        variant="h6"
                        sx={{
                          mt: 1,
                          color: '#244A66',
                          fontWeight: 700,
                        }}
                      >
                        {assessment.title}
                      </Typography>

                      <Stack
                        direction="row"
                        spacing={2}
                        sx={{
                          mt: 1,
                          color: '#657887',
                          alignItems: 'center',
                        }}
                      >
                        <Stack
                          direction="row"
                          spacing={0.6}
                          sx={{ alignItems: 'center' }}
                        >
                          <CalendarTodayOutlinedIcon
                            sx={{ fontSize: 17 }}
                          />

                          <Typography variant="body2">
                            {new Date(
                              assessment.createdAt
                            ).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </Typography>
                        </Stack>

                        <Typography variant="body2">
                          {assessment.timeLimitMinutes} min
                        </Typography>
                      </Stack>
                    </Box>

                    <Stack
                      direction="row"
                      spacing={2}
                      sx={{ alignItems: 'center' }}
                    >
                      <Chip
                        label={
                          completed
                            ? 'Completed'
                            : attempt?.result === 'PENDING'
                              ? 'In Progress'
                              : 'Upcoming'
                        }
                        size="small"
                        sx={{
                          bgcolor: completed
                            ? '#EAF6EF'
                            : '#EEF6FC',
                          color: completed
                            ? '#177245'
                            : '#0B5A91',
                          fontWeight: 600,
                        }}
                      />

                      {completed ? (
                        <Button
                          variant="outlined"
                          onClick={() =>
                            navigate(
                              `/trainee/assessments/${assessment.id}/result`
                            )
                          }
                        >
                          View Result {attempt.percentage}%
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          onClick={() =>
                            navigate(
                              `/trainee/assessments/${assessment.id}`
                            )
                          }
                        >
                          {attempt?.result === 'PENDING'
                            ? 'Continue Assessment'
                            : 'Start Assessment'}
                        </Button>
                      )}
                    </Stack>
                  </Stack>
                </Paper>
              );
            })}
          </Stack>
        )}
      </Container>
    </Box>
  );
};

export default Assessments;
