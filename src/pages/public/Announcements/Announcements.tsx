import {
  Box,
  Container,
  Divider,
  Stack,
  Typography,
  CircularProgress,
} from '@mui/material';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import { useEffect, useState } from 'react';
import { getPublishedAnnouncements } from '../../../services/api';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getPublishedAnnouncements()
      .then((data) => setAnnouncements(data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (value: string) =>
    new Date(value).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

  return (
    <Box sx={{ bgcolor: '#F5F9FC', minHeight: 'calc(100vh - 160px)' }}>
      <Box
        sx={{
          bgcolor: '#EAF4FB',
          borderBottom: '1px solid #DCE6ED',
          py: { xs: 5, md: 7 },
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Box
              sx={{
                width: 46,
                height: 46,
                borderRadius: 1.5,
                bgcolor: '#FFFFFF',
                color: '#0B5A91',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #DCE6ED',
              }}
            >
              <CampaignOutlinedIcon />
            </Box>

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
                Portal updates
              </Typography>

              <Typography
                variant="h2"
                sx={{
                  mt: 0.5,
                  color: '#173F60',
                  fontWeight: 700,
                  fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3.3rem' },
                  lineHeight: 1.15,
                }}
              >
                Announcements
              </Typography>
            </Box>
          </Box>

          <Typography
            sx={{
              mt: 2,
              maxWidth: 760,
              color: '#5D7486',
              fontSize: { xs: '1rem', md: '1.08rem' },
              lineHeight: 1.8,
            }}
          >
            Stay informed about training programmes, assessments, learning
            resources and important portal updates.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 7 } }}>
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

        <Typography
          sx={{
            mt: 1,
            color: '#657887',
            lineHeight: 1.7,
          }}
        >
          Important updates and activities from CAPACITY CONNECT.
        </Typography>

        <Box
          sx={{
            mt: 4,
            bgcolor: '#FFFFFF',
            border: '1px solid #DCE6ED',
            borderRadius: 2,
            overflow: 'hidden',
          }}
        >
          {loading ? (
            <Box sx={{ py: 7, display: 'flex', justifyContent: 'center' }}>
              <CircularProgress size={30} />
            </Box>
          ) : error ? (
            <Typography sx={{ p: 4, color: '#B42318' }}>
              Unable to load announcements.
            </Typography>
          ) : announcements.length === 0 ? (
            <Typography sx={{ p: 4, color: '#657887' }}>
              No published announcements available.
            </Typography>
          ) : announcements.map((announcement, index) => (
            <Box key={announcement.title}>
              <Box
                sx={{
                  px: { xs: 2.5, sm: 3, md: 4 },
                  py: { xs: 2.5, md: 3 },
                }}
              >
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={{ xs: 1, sm: 4 }}
                >
                  <Typography
                    sx={{
                      minWidth: { sm: 130 },
                      color: '#0B5A91',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                    }}
                  >
                    {formatDate(announcement.publishedAt || announcement.createdAt)}
                  </Typography>

                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        color: '#244A66',
                        fontWeight: 700,
                        fontSize: { xs: '1rem', md: '1.1rem' },
                      }}
                    >
                      {announcement.title}
                    </Typography>

                    <Typography
                      sx={{
                        mt: 0.7,
                        color: '#657887',
                        lineHeight: 1.7,
                      }}
                    >
                      {announcement.audience} · {announcement.type}
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              {index < announcements.length - 1 && <Divider />}
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default Announcements;
