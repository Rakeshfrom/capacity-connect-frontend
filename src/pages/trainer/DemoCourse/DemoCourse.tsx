import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  LinearProgress,
  Typography,
} from '@mui/material';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import OndemandVideoOutlinedIcon from '@mui/icons-material/OndemandVideoOutlined';
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import {
  trainerDummyCourses,
  TRAINER_DASHBOARD_DEMO_COURSES_ENABLED,
} from '../../../data/trainerDummyCourses';

const DemoCourse = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();

  const course = useMemo(
    () =>
      trainerDummyCourses.find(
        (item) => item.courseId === Number(courseId)
      ),
    [courseId]
  );

  if (!TRAINER_DASHBOARD_DEMO_COURSES_ENABLED || !course) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography sx={{ fontSize: '1.5rem', fontWeight: 700 }}>
          Course not found
        </Typography>

        <Button
          onClick={() => navigate('/trainer/dashboard')}
          sx={{ mt: 2, textTransform: 'none' }}
        >
          Back to Dashboard
        </Button>
      </Box>
    );
  }

  const totalResources = course.modules.reduce(
    (sum, module) => sum + module.contents.length,
    0
  );

  const totalQuickQuestions = course.modules.reduce(
    (sum, module) => sum + (module.quickQuiz?.questions.length ?? 0),
    0
  );

  return (
    <Box
      sx={{
        maxWidth: 1240,
        mx: 'auto',
        px: { xs: 2, md: 3 },
        py: { xs: 3, md: 4 },
      }}
    >
      <Button
        startIcon={<ArrowBackOutlinedIcon />}
        onClick={() => navigate('/trainer/dashboard')}
        sx={{
          mb: 3,
          textTransform: 'none',
          fontWeight: 700,
        }}
      >
        Back to Dashboard
      </Button>

      <Card
        elevation={0}
        sx={{
          border: '1px solid #DCE8F0',
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            p: { xs: 3, md: 4 },
            bgcolor: '#F5FAFD',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', md: 'center' },
              gap: 3,
            }}
          >
            <Box sx={{ maxWidth: 820 }}>
              <Chip
                label={course.category}
                size="small"
                sx={{
                  bgcolor: '#E7F2FA',
                  color: '#0B5A91',
                  fontWeight: 700,
                  mb: 1.5,
                }}
              />

              <Typography
                sx={{
                  fontSize: { xs: '1.8rem', md: '2.2rem' },
                  fontWeight: 800,
                  color: '#173F60',
                  lineHeight: 1.2,
                }}
              >
                {course.courseTitle}
              </Typography>

              <Typography
                sx={{
                  mt: 1.5,
                  color: '#657887',
                  lineHeight: 1.7,
                }}
              >
                {course.description}
              </Typography>
            </Box>

            <Chip
              label={course.level}
              sx={{
                bgcolor: '#FFF4E5',
                color: '#A35A00',
                fontWeight: 700,
              }}
            />
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(3, 1fr)',
              },
              gap: 2,
              mt: 3,
            }}
          >
            <Card
              elevation={0}
              sx={{ border: '1px solid #DCE8F0', borderRadius: 2 }}
            >
              <CardContent>
                <Typography sx={{ color: '#718594', fontSize: '0.85rem' }}>
                  Course progress
                </Typography>

                <Typography
                  sx={{
                    mt: 0.5,
                    fontSize: '1.5rem',
                    fontWeight: 800,
                    color: '#173F60',
                  }}
                >
                  {course.completion}%
                </Typography>

                <LinearProgress
                  variant="determinate"
                  value={course.completion}
                  sx={{ mt: 1.2, height: 7, borderRadius: 10 }}
                />
              </CardContent>
            </Card>

            <Card
              elevation={0}
              sx={{ border: '1px solid #DCE8F0', borderRadius: 2 }}
            >
              <CardContent>
                <Typography sx={{ color: '#718594', fontSize: '0.85rem' }}>
                  Enrolled trainees
                </Typography>

                <Typography
                  sx={{
                    mt: 0.5,
                    fontSize: '1.5rem',
                    fontWeight: 800,
                    color: '#173F60',
                  }}
                >
                  {course.trainees}
                </Typography>

                <Typography sx={{ color: '#718594', fontSize: '0.85rem' }}>
                  Current learners
                </Typography>
              </CardContent>
            </Card>

            <Card
              elevation={0}
              sx={{ border: '1px solid #DCE8F0', borderRadius: 2 }}
            >
              <CardContent>
                <Typography sx={{ color: '#718594', fontSize: '0.85rem' }}>
                  Average score
                </Typography>

                <Typography
                  sx={{
                    mt: 0.5,
                    fontSize: '1.5rem',
                    fontWeight: 800,
                    color: '#173F60',
                  }}
                >
                  {course.averageScore}%
                </Typography>

                <Typography sx={{ color: '#718594', fontSize: '0.85rem' }}>
                  Across assessments
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Card>

      <Box sx={{ mt: 3 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            gap: 2,
            mb: 2,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontSize: '1.35rem',
                fontWeight: 800,
                color: '#173F60',
              }}
            >
              Course Content
            </Typography>

            <Typography sx={{ color: '#718594', mt: 0.5 }}>
              {course.modules.length} modules · {totalResources} resources
            </Typography>
          </Box>

          <Chip
            icon={<QuizOutlinedIcon />}
            label={`${totalQuickQuestions} quick-check questions`}
            sx={{ fontWeight: 700 }}
          />
        </Box>

        <Box sx={{ display: 'grid', gap: 2 }}>
          {course.modules.map((module, index) => (
            <Card
              key={module.id}
              elevation={0}
              sx={{
                border: '1px solid #DCE8F0',
                borderRadius: 3,
              }}
            >
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <Box
                  sx={{
                    display: 'flex',
                    gap: 2,
                    alignItems: 'flex-start',
                  }}
                >
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 1.5,
                      bgcolor: '#EAF4FB',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <MenuBookOutlinedIcon sx={{ color: '#0B5A91' }} />
                  </Box>

                  <Box sx={{ flex: 1 }}>
                    <Typography
                      sx={{
                        color: '#0B5A91',
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                      }}
                    >
                      Module {index + 1}
                    </Typography>

                    <Typography
                      sx={{
                        mt: 0.5,
                        fontSize: '1.15rem',
                        fontWeight: 800,
                        color: '#173F60',
                      }}
                    >
                      {module.title.replace(/^Module \d+ · /, '')}
                    </Typography>

                    <Typography sx={{ mt: 0.7, color: '#718594' }}>
                      {module.description}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'grid', gap: 1.2, mt: 2.5 }}>
                  {module.contents.map((content) => (
                    <Box
                      key={content.id}
                      sx={{
                        border: '1px solid #E5EDF2',
                        borderRadius: 2,
                        px: 2,
                        py: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 2,
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.5,
                          minWidth: 0,
                        }}
                      >
                        {content.type === 'TEXT' ? (
                          <MenuBookOutlinedIcon sx={{ color: '#657887' }} />
                        ) : (
                          <OndemandVideoOutlinedIcon sx={{ color: '#657887' }} />
                        )}

                        <Box>
                          <Typography
                            sx={{
                              fontWeight: 700,
                              color: '#173F60',
                            }}
                          >
                            {content.title}
                          </Typography>

                          <Typography
                            sx={{
                              fontSize: '0.82rem',
                              color: '#718594',
                            }}
                          >
                            {content.type === 'TEXT'
                              ? `${content.durationMinutes ?? 0} min reading`
                              : `${content.durationMinutes ?? 0} min video`}
                          </Typography>
                        </Box>
                      </Box>

                      {content.type === 'VIDEO_URL' && content.url && (
                        <Button
                          size="small"
                          endIcon={<OpenInNewOutlinedIcon />}
                          href={content.url}
                          target="_blank"
                          rel="noreferrer"
                          sx={{
                            textTransform: 'none',
                            fontWeight: 700,
                            flexShrink: 0,
                          }}
                        >
                          Open
                        </Button>
                      )}
                    </Box>
                  ))}
                </Box>

                {module.quickQuiz && (
                  <Box>
                    <Divider sx={{ my: 2.5 }} />

                    <Box
                      sx={{
                        p: 2.2,
                        borderRadius: 2.5,
                        bgcolor: '#F7FBFE',
                        border: '1px solid #DCE8F0',
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        justifyContent: 'space-between',
                        gap: 2,
                      }}
                    >
                      <Box>
                        <Typography
                          sx={{
                            fontWeight: 800,
                            color: '#173F60',
                          }}
                        >
                          {module.quickQuiz.title}
                        </Typography>

                        <Typography
                          sx={{
                            color: '#718594',
                            mt: 0.5,
                            fontSize: '0.9rem',
                          }}
                        >
                          {module.quickQuiz.description}
                        </Typography>
                      </Box>

                      <Chip
                        icon={<CheckCircleOutlineOutlinedIcon />}
                        label={`${module.quickQuiz.questions.length} questions`}
                        sx={{ fontWeight: 700 }}
                      />
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>

      <Card
        elevation={0}
        sx={{
          mt: 3,
          border: '1px solid #DCE8F0',
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', md: 'center' },
              gap: 3,
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: '1.2rem',
                  fontWeight: 800,
                  color: '#173F60',
                }}
              >
                {course.finalAssessment.title}
              </Typography>

              <Typography sx={{ mt: 0.7, color: '#718594' }}>
                {course.finalAssessment.description}
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 1,
                  mt: 1.5,
                }}
              >
                <Chip
                  size="small"
                  label={`${course.finalAssessment.questions.length} questions`}
                />
                <Chip
                  size="small"
                  label={`${course.finalAssessment.totalMarks} marks`}
                />
                <Chip
                  size="small"
                  label={`${course.finalAssessment.durationMinutes} min`}
                />
              </Box>
            </Box>

            <Button
              variant="contained"
              startIcon={<QuizOutlinedIcon />}
              disabled
              sx={{
                minWidth: 190,
                textTransform: 'none',
                fontWeight: 700,
                borderRadius: 2,
              }}
            >
              View Assessment
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DemoCourse;
