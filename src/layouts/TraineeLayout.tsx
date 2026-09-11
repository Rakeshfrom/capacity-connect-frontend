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
  AssessmentOutlined,
  BookOutlined,
  DashboardOutlined,
  FeedbackOutlined,
  FolderOutlined,
  LogoutOutlined,
  MenuOutlined,
  NotificationsOutlined,
  PersonOutlined,
  WorkspacePremiumOutlined,
  SmartToyOutlined,
} from '@mui/icons-material';
import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import keycloak from '../services/keycloak';

const drawerWidth = 250;
const collapsedWidth = 72;

const menuItems = [
  { label: 'Dashboard', path: '/trainee/dashboard', icon: <DashboardOutlined /> },
  { label: 'My Profile', path: '/trainee/profile', icon: <PersonOutlined /> },
  { label: 'My Courses', path: '/trainee/courses', icon: <BookOutlined /> },
  { label: 'Assessments', path: '/trainee/assessments', icon: <AssessmentOutlined /> },
  { label: 'Certificates', path: '/trainee/certificates', icon: <WorkspacePremiumOutlined /> },
  { label: 'Feedback', path: '/trainee/feedback', icon: <FeedbackOutlined /> },
  { label: 'Notifications', path: '/trainee/notifications', icon: <NotificationsOutlined /> },
  { label: 'Resources', path: '/trainee/trainer-library', icon: <FolderOutlined /> },
  { label: 'AI Assistant', path: '/trainee/ai', icon: <SmartToyOutlined />, isNew: true },
];

const TraineeLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    keycloak.logout({
      redirectUri: `${window.location.origin}/`,
    });
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  const drawerContent = (isMobile = false) => (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          px: isMobile || !collapsed ? 2.5 : 1,
          py: 2,
          minHeight: 72,
          display: 'flex',
          alignItems: 'center',
          justifyContent: isMobile || !collapsed ? 'flex-start' : 'center',
          overflow: 'hidden',
        }}
      >
        {isMobile || !collapsed ? (
          <Box>
            <Typography
              variant="h6"
              color="primary"
              noWrap
              sx={{ fontWeight: 800 }}
            >
              CAPACITY CONNECT
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Trainee Portal
            </Typography>
          </Box>
        ) : (
          <Typography variant="h6" color="primary" sx={{ fontWeight: 800 }}>
            CC
          </Typography>
        )}
      </Box>

      <List sx={{ px: 1, flex: 1 }}>
        {menuItems.map((item) => {
          const active =
            location.pathname === item.path ||
            (item.path === '/trainee/assessments' &&
              location.pathname.startsWith('/trainee/assessments/'));

          const button = (
            <ListItemButton
              selected={active}
              onClick={() => handleNavigation(item.path)}
              sx={{
                minHeight: 48,
                px: collapsed && !isMobile ? 1.5 : 2,
                justifyContent:
                  collapsed && !isMobile ? 'center' : 'flex-start',
                borderRadius: 2,
                mb: 0.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: collapsed && !isMobile ? 0 : 42,
                  justifyContent: 'center',
                }}
              >
                {item.icon}
              </ListItemIcon>

              {(!collapsed || isMobile) && (
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 1 }}>
                  <ListItemText primary={item.label} />
                  {item.isNew && (
                    <Box
                      component="span"
                      sx={{
                        bgcolor: '#ef4444',
                        color: '#fff',
                        fontSize: 9,
                        fontWeight: 800,
                        px: 0.7,
                        py: 0.25,
                        borderRadius: 1,
                        lineHeight: 1.2,
                      }}
                    >
                      NEW
                    </Box>
                  )}
                </Box>
              )}
            </ListItemButton>
          );

          return collapsed && !isMobile ? (
            <Tooltip key={item.path} title={item.label} placement="right">
              {button}
            </Tooltip>
          ) : (
            <Box key={item.path}>{button}</Box>
          );
        })}
      </List>

      <Box sx={{ p: 1 }}>
        <Tooltip
          title={collapsed && !isMobile ? 'Logout' : ''}
          placement="right"
        >
          <ListItemButton
            onClick={handleLogout}
            sx={{
              minHeight: 48,
              px: collapsed && !isMobile ? 1.5 : 2,
              justifyContent:
                collapsed && !isMobile ? 'center' : 'flex-start',
              borderRadius: 2,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: collapsed && !isMobile ? 0 : 42,
                justifyContent: 'center',
              }}
            >
              <LogoutOutlined />
            </ListItemIcon>

            {(!collapsed || isMobile) && <ListItemText primary="Logout" />}
          </ListItemButton>
        </Tooltip>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F5F8FA' }}>
      <AppBar
        position="fixed"
        color="inherit"
        elevation={1}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          width: {
            xs: '100%',
            md: `calc(100% - ${
              collapsed ? collapsedWidth : drawerWidth
            }px)`,
          },
          ml: {
            xs: 0,
            md: `${collapsed ? collapsedWidth : drawerWidth}px`,
          },
          transition: 'width 0.2s, margin-left 0.2s',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setCollapsed((value) => !value)}
            sx={{ mr: 2, display: { xs: 'none', md: 'inline-flex' } }}
          >
            <MenuOutlined />
          </IconButton>

          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setMobileOpen(true)}
            sx={{ mr: 2, display: { xs: 'inline-flex', md: 'none' } }}
          >
            <MenuOutlined />
          </IconButton>

          <Typography
            variant="h6"
            color="primary"
            noWrap
            sx={{ flexGrow: 1, fontWeight: 700 }}
          >
            Trainee Portal
          </Typography>

          <IconButton onClick={() => navigate('/trainee/notifications')}>
            <NotificationsOutlined />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: collapsed ? collapsedWidth : drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
        >
          {drawerContent(true)}
        </Drawer>

        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              width: collapsed ? collapsedWidth : drawerWidth,
              boxSizing: 'border-box',
              overflowX: 'hidden',
              transition: 'width 0.2s',
            },
          }}
        >
          {drawerContent()}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          transition: 'margin 0.2s',
        }}
      >
        <Toolbar />
        <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default TraineeLayout;
