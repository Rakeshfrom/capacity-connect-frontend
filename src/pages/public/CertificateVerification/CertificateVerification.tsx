import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';

type VerificationResult = {
  valid: boolean;
  certificateNumber: string;
  traineeName: string;
  courseTitle: string;
  id: number;
  status: 'ISSUED' | 'REVOKED';
  issuedAt: string;
};

const API_BASE = `${import.meta.env.VITE_API_BASE_URL || ''}/api`;

const CertificateVerification = () => {
  const [certificateNumber, setCertificateNumber] = useState('');
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const verifyCertificate = async () => {
    const number = certificateNumber.trim();

    if (!number) {
      return;
    }

    setLoading(true);
    setSearched(true);
    setResult(null);

    try {
      const response = await fetch(
        `${API_BASE}/certificates/verify/${encodeURIComponent(number)}`
      );

      if (!response.ok) {
        throw new Error('Certificate not found');
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Certificate verification failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ bgcolor: '#F5F8FA', minHeight: '100%' }}>
      <Container maxWidth="md" sx={{ py: { xs: 4, md: 7 } }}>
        <Box sx={{ textAlign: 'center' }}>
          <VerifiedOutlinedIcon
            sx={{ color: '#0B5A91', fontSize: 52 }}
          />

          <Typography
            variant="h3"
            sx={{
              mt: 1,
              color: '#173F60',
              fontWeight: 700,
              fontSize: { xs: '2rem', md: '2.5rem' },
            }}
          >
            Certificate Verification
          </Typography>

          <Typography
            sx={{
              mt: 1,
              color: '#657887',
              maxWidth: 650,
              mx: 'auto',
            }}
          >
            Verify the authenticity and status of a Capacity Connect
            certificate using its unique certificate number.
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            mt: 4,
            p: { xs: 2.5, md: 3 },
            border: '1px solid #DCE6ED',
            borderRadius: 2,
          }}
        >
          <Typography
            sx={{
              color: '#244A66',
              fontWeight: 700,
              mb: 1.5,
            }}
          >
            Certificate Number
          </Typography>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1.5}
          >
            <TextField
              fullWidth
              value={certificateNumber}
              onChange={(event) =>
                setCertificateNumber(event.target.value)
              }
              placeholder="e.g. CC-739AF32B"
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  verifyCertificate();
                }
              }}
            />

            <Button
              variant="contained"
              startIcon={<SearchOutlinedIcon />}
              onClick={verifyCertificate}
              disabled={!certificateNumber.trim() || loading}
              sx={{
                minWidth: 145,
                minHeight: 56,
              }}
            >
              {loading ? <CircularProgress size={24} /> : 'Verify'}
            </Button>
          </Stack>
        </Paper>

        {searched && !loading && !result && (
          <Alert
            severity="error"
            sx={{ mt: 3 }}
          >
            Certificate not found. Please check the certificate number
            and try again.
          </Alert>
        )}

        {result && (
          <Paper
            elevation={0}
            sx={{
              mt: 3,
              border: '1px solid #DCE6ED',
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                p: 3,
                bgcolor: result.valid ? '#EAF6EF' : '#FDECEC',
                borderBottom: '1px solid #DCE6ED',
              }}
            >
              <Stack
                direction="row"
                spacing={1.5}
                sx={{ alignItems: 'center' }}
              >
                <VerifiedOutlinedIcon
                  sx={{
                    color: result.valid ? '#177245' : '#B42318',
                    fontSize: 34,
                  }}
                />

                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      color: result.valid ? '#177245' : '#B42318',
                      fontWeight: 700,
                    }}
                  >
                    {result.valid
                      ? 'Certificate Verified'
                      : 'Certificate Revoked'}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{ color: '#657887', mt: 0.3 }}
                  >
                    {result.valid
                      ? 'This certificate matches an issued Capacity Connect record.'
                      : 'This certificate is no longer valid.'}
                  </Typography>
                </Box>
              </Stack>
            </Box>

            <Box sx={{ p: { xs: 2.5, md: 3 } }}>
              <Stack spacing={2.5}>
                <Stack direction="row" spacing={1.5}>
                  <WorkspacePremiumOutlinedIcon
                    sx={{ color: '#0B5A91' }}
                  />
                  <Box>
                    <Typography variant="body2" sx={{ color: '#657887' }}>
                      Certificate Number
                    </Typography>
                    <Typography sx={{ color: '#244A66', fontWeight: 700 }}>
                      {result.certificateNumber}
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={1.5}>
                  <PersonOutlineOutlinedIcon
                    sx={{ color: '#0B5A91' }}
                  />
                  <Box>
                    <Typography variant="body2" sx={{ color: '#657887' }}>
                      Earned By
                    </Typography>
                    <Typography sx={{ color: '#244A66', fontWeight: 700 }}>
                      {result.traineeName}
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={1.5}>
                  <SchoolOutlinedIcon sx={{ color: '#0B5A91' }} />
                  <Box>
                    <Typography variant="body2" sx={{ color: '#657887' }}>
                      Course
                    </Typography>
                    <Typography sx={{ color: '#244A66', fontWeight: 700 }}>
                      {result.courseTitle}
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={1.5}>
                  <CalendarTodayOutlinedIcon
                    sx={{ color: '#0B5A91' }}
                  />
                  <Box>
                    <Typography variant="body2" sx={{ color: '#657887' }}>
                      Issued On
                    </Typography>
                    <Typography sx={{ color: '#244A66', fontWeight: 700 }}>
                      {new Date(result.issuedAt).toLocaleDateString(
                        'en-IN',
                        {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        }
                      )}
                    </Typography>
                  </Box>
                </Stack>

                <Stack
                  direction="row"
                  sx={{ alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <Typography
                    variant="body2"
                    sx={{ color: '#657887' }}
                  >
                    Certificate Status
                  </Typography>

                  <Chip
                    label={result.status}
                    sx={{
                      bgcolor: result.valid ? '#EAF6EF' : '#FDECEC',
                      color: result.valid ? '#177245' : '#B42318',
                      fontWeight: 700,
                    }}
                  />
                </Stack>

                {result.valid && (
                  <Button
                    variant="outlined"
                    startIcon={<WorkspacePremiumOutlinedIcon />}
                    onClick={() =>
                      window.open(
                        `${API_BASE}/certificates/${result.id}/view`,
                        '_blank'
                      )
                    }
                  >
                    View Matched Certificate
                  </Button>
                )}
              </Stack>
            </Box>
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default CertificateVerification;
