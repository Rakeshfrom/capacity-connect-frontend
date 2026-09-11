import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';

import {
  createAssessment,
  createQuestion,
  deleteQuestion,
  getQuestionsByAssessment,
} from '../../../../services/api';

type Question = {
  id: number;
  assessmentId: number;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: 'A' | 'B' | 'C' | 'D';
  marks: number;
};

type Props = {
  courseId: number;
  moduleId: number;
  onSaved: () => void;
};

const AssessmentBuilder = ({
  courseId,
  moduleId,
  onSaved,
}: Props) => {
  const [step, setStep] = useState<'details' | 'mode' | 'questions'>(
    'details'
  );

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [timeLimit, setTimeLimit] = useState(30);
  const [passingPercentage, setPassingPercentage] = useState(50);
  const [mode, setMode] = useState<'MANUAL' | 'AI'>('MANUAL');

  const [assessmentId, setAssessmentId] = useState<number | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);

  const [questionDialog, setQuestionDialog] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [error, setError] = useState('');

  const [questionText, setQuestionText] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [optionD, setOptionD] = useState('');
  const [correctOption, setCorrectOption] =
    useState<'A' | 'B' | 'C' | 'D'>('A');
  const [marks, setMarks] = useState(1);

  const resetQuestion = () => {
    setQuestionText('');
    setOptionA('');
    setOptionB('');
    setOptionC('');
    setOptionD('');
    setCorrectOption('A');
    setMarks(1);
  };

  const saveAssessmentDetails = async () => {
    if (!title.trim()) {
      setError('Assessment title is required.');
      return;
    }

    try {
      setSaving(true);
      setError('');

      const result = await createAssessment({
        courseId,
        moduleId,
        title: title.trim(),
        description: description.trim(),
        timeLimitMinutes: timeLimit,
        passingPercentage,
        status: 'DRAFT',
      });

      const id = Number(result.id);
      setAssessmentId(id);

      if (mode === 'AI') {
        setStep('questions');
        return;
      }

      setStep('questions');
    } catch (err) {
      console.error(err);
      setError('Unable to create assessment.');
    } finally {
      setSaving(false);
    }
  };

  const loadQuestions = async () => {
    if (!assessmentId) return;

    try {
      setLoadingQuestions(true);
      const data = await getQuestionsByAssessment(assessmentId);
      setQuestions(data ?? []);
    } catch (err) {
      console.error(err);
      setError('Unable to load questions.');
    } finally {
      setLoadingQuestions(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, [assessmentId]);

  const saveQuestion = async () => {
    if (
      !assessmentId ||
      !questionText.trim() ||
      !optionA.trim() ||
      !optionB.trim() ||
      !optionC.trim() ||
      !optionD.trim()
    ) {
      return;
    }

    try {
      setSaving(true);
      setError('');

      await createQuestion({
        assessmentId,
        questionText: questionText.trim(),
        optionA: optionA.trim(),
        optionB: optionB.trim(),
        optionC: optionC.trim(),
        optionD: optionD.trim(),
        correctOption,
        marks,
      });

      resetQuestion();
      setQuestionDialog(false);
      await loadQuestions();
    } catch (err) {
      console.error(err);
      setError('Unable to save question.');
    } finally {
      setSaving(false);
    }
  };

  const removeQuestion = async (id: number) => {
    if (!window.confirm('Delete this question?')) return;

    try {
      await deleteQuestion(id);
      await loadQuestions();
    } catch (err) {
      console.error(err);
      setError('Unable to delete question.');
    }
  };

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {step === 'details' && (
        <Stack spacing={2}>
          <Typography
            sx={{
              color: '#173F60',
              fontSize: '1.2rem',
              fontWeight: 800,
            }}
          >
            Create Assessment
          </Typography>

          <TextField
            label="Assessment Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            fullWidth
          />

          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            minRows={3}
            fullWidth
          />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              label="Time Limit (minutes)"
              type="number"
              value={timeLimit}
              onChange={(e) =>
                setTimeLimit(Number(e.target.value))
              }
              fullWidth
            />

            <TextField
              label="Passing Percentage"
              type="number"
              value={passingPercentage}
              onChange={(e) =>
                setPassingPercentage(Number(e.target.value))
              }
              fullWidth
            />
          </Stack>

          <Button
            variant="contained"
            onClick={() => setStep('mode')}
            disabled={!title.trim()}
            sx={{
              alignSelf: 'flex-end',
              textTransform: 'none',
              bgcolor: '#0B5A91',
            }}
          >
            Continue
          </Button>
        </Stack>
      )}

      {step === 'mode' && (
        <Stack spacing={2}>
          <Typography
            sx={{
              color: '#173F60',
              fontSize: '1.2rem',
              fontWeight: 800,
            }}
          >
            How should questions be created?
          </Typography>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
          >
            <Card
              onClick={() => setMode('MANUAL')}
              sx={{
                flex: 1,
                cursor: 'pointer',
                border: '2px solid',
                borderColor:
                  mode === 'MANUAL' ? '#0B5A91' : '#DCE8F0',
              }}
            >
              <CardContent>
                <QuizOutlinedIcon
                  sx={{ color: '#0B5A91', fontSize: 34 }}
                />

                <Typography
                  sx={{
                    mt: 1,
                    color: '#173F60',
                    fontWeight: 800,
                  }}
                >
                  Manual
                </Typography>

                <Typography
                  sx={{
                    mt: 0.5,
                    color: '#718594',
                    fontSize: '0.85rem',
                  }}
                >
                  Create and control every MCQ yourself.
                </Typography>
              </CardContent>
            </Card>

            <Card
              onClick={() => setMode('AI')}
              sx={{
                flex: 1,
                cursor: 'pointer',
                border: '2px solid',
                borderColor:
                  mode === 'AI' ? '#0B5A91' : '#DCE8F0',
              }}
            >
              <CardContent>
                <AutoAwesomeOutlinedIcon
                  sx={{ color: '#0B5A91', fontSize: 34 }}
                />

                <Typography
                  sx={{
                    mt: 1,
                    color: '#173F60',
                    fontWeight: 800,
                  }}
                >
                  AI Generated
                </Typography>

                <Typography
                  sx={{
                    mt: 0.5,
                    color: '#718594',
                    fontSize: '0.85rem',
                  }}
                >
                  Generate questions automatically and review them.
                </Typography>
              </CardContent>
            </Card>
          </Stack>

          <Stack
            direction="row"
            spacing={1}
            sx={{ justifyContent: 'flex-end' }}
          >
            <Button
              onClick={() => setStep('details')}
              sx={{ textTransform: 'none' }}
            >
              Back
            </Button>

            <Button
              variant="contained"
              onClick={saveAssessmentDetails}
              disabled={saving}
              sx={{
                textTransform: 'none',
                bgcolor: '#0B5A91',
              }}
            >
              {saving ? 'Creating...' : 'Create Assessment'}
            </Button>
          </Stack>
        </Stack>
      )}

      {step === 'questions' && (
        <Stack spacing={2}>
          <Box>
            <Typography
              sx={{
                color: '#173F60',
                fontSize: '1.2rem',
                fontWeight: 800,
              }}
            >
              {title}
            </Typography>

            <Typography
              sx={{
                color: '#718594',
                fontSize: '0.84rem',
                mt: 0.4,
              }}
            >
              {mode === 'MANUAL'
                ? 'Add and manage your MCQ questions.'
                : 'AI questions will appear here for trainer review.'}
            </Typography>
          </Box>

          {mode === 'AI' && (
            <Alert severity="info">
              AI generation is reserved for the next integration step.
              No generated questions are inserted automatically.
            </Alert>
          )}

          {loadingQuestions ? (
            <Box
              sx={{
                minHeight: 150,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <>
              {questions.length === 0 ? (
                <Box
                  sx={{
                    border: '1px dashed #BCD2E2',
                    borderRadius: 2,
                    textAlign: 'center',
                    py: 5,
                    bgcolor: '#FAFCFE',
                  }}
                >
                  <QuizOutlinedIcon
                    sx={{
                      fontSize: 42,
                      color: '#8AA5B7',
                    }}
                  />

                  <Typography
                    sx={{
                      mt: 1,
                      color: '#173F60',
                      fontWeight: 700,
                    }}
                  >
                    No questions added
                  </Typography>

                  {mode === 'MANUAL' && (
                    <Button
                      startIcon={<AddOutlinedIcon />}
                      onClick={() => {
                        resetQuestion();
                        setQuestionDialog(true);
                      }}
                      sx={{
                        mt: 1.5,
                        textTransform: 'none',
                        color: '#0B5A91',
                        fontWeight: 700,
                      }}
                    >
                      Add Question
                    </Button>
                  )}
                </Box>
              ) : (
                <>
                  <Stack spacing={1.25}>
                    {questions.map((question, index) => (
                      <Card
                        key={question.id}
                        elevation={0}
                        sx={{
                          border: '1px solid #DCE8F0',
                        }}
                      >
                        <CardContent>
                          <Stack
                            direction="row"
                            sx={{
                              justifyContent: 'space-between',
                              alignItems: 'flex-start',
                            }}
                          >
                            <Box sx={{ flex: 1 }}>
                              <Typography
                                sx={{
                                  color: '#173F60',
                                  fontWeight: 700,
                                }}
                              >
                                {index + 1}. {question.questionText}
                              </Typography>

                              <Typography
                                sx={{
                                  mt: 1,
                                  color: '#718594',
                                  fontSize: '0.85rem',
                                }}
                              >
                                A. {question.optionA}
                              </Typography>

                              <Typography
                                sx={{
                                  color: '#718594',
                                  fontSize: '0.85rem',
                                }}
                              >
                                B. {question.optionB}
                              </Typography>

                              <Typography
                                sx={{
                                  color: '#718594',
                                  fontSize: '0.85rem',
                                }}
                              >
                                C. {question.optionC}
                              </Typography>

                              <Typography
                                sx={{
                                  color: '#718594',
                                  fontSize: '0.85rem',
                                }}
                              >
                                D. {question.optionD}
                              </Typography>

                              <Typography
                                sx={{
                                  mt: 1,
                                  color: '#0B5A91',
                                  fontSize: '0.8rem',
                                  fontWeight: 700,
                                }}
                              >
                                Correct: {question.correctOption} ·{' '}
                                {question.marks} mark
                              </Typography>
                            </Box>

                            <IconButton
                              onClick={() =>
                                removeQuestion(question.id)
                              }
                              sx={{ color: '#A94442' }}
                            >
                              <DeleteOutlineOutlinedIcon />
                            </IconButton>
                          </Stack>
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>

                  {mode === 'MANUAL' && (
                    <Button
                      startIcon={<AddOutlinedIcon />}
                      onClick={() => {
                        resetQuestion();
                        setQuestionDialog(true);
                      }}
                      variant="outlined"
                      sx={{
                        alignSelf: 'flex-start',
                        textTransform: 'none',
                        color: '#0B5A91',
                        borderColor: '#BCD2E2',
                      }}
                    >
                      Add Another Question
                    </Button>
                  )}
                </>
              )}
            </>
          )}

          <Divider />

          <Stack
            direction="row"
            sx={{
              justifyContent: 'flex-end',
              gap: 1,
            }}
          >
            <Button
              onClick={onSaved}
              variant="contained"
              disabled={mode === 'MANUAL' && questions.length === 0}
              sx={{
                textTransform: 'none',
                bgcolor: '#0B5A91',
              }}
            >
              Save Assessment
            </Button>
          </Stack>
        </Stack>
      )}

      <Dialog
        open={questionDialog}
        onClose={() => !saving && setQuestionDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ color: '#173F60', fontWeight: 800 }}>
          Add MCQ Question
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              label="Question"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              multiline
              minRows={3}
              required
              fullWidth
            />

            <TextField
              label="Option A"
              value={optionA}
              onChange={(e) => setOptionA(e.target.value)}
              required
              fullWidth
            />

            <TextField
              label="Option B"
              value={optionB}
              onChange={(e) => setOptionB(e.target.value)}
              required
              fullWidth
            />

            <TextField
              label="Option C"
              value={optionC}
              onChange={(e) => setOptionC(e.target.value)}
              required
              fullWidth
            />

            <TextField
              label="Option D"
              value={optionD}
              onChange={(e) => setOptionD(e.target.value)}
              required
              fullWidth
            />

            <Stack direction="row" spacing={2}>
              <TextField
                select
                label="Correct Answer"
                value={correctOption}
                onChange={(e) =>
                  setCorrectOption(
                    e.target.value as 'A' | 'B' | 'C' | 'D'
                  )
                }
                fullWidth
              >
                <MenuItem value="A">Option A</MenuItem>
                <MenuItem value="B">Option B</MenuItem>
                <MenuItem value="C">Option C</MenuItem>
                <MenuItem value="D">Option D</MenuItem>
              </TextField>

              <TextField
                label="Marks"
                type="number"
                value={marks}
                onChange={(e) => setMarks(Number(e.target.value))}
                fullWidth
              />
            </Stack>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setQuestionDialog(false)}
            disabled={saving}
            sx={{ textTransform: 'none' }}
          >
            Cancel
          </Button>

          <Button
            onClick={saveQuestion}
            variant="contained"
            disabled={
              saving ||
              !questionText.trim() ||
              !optionA.trim() ||
              !optionB.trim() ||
              !optionC.trim() ||
              !optionD.trim()
            }
            sx={{
              textTransform: 'none',
              bgcolor: '#0B5A91',
            }}
          >
            {saving ? 'Saving...' : 'Save Question'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AssessmentBuilder;
