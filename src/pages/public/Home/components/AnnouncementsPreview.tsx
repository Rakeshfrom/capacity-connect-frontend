import { Box, Button, Container, Divider, Typography } from '@mui/material';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';

const announcements = [
  ['01 Sep 2026', 'New capacity building programmes available', 'Explore newly added learning opportunities on the portal.'],
  ['28 Aug 2026', 'Upcoming assessment schedule', 'Assessment schedules and participation details are now available.'],
  ['20 Aug 2026', 'Learning resources updated', 'New presentations and recorded learning resources have been added.'],
];

const AnnouncementsPreview = () => (
  <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: '#fff' }}>
    <Container maxWidth="xl">
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', sm: 'center' },
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2,
        mb: 3,
      }}>
        <Box>
          <Typography sx={{ color: '#0B5A91', fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.08em' }}>
            KEEP INFORMED
          </Typography>
          <Typography variant="h4" sx={{ mt: 1, color: '#173F60', fontWeight: 800 }}>
            Latest announcements
          </Typography>
        </Box>
        <Button href="/announcements" endIcon={<ArrowForwardRoundedIcon />} sx={{ color: '#0B5A91', fontWeight: 700, textTransform: 'none' }}>
          View all announcements
        </Button>
      </Box>

      <Box sx={{ border: '1px solid #DFE8EE', borderRadius: 2.5, overflow: 'hidden' }}>
        {announcements.map(([date, title, text], index) => (
          <Box key={title}>
            <Box sx={{
              p: { xs: 2.5, md: 3 },
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '150px 1fr auto' },
              gap: { xs: 1, sm: 3 },
              alignItems: 'center',
            }}>
              <Typography variant="body2" sx={{ color: '#0B5A91', fontWeight: 700 }}>
                {date}
              </Typography>

              <Box>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <CampaignOutlinedIcon sx={{ color: '#6D8CA0', fontSize: 19 }} />
                  <Typography sx={{ color: '#244A66', fontWeight: 700 }}>
                    {title}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: '#657887', mt: .5 }}>
                  {text}
                </Typography>
              </Box>

              <ArrowForwardRoundedIcon sx={{ color: '#8CA5B5', display: { xs: 'none', sm: 'block' } }} />
            </Box>
            {index < announcements.length - 1 && <Divider />}
          </Box>
        ))}
      </Box>
    </Container>
  </Box>
);

export default AnnouncementsPreview;
