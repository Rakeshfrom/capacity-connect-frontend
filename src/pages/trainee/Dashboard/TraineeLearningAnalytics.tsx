import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Chip,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import ShowChartOutlinedIcon from '@mui/icons-material/ShowChartOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import { getMyLearningAnalytics } from '../../../services/api';

type ModuleStat = {
  courseId: number;
  moduleId: number;
  moduleTitle: string;
  minutes: number;
  sessions: number;
  lastActivity?: string | null;
};

type HistogramPoint = {
  label: string;
  minutes: number;
};

type AnalyticsResponse = {
  totalMinutes: number;
  totalSessions: number;
  modules: ModuleStat[];
  recentActivity: Array<{
    moduleTitle: string;
    minutes: number;
    startedAt?: string;
  }>;
  histograms: {
    day: HistogramPoint[];
    month: HistogramPoint[];
    year: HistogramPoint[];
  };
};

type Range = 'day' | 'month' | 'year';

const formatMinutes = (minutes: number) => {
  const value = Math.max(0, Math.round(minutes));

  if (value < 60) {
    return `${value} min`;
  }

  const hours = Math.floor(value / 60);
  const mins = value % 60;

  return mins ? `${hours}h ${mins}m` : `${hours}h`;
};

const shortLabel = (label: string, range: Range) => {
  if (range === 'day') {
    const date = new Date(`${label}T00:00:00`);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
    });
  }

  if (range === 'month') {
    const date = new Date(`${label}-01T00:00:00`);
    return date.toLocaleDateString('en-IN', {
      month: 'short',
    });
  }

  return label;
};

