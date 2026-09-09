import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import PersonSearchOutlinedIcon from '@mui/icons-material/PersonSearchOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';

import { useEffect, useState } from 'react';
import { getCompetencyMapping } from '../../../services/api';

const competencies = [
  'Weather Forecasting',
  'Numerical Weather Prediction',
  'Climate Science',
  'Meteorological Observations',
  'Atmospheric Science',
];

const CompetencyMapping = () => {
  const [competency, setCompetency] = useState('Weather Forecasting');
  const [trainers, setTrainers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (event: SelectChangeEvent) => {
    setCompetency(event.target.value);
  };

  const findTrainers = async () => {
    setLoading(true);

    try {
      const response = await getCompetencyMapping(competency);
      setTrainers(response.trainers ?? []);
    } catch (error) {
      console.error('Failed to load competency mapping:', error);
      setTrainers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    findTrainers();
  }, []);

  return (
    <Box sx={{ bgcolor: '#F5F8FA', minHeight: '100vh' }}>
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
        <Box sx={{ mb: 4 }}>
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
            Competency Mapping
          </Typography>

          <Typography sx={{ color: '#657887', mt: 1 }}>
            Identify suitable trainers based on expertise, experience and
            current workload.
          </Typography>
        </Box>

        <Card
          elevation={0}
          sx={{
            border: '1px solid #DCE8F0',
            borderRadius: 2,
            mb: 3,
          }}
        >
          <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              sx={{
                alignItems: { xs: 'stretch', md: 'flex-end' },
                gap: 2,
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography
                  sx={{
                    color: '#173F60',
                    fontWeight: 700,
                    mb: 1,
                  }}
                >
                  Required Competency
                </Typography>

                <Select
                  fullWidth
                  size="small"
                  value={competency}
                  onChange={handleChange}
                >
                  {competencies.map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </Box>

              <Button
                variant="contained"
                startIcon={<PersonSearchOutlinedIcon />}
                onClick={findTrainers}
                disabled={loading}
                sx={{
                  bgcolor: '#0B5A91',
                  textTransform: 'none',
                  fontWeight: 700,
                  px: 3,
                  py: 1,
                  '&:hover': { bgcolor: '#084873' },
                }}
              >
                Find Suitable Trainers
              </Button>
            </Stack>
          </CardContent>
        </Card>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: 'repeat(2, 1fr)',
            },
            gap: 2.5,
          }}
        >
          {trainers.map((trainer) => (
            <Card
              key={trainer.name}
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
                  <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '50%',
                        bgcolor: '#EAF4FB',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <PeopleOutlineOutlinedIcon sx={{ color: '#0B5A91' }} />
                    </Box>

                    <Box>
                      <Typography
                        sx={{
                          color: '#173F60',
                          fontWeight: 700,
                          fontSize: '1.1rem',
                        }}
                      >
                        {trainer.name}
                      </Typography>

                      <Typography sx={{ color: '#718594', fontSize: '0.9rem' }}>
                        {trainer.department || 'Not specified'}
                      </Typography>
                    </Box>
                  </Stack>

                  <Chip
                    label={`${trainer.score}% Match`}
                    size="small"
                    sx={{
                      bgcolor: '#EAF6EF',
                      color: '#147A45',
                      fontWeight: 700,
                    }}
                  />
                </Stack>

                <Box sx={{ mt: 2.5 }}>
                  <Typography
                    sx={{
                      color: '#657887',
                      fontSize: '0.86rem',
                      mb: 0.5,
                    }}
                  >
                    Expertise
                  </Typography>

                  <Typography sx={{ color: '#173F60', fontWeight: 600 }}>
                    {trainer.expertise || 'Not specified'}
                  </Typography>
                </Box>

                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  sx={{ gap: 2, mt: 2.5 }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ color: '#718594', fontSize: '0.86rem' }}>
                      Experience
                    </Typography>
                    <Typography sx={{ color: '#173F60', fontWeight: 700 }}>
                      {trainer.experienceYears} years
                    </Typography>
                  </Box>

                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ color: '#718594', fontSize: '0.86rem' }}>
                      Current Workload
                    </Typography>
                    <Typography
                      sx={{
                        color:
                          trainer.workload === 'Low' ? '#147A45' : '#A35A00',
                        fontWeight: 700,
                      }}
                    >
                      {trainer.workload}
                    </Typography>
                  </Box>
                </Stack>

                <Button
                  variant="outlined"
                  startIcon={<VerifiedOutlinedIcon />}
                  fullWidth
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
                  View Trainer Profile
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default CompetencyMapping;
