import {
  AppBar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  AssessmentOutlined,
  BarChartOutlined,
  CampaignOutlined,
  DashboardOutlined,
  EmojiEventsOutlined,
  GroupOutlined,
  LibraryBooksOutlined,
  MenuOutlined,
  PsychologyOutlined,
  VerifiedOutlined,
  PersonAddAlt1Outlined,
  SecurityOutlined,
  SettingsOutlined,
} from '@mui/icons-material';
import { useState } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';

const drawerWidth = 250;
const collapsedWidth = 72;

const groups = [
  { label: 'Overview', items: [{ label: 'Dashboard', path: '/admin/dashboard', icon: <DashboardOutlined /> }] },
  {
    label: 'Operations',
    items: [
      { label: 'Users', path: '/admin/users', icon: <GroupOutlined /> },
      { label: 'Trainer Applications', path: '/admin/trainer-applications', icon: <PersonAddAlt1Outlined /> },
      { label: 'Courses', path: '/admin/courses', icon: <LibraryBooksOutlined /> },
      { label: 'Assessments', path: '/admin/assessments', icon: <AssessmentOutlined /> },
    ],
  },
  {
    label: 'Governance & Insights',
    items: [
      { label: 'Certifications', path: '/admin/certifications', icon: <VerifiedOutlined /> },
      { label: 'Analytics', path: '/admin/analytics', icon: <BarChartOutlined /> },
      { label: 'Competency Mapping', path: '/admin/competency-mapping', icon: <PsychologyOutlined /> },
      { label: 'Announcements', path: '/admin/announcements', icon: <CampaignOutlined /> },
      { label: 'Achievements', path: '/admin/achievements', icon: <EmojiEventsOutlined /> },
      { label: 'Audit Logs', path: '/admin/audit-logs', icon: <SecurityOutlined /> },
    ],
  },
];

const AdminLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar sx={{ minHeight: '72px !important', px: 2 }}>
        {!collapsed || isMobile ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              minWidth: 0,
            }}
          >
            <Box
              component="img"
              src="/logo/saksham-logo.jpeg"
              alt="Saksham"
              sx={{
                width: 42,
                height: 42,
                objectFit: 'contain',
                flexShrink: 0,
              }}
            />

            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="subtitle1"
                color="primary"
                noWrap
                sx={{
                  fontWeight: 900,
                  lineHeight: 1,
                  letterSpacing: '0.025em',
                }}
              >
                SAKSHAM
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
                noWrap
                sx={{
                  display: 'block',
                  mt: 0.45,
                  fontWeight: 700,
                  fontSize: '0.62rem',
                  letterSpacing: '0.045em',
                  lineHeight: 1,
                }}
              >
                CAPACITY CONNECT
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box
            component="img"
            src="/logo/saksham-logo.jpeg"
            alt="Saksham"
            sx={{
              width: 42,
              height: 42,
              objectFit: 'contain',
            }}
          />
        )}
      </Toolbar>
      <Divider />
      <List sx={{ px: 1, py: 1.5, flex: 1, overflowY: 'auto' }}>
        {groups.map((group) => (
          <Box key={group.label} sx={{ mb: 1.5 }}>
            {(!collapsed || isMobile) && <Typography sx={{ px: 2, py: .75, color: 'text.secondary', fontSize: '.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.08em' }}>{group.label}</Typography>}
            {group.items.map((item) => {
              const active = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
              return <Tooltip key={item.path} title={collapsed && !isMobile ? item.label : ''} placement="right"><ListItemButton selected={active} onClick={() => { navigate(item.path); if (isMobile) setMobileOpen(false); }} sx={{ minHeight: 46, mb: .35, borderRadius: 2, justifyContent: collapsed && !isMobile ? 'center' : 'flex-start', px: collapsed && !isMobile ? 1.5 : 2 }}><ListItemIcon sx={{ minWidth: collapsed && !isMobile ? 0 : 40, justifyContent: 'center' }}>{item.icon}</ListItemIcon>{(!collapsed || isMobile) && <ListItemText primary={item.label} />}</ListItemButton></Tooltip>;
            })}
          </Box>
        ))}
      </List>
      <Divider />
      <List sx={{ p: 1 }}>
        <Tooltip title={collapsed && !isMobile ? 'Settings' : ''} placement="right"><ListItemButton selected={location.pathname === '/admin/settings'} onClick={() => navigate('/admin/settings')} sx={{ minHeight: 48, borderRadius: 2, justifyContent: collapsed && !isMobile ? 'center' : 'flex-start', px: collapsed && !isMobile ? 1.5 : 2 }}><ListItemIcon sx={{ minWidth: collapsed && !isMobile ? 0 : 40, justifyContent: 'center' }}><SettingsOutlined /></ListItemIcon>{(!collapsed || isMobile) && <ListItemText primary="Settings" />}</ListItemButton></Tooltip>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="fixed" color="inherit" elevation={0} sx={{ width: { md: `calc(100% - ${collapsed ? collapsedWidth : drawerWidth}px)` }, ml: { md: `${collapsed ? collapsedWidth : drawerWidth}px` }, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
        <Toolbar sx={{ minHeight: '72px !important' }}>
          <IconButton edge="start" onClick={() => { if (isMobile) setMobileOpen(true); else setCollapsed((value) => !value); }} sx={{ mr: 2 }}><MenuOutlined /></IconButton>
          <Box sx={{ flexGrow: 1 }}><Typography variant="h6" sx={{ fontWeight: 700 }}>Administration</Typography><Typography variant="caption" color="text.secondary">Capacity Building & Learning Management Portal</Typography></Box>
          <IconButton onClick={() => navigate('/admin/settings')} aria-label="Settings"><SettingsOutlined /></IconButton>
        </Toolbar>
      </AppBar>
      <Box component="nav" sx={{ width: { md: collapsed ? collapsedWidth : drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer variant={isMobile ? 'temporary' : 'permanent'} open={isMobile ? mobileOpen : true} onClose={() => setMobileOpen(false)} ModalProps={{ keepMounted: true }} sx={{ '& .MuiDrawer-paper': { width: isMobile ? drawerWidth : collapsed ? collapsedWidth : drawerWidth, boxSizing: 'border-box', borderRight: '1px solid', borderColor: 'divider', overflowX: 'hidden' } }}>{drawerContent}</Drawer>
      </Box>
      <Box component="main" sx={{ flexGrow: 1, minWidth: 0, pt: '72px', px: { xs: 2, sm: 3, md: 4 }, pb: 4 }}><Outlet /></Box>
    </Box>
  );
};

export default AdminLayout;
