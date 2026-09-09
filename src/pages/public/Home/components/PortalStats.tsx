import { Box, Container, Typography } from '@mui/material';

const stats = [
  { value: '100+', label: 'Learning Resources' },
  { value: '50+', label: 'Training Programmes' },
  { value: '3', label: 'Portal Roles' },
  { value: '24×7', label: 'Digital Access' },
];

const PortalStats = () => {
  return (
    <Box sx={{ py: { xs: 5, md: 6 }, bgcolor: '#092F50', color: '#fff' }}>
      <Container maxWidth="xl">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)',
            },
            gap: { xs: 3, md: 2 },
            textAlign: 'center',
          }}
        >
          {stats.map((stat) => (
            <Box key={stat.label}>
              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '1.7rem', md: '2.2rem' },
                }}
              >
                {stat.value}
              </Typography>

              <Typography
                variant="body2"
                sx={{ color: '#B9C9D6', mt: 0.5 }}
              >
                {stat.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default PortalStats;
