import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Stack,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { getCourses, getTrainerQuestionnaires } from '../../../services/api';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

interface QuestionnaireData {
  id: number;
  title: string;
  description?: string;
  courseId: number;
  trainerId: number;
  deadline?: string;
  status: string;
}

interface CourseData {
  id: number;
  title: string;
}


const Questionnaires = () => {
  const { user } = useAuth();
  const [questionnaires, setQuestionnaires] = useState<QuestionnaireData[]>([]);
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    Promise.all([
      getTrainerQuestionnaires(user.id),
      getCourses(),
    ])
      .then(([questionnaireData, courseData]) => {
        setQuestionnaires(questionnaireData);
        setCourses(courseData);
      })
      .catch((error) => {
        console.error('Failed to load questionnaires:', error);
      })
      .finally(() => setLoading(false));
  }, [user?.id]);

  const getCourseTitle = (courseId: number) =>
    courses.find((course) => course.id === courseId)?.title || 'Course';

  const formatDeadline = (deadline?: string) => {
    if (!deadline) return 'No deadline';
    return new Date(deadline).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <Box sx={{ bgcolor: '#F5F8FA', minHeight: '100vh' }}>
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          sx={{
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'center' },
            gap: 2,
            mb: 4,
          }}
        >
          <Box>
            <Typography
              sx={{
                color: '#0B5A91',
                fontWeight: 700,
                fontSize: '0.82rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              Trainer Portal
            </Typography>

            <Typography
              sx={{
                color: '#173F60',
                fontWeight: 800,
                fontSize: { xs: '2rem', md: '2.6rem' },
                mt: 0.5,
              }}
            >
              Questionnaires
            </Typography>

            <Typography sx={{ color: '#657887', mt: 1 }}>
              Create and manage questionnaires, feedback forms and training evaluations.
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddOutlinedIcon />}
            sx={{
              bgcolor: '#0B5A91',
              textTransform: 'none',
              fontWeight: 700,
              px: 2.5,
              py: 1.2,
              '&:hover': { bgcolor: '#084873' },
            }}
          >
            Create Questionnaire
          </Button>
        </Stack>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            gap: 2.5,
          }}
        >
          {loading ? (
            <Typography sx={{ color: '#657887', gridColumn: '1 / -1' }}>
              Loading questionnaires...
            </Typography>
          ) : questionnaires.length === 0 ? (
            <Typography sx={{ color: '#657887', gridColumn: '1 / -1' }}>
              No questionnaires found.
            </Typography>
          ) : questionnaires.map((item) => (
            <Card
              key={item.title}
              elevation={0}
              sx={{
                border: '1px solid #DCE8F0',
                borderRadius: 2,
              }}
            >
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <Stack
                  direction="row"
                  sx={{
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 1.5,
                      bgcolor: '#EAF4FB',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <AssignmentOutlinedIcon sx={{ color: '#0B5A91' }} />
                  </Box>

                  <Chip
                    label={item.status}
                    size="small"
                    sx={{
                      bgcolor:
                        item.status === 'PUBLISHED' ? '#EAF6EF' : '#FFF4E5',
                      color:
                        item.status === 'PUBLISHED' ? '#147A45' : '#A35A00',
                      fontWeight: 700,
                    }}
                  />
                </Stack>

                <Typography
                  sx={{
                    color: '#173F60',
                    fontWeight: 700,
                    fontSize: '1.15rem',
                    mt: 2.5,
                  }}
                >
                  {item.title}
                </Typography>

                <Typography
                  sx={{
                    color: '#657887',
                    mt: 0.8,
                    lineHeight: 1.5,
                  }}
                >
                  {getCourseTitle(item.courseId)}
                </Typography>

                <Stack
                  direction="row"
                  sx={{
                    alignItems: 'center',
                    gap: 1,
                    mt: 2.5,
                  }}
                >
                  <PeopleOutlineOutlinedIcon
                    sx={{ fontSize: 20, color: '#718594' }}
                  />
                  <Typography sx={{ color: '#657887' }}>
                    0 responses
                  </Typography>
                </Stack>

                <Stack
                  direction="row"
                  sx={{
                    alignItems: 'center',
                    gap: 1,
                    mt: 1.2,
                  }}
                >
                  <CalendarTodayOutlinedIcon
                    sx={{ fontSize: 18, color: '#718594' }}
                  />
                  <Typography sx={{ color: '#657887' }}>
                    Deadline: {formatDeadline(item.deadline)}
                  </Typography>
                </Stack>

                <Button
                  variant="outlined"
                  startIcon={<EditOutlinedIcon />}
                  fullWidth
                  sx={{
                    mt: 2.5,
                    borderColor: '#BCD2E2',
                    color: '#0B5A91',
                    textTransform: 'none',
                    fontWeight: 700,
                    '&:hover': {
                      borderColor: '#0B5A91',
                      bgcolor: '#F5F9FC',
                    },
                  }}
                >
                  Manage Questionnaire
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default Questionnaires;
