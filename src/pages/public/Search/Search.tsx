import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Divider,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { searchPublicContent } from '../../../services/api';

const Search = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const initialQuery = params.get('q') || params.get('search') || '';
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<{
    courses: any[];
    announcements: any[];
  }>({ courses: [], announcements: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!initialQuery.trim()) {
      setResults({ courses: [], announcements: [] });
      return;
    }

    setLoading(true);

    searchPublicContent(initialQuery)
      .then(setResults)
      .catch(() => setResults({ courses: [], announcements: [] }))
      .finally(() => setLoading(false));
  }, [initialQuery]);

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();

    const value = query.trim();

    if (!value) {
      navigate('/search');
      return;
    }

    navigate(`/search?q=${encodeURIComponent(value)}`);
  };

  const total = results.courses.length + results.announcements.length;

  return (
    <Box sx={{ bgcolor: '#F5F9FC', minHeight: 'calc(100vh - 160px)' }}>
      <Box
        sx={{
          bgcolor: '#EAF4FB',
          borderBottom: '1px solid #DCE6ED',
          py: { xs: 5, md: 6 },
        }}
      >
        <Container maxWidth="lg">
          <Typography
            sx={{
              color: '#0B5A91',
              fontWeight: 700,
              fontSize: '0.8rem',
              letterSpacing: '0.08em',
            }}
          >
            CONTENT DISCOVERY
          </Typography>

          <Typography
            variant="h1"
            sx={{
              mt: 0.5,
              color: '#173F60',
              fontWeight: 800,
              fontSize: { xs: '2rem', md: '3rem' },
            }}
          >
            Search Learning Content
          </Typography>

          <Box
            component="form"
            onSubmit={submitSearch}
            sx={{
              mt: 3,
              maxWidth: 760,
              display: 'flex',
              gap: 1,
            }}
          >
            <TextField
              fullWidth
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search courses, announcements..."
              size="small"
              slotProps={{
                input: {
                  startAdornment: (
                    <SearchRoundedIcon
                      sx={{ mr: 1, color: '#718695' }}
                    />
                  ),
                },
              }}
              sx={{
                bgcolor: '#fff',
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              sx={{
                px: 3,
                borderRadius: 2,
                bgcolor: '#075B91',
                textTransform: 'none',
                fontWeight: 700,
              }}
            >
              Search
            </Button>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 7 } }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : !initialQuery.trim() ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <SearchRoundedIcon
              sx={{ fontSize: 52, color: '#A6BAC8', mb: 1 }}
            />
            <Typography variant="h6" sx={{ color: '#36546D' }}>
              Search for courses or announcements
            </Typography>
          </Box>
        ) : total === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h5" sx={{ color: '#173F60', fontWeight: 700 }}>
              No results found
            </Typography>
            <Typography sx={{ mt: 1, color: '#657887' }}>
              Try a different keyword or search term.
            </Typography>
          </Box>
        ) : (
          <Stack spacing={5}>
            {results.courses.length > 0 && (
              <Box>
                <Typography
                  variant="h5"
                  sx={{ color: '#173F60', fontWeight: 700, mb: 2 }}
                >
                  Courses ({results.courses.length})
                </Typography>

                <Stack spacing={1.5}>
                  {results.courses.map((course: any) => (
                    <Card
                      key={course.id}
                      elevation={0}
                      sx={{
                        border: '1px solid #DCE6ED',
                        borderRadius: 2,
                        '&:hover': {
                          borderColor: '#9DBACA',
                          boxShadow: '0 8px 24px rgba(20,65,95,0.08)',
                        },
                      }}
                    >
                      <CardContent
                        sx={{
                          p: 3,
                          display: 'flex',
                          alignItems: { xs: 'flex-start', md: 'center' },
                          gap: 2,
                          flexDirection: { xs: 'column', md: 'row' },
                        }}
                      >
                        <Box
                          sx={{
                            width: 46,
                            height: 46,
                            flexShrink: 0,
                            borderRadius: 1.5,
                            bgcolor: '#EAF4FB',
                            color: '#075B91',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <SchoolOutlinedIcon />
                        </Box>

                        <Box sx={{ flexGrow: 1 }}>
                          <Typography
                            variant="h6"
                            sx={{ color: '#244A66', fontWeight: 700 }}
                          >
                            {course.title}
                          </Typography>

                          <Typography
                            variant="body2"
                            sx={{ mt: 0.5, color: '#657887', lineHeight: 1.6 }}
                          >
                            {course.description || 'Learning programme'}
                          </Typography>

                          <Typography
                            variant="caption"
                            sx={{ color: '#0B5A91', fontWeight: 600 }}
                          >
                            {course.category || 'Course'}
                          </Typography>
                        </Box>

                        <Button
                          onClick={() => navigate(`/courses/${course.id}`)}
                          endIcon={<ArrowForwardRoundedIcon />}
                          sx={{
                            textTransform: 'none',
                            fontWeight: 700,
                            color: '#075B91',
                          }}
                        >
                          View Course
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              </Box>
            )}

            {results.announcements.length > 0 && (
              <Box>
                <Typography
                  variant="h5"
                  sx={{ color: '#173F60', fontWeight: 700, mb: 2 }}
                >
                  Announcements ({results.announcements.length})
                </Typography>

                <Card
                  elevation={0}
                  sx={{
                    border: '1px solid #DCE6ED',
                    borderRadius: 2,
                  }}
                >
                  {results.announcements.map(
                    (announcement: any, index: number) => (
                      <Box key={announcement.id || announcement.title}>
                        <Box sx={{ p: 3, display: 'flex', gap: 2 }}>
                          <CampaignOutlinedIcon
                            sx={{ color: '#075B91', mt: 0.3 }}
                          />

                          <Box>
                            <Typography
                              variant="h6"
                              sx={{ color: '#244A66', fontWeight: 700 }}
                            >
                              {announcement.title}
                            </Typography>

                            <Typography
                              variant="body2"
                              sx={{ mt: 0.5, color: '#657887' }}
                            >
                              {announcement.audience || 'Portal update'}
                              {' · '}
                              {announcement.type || 'Announcement'}
                            </Typography>
                          </Box>
                        </Box>

                        {index < results.announcements.length - 1 && <Divider />}
                      </Box>
                    )
                  )}
                </Card>
              </Box>
            )}
          </Stack>
        )}
      </Container>
    </Box>
  );
};

export default Search;
