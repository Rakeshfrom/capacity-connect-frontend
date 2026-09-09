import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import {
  getCertificates,
  getCourses,
  getUsers,
  issueCertificate as issueCertificateApi,
  revokeCertificate as revokeCertificateApi,
} from '../../../services/api';

interface Certificate {
  id: number;
  traineeId: number;
  courseId: number;
  certificateNumber: string;
  status: 'ISSUED' | 'REVOKED';
  issuedAt: string;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
}

interface Course {
  id: number;
  title: string;
}

const AdminCertifications = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [openIssue, setOpenIssue] = useState(false);
  const [traineeId, setTraineeId] = useState('');
  const [courseId, setCourseId] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      const [certificateData, userData, courseData] =
        await Promise.all([
          getCertificates(),
          getUsers(),
          getCourses(),
        ]);

      setCertificates(certificateData as Certificate[]);
      setUsers(userData as User[]);
      setCourses(courseData as Course[]);
      setError('');
    } catch {
      setError('Unable to load certification data from the backend.');
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const traineeName = (id: number) => {
    const user = users.find((item) => item.id === id);

    return user
      ? `${user.firstName} ${user.lastName}`
      : `Trainee #${id}`;
  };

  const courseName = (id: number) =>
    courses.find((course) => course.id === id)?.title ||
    `Course #${id}`;

  const filteredCertificates = useMemo(() => {
    const value = search.toLowerCase().trim();

    return certificates.filter((certificate) => {
      const matchesStatus =
        statusFilter === 'ALL' ||
        certificate.status === statusFilter;

      const matchesSearch =
        !value ||
        certificate.certificateNumber
          .toLowerCase()
          .includes(value) ||
        traineeName(certificate.traineeId)
          .toLowerCase()
          .includes(value) ||
        courseName(certificate.courseId)
          .toLowerCase()
          .includes(value);

      return matchesStatus && matchesSearch;
    });
  }, [certificates, users, courses, search, statusFilter]);

  const issueCertificate = async () => {
    if (!traineeId || !courseId) {
      setError('Trainee and course are required.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      await issueCertificateApi(Number(traineeId), Number(courseId));

      setOpenIssue(false);
      setTraineeId('');
      setCourseId('');
      await loadData();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to issue certificate.',
      );
    } finally {
      setSaving(false);
    }
  };

  const revokeCertificate = async (id: number) => {
    setError('');

    try {
      await revokeCertificateApi(id);

      await loadData();
    } catch {
      setError('Unable to revoke certificate.');
    }
  };

  const issued = certificates.filter(
    (certificate) => certificate.status === 'ISSUED',
  ).length;

  const revoked = certificates.filter(
    (certificate) => certificate.status === 'REVOKED',
  ).length;

  return (
    <Box sx={{ bgcolor: '#F5F8FA', minHeight: '100vh' }}>
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          sx={{
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'center' },
            gap: 2,
            mb: 4,
          }}
        >
          <Box>
            <Typography
              sx={{
                color: '#0B5A91',
                fontWeight: 700,
                fontSize: '0.82rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              Admin Portal
            </Typography>

            <Typography
              sx={{
                color: '#173F60',
                fontWeight: 800,
                fontSize: { xs: '2rem', md: '2.6rem' },
                mt: 0.5,
              }}
            >
              Certifications
            </Typography>

            <Typography sx={{ color: '#657887', mt: 1 }}>
              Manage issued certificates and certification status.
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddOutlinedIcon />}
            onClick={() => setOpenIssue(true)}
            sx={{
              bgcolor: '#0B5A91',
              textTransform: 'none',
              fontWeight: 700,
              px: 2.5,
              '&:hover': {
                bgcolor: '#084A77',
              },
            }}
          >
            Issue Certificate
          </Button>
        </Stack>

        {error && (
          <Box
            sx={{
              mb: 2.5,
              p: 2,
              borderRadius: 2,
              bgcolor: '#FFF4F2',
              border: '1px solid #F3C7C1',
            }}
          >
            <Typography sx={{ color: '#B42318', fontWeight: 600 }}>
              {error}
            </Typography>
          </Box>
        )}

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
            },
            gap: 2.5,
            mb: 3,
          }}
        >
          {[
            ['Issued', issued],
            ['Revoked', revoked],
          ].map(([label, value]) => (
            <Card
              key={label}
              elevation={0}
              sx={{
                border: '1px solid #DCE8F0',
                borderRadius: 2,
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Stack
                  direction="row"
                  sx={{
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Box>
                    <Typography sx={{ color: '#657887' }}>
                      {label}
                    </Typography>

                    <Typography
                      sx={{
                        color: '#173F60',
                        fontWeight: 800,
                        fontSize: '1.8rem',
                        mt: 0.4,
                      }}
                    >
                      {value}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      width: 46,
                      height: 46,
                      borderRadius: 1.5,
                      bgcolor: '#EAF4FB',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#0B5A91',
                    }}
                  >
                    <WorkspacePremiumOutlinedIcon />
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Box>

        <Card
          elevation={0}
          sx={{
            border: '1px solid #DCE8F0',
            borderRadius: 2,
          }}
        >
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={2}
              sx={{ mb: 3 }}
            >
              <TextField
                fullWidth
                label="Search certificates"
                placeholder="Certificate number, trainee or course"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />

              <FormControl sx={{ minWidth: 180 }}>
                <InputLabel>Status</InputLabel>

                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(event) =>
                    setStatusFilter(event.target.value)
                  }
                >
                  <MenuItem value="ALL">All status</MenuItem>
                  <MenuItem value="ISSUED">Issued</MenuItem>
                  <MenuItem value="REVOKED">Revoked</MenuItem>
                </Select>
              </FormControl>
            </Stack>

            <Box sx={{ overflowX: 'auto' }}>
              <Box sx={{ minWidth: 900 }}>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns:
                      '1.4fr 1.7fr 2fr 1.2fr 1fr 90px',
                    gap: 2,
                    px: 2,
                    py: 1.5,
                    bgcolor: '#F5F8FA',
                    borderRadius: 1.5,
                  }}
                >
                  {[
                    'Certificate',
                    'Trainee',
                    'Course',
                    'Issue Date',
                    'Status',
                    'Action',
                  ].map((heading) => (
                    <Typography
                      key={heading}
                      sx={{
                        color: '#657887',
                        fontWeight: 700,
                        fontSize: '0.82rem',
                      }}
                    >
                      {heading}
                    </Typography>
                  ))}
                </Box>

                {filteredCertificates.map((certificate) => (
                  <Box
                    key={certificate.id}
                    sx={{
                      display: 'grid',
                      gridTemplateColumns:
                        '1.4fr 1.7fr 2fr 1.2fr 1fr 90px',
                      gap: 2,
                      alignItems: 'center',
                      px: 2,
                      py: 2,
                      borderBottom: '1px solid #E4ECF1',
                    }}
                  >
                    <Typography
                      sx={{
                        color: '#173F60',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                      }}
                    >
                      {certificate.certificateNumber}
                    </Typography>

                    <Typography
                      sx={{
                        color: '#657887',
                        fontSize: '0.9rem',
                      }}
                    >
                      {traineeName(certificate.traineeId)}
                    </Typography>

                    <Typography
                      sx={{
                        color: '#657887',
                        fontSize: '0.9rem',
                      }}
                    >
                      {courseName(certificate.courseId)}
                    </Typography>

                    <Typography
                      sx={{
                        color: '#657887',
                        fontSize: '0.9rem',
                      }}
                    >
                      {new Date(
                        certificate.issuedAt,
                      ).toLocaleDateString()}
                    </Typography>

                    <Chip
                      label={certificate.status}
                      size="small"
                      sx={{
                        width: 'fit-content',
                        bgcolor:
                          certificate.status === 'ISSUED'
                            ? '#EAF6EF'
                            : '#F1F3F5',
                        color:
                          certificate.status === 'ISSUED'
                            ? '#147A45'
                            : '#657887',
                        fontWeight: 700,
                      }}
                    />

                    {certificate.status === 'ISSUED' ? (
                      <Button
                        size="small"
                        startIcon={<BlockOutlinedIcon />}
                        onClick={() =>
                          revokeCertificate(certificate.id)
                        }
                        sx={{
                          color: '#B42318',
                          fontWeight: 700,
                          textTransform: 'none',
                        }}
                      >
                        Revoke
                      </Button>
                    ) : (
                      <Typography
                        sx={{
                          color: '#657887',
                          fontSize: '0.82rem',
                        }}
                      >
                        —
                      </Typography>
                    )}
                  </Box>
                ))}

                {filteredCertificates.length === 0 && (
                  <Box sx={{ py: 6, textAlign: 'center' }}>
                    <Typography sx={{ color: '#657887' }}>
                      No certificates found.
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Dialog
          open={openIssue}
          onClose={() => {
            if (!saving) {
              setOpenIssue(false);
              setTraineeId('');
              setCourseId('');
            }
          }}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle
            sx={{
              color: '#173F60',
              fontWeight: 800,
            }}
          >
            Issue Certificate
          </DialogTitle>

          <DialogContent>
            <Stack spacing={2.2} sx={{ pt: 1 }}>
              <FormControl fullWidth>
                <InputLabel>Trainee</InputLabel>

                <Select
                  value={traineeId}
                  label="Trainee"
                  onChange={(event) =>
                    setTraineeId(event.target.value)
                  }
                >
                  {users
                    .filter((user) => user.id)
                    .map((user) => (
                      <MenuItem
                        key={user.id}
                        value={String(user.id)}
                      >
                        {user.firstName} {user.lastName} (@
                        {user.username})
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Course</InputLabel>

                <Select
                  value={courseId}
                  label="Course"
                  onChange={(event) =>
                    setCourseId(event.target.value)
                  }
                >
                  {courses.map((course) => (
                    <MenuItem
                      key={course.id}
                      value={String(course.id)}
                    >
                      {course.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Typography
                sx={{
                  color: '#657887',
                  fontSize: '0.85rem',
                }}
              >
                Certificate issuance eligibility will be enforced by
                the backend in the next certification step.
              </Typography>
            </Stack>
          </DialogContent>

          <DialogActions sx={{ p: 2.5 }}>
            <Button
              onClick={() => setOpenIssue(false)}
              disabled={saving}
              sx={{
                color: '#657887',
                textTransform: 'none',
              }}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              onClick={issueCertificate}
              disabled={saving}
              sx={{
                bgcolor: '#0B5A91',
                textTransform: 'none',
                '&:hover': {
                  bgcolor: '#084A77',
                },
              }}
            >
              {saving ? 'Issuing...' : 'Issue Certificate'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default AdminCertifications;
