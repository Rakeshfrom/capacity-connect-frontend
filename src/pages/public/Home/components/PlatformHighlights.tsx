import { Box, Container, Paper, Typography } from '@mui/material';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';

const highlights = [
  ['Role-based Learning', 'Dedicated experiences for trainees, trainers and administrators.', <GroupsOutlinedIcon />],
  ['Digital Resource Library', 'Centralized access to learning material, presentations and recordings.', <LibraryBooksOutlinedIcon />],
  ['Assessment & Certification', 'Evaluate learning outcomes and track successful completion.', <AssignmentTurnedInOutlinedIcon />],
  ['Progress & Analytics', 'Monitor participation, performance and professional development.', <InsightsOutlinedIcon />],
];

const PlatformHighlights = () => (
  <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: '#fff' }}>
    <Container maxWidth="xl">
      <Box sx={{ maxWidth: 760, mb: 4.5 }}>
        <Typography sx={{ color: '#0B5A91', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.08em' }}>
          PLATFORM CAPABILITIES
        </Typography>
        <Typography variant="h4" sx={{ mt: 1, color: '#173F60', fontWeight: 800 }}>
          Everything you need for connected learning
        </Typography>
        <Typography sx={{ mt: 1.2, color: '#657887', lineHeight: 1.7 }}>
          A single environment connecting learning, resources, assessment,
          certification and performance.
        </Typography>
      </Box>

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2,1fr)', lg: 'repeat(4,1fr)' },
        gap: 2,
      }}>
        {highlights.map(([title, text, icon]) => (
          <Paper
            key={String(title)}
            elevation={0}
            sx={{
              p: 3,
              minHeight: 190,
              border: '1px solid #DFE8EE',
              borderRadius: 2.5,
              transition: 'all .2s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 30px rgba(20,55,80,.09)',
                borderColor: '#C5DCE9',
              },
            }}
          >
            <Box sx={{
              width: 46,
              height: 46,
              display: 'grid',
              placeItems: 'center',
              borderRadius: 1.5,
              bgcolor: '#EAF5FC',
              color: '#0B5A91',
              mb: 2,
            }}>
              {icon}
            </Box>
            <Typography sx={{ color: '#244A66', fontWeight: 700, fontSize: '1.05rem' }}>
              {title}
            </Typography>
            <Typography variant="body2" sx={{ color: '#657887', mt: 1, lineHeight: 1.65 }}>
              {text}
            </Typography>
          </Paper>
        ))}
      </Box>
    </Container>
  </Box>
);

export default PlatformHighlights;
