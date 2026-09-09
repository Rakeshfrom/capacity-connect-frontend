import {
  Box,
  Button,
  Chip,
  Container,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import PlayCircleOutlineOutlinedIcon from '@mui/icons-material/PlayCircleOutlineOutlined';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import SlideshowOutlinedIcon from '@mui/icons-material/SlideshowOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';

const resources = [
  {
    title: 'Introduction to Weather Forecasting',
    trainer: 'Dr. Anil Sharma',
    category: 'Recorded Lecture',
    subject: 'Meteorology',
    duration: '42 min',
    type: 'video',
  },
  {
    title: 'Synoptic Weather Analysis',
    trainer: 'Dr. Priya Nair',
    category: 'Presentation',
    subject: 'Meteorology',
    duration: '24 slides',
    type: 'presentation',
  },
  {
    title: 'Climate Data Analysis Handbook',
    trainer: 'Dr. Rajesh Kumar',
    category: 'Study Material',
    subject: 'Climate',
    duration: '36 pages',
    type: 'pdf',
  },
  {
    title: 'Numerical Weather Prediction Basics',
    trainer: 'Dr. Meera Joshi',
    category: 'Recorded Lecture',
    subject: 'Forecasting',
    duration: '51 min',
    type: 'video',
  },
  {
    title: 'Understanding Climate Variability',
    trainer: 'Dr. Priya Nair',
    category: 'Study Material',
    subject: 'Climate',
    duration: '28 pages',
    type: 'pdf',
  },
  {
    title: 'Meteorological Instruments & Observation',
    trainer: 'Dr. Anil Sharma',
    category: 'Presentation',
    subject: 'Observations',
    duration: '32 slides',
    type: 'presentation',
  },
];

const getIcon = (type: string) => {
  if (type === 'video') return <PlayCircleOutlineOutlinedIcon />;
  if (type === 'presentation') return <SlideshowOutlinedIcon />;
  return <PictureAsPdfOutlinedIcon />;
};

const TrainerLibrary = () => {
  return (
    <Box sx={{ bgcolor: '#F5F8FA', minHeight: '100vh' }}>
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          sx={{
            mb: 4,
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'center' },
          }}
        >
          <Box>
            <Typography
              variant="h3"
              sx={{
                color: '#173F60',
                fontWeight: 700,
                fontSize: { xs: '2rem', md: '2.5rem' },
              }}
            >
              Trainer Library
            </Typography>

            <Typography sx={{ color: '#657887', mt: 1, lineHeight: 1.7 }}>
              Access learning resources shared by trainers and subject experts.
            </Typography>
          </Box>
        </Stack>

        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          sx={{ mb: 4 }}
        >
          <TextField
            fullWidth
            placeholder="Search resources..."
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

          <TextField
            select
            label="Resource type"
            defaultValue="all"
            sx={{ width: { xs: '100%', md: 220 } }}
          >
            <MenuItem value="all">All resources</MenuItem>
            <MenuItem value="video">Recorded lectures</MenuItem>
            <MenuItem value="presentation">Presentations</MenuItem>
            <MenuItem value="pdf">Study materials</MenuItem>
          </TextField>

          <TextField
            select
            label="Subject"
            defaultValue="all"
            sx={{ width: { xs: '100%', md: 190 } }}
          >
            <MenuItem value="all">All subjects</MenuItem>
            <MenuItem value="meteorology">Meteorology</MenuItem>
            <MenuItem value="climate">Climate</MenuItem>
            <MenuItem value="forecasting">Forecasting</MenuItem>
            <MenuItem value="observations">Observations</MenuItem>
          </TextField>
        </Stack>

        <Typography sx={{ color: '#536A7B', mb: 2.5, fontWeight: 600 }}>
          {resources.length} learning resources
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              lg: 'repeat(3, 1fr)',
            },
            gap: { xs: 2, md: 2.5 },
          }}
        >
          {resources.map((resource) => (
            <Box
              key={resource.title}
              sx={{
                bgcolor: '#FFFFFF',
                border: '1px solid #DCE8F0',
                borderRadius: 2,
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                minHeight: 255,
              }}
            >
              <Stack
                direction="row"
                sx={{
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <Box
                  sx={{
                    width: 46,
                    height: 46,
                    borderRadius: 1.5,
                    bgcolor: '#EAF4FB',
                    color: '#0B6497',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {getIcon(resource.type)}
                </Box>

                <Chip
                  label={resource.subject}
                  size="small"
                  sx={{
                    bgcolor: '#EAF4FB',
                    color: '#0B5A91',
                    fontWeight: 600,
                  }}
                />
              </Stack>

              <Typography
                sx={{
                  color: '#173F60',
                  fontWeight: 700,
                  fontSize: '1.08rem',
                  mt: 2.5,
                  lineHeight: 1.4,
                }}
              >
                {resource.title}
              </Typography>

              <Typography
                sx={{
                  color: '#657887',
                  mt: 1,
                  fontSize: '0.9rem',
                }}
              >
                Shared by {resource.trainer}
              </Typography>

              <Stack
                direction="row"
                spacing={1}
                sx={{
                  mt: 1.5,
                  color: '#718594',
                  alignItems: 'center',
                }}
              >
                {resource.type === 'video' ? (
                  <AccessTimeOutlinedIcon sx={{ fontSize: 18 }} />
                ) : (
                  <DescriptionOutlinedIcon sx={{ fontSize: 18 }} />
                )}

                <Typography variant="body2">{resource.duration}</Typography>
                <Typography variant="body2">•</Typography>
                <Typography variant="body2">{resource.category}</Typography>
              </Stack>

              <Box sx={{ mt: 'auto', pt: 2.5 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  sx={{
                    borderColor: '#B8D0E0',
                    color: '#075B91',
                    fontWeight: 600,
                    textTransform: 'none',
                  }}
                >
                  {resource.type === 'video' ? 'Watch lecture' : 'Open resource'}
                </Button>
              </Box>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default TrainerLibrary;
