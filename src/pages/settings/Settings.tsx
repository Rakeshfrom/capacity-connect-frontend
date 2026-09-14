import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Typography,
} from '@mui/material';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useThemeMode } from '../../context/ThemeModeContext';
import keycloak from '../../services/keycloak';
import { logoutCustomAuth } from '../../services/auth';
import GTranslate from '../../components/GTranslate';

const roleLabel = (role?: string) => {
  if (role === 'ADMIN') return 'Administrator';
  if (role === 'TRAINER') return 'Trainer';
  return 'Trainee';
};

const Settings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { mode, setMode } = useThemeMode();

  const role = user?.role === 'ADMIN' || user?.role === 'TRAINER' ? user.role : 'TRAINEE';
  const profilePath =
    role === 'ADMIN'
      ? '/admin/users'
      : role === 'TRAINER'
        ? '/trainer/profile'
        : '/trainee/profile';

  const handleLogout = () => {
    logoutCustomAuth();
    if (keycloak.authenticated && keycloak.idToken) {
      keycloak.logout({ redirectUri: `${window.location.origin}/` });
      return;
    }
    window.location.replace('/');
  };

  const fullName =
    [user?.firstName, user?.lastName].filter(Boolean).join(' ') ||
    user?.username ||
    'Account';

  const sectionSx = {
    border: '1px solid',
    borderColor: 'divider',
    borderRadius: 3,
  };

  return (
    <Box sx={{ maxWidth: 980, mx: 'auto', py: { xs: 1, md: 2 } }}>
      <Box sx={{ display: 'grid', gap: 3 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2,
                bgcolor: 'action.hover',
                display: 'grid',
                placeItems: 'center',
                flexShrink: 0,
              }}
            >
              <SettingsOutlinedIcon color="primary" />
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>
                Settings
              </Typography>
              <Typography color="text.secondary">
                Manage your account, appearance and preferences.
              </Typography>
            </Box>
          </Box>
        </Box>

        <Card elevation={0} sx={sectionSx}>
          <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between',
                alignItems: { xs: 'flex-start', sm: 'center' },
                gap: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    color: '#fff',
                    display: 'grid',
                    placeItems: 'center',
                    fontWeight: 800,
                    flexShrink: 0,
                  }}
                >
                  {fullName.slice(0, 1).toUpperCase()}
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 800 }}>{fullName}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user?.email || user?.username}
                  </Typography>
                  <Chip label={roleLabel(user?.role)} size="small" sx={{ mt: 1 }} />
                </Box>
              </Box>
              <Button
                variant="outlined"
                startIcon={<PersonOutlineOutlinedIcon />}
                onClick={() => navigate(profilePath)}
                sx={{ textTransform: 'none', borderRadius: 2 }}
              >
                Open profile
              </Button>
            </Box>
          </CardContent>
        </Card>

        <Card elevation={0} sx={sectionSx}>
          <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
            <Typography sx={{ fontWeight: 800, mb: 0.5 }}>Appearance</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
              Choose how CAPACITY CONNECT looks on this device.
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
                gap: 1.5,
              }}
            >
              <Button
                fullWidth
                onClick={() => setMode('light')}
                variant={mode === 'light' ? 'contained' : 'outlined'}
                startIcon={<LightModeOutlinedIcon />}
                color="inherit"
                sx={{
                  py: 1.4,
                  px: 1.75,
                  justifyContent: 'flex-start',
                  textTransform: 'none',
                  borderRadius: 2,
                  minHeight: 64,
                  fontWeight: 700,
                  color: mode === 'light' ? '#173B5E' : '#DCE7EE',
                  borderColor: mode === 'light' ? '#B8CBD8' : '#3F5563',
                  bgcolor: mode === 'light' ? '#F2F7FA' : 'rgba(255,255,255,0.02)',
                  '&:hover': {
                    bgcolor: mode === 'light' ? '#E8F1F6' : 'rgba(255,255,255,0.06)',
                    borderColor: mode === 'light' ? '#8FAABD' : '#587080',
                  },
                  '& .MuiButton-startIcon': { color: 'inherit' },
                }}
              >
                <Box sx={{ textAlign: 'left' }}>
                  <Box component="span" sx={{ display: 'block', fontWeight: 800 }}>
                    Light
                  </Box>
                  <Box component="span" sx={{ display: 'block', fontSize: 12, mt: 0.25, opacity: 0.78, fontWeight: 500 }}>
                    Clean and bright
                  </Box>
                </Box>
              </Button>
              <Button
                fullWidth
                onClick={() => setMode('dark')}
                variant={mode === 'dark' ? 'contained' : 'outlined'}
                startIcon={<DarkModeOutlinedIcon />}
                color="inherit"
                sx={{
                  py: 1.4,
                  px: 1.75,
                  justifyContent: 'flex-start',
                  textTransform: 'none',
                  borderRadius: 2,
                  minHeight: 64,
                  fontWeight: 700,
                  color: mode === 'dark' ? '#F4F8FB' : '#173B5E',
                  borderColor: mode === 'dark' ? '#4C6573' : '#B8CBD8',
                  bgcolor: mode === 'dark' ? '#263640' : '#FFFFFF',
                  boxShadow: mode === 'dark' ? '0 4px 14px rgba(0,0,0,0.18)' : 'none',
                  '&:hover': {
                    bgcolor: mode === 'dark' ? '#2D414C' : '#F2F7FA',
                    borderColor: mode === 'dark' ? '#607B8A' : '#8FAABD',
                  },
                  '& .MuiButton-startIcon': { color: 'inherit' },
                }}
              >
                <Box sx={{ textAlign: 'left' }}>
                  <Box component="span" sx={{ display: 'block', fontWeight: 800 }}>
                    Dark
                  </Box>
                  <Box component="span" sx={{ display: 'block', fontSize: 12, mt: 0.25, opacity: 0.82, fontWeight: 500 }}>
                    Low-light friendly
                  </Box>
                </Box>
              </Button>
            </Box>
          </CardContent>
        </Card>

        <Card elevation={0} sx={sectionSx}>
          <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 0.5 }}>
              <LanguageOutlinedIcon color="primary" />
              <Typography sx={{ fontWeight: 800 }}>Language</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Select the language used across supported portal content.
            </Typography>
            <Box sx={{ width: 110 }}>
              <GTranslate />
            </Box>
          </CardContent>
        </Card>

        <Card elevation={0} sx={sectionSx}>
          <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 0.5 }}>
              <SecurityOutlinedIcon color="primary" />
              <Typography sx={{ fontWeight: 800 }}>Account & security</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Authentication is handled through CAPACITY CONNECT identity services.
            </Typography>
          </CardContent>
        </Card>

        <Divider />

        <Card elevation={0} sx={sectionSx}>
          <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between',
                alignItems: { xs: 'flex-start', sm: 'center' },
                gap: 2,
              }}
            >
              <Box>
                <Typography sx={{ fontWeight: 800 }}>Sign out</Typography>
                <Typography variant="body2" color="text.secondary">
                  End your current CAPACITY CONNECT session.
                </Typography>
              </Box>
              <Button
                variant="outlined"
                color="error"
                startIcon={<LogoutOutlinedIcon />}
                onClick={handleLogout}
                sx={{ textTransform: 'none', borderRadius: 2 }}
              >
                Logout
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Settings;
