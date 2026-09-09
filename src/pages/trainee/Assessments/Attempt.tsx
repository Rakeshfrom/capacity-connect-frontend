import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  Typography,
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  getAssessment,
  getQuestionsByAssessment,
  getAttemptsByTrainee,
  startAssessmentAttempt,
  submitAssessmentAttempt,
  terminateAssessmentAttempt,
} from '../../../services/api';

type Assessment = {
  id: number;
  title: string;
  description: string;
  timeLimitMinutes: number;
  passingPercentage: number;
};

type Question = {
  id: number;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  marks: number;
};

const Attempt = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [attemptId, setAttemptId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [instructionsOpen, setInstructionsOpen] = useState(true);
  const [assessmentStarted, setAssessmentStarted] = useState(false);
  const [terminated, setTerminated] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const startRequested = useRef(false);
  const terminating = useRef(false);


  useEffect(() => {
    const loadData = async () => {
      if (!assessmentId || startRequested.current) return;

      startRequested.current = true;

      try {
        const id = Number(assessmentId);

        const [assessmentData, questionData, attemptData] =
          await Promise.all([
            getAssessment(id),
            getQuestionsByAssessment(id),
            getAttemptsByTrainee(),
          ]);

        setAssessment(assessmentData);
        setQuestions(questionData);
        setTimeLeft(assessmentData.timeLimitMinutes * 60);

        const assessmentAttempts = attemptData
          .filter((item: {
            assessmentId: number;
            result: string;
            startedAt: string;
            submittedAt: string | null;
          }) => item.assessmentId === id)
          .sort(
            (a: {
              startedAt: string;
              submittedAt: string | null;
            }, b: {
              startedAt: string;
              submittedAt: string | null;
            }) =>
              new Date(b.submittedAt || b.startedAt).getTime() -
              new Date(a.submittedAt || a.startedAt).getTime()
          );

        const pendingAttempt = assessmentAttempts.find(
          (item: { result: string }) => item.result === 'PENDING'
        );

        if (pendingAttempt) {
          setAttemptId(pendingAttempt.id);
          return;
        }

        const completedAttempt = assessmentAttempts.find(
          (item: { result: string }) => item.result !== 'PENDING'
        );

        if (completedAttempt) {
          navigate(
            `/trainee/assessments/${id}/result`,
            { replace: true }
          );
          return;
        }
      } catch (error) {
        console.error('Failed to load assessment:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [assessmentId, navigate]);

  const startConfirmedAssessment = async () => {
    if (!assessment || !assessmentId) return;

    try {
      await document.documentElement.requestFullscreen();

      const attempt = await startAssessmentAttempt(
        Number(assessmentId),
      );

      setAttemptId(attempt.id);
      setInstructionsOpen(false);
      setAssessmentStarted(true);
    } catch (error) {
      console.error('Failed to start assessment:', error);
      alert('Fullscreen mode is required to start the assessment.');
    }
  };

  useEffect(() => {
    if (!assessmentStarted || !attemptId || terminated || submitting) return;

    const timer = window.setInterval(() => {
      setTimeLeft((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [assessmentStarted, attemptId, terminated, submitting]);

  useEffect(() => {
    if (!assessmentStarted || !attemptId || timeLeft !== 0 || terminated || submitting) {
      return;
    }

    handleSubmit();
  }, [timeLeft, assessmentStarted, attemptId, terminated, submitting]);

  useEffect(() => {
    if (!assessmentStarted || !attemptId) return;

    const terminate = async (reason: string) => {
      if (terminating.current || terminated || submitting) return;

      terminating.current = true;

      try {
        await terminateAssessmentAttempt(attemptId);
      } catch (error) {
        console.error('Failed to terminate assessment:', error);
      } finally {
        setTerminated(true);

        if (document.fullscreenElement) {
          try {
            await document.exitFullscreen();
          } catch {
            // Ignore fullscreen exit errors.
          }
        }

        console.warn(`Assessment terminated: ${reason}`);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        terminate('tab or window switch detected');
      }
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        terminate('fullscreen mode exited');
      }
    };

    document.addEventListener(
      'visibilitychange',
      handleVisibilityChange
    );

    document.addEventListener(
      'fullscreenchange',
      handleFullscreenChange
    );

    return () => {
      document.removeEventListener(
        'visibilitychange',
        handleVisibilityChange
      );

      document.removeEventListener(
        'fullscreenchange',
        handleFullscreenChange
      );
    };
  }, [assessmentStarted, attemptId, terminated, submitting]);


  const handleAnswer = (questionId: number, value: string) => {
    setAnswers((current) => ({
      ...current,
      [questionId]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!attemptId || !assessment || terminated) return;

    setSubmitting(true);

    try {
      await submitAssessmentAttempt(
        attemptId,
        answers
      );

      navigate(
        `/trainee/assessments/${assessment.id}/result`
      );
    } catch (error) {
      console.error('Failed to submit assessment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container sx={{ py: 6 }}>
        <Typography>Loading assessment...</Typography>
      </Container>
    );
  }

  if (terminated) {
    return (
      <Container sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Assessment terminated because a tab/window switch or fullscreen
          exit was detected.
        </Alert>

        <Button
          variant="contained"
          onClick={() => navigate('/trainee/assessments')}
        >
          Back to Assessments
        </Button>
      </Container>
    );
  }

  if (!assessment) {
    return (
      <Container sx={{ py: 6 }}>
        <Typography variant="h6">
          Assessment not found.
        </Typography>

        <Button
          sx={{ mt: 2 }}
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/trainee/assessments')}
        >
          Back to Assessments
        </Button>
      </Container>
    );
  }

  return (
    <>
      <Dialog
        open={instructionsOpen}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ color: '#173F60', fontWeight: 800 }}>
          Assessment Instructions
        </DialogTitle>

        <DialogContent>
          <Stack spacing={1.5}>
            <Typography>
              Please read the following instructions before starting.
            </Typography>

            <Typography>• Assessment starts after confirmation.</Typography>
            <Typography>• Timer begins when the assessment starts.</Typography>
            <Typography>
              • Fullscreen mode is mandatory during the assessment.
            </Typography>
            <Typography>
              • Switching tabs or windows will immediately terminate the
              assessment.
            </Typography>
            <Typography>
              • Exiting fullscreen will also terminate the assessment.
            </Typography>
            <Typography>
              • A terminated assessment cannot be resumed or submitted.
            </Typography>
            <Typography>
              • Answers and marks are evaluated securely on the server.
            </Typography>

            <Alert severity="warning">
              Please make sure you are ready before selecting Confirm & Start.
            </Alert>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => navigate('/trainee/assessments')}
            color="inherit"
          >
            End Assessment
          </Button>

          <Button
            variant="contained"
            onClick={startConfirmedAssessment}
          >
            Confirm & Start
          </Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ bgcolor: '#F5F8FA', minHeight: '100vh' }}>
      <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/trainee/assessments')}
          sx={{
            color: '#0B5A91',
            textTransform: 'none',
            mb: 3,
          }}
        >
          Back to Assessments
        </Button>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, md: 4 },
            border: '1px solid #DCE6ED',
            borderRadius: 2,
          }}
        >
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{
              alignItems: { xs: 'flex-start', sm: 'center' },
              justifyContent: 'space-between',
            }}
          >
            <Box>
              <Typography
                variant="h4"
                sx={{
                  color: '#173F60',
                  fontWeight: 700,
                  fontSize: { xs: '1.8rem', md: '2.2rem' },
                }}
              >
                {assessment.title}
              </Typography>

              <Typography
                sx={{ mt: 1, color: '#657887' }}
              >
                {assessment.description}
              </Typography>
            </Box>

            <Chip
              label={`${Math.floor(timeLeft / 60)
                .toString()
                .padStart(2, '0')}:${(timeLeft % 60)
                .toString()
                .padStart(2, '0')}`}
              sx={{
                bgcolor: timeLeft <= 60 ? '#FDECEC' : '#EEF6FC',
                color: timeLeft <= 60 ? '#B42318' : '#0B5A91',
                fontWeight: 700,
              }}
            />
          </Stack>
        </Paper>

        <Stack spacing={2.5} sx={{ mt: 3 }}>
          {questions.map((question, index) => (
            <Paper
              key={question.id}
              elevation={0}
              sx={{
                p: { xs: 2.5, md: 3 },
                border: '1px solid #DCE6ED',
                borderRadius: 2,
              }}
            >
              <Typography
                sx={{
                  color: '#0B5A91',
                  fontWeight: 700,
                  mb: 1,
                }}
              >
                Question {index + 1}
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  color: '#244A66',
                  fontWeight: 700,
                  lineHeight: 1.5,
                }}
              >
                {question.questionText}
              </Typography>

              <RadioGroup
                value={answers[question.id] || ''}
                onChange={(event) =>
                  handleAnswer(
                    question.id,
                    event.target.value
                  )
                }
                sx={{ mt: 2 }}
              >
                {[
                  ['A', question.optionA],
                  ['B', question.optionB],
                  ['C', question.optionC],
                  ['D', question.optionD],
                ].map(([key, value]) => (
                  <FormControlLabel
                    key={key}
                    value={key}
                    control={<Radio />}
                    label={`${key}. ${value}`}
                    sx={{
                      mb: 0.5,
                      color: '#455A64',
                    }}
                  />
                ))}
              </RadioGroup>
            </Paper>
          ))}
        </Stack>

        <Button
          fullWidth
          variant="contained"
          size="large"
          disabled={submitting || questions.length === 0}
          onClick={handleSubmit}
          sx={{
            mt: 3,
            py: 1.4,
            textTransform: 'none',
            fontWeight: 700,
          }}
        >
          {submitting ? 'Submitting...' : 'Submit Assessment'}
        </Button>
      </Container>
      </Box>
    </>
  );
};

export default Attempt;
