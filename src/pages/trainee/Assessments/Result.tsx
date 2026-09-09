import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getAssessment, getAttemptsByTrainee } from '../../../services/api';

type Assessment = {
  id: number;
  title: string;
  description?: string;
};

type Attempt = {
  id: number;
  assessmentId: number;
  score: number;
  totalMarks: number;
  percentage: number;
  result: 'PENDING' | 'PASSED' | 'FAILED';
  startedAt: string;
  submittedAt?: string;
};


export default function AssessmentResult() {
  const { assessmentId } = useParams();
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResult = async () => {
      try {
        const id = Number(assessmentId);

        const [assessmentData, attempts] = await Promise.all([
          getAssessment(id),
          getAttemptsByTrainee(),
        ]);

        const completedAttempts = attempts
          .filter(
            (item: Attempt) =>
              item.assessmentId === id && item.result !== 'PENDING'
          )
          .sort(
            (a: Attempt, b: Attempt) =>
              new Date(b.submittedAt || b.startedAt).getTime() -
              new Date(a.submittedAt || a.startedAt).getTime()
          );

        setAssessment(assessmentData);
        setAttempt(completedAttempts[0] || null);
      } catch (error) {
        console.error('Failed to load assessment result', error);
      } finally {
        setLoading(false);
      }
    };

    loadResult();
  }, [assessmentId]);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!assessment || !attempt) {
    return (
      <Box sx={{ maxWidth: 1000, mx: 'auto', px: 3, py: 6 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
          Result not available
        </Typography>

        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/trainee/assessments')}
        >
          Back to Assessments
        </Button>
      </Box>
    );
  }

  const passed = attempt.result === 'PASSED';

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', px: 3, py: 5 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/trainee/assessments')}
        sx={{ mb: 4 }}
      >
        Back to Assessments
      </Button>

      <Card sx={{ borderRadius: 3, mb: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: 2,
              flexWrap: 'wrap',
            }}
          >
            <Box>
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, color: '#173f67', mb: 1 }}
              >
                Assessment Result
              </Typography>

              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {assessment.title}
              </Typography>

              {assessment.description && (
                <Typography color="text.secondary" sx={{ mt: 1 }}>
                  {assessment.description}
                </Typography>
              )}
            </Box>

            <Chip
              label={passed ? 'PASSED' : 'FAILED'}
              color={passed ? 'success' : 'error'}
              sx={{ fontWeight: 700 }}
            />
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, color: '#173f67', mb: 3 }}
          >
            Result Summary
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(3, 1fr)',
              },
              gap: 3,
              mb: 4,
            }}
          >
            <Box>
              <Typography color="text.secondary">Score</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {attempt.score} / {attempt.totalMarks}
              </Typography>
            </Box>

            <Box>
              <Typography color="text.secondary">Percentage</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {attempt.percentage}%
              </Typography>
            </Box>

            <Box>
              <Typography color="text.secondary">Result</Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {attempt.result}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: '1fr 1fr',
              },
              gap: 3,
            }}
          >
            <Box>
              <Typography color="text.secondary">Started At</Typography>
              <Typography sx={{ fontWeight: 600 }}>
                {new Date(attempt.startedAt).toLocaleString()}
              </Typography>
            </Box>

            <Box>
              <Typography color="text.secondary">Submitted At</Typography>
              <Typography sx={{ fontWeight: 600 }}>
                {attempt.submittedAt
                  ? new Date(attempt.submittedAt).toLocaleString()
                  : '-'}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
