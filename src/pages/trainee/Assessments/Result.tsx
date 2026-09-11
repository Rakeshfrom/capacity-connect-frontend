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
import {
  getAssessment,
  getAttemptsByTrainee,
  getEnrollments,
  getMyCertificates,
  issueCertificate,
} from '../../../services/api';

type Assessment = {
  id: number;
  title: string;
  description?: string;
  courseId: number;
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

type Enrollment = {
  id: number;
  traineeId: number;
  courseId: number;
  status: string;
  progress: number;
};

type Certificate = {
  id: number;
  traineeId: number;
  courseId: number;
  certificateNumber: string;
  status: 'ISSUED' | 'REVOKED';
};


export default function AssessmentResult() {
  const { assessmentId } = useParams();
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [issuingCertificate, setIssuingCertificate] = useState(false);
  const [certificateMessage, setCertificateMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResult = async () => {
      try {
        const id = Number(assessmentId);

        const [
          assessmentData,
          attempts,
          enrollmentData,
          certificateData,
        ] = await Promise.all([
          getAssessment(id),
          getAttemptsByTrainee(),
          getEnrollments(),
          getMyCertificates(),
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

        const currentEnrollment = enrollmentData.find(
          (item: Enrollment) =>
            Number(item.courseId) === Number(assessmentData.courseId)
        );

        const currentCertificate = certificateData.find(
          (item: Certificate) =>
            Number(item.courseId) === Number(assessmentData.courseId) &&
            item.status === 'ISSUED'
        );

        setEnrollment(currentEnrollment || null);
        setCertificate(currentCertificate || null);
      } catch (error) {
        console.error('Failed to load assessment result', error);
      } finally {
        setLoading(false);
      }
    };

    loadResult();
  }, [assessmentId]);

  const handleIssueCertificate = async () => {
    if (!assessment || !enrollment || attempt?.result !== 'PASSED') {
      return;
    }

    setIssuingCertificate(true);
    setCertificateMessage('');

    try {
      const issued = await issueCertificate(
        enrollment.traineeId,
        assessment.courseId
      );

      setCertificate(issued);
      setCertificateMessage('Certificate issued successfully.');
    } catch (error) {
      console.error('Failed to issue certificate:', error);
      setCertificateMessage(
        'Certificate is not available yet. Complete the course and pass all required assessments.'
      );
    } finally {
      setIssuingCertificate(false);
    }
  };

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

      {passed && enrollment && (
        <Card sx={{ borderRadius: 3, mt: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: '#173f67', mb: 1 }}
            >
              Course Certificate
            </Typography>

            {certificate ? (
              <>
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  Your certificate has been issued successfully.
                </Typography>

                <Button
                  variant="contained"
                  onClick={() => navigate('/trainee/certificates')}
                  sx={{ textTransform: 'none', fontWeight: 700 }}
                >
                  View Certificate
                </Button>
              </>
            ) : (
              <>
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  Certificate issuance requires 100% course completion and
                  passing all required assessments.
                </Typography>

                <Button
                  variant="contained"
                  onClick={handleIssueCertificate}
                  disabled={issuingCertificate || enrollment.progress < 100}
                  sx={{ textTransform: 'none', fontWeight: 700 }}
                >
                  {issuingCertificate ? 'Issuing Certificate...' : 'Get Certificate'}
                </Button>

                {certificateMessage && (
                  <Typography
                    variant="body2"
                    sx={{
                      mt: 2,
                      color: certificateMessage.includes('successfully')
                        ? '#177245'
                        : '#B42318',
                    }}
                  >
                    {certificateMessage}
                  </Typography>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
