import { Box, Container, Typography } from '@mui/material';

const stats = [
  ['100+', 'Learning Resources'],
  ['50+', 'Training Programmes'],
  ['3', 'Portal Roles'],
  ['24×7', 'Digital Access'],
];

const PortalStats = () => (
  <Box
    sx={{
      position: 'relative',
      overflow: 'hidden',
      py: { xs: 7, md: 9 },
      bgcolor: '#082F52',
      color: '#fff',
    }}
  >
    <Box
      sx={{
        position: 'absolute',
        width: 360,
        height: 360,
        borderRadius: '50%',
        top: -210,
        right: -100,
        bgcolor: 'rgba(72,156,205,.10)',
      }}
    />

    <Box
      sx={{
        position: 'absolute',
        width: 260,
        height: 260,
        borderRadius: '50%',
        bottom: -190,
        left: -100,
        bgcolor: 'rgba(255,255,255,.04)',
      }}
    />

    <Container maxWidth="xl" sx={{ position: 'relative' }}>
      <Box sx={{ textAlign: 'center', maxWidth: 650, mx: 'auto', mb: { xs: 5, md: 6 } }}>
        <Typography
          sx={{
            color: '#8CC7E8',
            fontWeight: 800,
            fontSize: '.76rem',
            letterSpacing: '.12em',
          }}
        >
          CAPACITY CONNECT
        </Typography>

        <Typography sx={{ mt: 1.2, fontWeight: 800, fontSize: { xs: '1.55rem', md: '2rem' }, letterSpacing: '-.02em' }}>
          A connected platform for continuous learning
        </Typography>

        <Typography variant="body2" sx={{ mt: 1.2, color: '#B9C9D6', lineHeight: 1.7 }}>
          Supporting structured capacity building and professional development.
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(2,1fr)', md: 'repeat(4,1fr)' },
          borderTop: '1px solid rgba(255,255,255,.14)',
          borderBottom: '1px solid rgba(255,255,255,.14)',
        }}
      >
        {stats.map(([value, label], index) => (
          <Box
            key={label}
            sx={{
              textAlign: 'center',
              py: { xs: 3, md: 4 },
              px: 2,
              borderRight: {
                xs: index % 2 === 0 ? '1px solid rgba(255,255,255,.14)' : 'none',
                md: index < 3 ? '1px solid rgba(255,255,255,.14)' : 'none',
              },
              borderBottom: {
                xs: index < 2 ? '1px solid rgba(255,255,255,.14)' : 'none',
                md: 'none',
              },
            }}
          >
            <Typography sx={{ fontWeight: 800, fontSize: { xs: '1.9rem', md: '2.5rem' } }}>
              {value}
            </Typography>

            <Typography variant="body2" sx={{ mt: .6, color: '#B9C9D6' }}>
              {label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Container>
  </Box>
);

export default PortalStats;
