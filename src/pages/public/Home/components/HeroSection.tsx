import {
  Box, Button, Container, Paper, Stack, Typography,
} from '@mui/material';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';

const HeroSection = () => {
  return (
    <Box
      sx={{
        background:
          'linear-gradient(135deg, #EAF5FC 0%, #F8FBFD 52%, #E5F1F8 100%)',
        borderBottom: '1px solid #D9E7F0',
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            minHeight: { md: 540 },
            py: { xs: 6, md: 8 },
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1.15fr 0.85fr' },
            gap: { xs: 5, md: 8 },
            alignItems: 'center',
          }}
        >
          <Box>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                px: 1.5,
                py: 0.7,
                borderRadius: 5,
                bgcolor: '#DCEEF9',
                color: '#075B91',
                fontWeight: 700,
                fontSize: '0.78rem',
                letterSpacing: '0.04em',
              }}
            >
              DIGITAL CAPACITY BUILDING PLATFORM
            </Box>

            <Typography
              sx={{
                mt: 2.5,
                color: '#123F63',
                fontWeight: 800,
                fontSize: { xs: '2.35rem', sm: '3.1rem', md: '4.15rem' },
                lineHeight: 1.08,
                maxWidth: 800,
              }}
            >
              Learn today.
              <br />
              Strengthen tomorrow.
            </Typography>

            <Typography
              sx={{
                mt: 2.5,
                color: '#526B7D',
                fontSize: { xs: '1rem', md: '1.15rem' },
                lineHeight: 1.8,
                maxWidth: 690,
              }}
            >
              CAPACITY CONNECT brings structured training, digital resources,
              assessments and professional development together in one
              secure learning environment.
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 4 }}>
              <Button
                variant="contained"
                size="large"
                href="/courses"
                endIcon={<ArrowForwardRoundedIcon />}
                sx={{
                  px: 3,
                  py: 1.35,
                  borderRadius: 1.5,
                  bgcolor: '#0B5A91',
                  textTransform: 'none',
                  fontWeight: 700,
                  '&:hover': { bgcolor: '#084873' },
                }}
              >
                Explore Learning Programmes
              </Button>

              <Button
                variant="outlined"
                size="large"
                href="/about"
                sx={{
                  px: 3,
                  py: 1.35,
                  borderRadius: 1.5,
                  borderColor: '#8AA9BC',
                  color: '#173F60',
                  textTransform: 'none',
                  fontWeight: 700,
                }}
              >
                Discover the Platform
              </Button>
            </Stack>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={{ xs: 1.5, sm: 3 }}
              sx={{ mt: 4 }}
            >
              {[
                ['✓', 'Structured learning'],
                ['✓', 'Secure role-based access'],
                ['✓', 'Assessment & certification'],
              ].map(([icon, text]) => (
                <Box key={text} sx={{ display: 'flex', gap: 0.8, alignItems: 'center' }}>
                  <Typography sx={{ color: '#16804B', fontWeight: 800 }}>{icon}</Typography>
                  <Typography variant="body2" sx={{ color: '#536B7C' }}>{text}</Typography>
                </Box>
              ))}
            </Stack>
          </Box>

          <Paper
            elevation={0}
            sx={{
              position: 'relative',
              overflow: 'hidden',
              p: { xs: 3, sm: 4 },
              borderRadius: 3,
              border: '1px solid #D2E3ED',
              bgcolor: 'rgba(255,255,255,0.92)',
              boxShadow: '0 18px 50px rgba(20,65,95,0.10)',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: -55,
                right: -45,
                width: 150,
                height: 150,
                borderRadius: '50%',
                bgcolor: '#E5F3FB',
              }}
            />

            <Typography sx={{ color: '#0B5A91', fontWeight: 700, fontSize: '0.8rem' }}>
              ONE CONNECTED PLATFORM
            </Typography>

            <Typography
              sx={{
                mt: 1,
                color: '#173F60',
                fontWeight: 800,
                fontSize: '1.7rem',
              }}
            >
              From learning to achievement
            </Typography>

            <Stack spacing={2.2} sx={{ mt: 3 }}>
              {[
                [<SchoolOutlinedIcon />, 'Training Programmes', 'Discover structured learning opportunities.'],
                [<MenuBookOutlinedIcon />, 'Digital Resources', 'Access presentations, recordings and study material.'],
                [<VerifiedOutlinedIcon />, 'Assessment & Certification', 'Measure progress and earn recognised outcomes.'],
              ].map(([icon, title, text]) => (
                <Box key={String(title)} sx={{ display: 'flex', gap: 2 }}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      flexShrink: 0,
                      display: 'grid',
                      placeItems: 'center',
                      borderRadius: 1.5,
                      bgcolor: '#EAF5FC',
                      color: '#0B5A91',
                    }}
                  >
                    {icon}
                  </Box>
                  <Box>
                    <Typography sx={{ color: '#244A66', fontWeight: 700 }}>
                      {title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#687D8C', mt: 0.35, lineHeight: 1.55 }}>
                      {text}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Stack>

            <Box
              sx={{
                mt: 3,
                p: 2,
                borderRadius: 2,
                bgcolor: '#F4F9FC',
                border: '1px solid #E0EBF2',
              }}
            >
              <Typography variant="body2" sx={{ color: '#567083', lineHeight: 1.6 }}>
                Built to support continuous professional development across
                the learning journey.
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default HeroSection;
