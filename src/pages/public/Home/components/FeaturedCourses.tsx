import { Box, Button, Container, Paper, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const courses = [
  {
    category: 'Meteorology',
    title: 'Foundations of Meteorological Science',
    description: 'Build core knowledge through structured learning modules.',
  },
  {
    category: 'Climate',
    title: 'Climate Science & Applications',
    description: 'Explore climate concepts, analysis and practical applications.',
  },
  {
    category: 'Weather Services',
    title: 'Weather Forecasting & Services',
    description: 'Develop knowledge of forecasting workflows and services.',
  },
];

const FeaturedCourses = () => {
  return (
    <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: '#F5F8FA' }}>
      <Container maxWidth="xl">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
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
              Featured learning programmes
            </Typography>

            <Typography sx={{ color: '#657887', mt: 1 }}>
              Explore selected training opportunities.
            </Typography>
          </Box>

          <Button
            href="/courses"
            endIcon={<ArrowForwardIcon />}
            sx={{
              color: '#0B5A91',
              fontWeight: 700,
              textTransform: 'none',
            }}
          >
            View all courses
          </Button>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: 2.5,
          }}
        >
          {courses.map((course) => (
            <Paper
              key={course.title}
              elevation={0}
              sx={{
                p: 3,
                border: '1px solid #DFE8EE',
                borderRadius: 2,
                bgcolor: '#fff',
              }}
            >
              <Typography
                sx={{
                  color: '#0B5A91',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                {course.category}
              </Typography>

              <Typography
                variant="h6"
                sx={{ color: '#244A66', fontWeight: 700, mt: 1.5 }}
              >
                {course.title}
              </Typography>

              <Typography
                variant="body2"
                sx={{ color: '#657887', mt: 1, lineHeight: 1.65 }}
              >
                {course.description}
              </Typography>

              <Button
                href="/courses"
                sx={{
                  mt: 2,
                  px: 0,
                  color: '#0B5A91',
                  textTransform: 'none',
                  fontWeight: 700,
                }}
              >
                View programme
              </Button>
            </Paper>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default FeaturedCourses;
