import { useMemo, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  LinearProgress,
  Radio,
  RadioGroup,
  FormControlLabel,
  Stack,
  Typography,
} from '@mui/material';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import PlayCircleOutlineOutlinedIcon from '@mui/icons-material/PlayCircleOutlineOutlined';
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import { useNavigate, useParams } from 'react-router-dom';
import { trainerDummyCourses } from '../../../data/trainerDummyCourses';

type Question = {
  question: string;
  options: string[];
  correctAnswer?: number | string;
  answer?: number | string;
  marks?: number;
};

export default function DemoCourseWorkspace() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const course = useMemo(
    () => trainerDummyCourses.find((item) => String(item.courseId) === String(courseId)),
    [courseId],
  );

  const storageKey = `capacity-connect-demo-progress-${courseId}`;
  const [completed, setCompleted] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [quickAnswers, setQuickAnswers] = useState<Record<string, number>>({});
  const [finalAnswers, setFinalAnswers] = useState<Record<string, number>>({});
  const [quickSubmitted, setQuickSubmitted] = useState(false);
  const [finalSubmitted, setFinalSubmitted] = useState(false);

  if (!course) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Alert severity="warning">Demo course not found.</Alert>
        <Button sx={{ mt: 2 }} onClick={() => navigate('/trainee/demo-courses')}>
          Back to courses
        </Button>
      </Box>
    );
  }

  const totalItems =
    course.modules.reduce(
      (sum: number, module: any) => sum + (module.content?.length || 0),
      0,
    ) + 1;

  const progress = Math.min(
    100,
    Math.round((completed.length / Math.max(totalItems, 1)) * 100),
  );

  const markComplete = (id: string) => {
    setCompleted((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      localStorage.setItem(storageKey, JSON.stringify(next));
      return next;
    });
  };

  const questions = ((course.finalAssessment?.questions || []) as Question[]);
  const quickQuestions = course.modules.flatMap(
    (module: any) => (module.quickQuiz?.questions || []) as Question[],
  );

  const score = (items: Question[], answers: Record<string, number>) =>
    items.reduce(
      (sum, item, index) =>
        sum + (Number(item.correctAnswer ?? item.answer) === Number(answers[String(index)]) ? (item.marks || 1) : 0),
      0,
    );

  const quickScore = score(quickQuestions, quickAnswers);
  const finalScore = score(questions, finalAnswers);
  const finalMax = questions.reduce((sum, item) => sum + (item.marks || 1), 0);

  return (
    <Box sx={{ bgcolor: '#F7FAFC', minHeight: '100%', p: { xs: 1.5, md: 3 } }}>
      <Box sx={{ maxWidth: 1240, mx: 'auto' }}>
        <Button
          startIcon={<ArrowBackOutlinedIcon />}
          onClick={() => navigate('/trainee/demo-courses')}
          sx={{ textTransform: 'none', mb: 1 }}
        >
          Back to learning workspace
        </Button>

        <Card elevation={0} sx={{ border: '1px solid #DCE8F0', borderRadius: 3, mb: 2 }}>
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
             
              spacing={2}
            >
              <Box>
                <Chip
                  size="small"
                  label="IMD Learning Workspace"
                  sx={{ bgcolor: '#EAF4FB', color: '#0B5A91', fontWeight: 800, mb: 1.2 }}
                />
                <Typography sx={{ color: '#173F60', fontWeight: 800, fontSize: { xs: '1.4rem', md: '2rem' } }}>
                  {(course as any).title ?? (course as any).courseName ?? (course as any).courseTitle ?? 'IMD Learning Course'}
                </Typography>
                <Typography sx={{ color: '#718594', mt: 1, maxWidth: 850 }}>
                  {course.description}
                </Typography>
              </Box>

              <Box sx={{ minWidth: { md: 250 } }}>
                <Typography variant="caption" color="text.secondary">
                  Course progress
                </Typography>
                <Typography sx={{ color: '#173F60', fontWeight: 800, mt: .3 }}>
                  {progress}%
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{ mt: 1, height: 8, borderRadius: 8 }}
                />
              </Box>
            </Stack>
          </CardContent>
        </Card>

        <Stack spacing={2}>
          {course.modules.map((module: any, moduleIndex: number) => (
            <Accordion
              key={module.moduleId}
              defaultExpanded={moduleIndex === 0}
              disableGutters
              elevation={0}
              sx={{ border: '1px solid #DCE8F0', borderRadius: '12px !important', overflow: 'hidden' }}
            >
              <AccordionSummary expandIcon={<ExpandMoreOutlinedIcon />}>
                <Box>
                  <Typography sx={{ color: '#173F60', fontWeight: 800 }}>
                    Module {moduleIndex + 1}: {module.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {module.content?.length || 0} learning resources
                    {module.quickQuiz ? ' • Quick Quiz' : ''}
                  </Typography>
                </Box>
              </AccordionSummary>

              <AccordionDetails sx={{ bgcolor: '#FCFEFF' }}>
                <Stack spacing={1.5}>
                  {(module.content || []).map((item: any, index: number) => {
                    const itemId = `${module.moduleId}-content-${index}`;
                    const done = completed.includes(itemId);

                    return (
                      <Card key={itemId} variant="outlined" sx={{ borderRadius: 2 }}>
                        <CardContent sx={{ p: 2 }}>
                          <Stack
                            direction={{ xs: 'column', sm: 'row' }}
                           
                            
                            spacing={1.5}
                          >
                            <Box>
                              <Typography sx={{ fontWeight: 800, color: '#173F60' }}>
                                {item.title}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mt: .35 }}>
                                {item.description || item.body || 'Learning resource'}
                              </Typography>
                              <Chip
                                size="small"
                                label={item.type === 'VIDEO_URL' ? 'Video' : 'Reading'}
                                icon={item.type === 'VIDEO_URL' ? <PlayCircleOutlineOutlinedIcon /> : undefined}
                                sx={{ mt: 1 }}
                              />
                            </Box>

                            <Stack direction="row" spacing={1}>
                              {item.type === 'VIDEO_URL' && item.url ? (
                                <Button
                                  size="small"
                                  variant="outlined"
                                  href={item.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  startIcon={<PlayCircleOutlineOutlinedIcon />}
                                  sx={{ textTransform: 'none' }}
                                  onClick={() => markComplete(itemId)}
                                >
                                  Watch
                                </Button>
                              ) : (
                                <Button
                                  size="small"
                                  variant="outlined"
                                  onClick={() => markComplete(itemId)}
                                  sx={{ textTransform: 'none' }}
                                >
                                  Mark complete
                                </Button>
                              )}

                              {done && (
                                <Chip
                                  size="small"
                                  label="Completed"
                                  color="success"
                                  icon={<CheckCircleOutlineOutlinedIcon />}
                                />
                              )}
                            </Stack>
                          </Stack>

                          {item.type !== 'VIDEO_URL' && item.body && (
                            <Typography sx={{ mt: 1.5, color: '#4E6270', lineHeight: 1.7 }}>
                              {item.body}
                            </Typography>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}

                  {module.quickQuiz && (
                    <Card
                      variant="outlined"
                      sx={{ borderRadius: 2, bgcolor: '#F8FBFD' }}
                    >
                      <CardContent sx={{ p: 2 }}>
                        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                          <QuizOutlinedIcon sx={{ color: '#0B5A91' }} />
                          <Typography sx={{ fontWeight: 800, color: '#173F60' }}>
                            Quick Quiz
                          </Typography>
                          <Chip size="small" label={`${quickQuestions.length} questions`} />
                        </Stack>

                        <Typography variant="body2" color="text.secondary" sx={{ mt: .7, mb: 1.5 }}>
                          Check your understanding before moving to the next section.
                        </Typography>

                        <Stack spacing={2}>
                          {quickQuestions.map((question, index) => (
                            <Box key={`quick-${index}`}>
                              <Typography sx={{ fontWeight: 700, color: '#304C60' }}>
                                {index + 1}. {question.question}
                              </Typography>
                              <RadioGroup
                                value={quickAnswers[String(index)] ?? ''}
                                onChange={(event) =>
                                  setQuickAnswers((prev) => ({
                                    ...prev,
                                    [String(index)]: Number(event.target.value),
                                  }))
                                }
                                sx={{ mt: .5 }}
                              >
                                {question.options.map((option, optionIndex) => (
                                  <FormControlLabel
                                    key={optionIndex}
                                    value={optionIndex}
                                    control={<Radio size="small" />}
                                    label={option}
                                  />
                                ))}
                              </RadioGroup>
                            </Box>
                          ))}

                          <Button
                            variant="contained"
                            onClick={() => {
                              setQuickSubmitted(true);
                              markComplete(`${module.moduleId}-quick-quiz`);
                            }}
                            sx={{ alignSelf: 'flex-start', textTransform: 'none', fontWeight: 800 }}
                          >
                            Submit Quick Quiz
                          </Button>

                          {quickSubmitted && (
                            <Alert severity={quickScore >= quickQuestions.length / 2 ? 'success' : 'info'}>
                              Quick quiz score: {quickScore}/{quickQuestions.length}
                            </Alert>
                          )}
                        </Stack>
                      </CardContent>
                    </Card>
                  )}
                </Stack>
              </AccordionDetails>
            </Accordion>
          ))}

          <Card
            elevation={0}
            sx={{
              border: '1px solid #DCE8F0',
              borderRadius: 3,
              bgcolor: '#FFFFFF',
            }}
          >
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <WorkspacePremiumOutlinedIcon sx={{ color: '#0B5A91' }} />
                <Typography sx={{ color: '#173F60', fontWeight: 800, fontSize: '1.15rem' }}>
                  Final Assessment
                </Typography>
              </Stack>

              <Typography color="text.secondary" sx={{ mt: .7, mb: 2 }}>
                {course.finalAssessment?.durationMinutes || 20} minutes • {questions.length} questions • {finalMax} marks
              </Typography>

              <Divider sx={{ mb: 2 }} />

              <Stack spacing={2.2}>
                {questions.map((question, index) => (
                  <Box key={`final-${index}`}>
                    <Typography sx={{ fontWeight: 700, color: '#304C60' }}>
                      {index + 1}. {question.question}
                    </Typography>
                    <RadioGroup
                      value={finalAnswers[String(index)] ?? ''}
                      onChange={(event) =>
                        setFinalAnswers((prev) => ({
                          ...prev,
                          [String(index)]: Number(event.target.value),
                        }))
                      }
                      sx={{ mt: .5 }}
                    >
                      {question.options.map((option, optionIndex) => (
                        <FormControlLabel
                          key={optionIndex}
                          value={optionIndex}
                          control={<Radio size="small" />}
                          label={option}
                        />
                      ))}
                    </RadioGroup>
                  </Box>
                ))}

                <Button
                  variant="contained"
                  onClick={() => {
                    setFinalSubmitted(true);
                    markComplete('final-assessment');
                    const maxMarks = questions.reduce(
                      (sum, item) => sum + (item.marks || 1),
                      0,
                    );
                    const finalResult = score(questions, finalAnswers);
                    localStorage.setItem(
                      `capacity-connect-demo-result-${courseId}`,
                      JSON.stringify({
                        score: finalResult,
                        max: maxMarks,
                        submittedAt: new Date().toISOString(),
                      }),
                    );
                    navigate(`/trainee/demo-courses/${courseId}/result`);
                  }}
                  sx={{ alignSelf: 'flex-start', textTransform: 'none', fontWeight: 800 }}
                >
                  Submit Final Assessment
                </Button>

                {finalSubmitted && (
                  <Alert severity={finalScore >= Math.ceil(finalMax * 0.6) ? 'success' : 'warning'}>
                    Final assessment score: {finalScore}/{finalMax}
                    {finalScore >= Math.ceil(finalMax * 0.6)
                      ? ' • Passed'
                      : ' • Review the modules and try again'}
                  </Alert>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Box>
    </Box>
  );
}
