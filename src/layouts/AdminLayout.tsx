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
  LogoutOutlined,
  MenuOutlined,
  PsychologyOutlined,
  VerifiedOutlined,
  SecurityOutlined,
  PersonAddAlt1Outlined,
} from '@mui/icons-material';
import { useState } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import keycloak from '../services/keycloak';

const drawerWidth = 250;
const collapsedWidth = 72;

const menuItems = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: <DashboardOutlined /> },
  { label: 'Users', path: '/admin/users', icon: <GroupOutlined /> },
  { label: 'Trainer Applications', path: '/admin/trainer-applications', icon: <PersonAddAlt1Outlined /> },
  { label: 'Courses', path: '/admin/courses', icon: <LibraryBooksOutlined /> },
  { label: 'Assessments', path: '/admin/assessments', icon: <AssessmentOutlined /> },
  { label: 'Certifications', path: '/admin/certifications', icon: <VerifiedOutlined /> },
  { label: 'Analytics', path: '/admin/analytics', icon: <BarChartOutlined /> },
  { label: 'Competency Mapping', path: '/admin/competency-mapping', icon: <PsychologyOutlined /> },
  { label: 'Announcements', path: '/admin/announcements', icon: <CampaignOutlined /> },
  { label: 'Achievements', path: '/admin/achievements', icon: <EmojiEventsOutlined /> },
  { label: 'Audit Logs', path: '/admin/audit-logs', icon: <SecurityOutlined /> },
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
        {(!collapsed || isMobile) && (
          <Box>
            <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 800 }}>
              CAPACITY CONNECT
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Administration Portal
            </Typography>
          </Box>
        )}
      </Toolbar>

      <Divider />

      <List sx={{ px: 1, py: 2, flex: 1 }}>
        {menuItems.map((item) => {
          const active = location.pathname === item.path ||
            location.pathname.startsWith(`${item.path}/`);

          return (
            <Tooltip
              key={item.path}
              title={collapsed && !isMobile ? item.label : ''}
              placement="right"
            >
              <ListItemButton
                selected={active}
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) setMobileOpen(false);
                }}
                sx={{
                  minHeight: 48,
                  mb: 0.5,
                  borderRadius: 1.5,
                  justifyContent: collapsed && !isMobile ? 'center' : 'flex-start',
                  px: collapsed && !isMobile ? 1.5 : 2,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: collapsed && !isMobile ? 0 : 40,
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </ListItemIcon>

                {(!collapsed || isMobile) && (
                  <ListItemText primary={item.label} />
                )}
              </ListItemButton>
            </Tooltip>
          );
        })}
      </List>

      <Divider />

      <List sx={{ p: 1 }}>
        <Tooltip title={collapsed && !isMobile ? 'Logout' : ''} placement="right">
          <ListItemButton
            onClick={() => keycloak.logout({ redirectUri: window.location.origin })}
            sx={{
              minHeight: 48,
              borderRadius: 1.5,
              justifyContent: collapsed && !isMobile ? 'center' : 'flex-start',
              px: collapsed && !isMobile ? 1.5 : 2,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: collapsed && !isMobile ? 0 : 40,
                justifyContent: 'center',
              }}
            >
              <LogoutOutlined />
            </ListItemIcon>

            {(!collapsed || isMobile) && <ListItemText primary="Logout" />}
          </ListItemButton>
        </Tooltip>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          width: {
            md: `calc(100% - ${collapsed ? collapsedWidth : drawerWidth}px)`,
          },
          ml: { md: `${collapsed ? collapsedWidth : drawerWidth}px` },
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Toolbar sx={{ minHeight: '72px !important' }}>
          <IconButton
            edge="start"
            onClick={() => {
              if (isMobile) {
                setMobileOpen(true);
              } else {
                setCollapsed((value) => !value);
              }
            }}
            sx={{ mr: 2 }}
          >
            <MenuOutlined />
          </IconButton>

          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Administration
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Capacity Building & Learning Management Portal
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: collapsed ? collapsedWidth : drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              width: isMobile ? drawerWidth : collapsed ? collapsedWidth : drawerWidth,
              boxSizing: 'border-box',
              borderRight: '1px solid',
              borderColor: 'divider',
              overflowX: 'hidden',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          pt: '72px',
          px: { xs: 2, sm: 3, md: 4 },
          pb: 4,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;
