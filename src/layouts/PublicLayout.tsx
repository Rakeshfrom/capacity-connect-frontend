import { useState } from 'react';
import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  InputAdornment,
  Link,
  Menu,
  MenuItem,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import AccessibilityNewRoundedIcon from '@mui/icons-material/AccessibilityNewRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import GTranslate from '../components/GTranslate';

const PublicLayout = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [learningAnchor, setLearningAnchor] = useState<null | HTMLElement>(null);
  const [resourcesAnchor, setResourcesAnchor] = useState<null | HTMLElement>(null);
  const [assessmentAnchor, setAssessmentAnchor] = useState<null | HTMLElement>(null);
  const [competencyAnchor, setCompetencyAnchor] = useState<null | HTMLElement>(null);

  const submitSearch = () => {
    const value = search.trim();
    navigate(value ? `/search?q=${encodeURIComponent(value)}` : '/search');
  };

  const navButtonSx = {
    px: 1.35,
    py: 1.05,
    borderRadius: 1.5,
    color: '#36546D',
    fontWeight: 650,
    textTransform: 'none',
    '&:hover': {
      bgcolor: '#F2F7FA',
      color: '#075B91',
    },
  };

  const dropdownButtonSx = {
    ...navButtonSx,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 0.2,
  };

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
          borderBottom: '1px solid rgba(255,255,255,0.14)',
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              minHeight: 38,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                component="img"
                src="/logo/india-emblem.png"
                alt="Government of India emblem"
                sx={{
                  width: 18,
                  height: 25,
                  objectFit: 'contain',
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 650,
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
                opacity: 0.92,
              }}
            >
              Ministry of Earth Sciences • India Meteorological Department
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Main institutional header */}
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
              minHeight: { xs: 72, md: 82 },
              gap: { xs: 1, md: 2 },
            }}
          >
            {/* Brand */}
            <Box
              component={NavLink}
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.25,
                textDecoration: 'none',
                color: 'inherit',
                flexShrink: 0,
              }}
            >
              <Box
                component="img"
                src="/logo/imd-logo.webp"
                alt="India Meteorological Department"
                sx={{
                  width: { xs: 46, md: 52 },
                  height: { xs: 46, md: 52 },
                  objectFit: 'contain',
                }}
              />

              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <Typography
                  sx={{
                    fontSize: { sm: '1.08rem', md: '1.3rem' },
                    fontWeight: 800,
                    letterSpacing: '0.02em',
                    lineHeight: 1.1,
                    color: '#123F63',
                  }}
                >
                  CAPACITY CONNECT
                </Typography>

                <Typography
                  sx={{
                    mt: 0.35,
                    fontSize: { sm: '0.58rem', md: '0.66rem' },
                    color: '#64798B',
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                  }}
                >
                  Digital Capacity Building & Learning Management Portal
                </Typography>
              </Box>
            </Box>

            {/* Search */}
            <Box
              component="form"
              onSubmit={(event) => {
                event.preventDefault();
                submitSearch();
              }}
              sx={{
                display: { xs: 'none', lg: 'flex' },
                alignItems: 'center',
                ml: { md: 2, xl: 4 },
                width: { lg: 190, xl: 245 },
              }}
            >
              <TextField
                fullWidth
                size="small"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search learning content"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchRoundedIcon
                          sx={{ color: '#6D8495', fontSize: 19 }}
                        />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    bgcolor: '#F7FAFC',
                    fontSize: '0.8rem',
                    '& fieldset': {
                      borderColor: '#D7E2EA',
                    },
                    '&:hover fieldset': {
                      borderColor: '#AFC4D2',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#075B91',
                    },
                  },
                }}
              />
            </Box>

            {/* Desktop navigation */}
            <Box
              sx={{
                display: { xs: 'none', xl: 'flex' },
                alignItems: 'center',
                ml: 'auto',
                gap: 0.15,
              }}
            >
              <Button component={NavLink} to="/" sx={navButtonSx}>
                Home
              </Button>

              <Button component={NavLink} to="/about" sx={navButtonSx}>
                About
              </Button>

              <Button
                onClick={(event) => setLearningAnchor(event.currentTarget)}
                sx={dropdownButtonSx}
                endIcon={<KeyboardArrowDownRoundedIcon fontSize="small" />}
              >
                Learning
              </Button>
              <Menu
                anchorEl={learningAnchor}
                open={Boolean(learningAnchor)}
                onClose={() => setLearningAnchor(null)}
              >
                <MenuItem onClick={() => navigate('/courses')}>
                  Explore Courses
                </MenuItem>
                <MenuItem onClick={() => navigate('/courses')}>
                  Learning Programmes
                </MenuItem>
              </Menu>

              <Button
                onClick={(event) => setResourcesAnchor(event.currentTarget)}
                sx={dropdownButtonSx}
                endIcon={<KeyboardArrowDownRoundedIcon fontSize="small" />}
              >
                Resources
              </Button>
              <Menu
                anchorEl={resourcesAnchor}
                open={Boolean(resourcesAnchor)}
                onClose={() => setResourcesAnchor(null)}
              >
                <MenuItem onClick={() => navigate('/login')}>
                  Digital Library
                </MenuItem>
                <MenuItem onClick={() => navigate('/login')}>
                  Trainer Resources
                </MenuItem>
              </Menu>

              <Button
                onClick={(event) => setAssessmentAnchor(event.currentTarget)}
                sx={dropdownButtonSx}
                endIcon={<KeyboardArrowDownRoundedIcon fontSize="small" />}
              >
                Assessments
              </Button>
              <Menu
                anchorEl={assessmentAnchor}
                open={Boolean(assessmentAnchor)}
                onClose={() => setAssessmentAnchor(null)}
              >
                <MenuItem onClick={() => navigate('/login')}>
                  Online Assessments
                </MenuItem>
                <MenuItem onClick={() => navigate('/login')}>
                  Assessment Results
                </MenuItem>
              </Menu>

              <Button
                onClick={(event) => setCompetencyAnchor(event.currentTarget)}
                sx={dropdownButtonSx}
                endIcon={<KeyboardArrowDownRoundedIcon fontSize="small" />}
              >
                Competencies
              </Button>
              <Menu
                anchorEl={competencyAnchor}
                open={Boolean(competencyAnchor)}
                onClose={() => setCompetencyAnchor(null)}
              >
                <MenuItem onClick={() => navigate('/login')}>
                  Competency Mapping
                </MenuItem>
                <MenuItem onClick={() => navigate('/login')}>
                  Skill Development
                </MenuItem>
              </Menu>

              <Button
                component={NavLink}
                to="/announcements"
                sx={navButtonSx}
              >
                Announcements
              </Button>
            </Box>

            {/* Utility controls */}
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                gap: 1,
                ml: { md: 'auto', xl: 1.5 },
              }}
            >
              <Button
                component={NavLink}
                to="/certificate-verification"
                sx={{
                  ...navButtonSx,
                  display: { md: 'none', xl: 'inline-flex' },
                  whiteSpace: 'nowrap',
                }}
              >
                Verify Certificate
              </Button>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.25,
                  px: 0.7,
                  border: '1px solid #D8E3EA',
                  borderRadius: 1.5,
                  color: '#496476',
                }}
                aria-label="Text size controls"
              >
                <AccessibilityNewRoundedIcon sx={{ fontSize: 17 }} />
                <Button
                  size="small"
                  sx={{
                    minWidth: 22,
                    px: 0.3,
                    color: '#496476',
                    fontSize: '0.68rem',
                    textTransform: 'none',
                  }}
                >
                  A−
                </Button>
                <Button
                  size="small"
                  sx={{
                    minWidth: 22,
                    px: 0.3,
                    color: '#496476',
                    fontSize: '0.72rem',
                    textTransform: 'none',
                  }}
                >
                  A
                </Button>
                <Button
                  size="small"
                  sx={{
                    minWidth: 22,
                    px: 0.3,
                    color: '#496476',
                    fontSize: '0.8rem',
                    textTransform: 'none',
                  }}
                >
                  A+
                </Button>
              </Box>

              <GTranslate />

              <Button
                component={NavLink}
                to="/signup"
                variant="outlined"
                sx={{
                  borderColor: '#075B91',
                  color: '#075B91',
                  px: 1.8,
                  py: 1,
                  borderRadius: 1.5,
                  textTransform: 'none',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                }}
              >
                Sign Up
              </Button>

              <Button
                component={NavLink}
                to="/login"
                variant="contained"
                sx={{
                  bgcolor: '#075B91',
                  px: 2.2,
                  py: 1,
                  borderRadius: 1.5,
                  textTransform: 'none',
                  fontWeight: 700,
                  boxShadow: '0 5px 14px rgba(7,91,145,0.18)',
                  '&:hover': {
                    bgcolor: '#064A75',
                  },
                }}
              >
                Login
              </Button>
            </Box>

            {/* Mobile */}
            <IconButton
              onClick={() => setMobileOpen((value) => !value)}
              sx={{
                display: { xs: 'flex', xl: 'none' },
                ml: 'auto',
                color: '#173B5E',
              }}
              aria-label="Open navigation menu"
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>

          {/* Tablet/mobile navigation */}
          {mobileOpen && (
            <Box
              sx={{
                display: { xs: 'block', xl: 'none' },
                pb: 2,
                borderTop: '1px solid #E4ECF1',
              }}
            >
              <Box
                component="form"
                onSubmit={(event) => {
                  event.preventDefault();
                  submitSearch();
                  setMobileOpen(false);
                }}
                sx={{ display: { xs: 'flex', lg: 'none' }, py: 2 }}
              >
                <TextField
                  fullWidth
                  size="small"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search learning content"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchRoundedIcon
                            sx={{ color: '#6D8495', fontSize: 19 }}
                          />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 0.5,
                }}
              >
                {[
                  ['Home', '/'],
                  ['About', '/about'],
                  ['Learning', '/courses'],
                  ['Resources', '/login'],
                  ['Assessments', '/login'],
                  ['Competencies', '/login'],
                  ['Announcements', '/announcements'],
                  ['Verify Certificate', '/certificate-verification'],
                  ['Sign Up', '/signup'],
                  ['Login', '/login'],
                ].map(([label, path]) => (
                  <Button
                    key={label}
                    component={NavLink}
                    to={path}
                    onClick={() => setMobileOpen(false)}
                    sx={navButtonSx}
                  >
                    {label}
                  </Button>
                ))}
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  mt: 1.5,
                  flexWrap: 'wrap',
                }}
              >
                <GTranslate />

                <Typography variant="caption" sx={{ color: '#657B8B' }}>
                  Accessibility: A− A A+
                </Typography>
              </Box>
            </Box>
          )}
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
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  mb: 2,
                }}
              >
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

              {[
                ['Home', '/'],
                ['About', '/about'],
                ['Courses', '/courses'],
                ['Announcements', '/announcements'],
              ].map(([label, path]) => (
                <Link
                  key={path}
                  component={NavLink}
                  to={path}
                  underline="none"
                  sx={{
                    display: 'block',
                    color: '#B8C9D7',
                    mb: 1,
                    '&:hover': { color: '#fff' },
                  }}
                >
                  {label}
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
