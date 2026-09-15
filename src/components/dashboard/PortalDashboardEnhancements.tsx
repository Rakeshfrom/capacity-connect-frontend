import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import LocalFireDepartmentOutlinedIcon from '@mui/icons-material/LocalFireDepartmentOutlined';
import PsychologyOutlinedIcon from '@mui/icons-material/PsychologyOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';
import {
  getEnrollments,
  getCourses,
  getAttemptsByTrainee,
  getMyCertificates,
  getTrainerAnalytics,
  getTrainerCourses,
  getAdminDashboard,
  chatWithAIActivity,
} from '../../services/api';

type Role = 'TRAINEE' | 'TRAINER' | 'ADMIN';

type CourseRow = {
  id?: number;
  courseId?: number;
  title?: string;
  courseTitle?: string;
  category?: string;
  durationHours?: number;
  progress?: number;
  completion?: number;
  averageScore?: number;
  trainees?: number;
  enrollments?: number;
};

type ActivityItem = {
  title: string;
  detail: string;
  date?: string;
};

const navy = '#173F60';
const blue = '#0B5A91';
const text = '#657887';
const border = '#DCE7EF';
const bg = '#F5F8FA';

const clamp = (value: number) => Math.min(100, Math.max(0, Math.round(value)));

const PortalDashboardEnhancements = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const role: Role =
    String(user?.role || 'TRAINEE').toUpperCase().includes('ADMIN')
      ? 'ADMIN'
      : String(user?.role || '').toUpperCase().includes('TRAINER')
        ? 'TRAINER'
        : 'TRAINEE';

  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<CourseRow[]>([]);
  const [attempts, setAttempts] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [dashboard, setDashboard] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [aiText, setAiText] = useState('');

  useEffect(() => {
    if (!user) return;

    let active = true;

    const load = async () => {
      try {
        if (role === 'TRAINEE') {
          const [enrollments, allCourses, traineeAttempts, traineeCertificates] =
            await Promise.all([
              getEnrollments(),
              getCourses(),
              getAttemptsByTrainee(),
              getMyCertificates(),
            ]);

          const rows = (enrollments || []).map((item: any) => {
            const course = (allCourses || []).find(
              (c: any) => Number(c.id) === Number(item.courseId)
            );

            return {
              id: item.courseId,
              courseId: item.courseId,
              title: course?.title || `Course #${item.courseId}`,
              courseTitle: course?.title || `Course #${item.courseId}`,
              category: course?.category || 'Learning',
              durationHours: Number(course?.durationHours || 0),
              progress: clamp(Number(item.progress || 0)),
            };
          });

          if (!active) return;
          setCourses(rows);
          setAttempts(traineeAttempts || []);
          setCertificates(traineeCertificates || []);
        }

        if (role === 'TRAINER') {
          const [analyticsData, trainerCourses] = await Promise.all([
            getTrainerAnalytics(Number(user.id)),
            getTrainerCourses(Number(user.id)),
          ]);

          const analyticsRows = analyticsData?.courses || [];
          const rows = (trainerCourses || []).map((course: any) => {
            const stats = analyticsRows.find(
              (item: any) => Number(item.courseId) === Number(course.id)
            );

            return {
              id: course.id,
              courseId: course.id,
              title: course.title,
              courseTitle: course.title,
              category: course.category || 'Training',
              durationHours: Number(course.durationHours || 0),
              progress: clamp(Number(stats?.completion || 0)),
              completion: clamp(Number(stats?.completion || 0)),
              averageScore: clamp(Number(stats?.averageScore || 0)),
              trainees: Number(stats?.trainees || 0),
            };
          });

          if (!active) return;
          setAnalytics(analyticsData);
          setCourses(rows);
        }

        if (role === 'ADMIN') {
          const data = await getAdminDashboard();

          if (!active) return;
          setDashboard(data);

          setCourses(
            (data?.courses || []).map((course: any) => ({
              id: course.courseId,
              courseId: course.courseId,
              title: course.courseTitle,
              courseTitle: course.courseTitle,
              progress: clamp(Number(course.completion || 0)),
              completion: clamp(Number(course.completion || 0)),
              enrollments: Number(course.enrollments || 0),
            }))
          );
        }
      } catch (error) {
        console.error('Portal dashboard enhancement load failed:', error);
      } finally {
        if (active) setLoading(false);
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [role, user]);

  const metrics = useMemo(() => {
    const avgProgress = courses.length
      ? Math.round(
          courses.reduce(
            (sum, item) => sum + Number(item.progress ?? item.completion ?? 0),
            0
          ) / courses.length
        )
      : 0;

    const scoreValues = attempts
      .map((item) => Number(item.percentage ?? item.score))
      .filter((value) => Number.isFinite(value));

    const traineeScore = scoreValues.length
      ? Math.round(scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length)
      : avgProgress;

    const trainerScore = Number(analytics?.overallPerformance || avgProgress);

    if (role === 'TRAINEE') {
      const hours = courses.reduce(
        (sum, item) =>
          sum +
          (Number(item.durationHours || 0) *
            Number(item.progress || 0)) /
            100,
        0
      );

      return {
        kpis: [
          ['Streak', '7 days', LocalFireDepartmentOutlinedIcon, 'Keep the rhythm'],
          ['Competency Score', `${clamp((avgProgress + traineeScore) / 2)}/100`, PsychologyOutlinedIcon, 'Current learning level'],
          ['Courses in Progress', String(courses.filter((c) => Number(c.progress || 0) < 100).length), MenuBookOutlinedIcon, 'Active learning'],
          ['Learning Hours', `${hours.toFixed(1)} hrs`, AccessTimeOutlinedIcon, 'Estimated from course progress'],
          ['Certificates', String(certificates.filter((c) => String(c.status || '').toUpperCase() === 'ISSUED').length), WorkspacePremiumOutlinedIcon, 'Earned'],
        ],
        score: clamp((avgProgress + traineeScore) / 2),
        engagement: clamp((courses.filter((c) => Number(c.progress || 0) > 0).length / Math.max(courses.length, 1)) * 100),
      };
    }

    if (role === 'TRAINER') {
      const totalTrainees = Number(analytics?.totalTrainees || 0);
      const programmeHours = courses.reduce(
        (sum, item) => sum + Number(item.durationHours || 0),
        0
      );

      return {
        kpis: [
          ['Active Trainees', String(totalTrainees), PeopleOutlineOutlinedIcon, 'Current reach'],
          ['Competency Score', `${clamp(trainerScore)}/100`, PsychologyOutlinedIcon, 'Trainee performance'],
          ['Programmes', String(courses.length), MenuBookOutlinedIcon, 'Assigned programmes'],
          ['Training Hours', `${programmeHours.toFixed(1)} hrs`, AccessTimeOutlinedIcon, 'Programme capacity'],
          ['Avg. Completion', `${avgProgress}%`, TrendingUpOutlinedIcon, 'Across courses'],
        ],
        score: clamp(trainerScore),
        engagement: avgProgress,
      };
    }

    const participation =
      dashboard && Number(dashboard.totalUsers) > 0
        ? Math.round(
            (Number(dashboard.totalEnrollments || 0) /
              Number(dashboard.totalUsers || 1)) *
              100
          )
        : 0;

    return {
      kpis: [
        ['Total Users', String(dashboard?.totalUsers ?? 0), PeopleOutlineOutlinedIcon, 'Platform users'],
        ['Competency Score', `${avgProgress}/100`, PsychologyOutlinedIcon, 'Average course completion'],
        ['Active Courses', String(dashboard?.totalCourses ?? 0), MenuBookOutlinedIcon, `${dashboard?.publishedCourses ?? 0} published`],
        ['Participation', `${participation}%`, TrendingUpOutlinedIcon, 'Enrollment ratio'],
        ['Assessments', String(dashboard?.totalAssessments ?? 0), AssignmentOutlinedIcon, 'Platform assessments'],
      ],
      score: avgProgress,
      engagement: participation,
    };
  }, [role, courses, attempts, certificates, analytics, dashboard]);

  const matrix = useMemo(
    () =>
      courses
        .map((course) => {
          const current = clamp(
            Number(course.averageScore ?? course.progress ?? course.completion ?? 0)
          );
          const required = 70;

          return {
            title: course.courseTitle || course.title || 'Learning area',
            current,
            required,
            progress: clamp((current / required) * 100),
            status: current >= required ? 'On target' : `Gap ${Math.max(1, Math.ceil((required - current) / 10))}`,
          };
        })
        .slice(0, 5),
    [courses]
  );

  const nextStep = useMemo(() => {
    if (!courses.length) {
      return {
        title: 'Start your first learning activity',
        detail: 'Explore available programmes and choose the most relevant next step.',
        action: role === 'TRAINEE' ? '/trainee/courses' : role === 'TRAINER' ? '/trainer/courses' : '/admin/courses',
      };
    }

    if (role === 'TRAINER') {
      const lowest = [...courses].sort(
        (a, b) => Number(a.averageScore || 0) - Number(b.averageScore || 0)
      )[0];

      return {
        title: `Review ${lowest?.courseTitle || 'the lowest-performing course'}`,
        detail: `Current trainee performance is ${Number(lowest?.averageScore || 0)}%. Use the analytics view to identify the next intervention.`,
        action: '/trainer/analytics',
      };
    }

    if (role === 'ADMIN') {
      const lowest = [...courses].sort(
        (a, b) => Number(a.completion || a.progress || 0) - Number(b.completion || b.progress || 0)
      )[0];

      return {
        title: `Review ${lowest?.courseTitle || 'course performance'}`,
        detail: `Current completion is ${Number(lowest?.completion || lowest?.progress || 0)}%. Review participation and governance actions.`,
        action: '/admin/analytics',
      };
    }

    const incomplete = [...courses]
      .filter((course) => Number(course.progress || 0) < 100)
      .sort((a, b) => Number(b.progress || 0) - Number(a.progress || 0))[0];

    return {
      title: incomplete
        ? `Continue ${incomplete.courseTitle || incomplete.title}`
        : 'Review your completed learning',
      detail: incomplete
        ? `${Number(incomplete.progress || 0)}% complete. Finish the current module before starting a new one.`
        : 'Use your assessment results and certificates to plan the next learning goal.',
      action: incomplete?.courseId
        ? `/trainee/courses/${incomplete.courseId}`
        : '/trainee/courses',
    };
  }, [courses, role]);

  const recommendations = useMemo(() => {
    if (role === 'TRAINER') {
      return [
        'Review the lowest-performing course first.',
        'Add an assessment where completion is high but scores are low.',
        'Use trainee analytics before publishing the next module.',
      ];
    }

    if (role === 'ADMIN') {
      return [
        'Review courses with low completion.',
        'Check participation before the next governance review.',
        'Use analytics to identify programmes needing intervention.',
      ];
    }

    const lowProgress = [...courses]
      .sort((a, b) => Number(a.progress || 0) - Number(b.progress || 0))
      .slice(0, 2);

    return [
      lowProgress[0]
        ? `Resume ${lowProgress[0].courseTitle || lowProgress[0].title}.`
        : 'Explore a relevant learning programme.',
      'Finish pending assessment work before adding another course.',
      'Use the AI Assistant for revision and planning.',
    ];
  }, [courses, role]);

  const recentActivity = useMemo<ActivityItem[]>(() => {
    if (role === 'TRAINEE') {
      return [
        ...attempts.slice(0, 3).map((item: any) => ({
          title: 'Assessment activity',
          detail: `${String(item.result || 'Attempt recorded').toLowerCase()}${item.percentage != null ? ` · ${Math.round(item.percentage)}%` : ''}`,
          date: item.submittedAt || item.createdAt,
        })),
        ...certificates.slice(0, 2).map((item: any) => ({
          title: 'Certificate activity',
          detail: item.courseTitle || item.title || 'Certificate updated',
          date: item.issuedAt,
        })),
      ].slice(0, 5);
    }

    if (role === 'TRAINER') {
      return courses.slice(0, 5).map((item) => ({
        title: item.courseTitle || item.title || 'Course',
        detail: `${Number(item.trainees || 0)} trainees · ${Number(item.completion || 0)}% completion`,
      }));
    }

    return [
      {
        title: 'Platform snapshot',
        detail: `${dashboard?.totalUsers ?? 0} users across the platform`,
      },
      {
        title: 'Course portfolio',
        detail: `${dashboard?.publishedCourses ?? 0} published of ${dashboard?.totalCourses ?? 0} courses`,
      },
      {
        title: 'Learning participation',
        detail: `${dashboard?.totalEnrollments ?? 0} total enrollments`,
      },
    ];
  }, [role, attempts, certificates, courses, dashboard]);

  useEffect(() => {
    if (!user || loading) return;

    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 1200);

    const context = JSON.stringify({
      role,
      competencyScore: metrics.score,
      engagement: metrics.engagement,
      courses: courses.slice(0, 5).map((course) => ({
        title: course.courseTitle || course.title,
        progress: course.progress ?? course.completion,
        averageScore: course.averageScore,
      })),
    });

    chatWithAIActivity(
      `Give one concise next-step recommendation for this dashboard. Keep it under 25 words. Return plain text only.`,
      context
    )
      .then((response: any) => {
        const text = typeof response === 'string' ? response : response?.answer;
        if (text) setAiText(String(text).trim());
      })
      .catch(() => {})
      .finally(() => window.clearTimeout(timer));

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [user, loading, role, courses, metrics]);

  if (loading) return null;

  const heroText =
    role === 'TRAINEE'
      ? 'Your personalised learning command centre.'
      : role === 'TRAINER'
        ? 'Your training delivery and learner performance command centre.'
        : 'Your platform governance and capacity-building command centre.';

  const roleIcon =
    role === 'ADMIN'
      ? <AdminPanelSettingsOutlinedIcon />
      : role === 'TRAINER'
        ? <PeopleOutlineOutlinedIcon />
        : <MenuBookOutlinedIcon />;

  return (
    <Box
      sx={{
        bgcolor: bg,
        mt: 3,
        mb: 3,
      }}
    >
      <Stack spacing={2.5}>
        <Card
          elevation={0}
          sx={{
            border: `1px solid ${border}`,
            borderRadius: 3,
            overflow: 'hidden',
            background:
              'linear-gradient(120deg, rgba(235,245,250,1) 0%, rgba(255,255,255,1) 68%)',
          }}
        >
          <CardContent sx={{ p: { xs: 2.2, md: 3 } }}>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              sx={{
                justifyContent: 'space-between',
                gap: 2,
                alignItems: { xs: 'flex-start', md: 'center' },
              }}
            >
              <Box>
                <Typography
                  sx={{
                    color: blue,
                    fontWeight: 800,
                    fontSize: '.76rem',
                    textTransform: 'uppercase',
                    letterSpacing: '.08em',
                  }}
                >
                  {role === 'ADMIN'
                    ? 'Administration'
                    : role === 'TRAINER'
                      ? 'Trainer Workspace'
                      : 'Learning Workspace'}
                </Typography>

                <Typography
                  sx={{
                    color: navy,
                    fontWeight: 800,
                    fontSize: { xs: '1.6rem', md: '2rem' },
                    mt: .4,
                  }}
                >
                  Good morning, {user?.firstName || 'there'} 👋
                </Typography>

                <Typography sx={{ color: text, mt: .6 }}>
                  {heroText}
                </Typography>
              </Box>

              <Box
                sx={{
                  minWidth: { xs: '100%', md: 240 },
                  p: 2,
                  borderRadius: 2.5,
                  bgcolor: 'rgba(255,255,255,.82)',
                  border: `1px solid ${border}`,
                }}
              >
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ alignItems: 'center' }}
                >
                  <Box sx={{ color: blue, display: 'flex' }}>{roleIcon}</Box>
                  <Typography sx={{ color: navy, fontWeight: 800 }}>
                    Current competency
                  </Typography>
                </Stack>

                <Stack
                  direction="row"
                  sx={{
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mt: 1.2,
                  }}
                >
                  <Typography
                    sx={{
                      color: navy,
                      fontWeight: 900,
                      fontSize: '1.65rem',
                    }}
                  >
                    {metrics.score}/100
                  </Typography>

                  <Chip
                    label={metrics.engagement >= 70 ? 'On track' : 'Needs focus'}
                    size="small"
                    sx={{
                      bgcolor:
                        metrics.engagement >= 70 ? '#EAF6EF' : '#FFF4E5',
                      color:
                        metrics.engagement >= 70 ? '#147A45' : '#B56A00',
                      fontWeight: 800,
                    }}
                  />
                </Stack>

                <LinearProgress
                  variant="determinate"
                  value={metrics.score}
                  sx={{
                    mt: 1.2,
                    height: 7,
                    borderRadius: 5,
                    bgcolor: '#E4ECF1',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: blue,
                      borderRadius: 5,
                    },
                  }}
                />
              </Box>
            </Stack>
          </CardContent>
        </Card>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              lg: 'repeat(5, 1fr)',
            },
            gap: 1.6,
          }}
        >
          {metrics.kpis.map(([label, value, Icon, detail]) => (
            <Card
              key={String(label)}
              elevation={0}
              sx={{
                border: `1px solid ${border}`,
                borderRadius: 2.5,
              }}
            >
              <CardContent sx={{ p: 2 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 1.5,
                    bgcolor: '#EAF4FB',
                    color: blue,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon fontSize="small" />
                </Box>

                <Typography
                  sx={{
                    color: navy,
                    fontWeight: 900,
                    fontSize: '1.45rem',
                    mt: 1,
                  }}
                >
                  {String(value)}
                </Typography>

                <Typography sx={{ color: text, fontWeight: 700, fontSize: '.82rem' }}>
                  {String(label)}
                </Typography>

                <Typography sx={{ color: text, mt: .35, fontSize: '.72rem' }}>
                  {String(detail)}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '1.45fr 1fr' },
            gap: 2.2,
          }}
        >
          <Card elevation={0} sx={{ border: `1px solid ${border}`, borderRadius: 2.5 }}>
            <CardContent sx={{ p: { xs: 2.2, md: 2.8 } }}>
              <Stack
                direction="row"
                sx={{
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Box>
                  <Typography sx={{ color: navy, fontWeight: 800, fontSize: '1.15rem' }}>
                    Competency Matrix
                  </Typography>
                  <Typography sx={{ color: text, fontSize: '.82rem', mt: .35 }}>
                    Current performance against the target level.
                  </Typography>
                </Box>

                <PsychologyOutlinedIcon sx={{ color: blue }} />
              </Stack>

              {matrix.length === 0 ? (
                <Typography sx={{ color: text }}>
                  No competency data is available yet.
                </Typography>
              ) : (
                <Stack spacing={1.7}>
                  {matrix.map((row) => (
                    <Box key={row.title}>
                      <Stack
                        direction="row"
                        sx={{
                          justifyContent: 'space-between',
                          gap: 2,
                          mb: .6,
                        }}
                      >
                        <Typography sx={{ color: navy, fontWeight: 700, fontSize: '.88rem' }}>
                          {row.title}
                        </Typography>

                        <Chip
                          label={row.status}
                          size="small"
                          sx={{
                            height: 22,
                            bgcolor:
                              row.status === 'On target'
                                ? '#EAF6EF'
                                : '#FFF4E5',
                            color:
                              row.status === 'On target'
                                ? '#147A45'
                                : '#B56A00',
                            fontWeight: 800,
                            fontSize: '.68rem',
                          }}
                        />
                      </Stack>

                      <Stack
                        direction="row"
                        sx={{ alignItems: 'center', gap: 1.2 }}
                      >
                        <Typography
                          sx={{
                            width: 58,
                            color: text,
                            fontSize: '.72rem',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {row.current}/{row.required}
                        </Typography>

                        <LinearProgress
                          variant="determinate"
                          value={row.progress}
                          sx={{
                            flex: 1,
                            height: 7,
                            borderRadius: 5,
                            bgcolor: '#E5EDF2',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: blue,
                              borderRadius: 5,
                            },
                          }}
                        />
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>

          <Card elevation={0} sx={{ border: `1px solid ${border}`, borderRadius: 2.5 }}>
            <CardContent sx={{ p: { xs: 2.2, md: 2.8 } }}>
              <Stack
                direction="row"
                sx={{ justifyContent: 'space-between', alignItems: 'center' }}
              >
                <Box>
                  <Typography sx={{ color: navy, fontWeight: 800, fontSize: '1.15rem' }}>
                    AI-Powered Learning Path
                  </Typography>
                  <Typography sx={{ color: text, fontSize: '.82rem', mt: .35 }}>
                    Next best step from your current LMS signals.
                  </Typography>
                </Box>

                <AutoAwesomeOutlinedIcon sx={{ color: '#7050A5' }} />
              </Stack>

              <Box
                sx={{
                  mt: 2,
                  p: 1.8,
                  borderRadius: 2,
                  bgcolor: '#F7F3FC',
                  border: '1px solid #E6DCF2',
                }}
              >
                <Typography sx={{ color: navy, fontWeight: 800 }}>
                  {nextStep.title}
                </Typography>

                <Typography sx={{ color: text, mt: .7, fontSize: '.84rem' }}>
                  {aiText || nextStep.detail}
                </Typography>

                <Button
                  variant="contained"
                  endIcon={<ArrowForwardOutlinedIcon />}
                  onClick={() => navigate(nextStep.action)}
                  sx={{
                    mt: 1.5,
                    bgcolor: '#7050A5',
                    textTransform: 'none',
                    fontWeight: 700,
                    borderRadius: 1.5,
                    boxShadow: 'none',
                    '&:hover': {
                      bgcolor: '#5D408B',
                      boxShadow: 'none',
                    },
                  }}
                >
                  View next step
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '1.15fr 1fr 1fr' },
            gap: 2.2,
          }}
        >
          <Card elevation={0} sx={{ border: `1px solid ${border}`, borderRadius: 2.5 }}>
            <CardContent sx={{ p: { xs: 2.2, md: 2.8 } }}>
              <Stack
                direction="row"
                sx={{ justifyContent: 'space-between', alignItems: 'center' }}
              >
                <Box>
                  <Typography sx={{ color: navy, fontWeight: 800, fontSize: '1.08rem' }}>
                    Continue Learning
                  </Typography>
                  <Typography sx={{ color: text, fontSize: '.8rem', mt: .3 }}>
                    Pick up where you left off.
                  </Typography>
                </Box>
                <MenuBookOutlinedIcon sx={{ color: blue }} />
              </Stack>

              <Stack spacing={1.2} sx={{ mt: 1.8 }}>
                {[...courses]
                  .filter((course) => Number(course.progress ?? course.completion ?? 0) < 100)
                  .sort(
                    (a, b) =>
                      Number(b.progress ?? b.completion ?? 0) -
                      Number(a.progress ?? a.completion ?? 0)
                  )
                  .slice(0, 3)
                  .map((course) => {
                    const progress = clamp(
                      Number(course.progress ?? course.completion ?? 0)
                    );

                    return (
                      <Box
                        key={course.courseId || course.id}
                        sx={{
                          p: 1.4,
                          borderRadius: 1.8,
                          border: `1px solid ${border}`,
                        }}
                      >
                        <Stack
                          direction="row"
                          sx={{
                            justifyContent: 'space-between',
                            gap: 1,
                          }}
                        >
                          <Typography sx={{ color: navy, fontWeight: 700, fontSize: '.84rem' }}>
                            {course.courseTitle || course.title}
                          </Typography>

                          <Typography sx={{ color: blue, fontWeight: 800, fontSize: '.76rem' }}>
                            {progress}%
                          </Typography>
                        </Stack>

                        <LinearProgress
                          variant="determinate"
                          value={progress}
                          sx={{
                            mt: .8,
                            height: 6,
                            borderRadius: 5,
                            bgcolor: '#E5EDF2',
                            '& .MuiLinearProgress-bar': {
                              bgcolor: blue,
                            },
                          }}
                        />
                      </Box>
                    );
                  })}

                {!courses.some(
                  (course) =>
                    Number(course.progress ?? course.completion ?? 0) < 100
                ) && (
                  <Typography sx={{ color: text, fontSize: '.84rem' }}>
                    You are currently caught up. Great work.
                  </Typography>
                )}
              </Stack>
            </CardContent>
          </Card>

          <Card elevation={0} sx={{ border: `1px solid ${border}`, borderRadius: 2.5 }}>
            <CardContent sx={{ p: { xs: 2.2, md: 2.8 } }}>
              <Typography sx={{ color: navy, fontWeight: 800, fontSize: '1.08rem' }}>
                {role === 'TRAINEE' ? 'Learning Hours' : role === 'TRAINER' ? 'Learner Engagement' : 'Platform Engagement'}
              </Typography>

              <Typography sx={{ color: text, fontSize: '.8rem', mt: .3 }}>
                Current engagement signal.
              </Typography>

              <Typography
                sx={{
                  color: navy,
                  fontWeight: 900,
                  fontSize: '2rem',
                  mt: 2,
                }}
              >
                {metrics.engagement}%
              </Typography>

              <LinearProgress
                variant="determinate"
                value={metrics.engagement}
                sx={{
                  mt: 1,
                  height: 8,
                  borderRadius: 6,
                  bgcolor: '#E5EDF2',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: '#2E7D57',
                    borderRadius: 6,
                  },
                }}
              />

              <Typography sx={{ color: text, fontSize: '.78rem', mt: 1.2 }}>
                {role === 'TRAINEE'
                  ? 'Based on active learning and course progress.'
                  : role === 'TRAINER'
                    ? 'Based on trainee completion across your programmes.'
                    : 'Based on course completion and enrolment participation.'}
              </Typography>
            </CardContent>
          </Card>

          <Card elevation={0} sx={{ border: `1px solid ${border}`, borderRadius: 2.5 }}>
            <CardContent sx={{ p: { xs: 2.2, md: 2.8 } }}>
              <Typography sx={{ color: navy, fontWeight: 800, fontSize: '1.08rem' }}>
                Recommendations
              </Typography>

              <Typography sx={{ color: text, fontSize: '.8rem', mt: .3 }}>
                Priority actions for your current portal state.
              </Typography>

              <Stack spacing={1.2} sx={{ mt: 1.8 }}>
                {recommendations.map((item) => (
                  <Stack
                    key={item}
                    direction="row"
                    spacing={1}
                    sx={{ alignItems: 'flex-start' }}
                  >
                    <CheckCircleOutlineOutlinedIcon
                      sx={{ color: '#2E7D57', fontSize: 18, mt: .1 }}
                    />
                    <Typography sx={{ color: navy, fontSize: '.8rem', lineHeight: 1.45 }}>
                      {item}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '1.1fr 1fr' },
            gap: 2.2,
          }}
        >
          <Card elevation={0} sx={{ border: `1px solid ${border}`, borderRadius: 2.5 }}>
            <CardContent sx={{ p: { xs: 2.2, md: 2.8 } }}>
              <Stack
                direction="row"
                sx={{
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 1.6,
                }}
              >
                <Box>
                  <Typography sx={{ color: navy, fontWeight: 800, fontSize: '1.08rem' }}>
                    Recent Activity
                  </Typography>
                  <Typography sx={{ color: text, fontSize: '.8rem', mt: .3 }}>
                    Latest activity from this portal.
                  </Typography>
                </Box>

                <TrendingUpOutlinedIcon sx={{ color: blue }} />
              </Stack>

              <Stack spacing={1.1}>
                {recentActivity.length ? (
                  recentActivity.map((item, index) => (
                    <Box key={`${item.title}-${index}`}>
                      {index > 0 && <Divider sx={{ mb: 1.1 }} />}
                      <Typography sx={{ color: navy, fontWeight: 700, fontSize: '.82rem' }}>
                        {item.title}
                      </Typography>
                      <Typography sx={{ color: text, fontSize: '.77rem', mt: .25 }}>
                        {item.detail}
                      </Typography>
                    </Box>
                  ))
                ) : (
                  <Typography sx={{ color: text, fontSize: '.82rem' }}>
                    No recent activity recorded.
                  </Typography>
                )}
              </Stack>
            </CardContent>
          </Card>

          <Card elevation={0} sx={{ border: `1px solid ${border}`, borderRadius: 2.5 }}>
            <CardContent sx={{ p: { xs: 2.2, md: 2.8 } }}>
              <Stack
                direction="row"
                sx={{ justifyContent: 'space-between', alignItems: 'center' }}
              >
                <Box>
                  <Typography sx={{ color: navy, fontWeight: 800, fontSize: '1.08rem' }}>
                    Development Plan
                  </Typography>
                  <Typography sx={{ color: text, fontSize: '.8rem', mt: .3 }}>
                    Three focused goals generated from the current portal state.
                  </Typography>
                </Box>

                <AssignmentOutlinedIcon sx={{ color: blue }} />
              </Stack>

              <Stack spacing={1.2} sx={{ mt: 1.8 }}>
                {(role === 'TRAINEE'
                  ? [
                      `Reach ${Math.min(100, metrics.score + 10)}/100 competency`,
                      'Complete the next pending learning activity',
                      'Finish one assessment cycle without interruption',
                    ]
                  : role === 'TRAINER'
                    ? [
                        'Improve the lowest-performing course',
                        'Review one assessment outcome this week',
                        'Use trainee analytics before the next course update',
                      ]
                    : [
                        'Review the lowest-completion programme',
                        'Audit participation before the next governance review',
                        'Track course quality and assessment coverage',
                      ]
                ).map((goal, index) => (
                  <Stack
                    key={goal}
                    direction="row"
                    spacing={1.1}
                    sx={{ alignItems: 'flex-start' }}
                  >
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        bgcolor: '#EAF4FB',
                        color: blue,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '.72rem',
                        fontWeight: 900,
                        flexShrink: 0,
                      }}
                    >
                      {index + 1}
                    </Box>

                    <Typography sx={{ color: navy, fontSize: '.82rem', lineHeight: 1.45 }}>
                      {goal}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Stack>
    </Box>
  );
};

export default PortalDashboardEnhancements;
