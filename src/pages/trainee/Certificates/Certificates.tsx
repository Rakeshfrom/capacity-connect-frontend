import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Container,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';

type Certificate = {
  id: number;
  traineeId: number;
  courseId: number;
  certificateNumber: string;
  status: 'ISSUED' | 'REVOKED';
  issuedAt: string;
};

type Course = {
  id: number;
  title: string;
};

const TRAINEE_ID = 1;
const API_BASE = `${import.meta.env.VITE_API_BASE_URL || ''}/api`;

const Certificates = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [certificateResponse, courseResponse] = await Promise.all([
          fetch(`${API_BASE}/certificates/trainee/${TRAINEE_ID}`),
          fetch(`${API_BASE}/courses`),
        ]);

        if (!certificateResponse.ok || !courseResponse.ok) {
          throw new Error('Failed to load certificate data');
        }

        const certificateData = await certificateResponse.json();
        const courseData = await courseResponse.json();

        setCertificates(certificateData);
        setCourses(courseData);
      } catch (error) {
        console.error('Failed to load certificates:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getCourseTitle = (courseId: number) => {
    return (
      courses.find((course) => course.id === courseId)?.title ||
      'Course information unavailable'
    );
  };

  const issuedCount = certificates.filter(
    (certificate) => certificate.status === 'ISSUED'
  ).length;

  const viewCertificate = (id: number) => {
    window.open(`${API_BASE}/certificates/${id}/view`, '_blank');
  };

  const downloadCertificate = async (id: number) => {
    try {
      const response = await fetch(
        `${API_BASE}/certificates/${id}/download`
      );

      if (!response.ok) {
        throw new Error('Failed to download certificate');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = url;
      link.download = `certificate-${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download certificate:', error);
    }
  };

  return (
    <Box sx={{ bgcolor: '#F5F8FA', minHeight: '100%' }}>
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
        <Typography
          variant="h3"
          sx={{
            color: '#173F60',
            fontWeight: 700,
            fontSize: { xs: '2rem', md: '2.5rem' },
          }}
        >
          Certificates
        </Typography>

        <Typography sx={{ mt: 1, color: '#657887' }}>
          View and manage your course completion certificates.
        </Typography>

        <Paper
          elevation={0}
          sx={{
            mt: 4,
            p: 3,
            border: '1px solid #DCE6ED',
            borderRadius: 2,
          }}
        >
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <WorkspacePremiumOutlinedIcon
              sx={{ color: '#0B5A91', fontSize: 36 }}
            />

            <Box>
              <Typography
                variant="h5"
                sx={{ color: '#173F60', fontWeight: 700 }}
              >
                {issuedCount} {issuedCount === 1 ? 'Certificate' : 'Certificates'}
              </Typography>
              <Typography sx={{ color: '#657887', mt: 0.5 }}>
                Successfully completed learning programmes.
              </Typography>
            </Box>
          </Stack>
        </Paper>

        {loading ? (
          <Typography sx={{ mt: 4, color: '#657887' }}>
            Loading certificates...
          </Typography>
        ) : certificates.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              mt: 3,
              p: 4,
              border: '1px solid #DCE6ED',
              borderRadius: 2,
              textAlign: 'center',
            }}
          >
            <Typography sx={{ color: '#657887' }}>
              No certificates have been issued yet.
            </Typography>
          </Paper>
        ) : (
          <Stack spacing={2} sx={{ mt: 3 }}>
            {certificates.map((certificate) => (
              <Paper
                key={certificate.id}
                elevation={0}
                sx={{
                  p: { xs: 2.5, md: 3 },
                  border: '1px solid #DCE6ED',
                  borderRadius: 2,
                }}
              >
                <Stack
                  direction={{ xs: 'column', md: 'row' }}
                  spacing={2}
                  sx={{
                    alignItems: { xs: 'flex-start', md: 'center' },
                    justifyContent: 'space-between',
                  }}
                >
                  <Box>
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ alignItems: 'center' }}
                    >
                      <WorkspacePremiumOutlinedIcon
                        sx={{ color: '#0B5A91' }}
                      />
                      <Typography
                        sx={{ color: '#0B5A91', fontWeight: 700 }}
                      >
                        Certificate of Completion
                      </Typography>
                    </Stack>

                    <Typography
                      variant="h6"
                      sx={{
                        mt: 1,
                        color: '#244A66',
                        fontWeight: 700,
                      }}
                    >
                      {getCourseTitle(certificate.courseId)}
                    </Typography>

                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{
                        mt: 1,
                        color: '#657887',
                        alignItems: 'center',
                      }}
                    >
                      <CalendarTodayOutlinedIcon sx={{ fontSize: 17 }} />
                      <Typography variant="body2">
                        Issued{' '}
                        {new Date(certificate.issuedAt).toLocaleDateString(
                          'en-IN',
                          {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          }
                        )}
                      </Typography>
                    </Stack>

                    <Typography
                      variant="body2"
                      sx={{ mt: 1, color: '#657887' }}
                    >
                      Certificate ID: {certificate.certificateNumber}
                    </Typography>
                  </Box>

                  <Stack
                    direction="row"
                    spacing={1.5}
                    sx={{ alignItems: 'center' }}
                  >
                    <Chip
                      label={
                        certificate.status === 'ISSUED'
                          ? 'Issued'
                          : 'Revoked'
                      }
                      size="small"
                      sx={{
                        bgcolor:
                          certificate.status === 'ISSUED'
                            ? '#EAF6EF'
                            : '#FDECEC',
                        color:
                          certificate.status === 'ISSUED'
                            ? '#177245'
                            : '#B42318',
                        fontWeight: 600,
                      }}
                    />

                    <Button
                      variant="outlined"
                      onClick={() => viewCertificate(certificate.id)}
                      disabled={certificate.status !== 'ISSUED'}
                    >
                      View Certificate
                    </Button>

                    <Button
                      variant="contained"
                      onClick={() => downloadCertificate(certificate.id)}
                      disabled={certificate.status !== 'ISSUED'}
                    >
                      Download
                    </Button>
                  </Stack>
                </Stack>
              </Paper>
            ))}
          </Stack>
        )}
      </Container>
    </Box>
  );
};

export default Certificates;
