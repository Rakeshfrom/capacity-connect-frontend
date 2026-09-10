import { Box, Container, Typography } from '@mui/material';

const stats = [
  ['100+', 'Learning Resources'],
  ['50+', 'Training Programmes'],
  ['3', 'Portal Roles'],
  ['24×7', 'Digital Access'],
];

const PortalStats = () => (
  <Box sx={{ py: { xs: 6, md: 7 }, bgcolor: '#082F52', color: '#fff' }}>
    <Container maxWidth="xl">
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography sx={{ fontWeight: 800, fontSize: '1.5rem' }}>
          A connected platform for continuous learning
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, color: '#B9C9D6' }}>
          Supporting structured capacity building and professional development.
        </Typography>
      </Box>

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: 'repeat(2,1fr)', md: 'repeat(4,1fr)' },
        gap: 2,
      }}>
        {stats.map(([value, label]) => (
          <Box key={label} sx={{ textAlign: 'center', p: 2 }}>
            <Typography sx={{ fontWeight: 800, fontSize: { xs: '1.8rem', md: '2.3rem' } }}>
              {value}
            </Typography>
            <Typography variant="body2" sx={{ mt: .5, color: '#B9C9D6' }}>
              {label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Container>
  </Box>
);

export default PortalStats;
