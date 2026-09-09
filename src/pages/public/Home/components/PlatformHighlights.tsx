import { Box, Container, Paper, Typography } from '@mui/material';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';

const highlights = [
  {
    icon: <GroupsOutlinedIcon />,
    title: 'Role-based Learning',
    text: 'Dedicated experiences for trainees, trainers and administrators.',
  },
  {
    icon: <LibraryBooksOutlinedIcon />,
    title: 'Digital Resources',
    text: 'Centralized access to lectures, presentations and study material.',
  },
  {
    icon: <VerifiedOutlinedIcon />,
    title: 'Certification',
    text: 'Track successful learning and certification outcomes.',
  },
  {
    icon: <InsightsOutlinedIcon />,
    title: 'Progress & Analytics',
    text: 'Monitor participation, assessments and learning progress.',
  },
];

const PlatformHighlights = () => {
  return (
    <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: '#fff' }}>
      <Container maxWidth="xl">
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Typography
            variant="h4"
            sx={{
              color: '#173F60',
              fontWeight: 700,
              fontSize: { xs: '1.8rem', md: '2.2rem' },
            }}
          >
            A complete learning ecosystem
          </Typography>

          <Typography
            sx={{
              color: '#657887',
              maxWidth: 720,
              mx: 'auto',
              mt: 1.5,
              lineHeight: 1.7,
            }}
          >
            Everything needed to support structured capacity building in one
            secure and accessible platform.
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              lg: 'repeat(4, 1fr)',
            },
            gap: 2.5,
          }}
        >
          {highlights.map((item) => (
            <Paper
              key={item.title}
              elevation={0}
              sx={{
                p: 3,
                minHeight: 170,
                border: '1px solid #DFE8EE',
                borderRadius: 2,
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: '0 8px 24px rgba(20, 55, 80, 0.08)',
                },
              }}
            >
              <Box sx={{ color: '#0B5A91', mb: 2 }}>{item.icon}</Box>

              <Typography
                sx={{ color: '#244A66', fontWeight: 700, fontSize: '1.05rem' }}
              >
                {item.title}
              </Typography>

              <Typography
                variant="body2"
                sx={{ color: '#657887', mt: 1, lineHeight: 1.65 }}
              >
                {item.text}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default PlatformHighlights;
