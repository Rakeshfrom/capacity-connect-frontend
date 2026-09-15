import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined';
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';
import AnalyticsOutlinedIcon from '@mui/icons-material/AnalyticsOutlined';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import { useNavigate } from 'react-router-dom';

const actions = [
  {
    label: 'My Courses',
    description: 'Create, edit and manage training courses.',
    path: '/trainer/courses',
    icon: SchoolOutlinedIcon,
  },
  {
    label: 'Trainees',
    description: 'Review learners and their course progress.',
    path: '/trainer/trainees',
    icon: GroupsOutlinedIcon,
  },
  {
    label: 'Questionnaires',
    description: 'Manage assessments and trainer questionnaires.',
    path: '/trainer/questionnaires',
    icon: QuizOutlinedIcon,
  },
  {
    label: 'Resource Library',
    description: 'Upload and manage learning resources.',
    path: '/trainer/library',
    icon: FolderOpenOutlinedIcon,
  },
  {
    label: 'Analytics',
    description: 'Review course and learner performance.',
    path: '/trainer/analytics',
    icon: AnalyticsOutlinedIcon,
  },
  {
    label: 'AI Assistant',
    description: 'Open the trainer-focused AI workspace.',
    path: '/trainer/ai',
    icon: SmartToyOutlinedIcon,
  },
];

const TrainerQuickActions = () => {
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
        Trainer Workspace
      </Typography>

      <Typography sx={{ color: '#718594', mt: 0.5, mb: 2 }}>
        Access your core teaching, learner and insight tools.
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            lg: 'repeat(3, 1fr)',
          },
          gap: 2,
        }}
      >
        {actions.map(({ label, description, path, icon: Icon }) => (
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
                  mb: 1.5,
                }}
              >
                <Icon />
              </Box>

              <Typography sx={{ fontWeight: 800, color: '#173F60' }}>
                {label}
              </Typography>

              <Typography
                sx={{
                  color: '#718594',
                  fontSize: '0.83rem',
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
                  fontWeight: 800,
                  color: '#0B5A91',
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

export default TrainerQuickActions;
