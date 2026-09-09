import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Link as RouterLink, useParams } from 'react-router-dom';
import CourseOverview from './components/CourseOverview';
import CourseModules from './components/CourseModules';

const courseData: Record<
  string,
  {
    category: string;
    title: string;
    description: string;
    duration: string;
    level: string;
    objectives: string[];
    modules: { title: string; description: string }[];
  }
> = {
  'meteorological-science': {
    category: 'Meteorology',
    title: 'Foundations of Meteorological Science',
    description:
      'Build core knowledge of meteorological concepts through structured learning modules and guided digital resources.',
    duration: '6 Weeks',
    level: 'Beginner',
    objectives: [
      'Understand fundamental meteorological concepts.',
      'Develop knowledge of atmospheric processes.',
      'Interpret basic meteorological observations.',
      'Build a foundation for advanced learning programmes.',
    ],
    modules: [
      {
        title: 'Introduction to Meteorology',
        description:
          'Fundamental concepts, atmosphere composition and basic meteorological terminology.',
      },
      {
        title: 'Atmospheric Processes',
        description:
          'Explore temperature, pressure, humidity, stability and atmospheric circulation.',
      },
      {
        title: 'Meteorological Observations',
        description:
          'Understand observation systems, instruments and interpretation of observations.',
      },
      {
        title: 'Weather Systems',
        description:
          'Introduction to major weather systems and their characteristics.',
      },
    ],
  },
  'climate-science': {
    category: 'Climate',
    title: 'Climate Science & Applications',
    description:
      'Explore climate concepts, analysis methods and practical applications for professional learning.',
    duration: '5 Weeks',
    level: 'Intermediate',
    objectives: [
      'Understand climate system components.',
      'Analyse basic climate variability.',
      'Interpret climate datasets.',
      'Apply climate knowledge to professional contexts.',
    ],
    modules: [
      {
        title: 'Climate System',
        description:
          'Introduction to the components and interactions within the climate system.',
      },
      {
        title: 'Climate Variability',
        description:
          'Understand natural variability and major climate patterns.',
      },
      {
        title: 'Climate Data',
        description:
          'Introduction to climate datasets, indicators and basic analysis.',
      },
      {
        title: 'Applications',
        description:
          'Explore practical applications of climate information.',
      },
    ],
  },
  'weather-services': {
    category: 'Weather Services',
    title: 'Weather Forecasting & Services',
    description:
      'Develop knowledge of forecasting workflows, products and operational weather services.',
    duration: '8 Weeks',
    level: 'Intermediate',
    objectives: [
      'Understand the forecasting workflow.',
      'Identify major forecasting products.',
      'Interpret forecast information.',
      'Understand operational weather services.',
    ],
    modules: [
      {
        title: 'Forecasting Fundamentals',
        description:
          'Core concepts and stages involved in weather forecasting.',
      },
      {
        title: 'Forecast Products',
        description:
          'Overview of forecast products and their applications.',
      },
      {
        title: 'Forecast Interpretation',
        description:
          'Learn how to interpret forecast information and associated uncertainty.',
      },
      {
        title: 'Operational Services',
        description:
          'Understand the role of weather services in operational decision-making.',
      },
    ],
  },
};

const CourseDetail = () => {
  const { courseId } = useParams();
  const course = courseId ? courseData[courseId] : undefined;

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
            {course.category}
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
            {course.title}
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
            {course.description}
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
        <CourseOverview
          duration={course.duration}
          level={course.level}
        />

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

            <Typography
              sx={{ color: '#657887', lineHeight: 1.8, mb: 4 }}
            >
              This programme provides a structured learning pathway for
              participants to develop relevant knowledge and practical
              understanding through digital learning resources and assessments.
            </Typography>

            <Typography
              variant="h5"
              sx={{ color: '#173F60', fontWeight: 700, mb: 2 }}
            >
              Learning objectives
            </Typography>

            <Stack spacing={1.5} sx={{ mb: 5 }}>
              {course.objectives.map((objective) => (
                <Box
                  key={objective}
                  sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}
                >
                  <CheckCircleIcon
                    sx={{ color: '#0B5A91', mt: 0.2 }}
                  />

                  <Typography sx={{ color: '#536A7B', lineHeight: 1.6 }}>
                    {objective}
                  </Typography>
                </Box>
              ))}
            </Stack>

            <CourseModules modules={course.modules} />
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
                Ready to start learning?
              </Typography>

              <Typography
                variant="body2"
                sx={{ color: '#657887', lineHeight: 1.7, mt: 1 }}
              >
                Enrolment will be available after secure account
                authentication.
              </Typography>

              <Button
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  mt: 3,
                  bgcolor: '#0B5A91',
                  py: 1.3,
                  textTransform: 'none',
                  fontWeight: 700,
                  '&:hover': { bgcolor: '#084873' },
                }}
              >
                Enrol in course
              </Button>

              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  textAlign: 'center',
                  color: '#80909D',
                  mt: 1.5,
                }}
              >
                Login required for enrolment
              </Typography>
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default CourseDetail;
