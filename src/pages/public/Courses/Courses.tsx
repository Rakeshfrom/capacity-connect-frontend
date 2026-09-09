import {
  Box,
  Container,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import CourseCard from './components/CourseCard';

const courses = [
  {
    courseId: 'meteorological-science',
    category: 'Meteorology',
    title: 'Foundations of Meteorological Science',
    description:
      'Build core knowledge of meteorological concepts through structured learning modules.',
    duration: '6 Weeks',
    level: 'Beginner',
  },
  {
    courseId: 'climate-science',
    category: 'Climate',
    title: 'Climate Science & Applications',
    description:
      'Explore climate concepts, analysis methods and practical applications.',
    duration: '5 Weeks',
    level: 'Intermediate',
  },
  {
    courseId: 'weather-services',
    category: 'Weather Services',
    title: 'Weather Forecasting & Services',
    description:
      'Develop knowledge of forecasting workflows, products and operational services.',
    duration: '8 Weeks',
    level: 'Intermediate',
  },
  {
    courseId: 'meteorological-data-analysis',
    category: 'Data & Technology',
    title: 'Meteorological Data Analysis',
    description:
      'Learn methods for working with meteorological datasets and analytical workflows.',
    duration: '6 Weeks',
    level: 'Intermediate',
  },
  {
    courseId: 'climate-data-risk-assessment',
    category: 'Climate',
    title: 'Climate Data & Risk Assessment',
    description:
      'Understand climate data, variability and approaches to climate risk assessment.',
    duration: '7 Weeks',
    level: 'Advanced',
  },
  {
    courseId: 'numerical-weather-prediction',
    category: 'Forecasting',
    title: 'Numerical Weather Prediction',
    description:
      'Develop an understanding of numerical prediction systems and their applications.',
    duration: '8 Weeks',
    level: 'Advanced',
  },
];

const Courses = () => {
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
          <Typography
            sx={{
              color: '#0B5A91',
              fontWeight: 700,
              fontSize: '0.82rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            Learning Catalogue
          </Typography>

          <Typography
            variant="h2"
            sx={{
              color: '#173F60',
              fontWeight: 800,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              mt: 1,
            }}
          >
            Explore Courses
          </Typography>

          <Typography
            sx={{
              color: '#657887',
              maxWidth: 760,
              mt: 1.5,
              lineHeight: 1.7,
              fontSize: { xs: '0.95rem', md: '1.05rem' },
            }}
          >
            Discover structured training programmes designed to support
            professional learning and capacity development.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          sx={{ mb: 4 }}
        >
          <TextField
            fullWidth
            placeholder="Search courses..."
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchOutlinedIcon sx={{ color: '#718594' }} />
                  </InputAdornment>
                ),
              },
            }}
          />

          <TextField
            select
            label="Category"
            defaultValue="all"
            sx={{ width: { xs: '100%', md: 220 } }}
          >
            <MenuItem value="all">All categories</MenuItem>
            <MenuItem value="meteorology">Meteorology</MenuItem>
            <MenuItem value="climate">Climate</MenuItem>
            <MenuItem value="forecasting">Forecasting</MenuItem>
            <MenuItem value="technology">Data & Technology</MenuItem>
          </TextField>

          <TextField
            select
            label="Level"
            defaultValue="all"
            sx={{ width: { xs: '100%', md: 180 } }}
          >
            <MenuItem value="all">All levels</MenuItem>
            <MenuItem value="beginner">Beginner</MenuItem>
            <MenuItem value="intermediate">Intermediate</MenuItem>
            <MenuItem value="advanced">Advanced</MenuItem>
          </TextField>
        </Stack>

        <Typography
          sx={{
            color: '#536A7B',
            mb: 2.5,
            fontWeight: 600,
          }}
        >
          6 learning programmes
        </Typography>

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
          {courses.map((course) => (
            <CourseCard key={course.title} {...course} />
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default Courses;
