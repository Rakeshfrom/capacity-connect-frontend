import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';

const features = [
  {
    icon: <SchoolOutlinedIcon />,
    title: 'Structured Training',
    text: 'Access organized learning programmes and courses.',
  },
  {
    icon: <MenuBookOutlinedIcon />,
    title: 'Learning Resources',
    text: 'Study from presentations, recordings and digital materials.',
  },
  {
    icon: <AssessmentOutlinedIcon />,
    title: 'Assessments',
    text: 'Evaluate learning through subject-wise assessments.',
  },
];

const HeroSection = () => {
  return (
    <Box
      sx={{
        background:
          'linear-gradient(135deg, #EAF4FB 0%, #F7FAFC 55%, #E9F3F9 100%)',
        borderBottom: '1px solid #DCE8F0',
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            minHeight: { md: 500 },
            py: { xs: 6, sm: 7, md: 9 },
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1.15fr 0.85fr' },
            gap: { xs: 5, md: 7 },
            alignItems: 'center',
          }}
        >
          <Box>
            <Typography
              sx={{
                color: '#0B5A91',
                fontWeight: 700,
                fontSize: { xs: '0.78rem', sm: '0.9rem' },
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                mb: 2,
              }}
            >
              Digital Capacity Building Platform
            </Typography>

            <Typography
              sx={{
                color: '#123E61',
                fontWeight: 800,
                fontSize: { xs: '2.25rem', sm: '3rem', md: '4rem' },
                lineHeight: 1.12,
                maxWidth: 780,
              }}
            >
              Learn. Build. Strengthen your professional capacity.
            </Typography>

            <Typography
              sx={{
                color: '#536A7B',
                fontSize: { xs: '1rem', md: '1.15rem' },
                lineHeight: 1.8,
                maxWidth: 680,
                mt: 2.5,
              }}
            >
              A centralized learning environment for structured training,
              digital resources, assessments and professional development.
            </Typography>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              sx={{ mt: 4 }}
            >
              <Button
                variant="contained"
                size="large"
                href="/courses"
                sx={{
                  px: 3.5,
                  py: 1.3,
                  bgcolor: '#0B5A91',
                  textTransform: 'none',
                  fontWeight: 700,
                  width: { xs: '100%', sm: 'auto' },
                  '&:hover': { bgcolor: '#084873' },
                }}
              >
                Explore Courses
              </Button>

              <Button
                variant="outlined"
                size="large"
                href="/about"
                sx={{
                  px: 3.5,
                  py: 1.3,
                  borderColor: '#7D9AAF',
                  color: '#173F60',
                  textTransform: 'none',
                  fontWeight: 700,
                  width: { xs: '100%', sm: 'auto' },
                }}
              >
                Learn More
              </Button>
            </Stack>
          </Box>

          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, sm: 4 },
              border: '1px solid #D5E4ED',
              borderRadius: 2,
              bgcolor: '#fff',
            }}
          >
            <Typography
              variant="h5"
              sx={{
                color: '#173F60',
                fontWeight: 700,
                mb: 3,
                fontSize: { xs: '1.35rem', sm: '1.5rem' },
              }}
            >
              One portal for learning
            </Typography>

            <Stack spacing={2.5}>
              {features.map((item) => (
                <Box key={item.title} sx={{ display: 'flex', gap: 2 }}>
                  <Box sx={{ color: '#0B5A91', pt: 0.3 }}>{item.icon}</Box>

                  <Box>
                    <Typography sx={{ fontWeight: 700, color: '#244A66' }}>
                      {item.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: '#657887', mt: 0.4, lineHeight: 1.6 }}
                    >
                      {item.text}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default HeroSection;
