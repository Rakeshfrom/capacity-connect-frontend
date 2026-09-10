import { Box, Button, Container, Divider, Typography } from '@mui/material';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';

const announcements = [
  ['01 Sep 2026', 'New capacity building programmes available', 'Explore newly added learning opportunities on the portal.'],
  ['28 Aug 2026', 'Upcoming assessment schedule', 'Assessment schedules and participation details are now available.'],
  ['20 Aug 2026', 'Learning resources updated', 'New presentations and recorded learning resources have been added.'],
];

const AnnouncementsPreview = () => (
  <Box sx={{ py: { xs: 7, md: 10 }, bgcolor: '#fff' }}>
    <Container maxWidth="xl">
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          mb: { xs: 4, md: 5 },
        }}
      >
        <Box>
          <Typography sx={{ color: '#0B5A91', fontWeight: 800, fontSize: '.76rem', letterSpacing: '.12em' }}>
            KEEP INFORMED
          </Typography>

          <Typography
            variant="h4"
            sx={{ mt: 1.2, color: '#173F60', fontWeight: 800, letterSpacing: '-.02em' }}
          >
            Latest announcements
          </Typography>
        </Box>

        <Button
          href="/announcements"
          endIcon={<ArrowForwardRoundedIcon />}
          sx={{
            color: '#0B5A91',
            fontWeight: 800,
            textTransform: 'none',
            px: 0,
            '&:hover': { bgcolor: 'transparent' },
          }}
        >
          View all announcements
        </Button>
      </Box>

      <Box
        sx={{
          border: '1px solid #DCE7EE',
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: '0 8px 28px rgba(20,55,80,.04)',
        }}
      >
        {announcements.map(([date, title, text], index) => (
          <Box key={title}>
            <Box
              sx={{
                p: { xs: 2.5, md: 3 },
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '125px 1fr auto' },
                gap: { xs: 1.5, sm: 3 },
                alignItems: 'center',
                transition: 'background .2s ease',
                '&:hover': { bgcolor: '#F7FAFC' },
              }}
            >
              <Box
                sx={{
                  display: 'inline-flex',
                  width: 'fit-content',
                  px: 1.4,
                  py: .65,
                  borderRadius: 1.5,
                  bgcolor: '#EAF5FC',
                }}
              >
                <Typography variant="body2" sx={{ color: '#0B5A91', fontWeight: 800 }}>
                  {date}
                </Typography>
              </Box>

              <Box>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <CampaignOutlinedIcon sx={{ color: '#0B5A91', fontSize: 19 }} />
                  <Typography sx={{ color: '#244A66', fontWeight: 800 }}>
                    {title}
                  </Typography>
                </Box>

                <Typography variant="body2" sx={{ color: '#657887', mt: .6, lineHeight: 1.55 }}>
                  {text}
                </Typography>
              </Box>

              <ArrowForwardRoundedIcon
                sx={{
                  color: '#8CA5B5',
                  display: { xs: 'none', sm: 'block' },
                }}
              />
            </Box>

            {index < announcements.length - 1 && <Divider />}
          </Box>
        ))}
      </Box>
    </Container>
  </Box>
);

export default AnnouncementsPreview;
