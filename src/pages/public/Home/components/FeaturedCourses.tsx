import { Box, Button, Container, Paper, Typography } from '@mui/material';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';

const courses = [
  ['Meteorology', 'Foundations of Meteorological Science', 'Build core knowledge through structured learning modules.'],
  ['Climate', 'Climate Science & Applications', 'Explore climate concepts, analysis and practical applications.'],
  ['Weather Services', 'Weather Forecasting & Services', 'Develop knowledge of forecasting workflows and services.'],
];

const FeaturedCourses = () => (
  <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: '#F5F9FC' }}>
    <Container maxWidth="xl">
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', md: 'flex-end' },
        flexDirection: { xs: 'column', md: 'row' },
        gap: 2,
        mb: 4,
      }}>
        <Box>
          <Typography sx={{ color: '#0B5A91', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.08em' }}>
            LEARNING PROGRAMMES
          </Typography>
          <Typography variant="h4" sx={{ mt: 1, color: '#173F60', fontWeight: 800 }}>
            Explore featured programmes
          </Typography>
          <Typography sx={{ mt: 1, color: '#657887' }}>
            Start building knowledge in key areas of Earth and atmospheric sciences.
          </Typography>
        </Box>

        <Button
          href="/courses"
          endIcon={<ArrowForwardRoundedIcon />}
          sx={{ color: '#0B5A91', fontWeight: 700, textTransform: 'none' }}
        >
          View all courses
        </Button>
      </Box>

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: 'repeat(3,1fr)' },
        gap: 2.5,
      }}>
        {courses.map(([category, title, description]) => (
          <Paper
            key={title}
            elevation={0}
            sx={{
              p: 3,
              border: '1px solid #DDE8EE',
              borderRadius: 2.5,
              bgcolor: '#fff',
              transition: 'all .2s ease',
              '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 10px 28px rgba(20,55,80,.08)' },
            }}
          >
            <Box sx={{
              width: 44,
              height: 44,
              display: 'grid',
              placeItems: 'center',
              borderRadius: 1.5,
              bgcolor: '#EAF5FC',
              color: '#0B5A91',
            }}>
              <MenuBookOutlinedIcon />
            </Box>

            <Typography sx={{
              mt: 2.5,
              color: '#0B5A91',
              fontWeight: 700,
              fontSize: '0.76rem',
              letterSpacing: '0.07em',
              textTransform: 'uppercase',
            }}>
              {category}
            </Typography>

            <Typography variant="h6" sx={{ mt: 1, color: '#244A66', fontWeight: 800 }}>
              {title}
            </Typography>

            <Typography variant="body2" sx={{ mt: 1, color: '#657887', lineHeight: 1.65 }}>
              {description}
            </Typography>

            <Button
              href="/courses"
              endIcon={<ArrowForwardRoundedIcon />}
              sx={{ mt: 2, px: 0, color: '#0B5A91', textTransform: 'none', fontWeight: 700 }}
            >
              View programme
            </Button>
          </Paper>
        ))}
      </Box>
    </Container>
  </Box>
);

export default FeaturedCourses;
