import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  AnalyticsOutlined,
  BookOutlined,
  DashboardOutlined,
  FolderOutlined,
  MenuOutlined,
  NotificationsOutlined,
  PeopleOutlined,
  QuizOutlined,
  SettingsOutlined,
  SmartToyOutlined,
} from '@mui/icons-material';
import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const drawerWidth = 250;
const collapsedWidth = 72;

const groups = [
  { label: 'Overview', items: [{ label: 'Dashboard', path: '/trainer/dashboard', icon: <DashboardOutlined /> }] },
  {
    label: 'Teaching',
    items: [
      { label: 'My Courses', path: '/trainer/courses', icon: <BookOutlined /> },
      { label: 'Trainees', path: '/trainer/trainees', icon: <PeopleOutlined /> },
      { label: 'Questionnaires', path: '/trainer/questionnaires', icon: <QuizOutlined /> },
      { label: 'Resource Library', path: '/trainer/library', icon: <FolderOutlined /> },
    ],
  },
  {
    label: 'Insights & AI',
    items: [
      { label: 'Analytics', path: '/trainer/analytics', icon: <AnalyticsOutlined /> },
      { label: 'AI Assistant', path: '/trainer/ai', icon: <SmartToyOutlined />, isNew: true },
    ],
  },
];

const isActive = (pathname: string, path: string) =>
  pathname === path ||
  (path === '/trainer/courses' && pathname.startsWith('/trainer/courses/')) ||
  (path === '/trainer/trainees' && pathname.startsWith('/trainer/trainees/'));

const TrainerLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const handleNavigation = (path: string) => { navigate(path); setMobileOpen(false); };

  const drawerContent = (isMobile = false) => (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ px: isMobile || !collapsed ? 2.5 : 1, py: 2, minHeight: 72, display: 'flex', alignItems: 'center', justifyContent: isMobile || !collapsed ? 'flex-start' : 'center' }}>
        {isMobile || !collapsed ? <Box><Typography variant="h6" color="primary" noWrap sx={{ fontWeight: 800 }}>CAPACITY CONNECT</Typography><Typography variant="caption" color="text.secondary">Trainer Portal</Typography></Box> : <Typography variant="h6" color="primary" sx={{ fontWeight: 800 }}>CC</Typography>}
      </Box>

      <List sx={{ px: 1, py: 1, flex: 1, overflowY: 'auto' }}>
        {groups.map((group) => (
          <Box key={group.label} sx={{ mb: 1.5 }}>
            {(!collapsed || isMobile) && <Typography sx={{ px: 2, py: .75, color: 'text.secondary', fontSize: '.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.08em' }}>{group.label}</Typography>}
            {group.items.map((item) => (
              <Tooltip key={item.path} title={collapsed && !isMobile ? item.label : ''} placement="right">
                <ListItemButton selected={isActive(location.pathname, item.path)} onClick={() => handleNavigation(item.path)} sx={{ minHeight: 46, px: collapsed && !isMobile ? 1.5 : 2, justifyContent: collapsed && !isMobile ? 'center' : 'flex-start', borderRadius: 2, mb: .35 }}>
                  <ListItemIcon sx={{ minWidth: collapsed && !isMobile ? 0 : 40, justifyContent: 'center' }}>{item.icon}</ListItemIcon>
                  {(!collapsed || isMobile) && <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 1 }}><ListItemText primary={item.label} />{item.isNew && <Box component="span" sx={{ bgcolor: '#ef4444', color: '#fff', fontSize: 9, fontWeight: 800, px: .7, py: .25, borderRadius: 1 }}>NEW</Box>}</Box>}
                </ListItemButton>
              </Tooltip>
            ))}
          </Box>
        ))}
      </List>

      <Box sx={{ p: 1, borderTop: '1px solid', borderColor: 'divider' }}>
        <Tooltip title={collapsed && !isMobile ? 'Settings' : ''} placement="right">
          <ListItemButton selected={location.pathname === '/trainer/settings'} onClick={() => handleNavigation('/trainer/settings')} sx={{ minHeight: 48, px: collapsed && !isMobile ? 1.5 : 2, justifyContent: collapsed && !isMobile ? 'center' : 'flex-start', borderRadius: 2 }}>
            <ListItemIcon sx={{ minWidth: collapsed && !isMobile ? 0 : 40, justifyContent: 'center' }}><SettingsOutlined /></ListItemIcon>
            {(!collapsed || isMobile) && <ListItemText primary="Settings" />}
          </ListItemButton>
        </Tooltip>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="fixed" color="inherit" elevation={0} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, width: { xs: '100%', md: `calc(100% - ${collapsed ? collapsedWidth : drawerWidth}px)` }, ml: { xs: 0, md: `${collapsed ? collapsedWidth : drawerWidth}px` }, transition: 'width .2s, margin-left .2s', borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={() => setCollapsed((value) => !value)} sx={{ mr: 2, display: { xs: 'none', md: 'inline-flex' } }}><MenuOutlined /></IconButton>
          <IconButton color="inherit" edge="start" onClick={() => setMobileOpen(true)} sx={{ mr: 2, display: { xs: 'inline-flex', md: 'none' } }}><MenuOutlined /></IconButton>
          <Typography variant="h6" color="primary" noWrap sx={{ flexGrow: 1, fontWeight: 700 }}>Trainer Portal</Typography>
          <IconButton onClick={() => navigate('/trainer/notifications')} aria-label="Notifications"><NotificationsOutlined /></IconButton>
          <IconButton onClick={() => navigate('/trainer/settings')} aria-label="Settings"><SettingsOutlined /></IconButton>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: collapsed ? collapsedWidth : drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer variant="temporary" open={mobileOpen} onClose={() => setMobileOpen(false)} ModalProps={{ keepMounted: true }} sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' } }}>{drawerContent(true)}</Drawer>
        <Drawer variant="permanent" open sx={{ display: { xs: 'none', md: 'block' }, '& .MuiDrawer-paper': { width: collapsed ? collapsedWidth : drawerWidth, boxSizing: 'border-box', overflowX: 'hidden', transition: 'width .2s' } }}>{drawerContent()}</Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, minWidth: 0 }}><Toolbar /><Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}><Outlet /></Box></Box>
    </Box>
  );
};

export default TrainerLayout;
