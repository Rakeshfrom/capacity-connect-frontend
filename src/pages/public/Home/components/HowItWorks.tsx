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
  <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: '#F5F9FC' }}>
    <Container maxWidth="xl">
      <Box sx={{ textAlign: 'center', maxWidth: 700, mx: 'auto', mb: 5 }}>
        <Typography sx={{ color: '#0B5A91', fontWeight: 700, fontSize: '.8rem', letterSpacing: '.08em' }}>
          YOUR LEARNING JOURNEY
        </Typography>
        <Typography variant="h4" sx={{ mt: 1, color: '#173F60', fontWeight: 800 }}>
          Learn in four simple steps
        </Typography>
        <Typography sx={{ mt: 1.2, color: '#657887', lineHeight: 1.7 }}>
          From discovering a programme to demonstrating your learning outcomes.
        </Typography>
      </Box>

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2,1fr)', lg: 'repeat(4,1fr)' },
        gap: 2,
      }}>
        {steps.map(([number, title, text, icon]) => (
          <Paper key={String(title)} elevation={0} sx={{
            p: 3,
            border: '1px solid #DDE8EE',
            borderRadius: 2.5,
            bgcolor: '#fff',
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ color: '#B0C2CE', fontWeight: 800, fontSize: '1.5rem' }}>
                {number}
              </Typography>
              <Box sx={{ color: '#0B5A91' }}>{icon}</Box>
            </Box>
            <Typography sx={{ mt: 2, color: '#244A66', fontWeight: 800, fontSize: '1.08rem' }}>
              {title}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: '#657887', lineHeight: 1.65 }}>
              {text}
            </Typography>
          </Paper>
        ))}
      </Box>
    </Container>
  </Box>
);

export default HowItWorks;
