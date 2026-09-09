import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Container,
  Paper,
  Typography,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import { Link as RouterLink } from 'react-router-dom';
import { getCourses, getEnrollments } from '../../../services/api';

type Course = {
  id: number;
  title: string;
  category: string;
  level: string;
  durationHours: number;
};

type Enrollment = {
  id: number;
  traineeId: number;
  courseId: number;
  status: string;
  progress: number;
};

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const [courseData, enrollmentData] = await Promise.all([
          getCourses(),
          getEnrollments(),
        ]);

        setCourses(courseData);
        setEnrollments(enrollmentData);
      } catch (error) {
        console.error('Failed to load courses:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, []);

  const enrolledCourses = enrollments
    .map((enrollment) => {
      const course = courses.find(
        (item) => item.id === enrollment.courseId
      );

      if (!course) {
        return undefined;
      }

      return {
        ...course,
        progress: enrollment.progress,
        status:
          enrollment.status === 'COMPLETED'
            ? 'Completed'
            : enrollment.status === 'IN_PROGRESS'
              ? 'In Progress'
              : 'Enrolled',
      };
    })
    .filter(
      (course): course is Course & {
        progress: number;
        status: string;
      } => course !== undefined
    );

  return (
    <Box sx={{ bgcolor: '#F4F8FB', minHeight: '100vh', py: { xs: 3, md: 5 } }}>
      <Container maxWidth="xl">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 2,
            flexWrap: 'wrap',
            mb: 4,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                color: '#173F60',
                fontWeight: 700,
                fontSize: { xs: '1.8rem', md: '2.2rem' },
              }}
            >
              My Courses
            </Typography>

            <Typography sx={{ mt: 0.7, color: '#657887' }}>
              View your enrolled programmes and continue learning.
            </Typography>
          </Box>

          <Button
            component={RouterLink}
            to="/courses"
            variant="outlined"
            endIcon={<ArrowForwardIcon />}
            sx={{
              borderColor: '#AFC2D0',
              color: '#0B5A91',
              textTransform: 'none',
              fontWeight: 700,
            }}
          >
            Browse courses
          </Button>
        </Box>

        {loading ? (
          <Typography sx={{ color: '#657887' }}>
            Loading courses...
          </Typography>
        ) : enrolledCourses.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 5,
              textAlign: 'center',
              border: '1px solid #DCE6ED',
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" sx={{ color: '#244A66', fontWeight: 700 }}>
              No enrolled courses
            </Typography>

            <Typography sx={{ mt: 1, color: '#657887' }}>
              Browse available courses and enroll to start learning.
            </Typography>
          </Paper>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                lg: 'repeat(3, 1fr)',
              },
              gap: { xs: 2, md: 2.5 },
            }}
          >
            {enrolledCourses.map((course) => (
              <Paper
                key={course.id}
                elevation={0}
                sx={{
                  p: { xs: 2.5, md: 3 },
                  border: '1px solid #DCE6ED',
                  borderRadius: 2,
                  bgcolor: '#FFFFFF',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: 1,
                    flexWrap: 'wrap',
                  }}
                >
                  <Typography
                    sx={{
                      color: '#0B5A91',
                      fontWeight: 700,
                      fontSize: '0.78rem',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {course.category}
                  </Typography>

                  <Chip
                    label={course.status}
                    size="small"
                    sx={{
                      bgcolor:
                        course.status === 'Completed'
                          ? '#EAF5EF'
                          : '#EEF6FC',
                      color:
                        course.status === 'Completed'
                          ? '#28734A'
                          : '#0B5A91',
                      fontWeight: 600,
                    }}
                  />
                </Box>

                <Typography
                  variant="h6"
                  sx={{
                    color: '#244A66',
                    fontWeight: 700,
                    mt: 2,
                    lineHeight: 1.4,
                  }}
                >
                  {course.title}
                </Typography>

                <Box
                  sx={{
                    display: 'flex',
                    gap: 2,
                    flexWrap: 'wrap',
                    mt: 2,
                    color: '#657887',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                    <AccessTimeOutlinedIcon sx={{ fontSize: 18 }} />
                    <Typography variant="body2">
                      {course.durationHours} Hours
                    </Typography>
                  </Box>

                  <Typography variant="body2">
                    {course.level}
                  </Typography>
                </Box>

                <Box sx={{ mt: 3 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mb: 0.8,
                    }}
                  >
                    <Typography variant="body2" sx={{ color: '#657887' }}>
                      Progress
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{ color: '#0B5A91', fontWeight: 700 }}
                    >
                      {course.progress}%
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      height: 7,
                      bgcolor: '#E7EEF3',
                      borderRadius: 5,
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

                <Button
                  component={RouterLink}
                  to="/courses"
                  variant="outlined"
                  fullWidth
                  sx={{
                    mt: 3,
                    py: 1,
                    borderColor: '#AFC2D0',
                    color: '#0B5A91',
                    textTransform: 'none',
                    fontWeight: 700,
                  }}
                >
                  {course.status === 'Completed'
                    ? 'View course'
                    : 'Continue learning'}
                </Button>
              </Paper>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Courses;
