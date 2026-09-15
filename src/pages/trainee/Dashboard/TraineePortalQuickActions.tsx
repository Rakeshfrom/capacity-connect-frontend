import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import RateReviewOutlinedIcon from '@mui/icons-material/RateReviewOutlined';
import { useNavigate } from 'react-router-dom';

const actions = [
  {
    label: 'Courses',
    title: 'Explore Courses',
    description: 'Continue structured learning and course work.',
    path: '/trainee/courses',
    Icon: SchoolOutlinedIcon,
  },
  {
    label: 'Assessments',
    title: 'Assessments',
    description: 'Attempt published assessments and review results.',
    path: '/trainee/assessments',
    Icon: AssignmentOutlinedIcon,
  },
  {
    label: 'Resources',
    title: 'Learning Resources',
    description: 'Access trainer-published study resources.',
    path: '/trainee/library',
    Icon: FolderOutlinedIcon,
  },
  {
    label: 'AI Assistant',
    title: 'AI Assistant',
    description: 'Ask questions, revise topics and plan next steps.',
    path: '/trainee/ai',
    Icon: AutoAwesomeOutlinedIcon,
  },
  {
    label: 'Certificates',
    title: 'Certificates',
    description: 'View earned learning certificates.',
    path: '/trainee/certificates',
    Icon: WorkspacePremiumOutlinedIcon,
  },
  {
    label: 'Feedback',
    title: 'Feedback',
    description: 'Share course and learning experience feedback.',
    path: '/trainee/feedback',
    Icon: RateReviewOutlinedIcon,
  },
  {
    label: 'Notifications',
    title: 'Notifications',
    description: 'Review important learning updates.',
    path: '/trainee/notifications',
    Icon: NotificationsNoneOutlinedIcon,
  },
    {
    label: 'Demo Workspace',
    title: 'Demo Course Workspace',
    description: 'Open the IMD demo courses with modules, quizzes and final assessment.',
    path: '/trainee/demo-courses',
    Icon: SchoolOutlinedIcon,
  },
{
    label: 'Settings',
    title: 'Settings',
    description: 'Manage account, security and preferences.',
    path: '/trainee/settings',
    Icon: SettingsOutlinedIcon,
  },
];

const TraineePortalQuickActions = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ mb: 3 }}>
      <Typography
        sx={{
          color: '#173F60',
          fontWeight: 800,
          fontSize: '1.2rem',
        }}
      >
        Learning Workspace
      </Typography>

      <Typography
        sx={{
          color: '#718594',
          mt: 0.5,
          mb: 2,
        }}
      >
        Continue learning, complete assessments and manage your learning journey.
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            lg: 'repeat(4, 1fr)',
          },
          gap: 2,
        }}
      >
        {actions.map(({ label, title, description, path, Icon }) => (
          <Card
            key={label}
            elevation={0}
            onClick={() => navigate(path)}
            sx={{
              border: '1px solid #DCE8F0',
              borderRadius: 2.5,
              cursor: 'pointer',
              transition: 'all 0.18s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                borderColor: '#B8D4E3',
                boxShadow: '0 8px 24px rgba(23,63,96,0.08)',
              },
            }}
          >
            <CardContent sx={{ p: 2.2 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 1.5,
                  bgcolor: '#EAF4FB',
                  color: '#0B5A91',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 1.4,
                }}
              >
                <Icon />
              </Box>

              <Typography
                sx={{
                  color: '#173F60',
                  fontWeight: 800,
                }}
              >
                {title}
              </Typography>

              <Typography
                sx={{
                  color: '#718594',
                  fontSize: '0.82rem',
                  mt: 0.5,
                  minHeight: 38,
                }}
              >
                {description}
              </Typography>

              <Button
                size="small"
                onClick={(event) => {
                  event.stopPropagation();
                  navigate(path);
                }}
                sx={{
                  mt: 1,
                  px: 0,
                  textTransform: 'none',
                  color: '#0B5A91',
                  fontWeight: 800,
                }}
              >
                Open →
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default TraineePortalQuickActions;
