import { Box, Button, Card, CardContent, Chip, Stack, Typography } from '@mui/material';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import PlayCircleOutlineOutlinedIcon from '@mui/icons-material/PlayCircleOutlineOutlined';
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined';
import { useNavigate } from 'react-router-dom';
import {
  trainerDummyCourses,
  TRAINER_DASHBOARD_DEMO_COURSES_ENABLED,
} from '../../../data/trainerDummyCourses';

export default function DemoCourseList() {
  const navigate = useNavigate();

  if (!TRAINER_DASHBOARD_DEMO_COURSES_ENABLED) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>Demo courses unavailable</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1280, mx: 'auto' }}>
      <Stack spacing={0.7} sx={{ mb: 3 }}>
        <Typography sx={{ color: '#173F60', fontWeight: 800, fontSize: { xs: '1.5rem', md: '2rem' } }}>
          Learning Workspace
        </Typography>
        <Typography sx={{ color: '#718594' }}>
          Explore the IMD learning experience with structured modules, videos, quick quizzes and final assessments.
        </Typography>
      </Stack>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
          gap: 2.5,
        }}
      >
        {trainerDummyCourses.map((course) => (
          <Card
            key={course.courseId}
            elevation={0}
            sx={{
              border: '1px solid #DCE8F0',
              borderRadius: 3,
              overflow: 'hidden',
              transition: 'transform .18s ease, box-shadow .18s ease',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: '0 12px 28px rgba(23,63,96,.09)',
              },
            }}
          >
            <Box sx={{ height: 8, bgcolor: '#0B5A91' }} />
            <CardContent sx={{ p: 2.5 }}>
              <Stack direction="row" spacing={2} sx={{ justifyContent: "space-between", alignItems: "flex-start" }}>
                <Box>
                  <Chip
                    size="small"
                    label="IMD Demo Course"
                    sx={{ mb: 1.2, bgcolor: '#EAF4FB', color: '#0B5A91', fontWeight: 800 }}
                  />
                  <Typography sx={{ color: '#173F60', fontWeight: 800, fontSize: '1.1rem' }}>
                    {(course as any).title ?? (course as any).courseName ?? (course as any).courseTitle ?? 'IMD Learning Course'}
                  </Typography>
                </Box>
                <SchoolOutlinedIcon sx={{ color: '#0B5A91', mt: .3 }} />
              </Stack>

              <Typography sx={{ color: '#718594', mt: 1, minHeight: 48 }}>
                {course.description}
              </Typography>

              <Stack direction="row" spacing={1} useFlexGap sx={{ mt: 2, flexWrap: "wrap" }}>
                <Chip
                  size="small"
                  icon={<PlayCircleOutlineOutlinedIcon />}
                  label={`${course.modules.length} modules`}
                  variant="outlined"
                />
                <Chip
                  size="small"
                  icon={<QuizOutlinedIcon />}
                  label="Quick quiz + final assessment"
                  variant="outlined"
                />
              </Stack>

              <Button
                fullWidth
                variant="contained"
                onClick={() => navigate(`/trainee/demo-courses/${course.courseId}`)}
                sx={{ mt: 2.2, borderRadius: 2, textTransform: 'none', fontWeight: 800 }}
              >
                Open Learning Workspace
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
}