const TraineeLearningAnalytics = () => {
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [range, setRange] = useState<Range>('day');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyLearningAnalytics()
      .then((result) => setData(result as AnalyticsResponse))
      .catch((error) => {
        console.warn('Unable to load learning analytics:', error);
        setData(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const histogram = data?.histograms?.[range] || [];

  const maxMinutes = Math.max(
    1,
    ...histogram.map((item) => Number(item.minutes || 0))
  );

  const moduleRows = useMemo(
    () =>
      [...(data?.modules || [])]
        .sort((a, b) => b.minutes - a.minutes)
        .slice(0, 8),
    [data]
  );

  if (loading) {
    return null;
  }

  return (
    <Card
      elevation={0}
      sx={{
        border: '1px solid #DCE7EF',
        borderRadius: 3,
        mt: 2.5,
      }}
    >
      <CardContent sx={{ p: { xs: 2.2, md: 3 } }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          sx={{
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'center' },
            gap: 1.5,
            mb: 2.5,
          }}
        >
          <Box>
            <Typography
              sx={{
                color: '#173F60',
                fontWeight: 800,
                fontSize: '1.2rem',
              }}
            >
              Learning Analytics
            </Typography>

            <Typography sx={{ color: '#657887', mt: 0.4 }}>
              Module-wise learning time and your complete recent activity history.
            </Typography>
          </Box>

          <Stack direction="row" spacing={1}>
            <Chip
              icon={<AccessTimeOutlinedIcon />}
              label={formatMinutes(Number(data?.totalMinutes || 0))}
              sx={{
                bgcolor: '#EAF4FB',
                color: '#0B5A91',
                fontWeight: 800,
              }}
            />

            <Chip
              icon={<AssessmentOutlinedIcon />}
              label={`${data?.totalSessions || 0} sessions`}
              sx={{
                bgcolor: '#F3EDF9',
                color: '#7050A5',
                fontWeight: 800,
              }}
            />
          </Stack>
        </Stack>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '1.05fr 1.55fr' },
            gap: 2,
          }}
        >
          <Card
            elevation={0}
            sx={{
              border: '1px solid #E0E9EE',
              borderRadius: 2.5,
              bgcolor: '#FBFDFE',
            }}
          >
            <CardContent sx={{ p: 2.3 }}>
              <Stack
                direction="row"
                sx={{
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 1.8,
                }}
              >
                <Box>
                  <Typography sx={{ color: '#173F60', fontWeight: 800 }}>
                    Time by Module
                  </Typography>
                  <Typography
                    sx={{ color: '#718594', fontSize: '.78rem', mt: .3 }}
                  >
                    Actual tracked learning time
                  </Typography>
                </Box>

                <MenuBookOutlinedIcon sx={{ color: '#0B5A91' }} />
              </Stack>

              <Stack spacing={1.5}>
                {moduleRows.length ? (
                  moduleRows.map((item) => {
                    const percentage =
                      data?.totalMinutes
                        ? Math.min(
                            100,
                            Math.round(
                              (item.minutes / data.totalMinutes) * 100
                            )
                          )
                        : 0;

                    return (
                      <Box key={`${item.courseId}-${item.moduleId}`}>
                        <Stack
                          direction="row"
                          sx={{
                            justifyContent: 'space-between',
                            gap: 1,
                            mb: .5,
                          }}
                        >
                          <Typography
                            sx={{
                              color: '#173F60',
                              fontSize: '.82rem',
                              fontWeight: 700,
                            }}
                          >
                            {item.moduleTitle}
                          </Typography>

                          <Typography
                            sx={{
                              color: '#0B5A91',
                              fontSize: '.76rem',
                              fontWeight: 800,
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {formatMinutes(item.minutes)}
                          </Typography>
                        </Stack>

                        <Box
                          sx={{
                            height: 7,
                            bgcolor: '#E5EDF2',
                            borderRadius: 5,
                            overflow: 'hidden',
                          }}
                        >
                          <Box
                            sx={{
                              width: `${percentage}%`,
                              height: '100%',
                              bgcolor: '#0B5A91',
                            }}
                          />
                        </Box>
                      </Box>
                    );
                  })
                ) : (
                  <Typography sx={{ color: '#718594', fontSize: '.82rem' }}>
                    No learning sessions recorded yet.
                  </Typography>
                )}
              </Stack>
            </CardContent>
          </Card>

          <Card
            elevation={0}
            sx={{
              border: '1px solid #E0E9EE',
              borderRadius: 2.5,
              bgcolor: '#FBFDFE',
            }}
          >
            <CardContent sx={{ p: 2.3 }}>
              <Stack
                direction="row"
                sx={{
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 1.8,
                }}
              >
                <Box>
                  <Typography sx={{ color: '#173F60', fontWeight: 800 }}>
                    Activity History
                  </Typography>
                  <Typography
                    sx={{ color: '#718594', fontSize: '.78rem', mt: .3 }}
                  >
                    Learning time trend
                  </Typography>
                </Box>

                <Select
                  size="small"
                  value={range}
                  onChange={(event) =>
                    setRange(event.target.value as Range)
                  }
                  sx={{
                    minWidth: 105,
                    borderRadius: 1.5,
                    fontSize: '.78rem',
                  }}
                >
                  <MenuItem value="day">Day</MenuItem>
                  <MenuItem value="month">Month</MenuItem>
                  <MenuItem value="year">Year</MenuItem>
                </Select>
              </Stack>

              <Box
                sx={{
                  height: 230,
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: { xs: .45, md: .8 },
                  overflowX: 'auto',
                  pb: 3,
                }}
              >
                {histogram.map((item) => {
                  const height = Math.max(
                    item.minutes > 0 ? 8 : 2,
                    Math.round((item.minutes / maxMinutes) * 165)
                  );

                  return (
                    <Box
                      key={item.label}
                      sx={{
                        minWidth:
                          range === 'day'
                            ? 34
                            : range === 'month'
                              ? 42
                              : 48,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        gap: .6,
                      }}
                    >
                      <Typography
                        sx={{
                          color: '#718594',
                          fontSize: '.62rem',
                          minHeight: 16,
                        }}
                      >
                        {item.minutes ? formatMinutes(item.minutes) : ''}
                      </Typography>

                      <Box
                        title={`${item.label}: ${formatMinutes(item.minutes)}`}
                        sx={{
                          width: '100%',
                          height,
                          minHeight: 2,
                          borderRadius: '5px 5px 2px 2px',
                          bgcolor: '#0B5A91',
                          opacity: item.minutes ? 1 : .14,
                        }}
                      />

                      <Typography
                        sx={{
                          color: '#657887',
                          fontSize: '.62rem',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {shortLabel(item.label, range)}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>

              <Stack
                direction="row"
                spacing={1}
                sx={{ alignItems: 'center' }}
              >
                <ShowChartOutlinedIcon
                  sx={{ color: '#0B5A91', fontSize: 18 }}
                />
                <Typography
                  sx={{
                    color: '#718594',
                    fontSize: '.72rem',
                  }}
                >
                  Histogram is based on tracked module learning sessions.
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography
            sx={{
              color: '#173F60',
              fontWeight: 800,
              fontSize: '1rem',
              mb: 1.3,
            }}
          >
            Recent Activity
          </Typography>

          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={1.2}
            sx={{ overflowX: { md: 'auto' } }}
          >
            {(data?.recentActivity || []).slice(0, 6).map((item, index) => (
              <Box
                key={`${item.moduleTitle}-${index}`}
                sx={{
                  minWidth: { md: 190 },
                  flex: 1,
                  p: 1.5,
                  border: '1px solid #E0E9EE',
                  borderRadius: 2,
                  bgcolor: '#FBFDFE',
                }}
              >
                <Typography
                  sx={{
                    color: '#173F60',
                    fontWeight: 700,
                    fontSize: '.78rem',
                  }}
                >
                  {item.moduleTitle}
                </Typography>

                <Typography
                  sx={{
                    color: '#0B5A91',
                    fontWeight: 800,
                    fontSize: '.75rem',
                    mt: .5,
                  }}
                >
                  {formatMinutes(item.minutes)}
                </Typography>

                <Typography
                  sx={{
                    color: '#718594',
                    fontSize: '.68rem',
                    mt: .4,
                  }}
                >
                  {item.startedAt
                    ? new Date(item.startedAt).toLocaleString('en-IN')
                    : 'Recent learning activity'}
                </Typography>
              </Box>
            ))}

            {!data?.recentActivity?.length && (
              <Typography sx={{ color: '#718594', fontSize: '.82rem' }}>
                No recent activity recorded yet.
              </Typography>
            )}
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TraineeLearningAnalytics;
