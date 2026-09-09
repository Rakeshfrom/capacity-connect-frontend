import {
  Box,
  Container,
  Divider,
  Paper,
  Typography,
} from '@mui/material';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';

const notifications = [
  {
    title: 'Upcoming assessment',
    message: 'Your Module 2 assessment for Meteorological Science is scheduled for 12 September 2026.',
    date: '2 days ago',
    unread: true,
  },
  {
    title: 'New learning resource',
    message: 'New study material has been added to Foundations of Meteorological Science.',
    date: '4 days ago',
    unread: true,
  },
  {
    title: 'Course progress update',
    message: 'You have completed 68% of Foundations of Meteorological Science.',
    date: '1 week ago',
    unread: false,
  },
];

const Notifications = () => {
  return (
    <Box sx={{ bgcolor: '#F5F8FA', minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Typography
          variant="h3"
          sx={{
            color: '#173F60',
            fontWeight: 700,
            fontSize: { xs: '2rem', md: '2.5rem' },
          }}
        >
          Notifications
        </Typography>

        <Typography sx={{ mt: 1, color: '#657887', lineHeight: 1.7 }}>
          Stay updated with your courses, assessments and learning activities.
        </Typography>

        <Paper
          elevation={0}
          sx={{
            mt: 4,
            border: '1px solid #DCE6ED',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          {notifications.map((notification, index) => (
            <Box key={notification.title}>
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  p: { xs: 2.5, sm: 3 },
                  bgcolor: notification.unread ? '#F7FBFE' : '#FFFFFF',
                }}
              >
                <NotificationsNoneOutlinedIcon
                  sx={{ color: '#0B5A91', mt: 0.3 }}
                />

                <Box sx={{ flexGrow: 1 }}>
                  <Typography
                    sx={{
                      color: '#244A66',
                      fontWeight: notification.unread ? 700 : 600,
                    }}
                  >
                    {notification.title}
                  </Typography>

                  <Typography
                    sx={{
                      mt: 0.5,
                      color: '#657887',
                      lineHeight: 1.6,
                    }}
                  >
                    {notification.message}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{ mt: 1, color: '#8A9AA6' }}
                  >
                    {notification.date}
                  </Typography>
                </Box>

                {notification.unread && (
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: '#0B5A91',
                      mt: 1,
                    }}
                  />
                )}
              </Box>

              {index < notifications.length - 1 && <Divider />}
            </Box>
          ))}
        </Paper>
      </Container>
    </Box>
  );
};

export default Notifications;
