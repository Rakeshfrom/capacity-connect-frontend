import {
  AppBar, Box, Button, Container, Divider, Link, Toolbar, Typography,
} from '@mui/material';
import { NavLink, Outlet } from 'react-router-dom';

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Courses', path: '/courses' },
  { label: 'Announcements', path: '/announcements' },
];

const PublicLayout = () => (
  <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#F5F9FC' }}>
    <Box sx={{ bgcolor: '#082F52', color: '#fff', py: .65 }}>
      <Container maxWidth="xl">
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
          fontSize: '.78rem',
        }}>
          <Typography variant="body2" sx={{ fontSize: 'inherit' }}>
            Ministry of Earth Sciences | India Meteorological Department
          </Typography>
          <Typography variant="body2" sx={{ fontSize: 'inherit', display: { xs: 'none', sm: 'block' } }}>
            Government of India
          </Typography>
        </Box>
      </Container>
    </Box>

    <AppBar position="sticky" elevation={0} sx={{
      bgcolor: 'rgba(255,255,255,.96)',
      color: '#173B5E',
      borderBottom: '1px solid #DCE6ED',
      backdropFilter: 'blur(10px)',
    }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: { xs: 68, md: 76 } }}>
          <Box
            component={NavLink}
            to="/"
            sx={{
              textDecoration: 'none',
              color: 'inherit',
              mr: { xs: 2, md: 6 },
              display: 'flex',
              flexDirection: 'column',
              minWidth: 'max-content',
            }}
          >
            <Typography sx={{
              fontSize: { xs: '1.18rem', md: '1.5rem' },
              fontWeight: 900,
              letterSpacing: '.025em',
              lineHeight: 1.1,
            }}>
              CAPACITY CONNECT
            </Typography>
            <Typography sx={{ fontSize: '.66rem', color: '#63798A', mt: .45 }}>
              Digital Capacity Building & Learning Management Portal
            </Typography>
          </Box>

          <Box sx={{
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            gap: .5,
            flexGrow: 1,
          }}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                component={NavLink}
                to={item.path}
                sx={{
                  px: 1.7,
                  py: 1,
                  color: '#36546D',
                  fontWeight: 650,
                  textTransform: 'none',
                  borderRadius: 1.5,
                  '&.active': {
                    color: '#0B5A91',
                    bgcolor: '#EEF6FC',
                  },
                  '&:hover': { bgcolor: '#F2F7FA' },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          <Button
            component={NavLink}
            to="/login"
            variant="contained"
            sx={{
              ml: 'auto',
              px: { xs: 2, md: 2.6 },
              py: 1,
              bgcolor: '#0B5A91',
              textTransform: 'none',
              fontWeight: 700,
              borderRadius: 1.5,
              boxShadow: '0 4px 12px rgba(11,90,145,.18)',
              '&:hover': { bgcolor: '#084873' },
            }}
          >
            Login
          </Button>
        </Toolbar>
      </Container>
    </AppBar>

    <Box component="main" sx={{ flexGrow: 1 }}>
      <Outlet />
    </Box>

    <Box component="footer" sx={{ bgcolor: '#082F52', color: '#fff', mt: 0 }}>
      <Container maxWidth="xl">
        <Box sx={{
          py: { xs: 5, md: 6 },
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 1fr' },
          gap: 5,
        }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
              CAPACITY CONNECT
            </Typography>
            <Typography variant="body2" sx={{
              color: '#B9C9D6',
              maxWidth: 520,
              lineHeight: 1.75,
            }}>
              A digital capacity building and learning management portal
              supporting structured training, assessment and professional
              development.
            </Typography>
          </Box>

          <Box>
            <Typography sx={{ fontWeight: 800, mb: 1.5 }}>Quick Links</Typography>
            {navItems.map((item) => (
              <Link
                key={item.path}
                component={NavLink}
                to={item.path}
                underline="none"
                sx={{ display: 'block', color: '#B9C9D6', mb: 1, '&:hover': { color: '#fff' } }}
              >
                {item.label}
              </Link>
            ))}
            <Link
              component={NavLink}
              to="/certificate-verification"
              underline="none"
              sx={{ display: 'block', color: '#B9C9D6', '&:hover': { color: '#fff' } }}
            >
              Verify Certificate
            </Link>
          </Box>

          <Box>
            <Typography sx={{ fontWeight: 800, mb: 1.5 }}>Portal</Typography>
            <Typography variant="body2" sx={{ color: '#B9C9D6', mb: 1 }}>
              Secure role-based access
            </Typography>
            <Typography variant="body2" sx={{ color: '#B9C9D6' }}>
              Trainee • Trainer • Admin
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ borderColor: 'rgba(255,255,255,.14)' }} />

        <Box sx={{
          py: 2,
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 1,
        }}>
          <Typography variant="caption" sx={{ color: '#AFC0CD' }}>
            © 2026 CAPACITY CONNECT
          </Typography>
          <Typography variant="caption" sx={{ color: '#AFC0CD' }}>
            Ministry of Earth Sciences • Government of India
          </Typography>
        </Box>
      </Container>
    </Box>
  </Box>
);

export default PublicLayout;
