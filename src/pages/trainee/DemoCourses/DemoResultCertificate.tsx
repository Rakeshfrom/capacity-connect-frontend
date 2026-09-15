import { useMemo } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import { useNavigate, useParams } from 'react-router-dom';
import { trainerDummyCourses } from '../../../data/trainerDummyCourses';

export default function DemoResultCertificate() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const course = useMemo(
    () => trainerDummyCourses.find((item) => String(item.courseId) === String(courseId)),
    [courseId],
  );

  const storageKey = `capacity-connect-demo-result-${courseId}`;
  const result = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || 'null') as
        | { score: number; max: number; submittedAt: string }
        | null;
    } catch {
      return null;
    }
  }, [storageKey]);

  if (!course) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Alert severity="warning">Demo course not found.</Alert>
      </Box>
    );
  }

  const score = result?.score ?? 0;
  const max = result?.max ?? 0;
  const passed = max > 0 && score / max >= 0.6;
  const percent = max > 0 ? Math.round((score / max) * 100) : 0;

  return (
    <Box sx={{ minHeight: '100%', bgcolor: '#F7FAFC', p: { xs: 1.5, md: 4 } }}>
      <Box sx={{ maxWidth: 980, mx: 'auto' }}>
        <Button
          startIcon={<ArrowBackOutlinedIcon />}
          onClick={() => navigate(`/trainee/demo-courses/${course.courseId}`)}
          sx={{ mb: 2, textTransform: 'none' }}
        >
          Back to course
        </Button>

        <Card elevation={0} sx={{ border: '1px solid #DCE8F0', borderRadius: 3 }}>
          <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
            <Stack spacing={2.5}>
              <Box>
                <Chip
                  size="small"
                  label="Assessment Result"
                  sx={{ bgcolor: '#EAF4FB', color: '#0B5A91', fontWeight: 800 }}
                />
                <Typography
                  sx={{
                    mt: 1.1,
                    color: '#173F60',
                    fontWeight: 800,
                    fontSize: { xs: '1.5rem', md: '2rem' },
                  }}
                >
                  {(course as any).title ?? (course as any).courseName ?? 'IMD Learning Course'}
                </Typography>
              </Box>

              {!result ? (
                <Alert severity="info">
                  No final assessment result has been submitted yet.
                </Alert>
              ) : (
                <>
                  <Card
                    elevation={0}
                    sx={{
                      borderRadius: 3,
                      bgcolor: passed ? '#ECF8F1' : '#FFF7E8',
                      border: `1px solid ${passed ? '#BFE2CD' : '#F1D59B'}`,
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                        {passed ? (
                          <CheckCircleOutlineOutlinedIcon sx={{ fontSize: 44, color: '#147A45' }} />
                        ) : (
                          <EmojiEventsOutlinedIcon sx={{ fontSize: 44, color: '#A35A00' }} />
                        )}
                        <Box>
                          <Typography sx={{ fontWeight: 900, color: '#173F60', fontSize: '1.2rem' }}>
                            {passed ? 'Assessment Passed' : 'Assessment Not Passed'}
                          </Typography>
                          <Typography color="text.secondary">
                            Score: {score}/{max} ({percent}%)
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>

                  {passed ? (
                    <Card
                      elevation={0}
                      sx={{
                        border: '2px solid #B8D8C6',
                        borderRadius: 3,
                        bgcolor: '#FFFFFF',
                      }}
                    >
                      <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
                        <Stack spacing={1.2} sx={{ alignItems: 'center', textAlign: 'center' }}>
                          <WorkspacePremiumOutlinedIcon sx={{ fontSize: 54, color: '#0B5A91' }} />
                          <Typography sx={{ color: '#173F60', fontWeight: 900, fontSize: '1.45rem' }}>
                            Certificate of Completion
                          </Typography>
                          <Typography color="text.secondary">
                            This demo certificate confirms successful completion of
                          </Typography>
                          <Typography sx={{ color: '#173F60', fontWeight: 800, fontSize: '1.2rem' }}>
                            {(course as any).title ?? (course as any).courseName ?? 'IMD Learning Course'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Final assessment score: {score}/{max} • {percent}%
                          </Typography>
                          <Divider sx={{ width: '100%', my: 1.2 }} />
                          <Typography variant="caption" color="text.secondary">
                            Issued through the Capacity Connect learning experience
                          </Typography>
                        </Stack>
                      </CardContent>
                    </Card>
                  ) : (
                    <Typography color="text.secondary">
                      Review the course modules and return to the assessment.
                    </Typography>
                  )}
                </>
              )}

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                <Button
                  variant="contained"
                  onClick={() => navigate(`/trainee/demo-courses/${course.courseId}`)}
                  sx={{ textTransform: 'none', fontWeight: 800 }}
                >
                  Return to Course
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/trainee/demo-courses')}
                  sx={{ textTransform: 'none', fontWeight: 800 }}
                >
                  All Demo Courses
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
