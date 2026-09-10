import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  Link,
  Toolbar,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { NavLink, Outlet } from 'react-router-dom';
import GTranslate from '../components/GTranslate';

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Courses', path: '/courses' },
  { label: 'Announcements', path: '/announcements' },
  { label: 'Features', path: '/#features' },
];

const PublicLayout = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#F6F9FC',
      }}
    >
      {/* Government identity bar */}
      <Box
        sx={{
          bgcolor: '#073B66',
          color: '#fff',
          borderBottom: '1px solid rgba(255,255,255,0.15)',
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              minHeight: 42,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
              <Box
                component="img"
                src="/logo/india-emblem.png"
                alt="Government of India emblem"
                sx={{ width: 22, height: 28, objectFit: 'contain' }}
              />
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 600,
                  letterSpacing: '0.02em',
                }}
              >
                Government of India
              </Typography>
            </Box>

            <Typography
              variant="caption"
              sx={{
                display: { xs: 'none', sm: 'block' },
                opacity: 0.9,
              }}
            >
              Ministry of Earth Sciences • India Meteorological Department
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Main navigation */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: '#fff',
          color: '#173B5E',
          borderBottom: '1px solid #DCE7EF',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar
            disableGutters
            sx={{
              minHeight: { xs: 72, md: 88 },
              gap: 2,
            }}
          >
            <Box
              component={NavLink}
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                textDecoration: 'none',
                color: 'inherit',
                mr: { xs: 'auto', md: 5 },
              }}
            >
              <Box
                component="img"
                src="/logo/imd-logo.webp"
                alt="India Meteorological Department"
                sx={{
                  width: { xs: 48, md: 58 },
                  height: { xs: 48, md: 58 },
                  objectFit: 'contain',
                }}
              />

              <Box>
                <Typography
                  sx={{
                    fontSize: { xs: '1.15rem', md: '1.45rem' },
                    fontWeight: 800,
                    letterSpacing: '0.025em',
                    lineHeight: 1.1,
                    color: '#123F63',
                  }}
                >
                  CAPACITY CONNECT
                </Typography>

                <Typography
                  sx={{
                    mt: 0.5,
                    fontSize: { xs: '0.62rem', md: '0.7rem' },
                    color: '#64798B',
                    fontWeight: 500,
                  }}
                >
                  Digital Capacity Building & Learning Management Portal
                </Typography>
              </Box>
            </Box>

            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                gap: 0.5,
                flexGrow: 1,
              }}
            >
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  component={NavLink}
                  to={item.path}
                  sx={{
                    px: 1.8,
                    py: 1.15,
                    borderRadius: 1.5,
                    color: '#36546D',
                    fontWeight: 650,
                    textTransform: 'none',
                    '&.active': {
                      color: '#075B91',
                      bgcolor: '#EAF4FB',
                    },
                    '&:hover': {
                      bgcolor: '#F2F7FA',
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>

            <Box
              sx={{
                display: { xs: 'none', sm: 'flex' },
                alignItems: 'center',
                gap: 1.5,
                ml: 'auto',
              }}
            >
              <GTranslate />

              <Button
                component={NavLink}
                to="/signup"
                variant="outlined"
                sx={{
                  borderColor: '#075B91',
                  color: '#075B91',
                  px: 2.2,
                  py: 1.05,
                  borderRadius: 1.5,
                  textTransform: 'none',
                  fontWeight: 700,
                  '&:hover': {
                    borderColor: '#064A75',
                    bgcolor: '#F2F7FA',
                  },
                }}
              >
                Sign Up
              </Button>

              <Button
                component={NavLink}
                to="/login"
                variant="contained"
              sx={{
                display: { xs: 'none', sm: 'inline-flex' },
                bgcolor: '#075B91',
                px: 3,
                py: 1.2,
                borderRadius: 1.5,
                textTransform: 'none',
                fontWeight: 700,
                boxShadow: '0 5px 14px rgba(7,91,145,0.18)',
                '&:hover': {
                  bgcolor: '#064A75',
                  boxShadow: '0 7px 18px rgba(7,91,145,0.24)',
                },
              }}
            >
              Login
            </Button>
            </Box>

            <IconButton
              sx={{
                display: { xs: 'flex', md: 'none' },
                color: '#173B5E',
              }}
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          bgcolor: '#062E4F',
          color: '#fff',
          mt: 8,
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              py: 6,
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1.8fr 1fr 1fr' },
              gap: { xs: 4, md: 7 },
            }}
          >
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Box
                  component="img"
                  src="/logo/india-emblem.png"
                  alt="Government of India"
                  sx={{ width: 30, height: 38, objectFit: 'contain' }}
                />
                <Box>
                  <Typography sx={{ fontWeight: 800, letterSpacing: '0.02em' }}>
                    CAPACITY CONNECT
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#AFC4D4' }}>
                    Ministry of Earth Sciences
                  </Typography>
                </Box>
              </Box>

              <Typography
                variant="body2"
                sx={{
                  color: '#B8C9D7',
                  maxWidth: 560,
                  lineHeight: 1.8,
                }}
              >
                A digital capacity building and learning management platform
                supporting structured training, assessment, certification and
                continuous professional development.
              </Typography>
            </Box>

            <Box>
              <Typography sx={{ fontWeight: 700, mb: 1.5 }}>
                Quick Links
              </Typography>

              {navItems.map((item) => (
                <Link
                  key={item.path}
                  component={NavLink}
                  to={item.path}
                  underline="none"
                  sx={{
                    display: 'block',
                    color: '#B8C9D7',
                    mb: 1,
                    '&:hover': { color: '#fff' },
                  }}
                >
                  {item.label}
                </Link>
              ))}

              <Link
                component={NavLink}
                to="/certificate-verification"
                underline="none"
                sx={{
                  display: 'block',
                  color: '#B8C9D7',
                  mt: 1.5,
                  '&:hover': { color: '#fff' },
                }}
              >
                Verify Certificate
              </Link>
            </Box>

            <Box>
              <Typography sx={{ fontWeight: 700, mb: 1.5 }}>
                Platform
              </Typography>

              <Typography variant="body2" sx={{ color: '#B8C9D7', mb: 1 }}>
                Secure role-based access
              </Typography>

              <Typography variant="body2" sx={{ color: '#B8C9D7', mb: 1 }}>
                Trainee • Trainer • Admin
              </Typography>

              <Typography variant="body2" sx={{ color: '#B8C9D7' }}>
                Learning • Assessment • Certification
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ borderColor: 'rgba(255,255,255,0.14)' }} />

          <Box
            sx={{
              py: 2,
              display: 'flex',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 1,
            }}
          >
            <Typography variant="caption" sx={{ color: '#9FB5C6' }}>
              © 2026 CAPACITY CONNECT
            </Typography>

            <Typography variant="caption" sx={{ color: '#9FB5C6' }}>
              Government of India • Ministry of Earth Sciences • IMD
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default PublicLayout;
