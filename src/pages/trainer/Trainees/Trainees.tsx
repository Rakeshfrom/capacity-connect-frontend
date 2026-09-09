import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { getTrainerTrainees } from '../../../services/api';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  InputAdornment,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

type Trainee = {
  traineeId: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  courseId: number;
  courseTitle: string;
  enrollmentStatus: string;
  progress: number;
};

const Trainees = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [trainees, setTrainees] = useState<Trainee[]>([]);
  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    getTrainerTrainees(user.id)
      .then((data) => setTrainees(data))
      .catch((error) => console.error('Failed to load trainees:', error))
      .finally(() => setLoading(false));
  }, [user?.id]);

  const filteredTrainees = useMemo(() => {
    return trainees.filter((trainee) => {
      const name = `${trainee.firstName} ${trainee.lastName}`.toLowerCase();

      const matchesSearch =
        name.includes(search.toLowerCase()) ||
        trainee.username.toLowerCase().includes(search.toLowerCase()) ||
        trainee.email.toLowerCase().includes(search.toLowerCase());

      const matchesCourse =
        courseFilter === 'all' ||
        trainee.courseId.toString() === courseFilter;

      return matchesSearch && matchesCourse;
    });
  }, [trainees, search, courseFilter]);

  const courseOptions = Array.from(
    new Map(
      trainees.map((trainee) => [
        trainee.courseId,
        trainee.courseTitle,
      ])
    ).entries()
  );

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
              Trainer Portal
            </Typography>

            <Typography
              sx={{
                color: '#173F60',
                fontWeight: 800,
                fontSize: { xs: '2rem', md: '2.6rem' },
                mt: 0.5,
              }}
            >
              Trainees
            </Typography>

            <Typography sx={{ color: '#657887', mt: 1 }}>
              Monitor trainee participation, progress and assessment performance.
            </Typography>
          </Box>

          <Box
            sx={{
              width: 54,
              height: 54,
              borderRadius: 1.5,
              bgcolor: '#EAF4FB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <PeopleOutlineOutlinedIcon
              sx={{ color: '#0B5A91', fontSize: 28 }}
            />
          </Box>
        </Stack>

        <Card
          elevation={0}
          sx={{
            border: '1px solid #DCE8F0',
            borderRadius: 2,
            mb: 3,
          }}
        >
          <CardContent sx={{ p: 2 }}>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              sx={{ gap: 2 }}
            >
              <TextField
                placeholder="Search trainees..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                fullWidth
                size="small"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchOutlinedIcon sx={{ color: '#718594' }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <Select
                value={courseFilter}
                onChange={(event) => setCourseFilter(event.target.value)}
                size="small"
                sx={{ minWidth: { md: 240 } }}
              >
                <MenuItem value="all">All courses</MenuItem>

                {courseOptions.map(([courseId, courseTitle]) => (
                  <MenuItem key={courseId} value={courseId.toString()}>
                    {courseTitle}
                  </MenuItem>
                ))}
              </Select>
            </Stack>
          </CardContent>
        </Card>

        <Typography
          sx={{
            color: '#526B7A',
            fontWeight: 700,
            mb: 1.5,
          }}
        >
          {loading
            ? 'Loading trainees...'
            : `${filteredTrainees.length} trainee${
                filteredTrainees.length !== 1 ? 's' : ''
              }`}
        </Typography>

        {!loading && filteredTrainees.length === 0 && (
          <Card
            elevation={0}
            sx={{
              border: '1px solid #DCE8F0',
              borderRadius: 2,
            }}
          >
            <CardContent sx={{ py: 5, textAlign: 'center' }}>
              <Typography sx={{ color: '#657887' }}>
                No trainees found.
              </Typography>
            </CardContent>
          </Card>
        )}

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' },
            gap: 2.5,
          }}
        >
          {filteredTrainees.map((trainee) => {
            const name = `${trainee.firstName} ${trainee.lastName}`.trim();
            const initials = name
              .split(' ')
              .map((word) => word[0])
              .join('');

            const status =
              trainee.enrollmentStatus === 'COMPLETED'
                ? 'Completed'
                : trainee.enrollmentStatus === 'DROPPED'
                  ? 'Dropped'
                  : 'Active';

            return (
              <Card
                key={`${trainee.traineeId}-${trainee.courseId}`}
                elevation={0}
                sx={{
                  border: '1px solid #DCE8F0',
                  borderRadius: 2,
                }}
              >
                <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                  <Stack
                    direction="row"
                    sx={{
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: 2,
                    }}
                  >
                    <Stack
                      direction="row"
                      sx={{ alignItems: 'center', gap: 1.5 }}
                    >
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: '50%',
                          bgcolor: '#0B5A91',
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                        }}
                      >
                        {initials}
                      </Box>

                      <Box>
                        <Typography
                          sx={{
                            color: '#173F60',
                            fontWeight: 700,
                            fontSize: '1.05rem',
                          }}
                        >
                          {name}
                        </Typography>

                        <Typography
                          sx={{
                            color: '#718594',
                            fontSize: '0.9rem',
                            mt: 0.2,
                          }}
                        >
                          {trainee.email}
                        </Typography>
                      </Box>
                    </Stack>

                    <Chip
                      label={status}
                      size="small"
                      sx={{
                        bgcolor:
                          status === 'Active' ? '#EAF6EF' : '#FFF4E5',
                        color:
                          status === 'Active' ? '#147A45' : '#A35A00',
                        fontWeight: 700,
                      }}
                    />
                  </Stack>

                  <Typography
                    sx={{
                      color: '#526B7A',
                      mt: 2.5,
                      fontSize: '0.92rem',
                    }}
                  >
                    {trainee.courseTitle}
                  </Typography>

                  <Stack
                    direction="row"
                    sx={{
                      justifyContent: 'space-between',
                      mt: 2,
                      mb: 0.7,
                    }}
                  >
                    <Typography sx={{ color: '#657887', fontSize: '0.9rem' }}>
                      Course progress
                    </Typography>

                    <Typography
                      sx={{
                        color: '#0B5A91',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                      }}
                    >
                      {trainee.progress}%
                    </Typography>
                  </Stack>

                  <Box
                    sx={{
                      height: 7,
                      bgcolor: '#E1EAF0',
                      borderRadius: 5,
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      sx={{
                        width: `${trainee.progress}%`,
                        height: '100%',
                        bgcolor: '#0B5A91',
                        borderRadius: 5,
                      }}
                    />
                  </Box>

                  <Typography
                    sx={{
                      color: '#657887',
                      fontSize: '0.9rem',
                      mt: 2,
                    }}
                  >
                    Enrollment status:{' '}
                    <strong style={{ color: '#173F60' }}>
                      {trainee.enrollmentStatus}
                    </strong>
                  </Typography>

                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => navigate(`/trainer/trainees/${trainee.traineeId}`)}
                    startIcon={<VisibilityOutlinedIcon />}
                    sx={{
                      mt: 2.5,
                      borderColor: '#BCD2E2',
                      color: '#0B5A91',
                      textTransform: 'none',
                      fontWeight: 700,
                      '&:hover': {
                        borderColor: '#0B5A91',
                        bgcolor: '#F5F9FC',
                      },
                    }}
                  >
                    View Trainee
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      </Container>
    </Box>
  );
};

export default Trainees;
