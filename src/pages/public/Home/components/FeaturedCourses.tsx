import { Box, Button, Container, Paper, Typography } from '@mui/material';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';

const courses = [
  ['Meteorology', 'Foundations of Meteorological Science', 'Build core knowledge through structured learning modules.'],
  ['Climate', 'Climate Science & Applications', 'Explore climate concepts, analysis and practical applications.'],
  ['Weather Services', 'Weather Forecasting & Services', 'Develop knowledge of forecasting workflows and services.'],
];

const FeaturedCourses = () => (
  <Box sx={{ py: { xs: 7, md: 10 }, bgcolor: '#F5F9FC' }}>
    <Container maxWidth="xl">
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'flex-end' },
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2,
          mb: { xs: 4, md: 5 },
        }}
      >
        <Box>
          <Typography sx={{ color: '#0B5A91', fontWeight: 800, fontSize: '.76rem', letterSpacing: '.12em' }}>
            LEARNING PROGRAMMES
          </Typography>

          <Typography
            variant="h4"
            sx={{ mt: 1.2, color: '#173F60', fontWeight: 800, letterSpacing: '-.02em' }}
          >
            Explore featured programmes
          </Typography>

          <Typography sx={{ mt: 1.2, color: '#657887', lineHeight: 1.7 }}>
            Start building knowledge in key areas of Earth and atmospheric sciences.
          </Typography>
        </Box>

        <Button
          href="/courses"
          endIcon={<ArrowForwardRoundedIcon />}
          sx={{
            color: '#0B5A91',
            fontWeight: 800,
            textTransform: 'none',
            px: 0,
            '&:hover': { bgcolor: 'transparent' },
          }}
        >
          View all courses
        </Button>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3,1fr)' },
          gap: 2.5,
        }}
      >
        {courses.map(([category, title, description], index) => (
          <Paper
            key={title}
            elevation={0}
            sx={{
              overflow: 'hidden',
              border: '1px solid #DDE8EE',
              borderRadius: 3,
              bgcolor: '#fff',
              transition: 'transform .25s ease, box-shadow .25s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 18px 38px rgba(20,55,80,.10)',
              },
            }}
          >
            <Box
              sx={{
                height: 7,
                background: index === 1
                  ? 'linear-gradient(90deg,#0B5A91,#2B86B8)'
                  : 'linear-gradient(90deg,#164F75,#0B5A91)',
              }}
            />

            <Box sx={{ p: { xs: 2.8, md: 3.2 } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box
                  sx={{
                    width: 46,
                    height: 46,
                    display: 'grid',
                    placeItems: 'center',
                    borderRadius: 2,
                    bgcolor: '#EAF5FC',
                    color: '#0B5A91',
                  }}
                >
                  <MenuBookOutlinedIcon />
                </Box>

                <Typography sx={{ color: '#9AAEBA', fontWeight: 700, fontSize: '.78rem' }}>
                  PROGRAMME 0{index + 1}
                </Typography>
              </Box>

              <Typography
                sx={{
                  mt: 2.5,
                  color: '#0B5A91',
                  fontWeight: 800,
                  fontSize: '.72rem',
                  letterSpacing: '.1em',
                  textTransform: 'uppercase',
                }}
              >
                {category}
              </Typography>

              <Typography variant="h6" sx={{ mt: 1, color: '#244A66', fontWeight: 800, lineHeight: 1.35 }}>
                {title}
              </Typography>

              <Typography variant="body2" sx={{ mt: 1.2, color: '#657887', lineHeight: 1.65 }}>
                {description}
              </Typography>

              <Box sx={{ mt: 2.2, pt: 2, borderTop: '1px solid #EDF2F5', display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccessTimeOutlinedIcon sx={{ fontSize: 18, color: '#78909F' }} />
                <Typography variant="body2" sx={{ color: '#718594' }}>
                  Structured learning programme
                </Typography>
              </Box>

              <Button
                href="/courses"
                endIcon={<ArrowForwardRoundedIcon />}
                sx={{
                  mt: 2,
                  px: 0,
                  color: '#0B5A91',
                  textTransform: 'none',
                  fontWeight: 800,
                  '&:hover': { bgcolor: 'transparent' },
                }}
              >
                View programme
              </Button>
            </Box>
          </Paper>
        ))}
      </Box>
    </Container>
  </Box>
);

export default FeaturedCourses;
