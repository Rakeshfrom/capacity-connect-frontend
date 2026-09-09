import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

const achievements = [
  {
    title: 'Outstanding Course Completion',
    recipient: 'Rahul Verma',
    course: 'Foundations of Meteorological Science',
    date: '05 September 2026',
    status: 'Published',
    type: 'Top Performer',
  },
  {
    title: 'Excellence in Climate Science',
    recipient: 'Sneha Iyer',
    course: 'Climate Science & Applications',
    date: '02 September 2026',
    status: 'Published',
    type: 'Achievement',
  },
  {
    title: 'Highest Assessment Score',
    recipient: 'Arjun Nair',
    course: 'Weather Forecasting & Services',
    date: '30 August 2026',
    status: 'Published',
    type: 'Top Score',
  },
  {
    title: 'Training Cohort Completion Milestone',
    recipient: 'Climate Science Training Cohort',
    course: 'Climate Science & Applications',
    date: '28 August 2026',
    status: 'Draft',
    type: 'Milestone',
  },
];

const Achievements = () => {
  return (
    <Box sx={{ bgcolor: '#F5F8FA', minHeight: '100vh' }}>
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          sx={{
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
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
              Achievements
            </Typography>

            <Typography sx={{ color: '#657887', mt: 1 }}>
              Recognise outstanding trainee performance and training milestones.
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddOutlinedIcon />}
            sx={{
              bgcolor: '#0B5A91',
              textTransform: 'none',
              fontWeight: 700,
              px: 2.5,
              py: 1.2,
              '&:hover': { bgcolor: '#084873' },
            }}
          >
            Add Achievement
          </Button>
        </Stack>

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
          {achievements.map((achievement) => (
            <Card
              key={achievement.title}
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
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 1.5,
                      bgcolor: '#EAF4FB',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <EmojiEventsOutlinedIcon sx={{ color: '#0B5A91' }} />
                  </Box>

                  <Chip
                    label={achievement.status}
                    size="small"
                    sx={{
                      bgcolor:
                        achievement.status === 'Published'
                          ? '#EAF6EF'
                          : '#FFF3E0',
                      color:
                        achievement.status === 'Published'
                          ? '#147A45'
                          : '#A35A00',
                      fontWeight: 700,
                    }}
                  />
                </Stack>

                <Typography
                  sx={{
                    color: '#173F60',
                    fontWeight: 700,
                    fontSize: '1.12rem',
                    mt: 2.2,
                  }}
                >
                  {achievement.title}
                </Typography>

                <Chip
                  label={achievement.type}
                  size="small"
                  sx={{
                    mt: 1,
                    bgcolor: '#EAF4FB',
                    color: '#0B5A91',
                    fontWeight: 600,
                  }}
                />

                <Divider sx={{ my: 2.2 }} />

                <Stack spacing={1}>
                  <Typography sx={{ color: '#657887', fontSize: '0.92rem' }}>
                    <strong>Recipient:</strong> {achievement.recipient}
                  </Typography>

                  <Typography sx={{ color: '#657887', fontSize: '0.92rem' }}>
                    <strong>Course:</strong> {achievement.course}
                  </Typography>

                  <Typography sx={{ color: '#657887', fontSize: '0.92rem' }}>
                    <strong>Date:</strong> {achievement.date}
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={1.5} sx={{ mt: 2.5 }}>
                  <Button
                    variant="outlined"
                    startIcon={<VisibilityOutlinedIcon />}
                    fullWidth
                    sx={{
                      borderColor: '#BCD2E2',
                      color: '#0B5A91',
                      textTransform: 'none',
                      fontWeight: 700,
                    }}
                  >
                    View
                  </Button>

                  <Button
                    variant="outlined"
                    startIcon={<EditOutlinedIcon />}
                    fullWidth
                    sx={{
                      borderColor: '#BCD2E2',
                      color: '#0B5A91',
                      textTransform: 'none',
                      fontWeight: 700,
                    }}
                  >
                    Edit
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default Achievements;
