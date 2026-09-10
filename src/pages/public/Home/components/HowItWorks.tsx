import { Box, Container, Paper, Typography } from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import PlayCircleOutlineOutlinedIcon from '@mui/icons-material/PlayCircleOutlineOutlined';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';

const steps = [
  ['01', 'Discover', 'Find learning programmes aligned with your professional goals.', <SearchOutlinedIcon />],
  ['02', 'Learn', 'Access structured modules, resources and training material.', <PlayCircleOutlineOutlinedIcon />],
  ['03', 'Assess', 'Complete assessments and track your learning outcomes.', <FactCheckOutlinedIcon />],
  ['04', 'Grow', 'Build competencies and progress towards certification.', <EmojiEventsOutlinedIcon />],
];

const HowItWorks = () => (
  <Box
    sx={{
      py: { xs: 7, md: 10 },
      bgcolor: '#F5F9FC',
      borderTop: '1px solid #E4EDF2',
      borderBottom: '1px solid #E4EDF2',
    }}
  >
    <Container maxWidth="xl">
      <Box sx={{ textAlign: 'center', maxWidth: 700, mx: 'auto', mb: { xs: 4.5, md: 6 } }}>
        <Typography sx={{ color: '#0B5A91', fontWeight: 800, fontSize: '.76rem', letterSpacing: '.12em' }}>
          YOUR LEARNING JOURNEY
        </Typography>

        <Typography
          variant="h4"
          sx={{ mt: 1.2, color: '#173F60', fontWeight: 800, letterSpacing: '-.02em' }}
        >
          Learn in four simple steps
        </Typography>

        <Typography sx={{ mt: 1.3, color: '#657887', lineHeight: 1.7 }}>
          From discovering a programme to demonstrating your learning outcomes.
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2,1fr)', lg: 'repeat(4,1fr)' },
          gap: 2,
        }}
      >
        {steps.map(([number, title, text, icon], index) => (
          <Box key={String(title)} sx={{ position: 'relative' }}>
            <Paper
              elevation={0}
              sx={{
                position: 'relative',
                p: { xs: 2.8, md: 3.2 },
                minHeight: 215,
                border: '1px solid #DDE8EE',
                borderRadius: 3,
                bgcolor: '#fff',
                transition: 'transform .25s ease, box-shadow .25s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 16px 34px rgba(20,55,80,.09)',
                },
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    display: 'grid',
                    placeItems: 'center',
                    borderRadius: '50%',
                    bgcolor: '#0B5A91',
                    color: '#fff',
                  }}
                >
                  <Typography sx={{ fontWeight: 800, fontSize: '.82rem' }}>
                    {number}
                  </Typography>
                </Box>

                <Box sx={{ color: '#0B5A91' }}>{icon}</Box>
              </Box>

              <Typography sx={{ mt: 2.5, color: '#244A66', fontWeight: 800, fontSize: '1.08rem' }}>
                {title}
              </Typography>

              <Typography variant="body2" sx={{ mt: 1, color: '#657887', lineHeight: 1.65 }}>
                {text}
              </Typography>
            </Paper>

            {index < steps.length - 1 && (
              <Box
                sx={{
                  display: { xs: 'none', lg: 'block' },
                  position: 'absolute',
                  top: 21,
                  right: -17,
                  width: 34,
                  borderTop: '1px dashed #B9CCD8',
                  zIndex: 2,
                }}
              />
            )}
          </Box>
        ))}
      </Box>
    </Container>
  </Box>
);

export default HowItWorks;
