import {
  Box,
  Button,
  Container,
  Divider,
  Typography,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const announcements = [
  {
    date: '01 Sep 2026',
    title: 'New capacity building programmes available',
    text: 'Explore newly added learning opportunities on the portal.',
  },
  {
    date: '28 Aug 2026',
    title: 'Upcoming assessment schedule',
    text: 'Assessment schedules and participation details are now available.',
  },
  {
    date: '20 Aug 2026',
    title: 'Learning resources updated',
    text: 'New presentations and recorded learning resources have been added.',
  },
];

const AnnouncementsPreview = () => {
  return (
    <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: '#fff' }}>
      <Container maxWidth="xl">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            mb: 3,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{
                color: '#173F60',
                fontWeight: 700,
                fontSize: { xs: '1.8rem', md: '2.2rem' },
              }}
            >
              Latest announcements
            </Typography>

            <Typography sx={{ color: '#657887', mt: 1 }}>
              Stay informed about portal updates and activities.
            </Typography>
          </Box>

          <Button
            href="/announcements"
            endIcon={<ArrowForwardIcon />}
            sx={{
              color: '#0B5A91',
              fontWeight: 700,
              textTransform: 'none',
            }}
          >
            View all
          </Button>
        </Box>

        <Box>
          {announcements.map((item, index) => (
            <Box key={item.title}>
              <Box
                sx={{
                  py: 2.5,
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '150px 1fr' },
                  gap: { xs: 1, sm: 3 },
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: '#0B5A91', fontWeight: 700 }}
                >
                  {item.date}
                </Typography>

                <Box>
                  <Typography
                    sx={{ color: '#244A66', fontWeight: 700 }}
                  >
                    {item.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{ color: '#657887', mt: 0.6, lineHeight: 1.6 }}
                  >
                    {item.text}
                  </Typography>
                </Box>
              </Box>

              {index < announcements.length - 1 && <Divider />}
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default AnnouncementsPreview;
