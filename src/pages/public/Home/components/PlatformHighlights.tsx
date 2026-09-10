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
  <Box sx={{ py: { xs: 7, md: 10 }, bgcolor: '#fff' }}>
    <Container maxWidth="xl">
      <Box sx={{ maxWidth: 760, mb: { xs: 4, md: 5.5 } }}>
        <Typography
          sx={{
            color: '#0B5A91',
            fontWeight: 800,
            fontSize: '.76rem',
            letterSpacing: '.12em',
          }}
        >
          PLATFORM CAPABILITIES
        </Typography>

        <Typography
          variant="h4"
          sx={{
            mt: 1.2,
            color: '#123F63',
            fontWeight: 800,
            letterSpacing: '-.02em',
          }}
        >
          Everything you need for connected learning
        </Typography>

        <Typography sx={{ mt: 1.5, color: '#657887', lineHeight: 1.75, maxWidth: 680 }}>
          A single environment connecting learning, resources, assessment,
          certification and professional development.
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2,1fr)', lg: 'repeat(4,1fr)' },
          gap: 2,
        }}
      >
        {highlights.map(([title, text, icon], index) => (
          <Paper
            key={String(title)}
            elevation={0}
            sx={{
              position: 'relative',
              overflow: 'hidden',
              p: { xs: 2.8, md: 3.2 },
              minHeight: 205,
              border: '1px solid #DCE7EE',
              borderRadius: 3,
              bgcolor: '#fff',
              transition: 'transform .25s ease, box-shadow .25s ease, border-color .25s ease',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: 48,
                height: 3,
                bgcolor: '#0B5A91',
              },
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 18px 38px rgba(20,55,80,.10)',
                borderColor: '#C4DCE9',
              },
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  display: 'grid',
                  placeItems: 'center',
                  borderRadius: 2,
                  bgcolor: '#EAF5FC',
                  color: '#0B5A91',
                }}
              >
                {icon}
              </Box>

              <Typography
                sx={{
                  color: '#C1D0D9',
                  fontWeight: 800,
                  fontSize: '.8rem',
                }}
              >
                0{index + 1}
              </Typography>
            </Box>

            <Typography sx={{ mt: 2.4, color: '#244A66', fontWeight: 800, fontSize: '1.05rem' }}>
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

export default PlatformHighlights;
