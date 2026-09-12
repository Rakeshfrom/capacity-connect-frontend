import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  LinearProgress,
  Paper,
  Typography,
} from '@mui/material';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import PlayCircleOutlineOutlinedIcon from '@mui/icons-material/PlayCircleOutlineOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import LocalFireDepartmentOutlinedIcon from '@mui/icons-material/LocalFireDepartmentOutlined';
import PsychologyOutlinedIcon from '@mui/icons-material/PsychologyOutlined';
import { Link as RouterLink } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import {
  getCourses,
  getEnrollments,
  getAttemptsByTrainee,
  getMyCertificates,
  getPublishedAnnouncements,
  getMyStudyResource,
  chatWithAI,
} from '../../../services/api';

interface Enrollment {
  id: number;
  courseId: number;
  progress?: number;
  status?: string;
}

interface Course {
  id: number;
  title: string;
  category?: string;
}

interface Attempt {
  id: number;
  assessmentId: number;
  result: string;
  score?: number;
  percentage?: number;
  createdAt?: string;
  submittedAt?: string;
}

interface Certificate {
  id: number;
  status: string;
  title?: string;
  courseTitle?: string;
  issuedAt?: string;
}

interface Announcement {
  id: number;
  title?: string;
  message?: string;
  content?: string;
  createdAt?: string;
  publishedAt?: string;
}

interface Resource {
  id: number;
  title: string;
  type?: string;
  department?: string;
  createdAt?: string;
}

interface ActivityDay {
  date: string;
  count: number;
}

const colors = {
  navy: '#173F60',
  blue: '#0B5A91',
  lightBlue: '#EAF4FA',
  text: '#657887',
  border: '#DCE6ED',
  bg: '#F4F8FB',
  green: '#2E7D57',
  lightGreen: '#EAF6F0',
  orange: '#B56A00',
  lightOrange: '#FFF4E5',
  purple: '#7050A5',
  lightPurple: '#F2ECFA',
};

const cardSx = {
  border: `1px solid ${colors.border}`,
  borderRadius: 3,
  bgcolor: '#fff',
  boxShadow: '0 2px 10px rgba(23,63,96,.035)',
};

const Dashboard = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [aiInsight, setAiInsight] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getEnrollments(),
      getCourses(),
      getAttemptsByTrainee(),
      getMyCertificates(),
      getPublishedAnnouncements().catch(() => []),
    ])
      .then(async ([enrollmentData, courseData, attemptData, certificateData, announcementData]) => {
        setEnrollments(enrollmentData || []);
        setCourses(courseData || []);
        setAttempts(attemptData || []);
        setCertificates(certificateData || []);
        setAnnouncements(announcementData || []);

        const courseIds = (enrollmentData || []).slice(0, 5).map(
          (e: Enrollment) => e.courseId
        );

        const resourceLists = await Promise.all(
          courseIds.map((id: number) =>
            getMyStudyResource(id).catch(() => null)
          )
        );

        const extracted = resourceLists.filter(Boolean).flat();
        if (extracted.length) {
          setResources(extracted as Resource[]);
        }

        const progress = (enrollmentData || []).map(
          (e: Enrollment) => e.progress || 0
        );
        const avg = progress.length
          ? Math.round(progress.reduce((a: number, b: number) => a + b, 0) / progress.length)
          : 0;

        try {
          const response = await chatWithAI(
            `You are the learning coach inside an LMS dashboard.
Based only on these trainee metrics, give one concise personalized learning insight and one next action.
Enrolled courses: ${enrollmentData?.length || 0}
Average course progress: ${avg}%
Assessment attempts: ${attemptData?.length || 0}
Pending assessments: ${(attemptData || []).filter((a: Attempt) => a.result?.toUpperCase() === 'PENDING').length}
Certificates issued: ${(certificateData || []).filter((c: Certificate) => c.status?.toUpperCase() === 'ISSUED').length}
Do not invent course names, scores, or facts.
Return plain text in 2 short sentences.`
          );

          setAiInsight(
            typeof response === 'string'
              ? response
              : response?.answer || ''
          );
        } catch {
          setAiInsight('');
        }
      })
      .catch((error) => {
        console.error('Failed to load trainee dashboard:', error);
      })
      .finally(() => setLoading(false));
  }, []);

  const enrolledCourses = useMemo(
    () =>
      enrollments.map((enrollment) => {
        const course = courses.find((item) => item.id === enrollment.courseId);

        return {
          ...enrollment,
          title: course?.title ?? `Course #${enrollment.courseId}`,
          category: course?.category ?? 'Learning',
          progress: Math.min(100, Math.max(0, enrollment.progress ?? 0)),
        };
      }),
    [enrollments, courses]
  );

  const totalProgress = enrolledCourses.length
    ? Math.round(
        enrolledCourses.reduce((sum, course) => sum + course.progress, 0) /
          enrolledCourses.length
      )
    : 0;

  const pendingAssessments = attempts.filter(
    (a) => a.result?.toUpperCase() === 'PENDING'
  ).length;

  const passedAssessments = attempts.filter((a) =>
    ['PASSED', 'PASS', 'COMPLETED'].includes(a.result?.toUpperCase())
  ).length;

  const failedAssessments = attempts.filter((a) =>
    ['FAILED', 'FAIL'].includes(a.result?.toUpperCase())
  ).length;

  const issuedCertificates = certificates.filter(
    (c) => c.status?.toUpperCase() === 'ISSUED'
  ).length;

  const completedCourses = enrolledCourses.filter(
    (c) => c.progress >= 100
  ).length;

  const averageScore = useMemo(() => {
    const scores = attempts
      .map((a) => a.percentage ?? a.score)
      .filter((v): v is number => typeof v === 'number');

    return scores.length
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0;
  }, [attempts]);

  const resourceByType = useMemo(() => {
    const file = resources.filter((r) => r.type === 'FILE').length;
    const link = resources.filter((r) => r.type === 'LINK').length;

    return { file, link, total: resources.length };
  }, [resources]);

  const nextCourse = [...enrolledCourses]
    .filter((c) => c.progress < 100)
    .sort((a, b) => b.progress - a.progress)[0];

  /*
   * Portal activity tracker.
   * Each dashboard visit records the current day locally.
   * Learning actions add intensity to the same day.
   */
  const [activity, setActivity] = useState<ActivityDay[]>([]);

  useEffect(() => {
    const key = 'capacity-connect-learning-activity';
    const today = new Date().toISOString().slice(0, 10);

    let stored: ActivityDay[] = [];

    try {
      stored = JSON.parse(localStorage.getItem(key) || '[]');
    } catch {
      stored = [];
    }

    const current = stored.find((d) => d.date === today);

    if (current) {
      current.count = Math.min(4, current.count + 1);
    } else {
      stored.push({ date: today, count: 1 });
    }

    stored = stored
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-365);

    localStorage.setItem(key, JSON.stringify(stored));
    setActivity(stored);
  }, []);

  const activityMap = useMemo(
    () => new Map(activity.map((item) => [item.date, item.count])),
    [activity]
  );

  const heatmapDays = useMemo(() => {
    const days: ActivityDay[] = [];
    const end = new Date();
    end.setHours(0, 0, 0, 0);

    for (let i = 364; i >= 0; i--) {
      const date = new Date(end);
      date.setDate(end.getDate() - i);

      const key = date.toISOString().slice(0, 10);
      days.push({
        date: key,
        count: activityMap.get(key) || 0,
      });
    }

    return days;
  }, [activityMap]);

  const activeDays = activity.filter((d) => d.count > 0).length;

  const currentStreak = useMemo(() => {
    let streak = 0;

    for (let i = 0; i < heatmapDays.length; i++) {
      const item = heatmapDays[heatmapDays.length - 1 - i];

      if (item.count > 0) streak++;
      else break;
    }

    return streak;
  }, [heatmapDays]);

  const activityLevel = (count: number) => {
    if (count <= 0) return '#E8EFF3';
    if (count === 1) return '#CDE5D8';
    if (count === 2) return '#8CC5A4';
    if (count === 3) return '#51A678';
    return '#258457';
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '75vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: colors.bg,
        }}
      >
        <CircularProgress sx={{ color: colors.blue }} />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: colors.bg, minHeight: '100vh', py: { xs: 2.5, md: 4 } }}>
      <Container maxWidth="xl">

        {/* HEADER */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'center' },
            gap: 2,
            flexWrap: 'wrap',
            mb: 3,
          }}
        >
          <Box>
            <Typography
              sx={{
                color: colors.navy,
                fontWeight: 800,
                fontSize: { xs: '1.75rem', md: '2.2rem' },
              }}
            >
              Welcome back 👋
            </Typography>
            <Typography sx={{ color: colors.text, mt: .6 }}>
              Your professional learning command centre.
            </Typography>
          </Box>

          <Button
            component={RouterLink}
            to="/ai-assistant"
            variant="contained"
            startIcon={<AutoAwesomeOutlinedIcon />}
            sx={{
              bgcolor: colors.blue,
              borderRadius: 2,
              px: 2.2,
              py: 1.1,
              textTransform: 'none',
              fontWeight: 700,
              boxShadow: 'none',
              '&:hover': { bgcolor: '#084873', boxShadow: 'none' },
            }}
          >
            AI Learning Assistant
          </Button>
        </Box>

        {/* TOP SNAPSHOT */}
        <Paper elevation={0} sx={{ ...cardSx, p: { xs: 2, md: 3 }, mb: 3 }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                lg: 'repeat(4, 1fr)',
              },
              gap: 2,
            }}
          >
            {[
              {
                icon: <SchoolOutlinedIcon />,
                value: enrolledCourses.length,
                label: 'Enrolled courses',
                bg: colors.lightBlue,
                fg: colors.blue,
              },
              {
                icon: <TrendingUpOutlinedIcon />,
                value: `${totalProgress}%`,
                label: 'Overall progress',
                bg: colors.lightGreen,
                fg: colors.green,
              },
              {
                icon: <AssignmentOutlinedIcon />,
                value: pendingAssessments,
                label: 'Pending assessments',
                bg: colors.lightOrange,
                fg: colors.orange,
              },
              {
                icon: <WorkspacePremiumOutlinedIcon />,
                value: issuedCertificates,
                label: 'Certificates earned',
                bg: colors.lightPurple,
                fg: colors.purple,
              },
            ].map((item) => (
              <Box
                key={item.label}
                sx={{
                  p: 2,
                  borderRadius: 2.5,
                  bgcolor: '#FAFCFD',
                  border: `1px solid ${colors.border}`,
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: item.bg,
                    color: item.fg,
                    width: 42,
                    height: 42,
                    mb: 1.3,
                  }}
                >
                  {item.icon}
                </Avatar>
                <Typography sx={{ color: colors.navy, fontWeight: 800, fontSize: '1.65rem' }}>
                  {item.value}
                </Typography>
                <Typography sx={{ color: colors.text, fontSize: '.84rem' }}>
                  {item.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>

        {/* MY COURSES */}
        <Paper elevation={0} sx={{ ...cardSx, p: { xs: 2.5, md: 3.5 }, mb: 3 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 2,
              flexWrap: 'wrap',
              mb: 3,
            }}
          >
            <Box>
              <Typography sx={{ color: colors.navy, fontWeight: 800, fontSize: '1.3rem' }}>
                My Courses
              </Typography>
              <Typography sx={{ color: colors.text, mt: .4, fontSize: '.88rem' }}>
                Your current learning programmes and completion progress.
              </Typography>
            </Box>

            <Button
              component={RouterLink}
              to="/courses"
              endIcon={<ArrowForwardIcon />}
              sx={{ color: colors.blue, textTransform: 'none', fontWeight: 700 }}
            >
              View courses
            </Button>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '260px 1fr' },
              gap: 4,
              alignItems: 'center',
            }}
          >
            {/* Overall progress visual */}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box
                sx={{
                  width: 190,
                  height: 190,
                  borderRadius: '50%',
                  background: `conic-gradient(${colors.blue} ${totalProgress * 3.6}deg, #E4EDF2 0deg)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Box
                  sx={{
                    width: 148,
                    height: 148,
                    borderRadius: '50%',
                    bgcolor: '#fff',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography sx={{ color: colors.navy, fontWeight: 800, fontSize: '2.25rem' }}>
                    {totalProgress}%
                  </Typography>
                  <Typography sx={{ color: colors.text, fontSize: '.78rem' }}>
                    overall completion
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Course bars */}
            <Box>
              {enrolledCourses.length ? (
                enrolledCourses.slice(0, 6).map((course) => (
                  <Box key={course.id} sx={{ mb: 2.1 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: 2,
                        mb: .7,
                      }}
                    >
                      <Typography
                        sx={{
                          color: '#294C65',
                          fontWeight: 700,
                          fontSize: '.88rem',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {course.title}
                      </Typography>
                      <Typography sx={{ color: colors.blue, fontWeight: 800, fontSize: '.82rem' }}>
                        {course.progress}%
                      </Typography>
                    </Box>

                    <LinearProgress
                      variant="determinate"
                      value={course.progress}
                      sx={{
                        height: 8,
                        borderRadius: 8,
                        bgcolor: '#E6EEF3',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 8,
                          bgcolor: course.progress >= 100 ? colors.green : colors.blue,
                        },
                      }}
                    />
                  </Box>
                ))
              ) : (
                <Box sx={{ py: 4, textAlign: 'center' }}>
                  <MenuBookOutlinedIcon sx={{ fontSize: 42, color: '#A5B6C1' }} />
                  <Typography sx={{ color: colors.navy, fontWeight: 700, mt: 1 }}>
                    No enrolled courses yet
                  </Typography>
                  <Button
                    component={RouterLink}
                    to="/courses"
                    endIcon={<ArrowForwardIcon />}
                    sx={{ color: colors.blue, textTransform: 'none', fontWeight: 700 }}
                  >
                    Explore courses
                  </Button>
                </Box>
              )}
            </Box>
          </Box>

          {nextCourse && (
            <Box
              sx={{
                mt: 2,
                p: 2,
                borderRadius: 2,
                bgcolor: '#F5F9FC',
                border: `1px solid ${colors.border}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 2,
                flexWrap: 'wrap',
              }}
            >
              <Box>
                <Typography sx={{ color: colors.text, fontSize: '.75rem', fontWeight: 700 }}>
                  CONTINUE LEARNING
                </Typography>
                <Typography sx={{ color: colors.navy, fontWeight: 750, mt: .2 }}>
                  {nextCourse.title}
                </Typography>
              </Box>

              <Button
                component={RouterLink}
                to={`/courses/${nextCourse.courseId}`}
                variant="contained"
                startIcon={<PlayCircleOutlineOutlinedIcon />}
                sx={{
                  bgcolor: colors.blue,
                  textTransform: 'none',
                  fontWeight: 700,
                  boxShadow: 'none',
                }}
              >
                Continue
              </Button>
            </Box>
          )}
        </Paper>

        {/* ASSESSMENTS */}
        <Paper elevation={0} sx={{ ...cardSx, p: { xs: 2.5, md: 3.5 }, mb: 3 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 2,
              flexWrap: 'wrap',
              mb: 3,
            }}
          >
            <Box>
              <Typography sx={{ color: colors.navy, fontWeight: 800, fontSize: '1.3rem' }}>
                Assessments
              </Typography>
              <Typography sx={{ color: colors.text, mt: .4, fontSize: '.88rem' }}>
                Monitor assessment activity and performance.
              </Typography>
            </Box>

            <Button
              component={RouterLink}
              to="/assessments"
              endIcon={<ArrowForwardIcon />}
              sx={{ color: colors.blue, textTransform: 'none', fontWeight: 700 }}
            >
              View assessments
            </Button>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(4, 1fr)' },
              gap: 2,
              mb: 3,
            }}
          >
            {[
              ['Total attempts', attempts.length, colors.blue],
              ['Passed', passedAssessments, colors.green],
              ['Pending', pendingAssessments, colors.orange],
              ['Average score', `${averageScore}%`, colors.purple],
            ].map(([label, value, color]) => (
              <Box
                key={String(label)}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: '#FAFCFD',
                  border: `1px solid ${colors.border}`,
                }}
              >
                <Typography sx={{ color: String(color), fontWeight: 800, fontSize: '1.45rem' }}>
                  {value}
                </Typography>
                <Typography sx={{ color: colors.text, fontSize: '.8rem', mt: .3 }}>
                  {label}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Assessment visualization */}
          <Box sx={{ p: 2.5, borderRadius: 2.5, bgcolor: '#F7FAFC' }}>
            <Typography sx={{ color: colors.navy, fontWeight: 750, mb: 2 }}>
              Assessment outcome
            </Typography>

            {[
              ['Passed', passedAssessments, colors.green],
              ['Pending', pendingAssessments, colors.orange],
              ['Failed', failedAssessments, '#C65353'],
            ].map(([label, value, color]) => {
              const total = Math.max(attempts.length, 1);
              const width = (Number(value) / total) * 100;

              return (
                <Box key={String(label)} sx={{ mb: 1.8 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: .5 }}>
                    <Typography sx={{ color: '#486274', fontSize: '.82rem' }}>
                      {label}
                    </Typography>
                    <Typography sx={{ color: colors.navy, fontWeight: 700, fontSize: '.8rem' }}>
                      {value}
                    </Typography>
                  </Box>
                  <Box sx={{ height: 10, borderRadius: 8, bgcolor: '#E4EBEF', overflow: 'hidden' }}>
                    <Box
                      sx={{
                        width: `${width}%`,
                        height: '100%',
                        bgcolor: color,
                        borderRadius: 8,
                        transition: 'width .4s ease',
                      }}
                    />
                  </Box>
                </Box>
              );
            })}
          </Box>

          <Box
            sx={{
              mt: 2.5,
              p: 2,
              borderRadius: 2,
              bgcolor: '#EEF6FB',
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            <PsychologyOutlinedIcon sx={{ color: colors.blue }} />
            <Typography sx={{ color: '#365A70', fontSize: '.84rem' }}>
              <b>AI performance support:</b> your assessment activity is used to
              generate personalized learning guidance below.
            </Typography>
          </Box>
        </Paper>

        {/* RESOURCES */}
        <Paper elevation={0} sx={{ ...cardSx, p: { xs: 2.5, md: 3.5 }, mb: 3 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 2,
              flexWrap: 'wrap',
              mb: 3,
            }}
          >
            <Box>
              <Typography sx={{ color: colors.navy, fontWeight: 800, fontSize: '1.3rem' }}>
                Resources
              </Typography>
              <Typography sx={{ color: colors.text, mt: .4, fontSize: '.88rem' }}>
                Learning material connected with your programmes.
              </Typography>
            </Box>

            <Button
              component={RouterLink}
              to="/resources"
              endIcon={<ArrowForwardIcon />}
              sx={{ color: colors.blue, textTransform: 'none', fontWeight: 700 }}
            >
              View resources
            </Button>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: 3,
            }}
          >
            <Box
              sx={{
                minHeight: 210,
                p: 3,
                borderRadius: 2.5,
                bgcolor: '#F7FAFC',
                border: `1px solid ${colors.border}`,
              }}
            >
              <Typography sx={{ color: colors.navy, fontWeight: 750, mb: 2 }}>
                Resource library
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                  height: 130,
                }}
              >
                {[
                  ['Files', resourceByType.file, colors.blue],
                  ['Links', resourceByType.link, colors.green],
                ].map(([label, value, color]) => {
                  const total = Math.max(resourceByType.total, 1);
                  const percent = Math.round((Number(value) / total) * 100);

                  return (
                    <Box key={String(label)} sx={{ textAlign: 'center' }}>
                      <Box
                        sx={{
                          width: 110,
                          height: 110,
                          borderRadius: '50%',
                          background: `conic-gradient(${color} ${percent * 3.6}deg, #E5EDF2 0deg)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Box
                          sx={{
                            width: 78,
                            height: 78,
                            borderRadius: '50%',
                            bgcolor: '#F7FAFC',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column',
                          }}
                        >
                          <Typography sx={{ color: colors.navy, fontWeight: 800 }}>
                            {value}
                          </Typography>
                          <Typography sx={{ color: colors.text, fontSize: '.68rem' }}>
                            {percent}%
                          </Typography>
                        </Box>
                      </Box>
                      <Typography sx={{ color: colors.text, fontSize: '.78rem', mt: .7 }}>
                        {label}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            </Box>

            <Box
              sx={{
                minHeight: 210,
                p: 3,
                borderRadius: 2.5,
                bgcolor: '#F7FAFC',
                border: `1px solid ${colors.border}`,
              }}
            >
              <Typography sx={{ color: colors.navy, fontWeight: 750, mb: 2 }}>
                Learning material available
              </Typography>

              {resources.length ? (
                resources.slice(0, 5).map((resource) => (
                  <Box
                    key={resource.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.3,
                      py: 1.1,
                      borderBottom: `1px solid ${colors.border}`,
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: colors.lightBlue,
                        color: colors.blue,
                      }}
                    >
                      <LibraryBooksOutlinedIcon sx={{ fontSize: 18 }} />
                    </Avatar>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        sx={{
                          color: colors.navy,
                          fontWeight: 650,
                          fontSize: '.82rem',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {resource.title}
                      </Typography>
                      <Typography sx={{ color: colors.text, fontSize: '.7rem' }}>
                        {resource.type || 'Resource'}
                      </Typography>
                    </Box>
                  </Box>
                ))
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <LibraryBooksOutlinedIcon sx={{ color: '#A5B6C1', fontSize: 38 }} />
                  <Typography sx={{ color: colors.text, fontSize: '.84rem', mt: 1 }}>
                    Resources will appear here as they become available.
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Paper>

        {/* CERTIFICATES */}
        <Paper elevation={0} sx={{ ...cardSx, p: { xs: 2.5, md: 3.5 }, mb: 3 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 2,
              flexWrap: 'wrap',
            }}
          >
            <Box>
              <Typography sx={{ color: colors.navy, fontWeight: 800, fontSize: '1.3rem' }}>
                Certificates
              </Typography>
              <Typography sx={{ color: colors.text, mt: .4, fontSize: '.88rem' }}>
                Your professional learning credentials.
              </Typography>
            </Box>

            <Button
              component={RouterLink}
              to="/certificates"
              endIcon={<ArrowForwardIcon />}
              sx={{ color: colors.blue, textTransform: 'none', fontWeight: 700 }}
            >
              View certificates
            </Button>
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
              gap: 2,
              mt: 3,
            }}
          >
            <Box sx={{ p: 2.5, borderRadius: 2.5, bgcolor: colors.lightPurple }}>
              <WorkspacePremiumOutlinedIcon sx={{ color: colors.purple, fontSize: 34 }} />
              <Typography sx={{ color: colors.navy, fontWeight: 800, fontSize: '1.6rem', mt: 1 }}>
                {issuedCertificates}
              </Typography>
              <Typography sx={{ color: colors.text, fontSize: '.82rem' }}>
                Certificates issued
              </Typography>
            </Box>

            <Box sx={{ p: 2.5, borderRadius: 2.5, bgcolor: '#F7FAFC' }}>
              <CheckCircleOutlineOutlinedIcon sx={{ color: colors.green, fontSize: 34 }} />
              <Typography sx={{ color: colors.navy, fontWeight: 800, fontSize: '1.6rem', mt: 1 }}>
                {completedCourses}
              </Typography>
              <Typography sx={{ color: colors.text, fontSize: '.82rem' }}>
                Completed courses
              </Typography>
            </Box>

            <Box sx={{ p: 2.5, borderRadius: 2.5, bgcolor: colors.lightBlue }}>
              <TrendingUpOutlinedIcon sx={{ color: colors.blue, fontSize: 34 }} />
              <Typography sx={{ color: colors.navy, fontWeight: 800, fontSize: '1.6rem', mt: 1 }}>
                {totalProgress}%
              </Typography>
              <Typography sx={{ color: colors.text, fontSize: '.82rem' }}>
                Programme completion
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* NOTIFICATIONS */}
        <Paper elevation={0} sx={{ ...cardSx, p: { xs: 2.5, md: 3.5 }, mb: 3 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 2,
              flexWrap: 'wrap',
            }}
          >
            <Box>
              <Typography sx={{ color: colors.navy, fontWeight: 800, fontSize: '1.3rem' }}>
                Notifications
              </Typography>
              <Typography sx={{ color: colors.text, mt: .4, fontSize: '.88rem' }}>
                Important updates from your learning portal.
              </Typography>
            </Box>

            <Button
              component={RouterLink}
              to="/announcements"
              endIcon={<ArrowForwardIcon />}
              sx={{ color: colors.blue, textTransform: 'none', fontWeight: 700 }}
            >
              View all
            </Button>
          </Box>

          <Divider sx={{ my: 2.5 }} />

          {announcements.length ? (
            announcements.slice(0, 4).map((item) => (
              <Box
                key={item.id}
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 1.5,
                  py: 1.4,
                  borderBottom: `1px solid ${colors.border}`,
                }}
              >
                <Avatar
                  sx={{
                    width: 38,
                    height: 38,
                    bgcolor: colors.lightBlue,
                    color: colors.blue,
                  }}
                >
                  <NotificationsNoneOutlinedIcon />
                </Avatar>

                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ color: colors.navy, fontWeight: 700, fontSize: '.86rem' }}>
                    {item.title || 'Portal update'}
                  </Typography>
                  <Typography sx={{ color: colors.text, fontSize: '.78rem', mt: .25 }}>
                    {item.message || item.content || 'New information is available in the portal.'}
                  </Typography>
                </Box>
              </Box>
            ))
          ) : (
            <Box sx={{ py: 3, textAlign: 'center' }}>
              <NotificationsNoneOutlinedIcon sx={{ color: '#A5B6C1', fontSize: 38 }} />
              <Typography sx={{ color: colors.text, fontSize: '.84rem', mt: 1 }}>
                No important notifications right now.
              </Typography>
            </Box>
          )}
        </Paper>

        {/* AI LEARNING INSIGHTS */}
        <Paper
          elevation={0}
          sx={{
            ...cardSx,
            p: { xs: 2.5, md: 3.5 },
            mb: 3,
            background: 'linear-gradient(135deg, #F3F8FC 0%, #FFFFFF 70%)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 2,
            }}
          >
            <Avatar
              sx={{
                width: 50,
                height: 50,
                bgcolor: colors.blue,
                color: '#fff',
              }}
            >
              <AutoAwesomeOutlinedIcon />
            </Avatar>

            <Box sx={{ flex: 1 }}>
              <Typography sx={{ color: colors.navy, fontWeight: 800, fontSize: '1.3rem' }}>
                AI Learning Insights
              </Typography>

              <Typography sx={{ color: colors.text, mt: .5, fontSize: '.86rem' }}>
                Personalized guidance generated from your current learning activity.
              </Typography>

              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  bgcolor: '#fff',
                  borderRadius: 2,
                  border: `1px solid ${colors.border}`,
                }}
              >
                <Typography sx={{ color: '#365A70', lineHeight: 1.7, fontSize: '.88rem' }}>
                  {aiInsight ||
                    'Keep progressing through your active courses and complete pending assessments to build a stronger learning profile.'}
                </Typography>
              </Box>

              <Button
                component={RouterLink}
                to="/ai-assistant"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  mt: 1.5,
                  color: colors.blue,
                  textTransform: 'none',
                  fontWeight: 700,
                }}
              >
                Explore with AI Assistant
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* LEARNING STREAK + ACTIVITY */}
        <Paper elevation={0} sx={{ ...cardSx, p: { xs: 2.5, md: 3.5 }, mb: 3 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', md: 'center' },
              gap: 2,
              flexWrap: 'wrap',
            }}
          >
            <Box>
              <Typography sx={{ color: colors.navy, fontWeight: 800, fontSize: '1.3rem' }}>
                Learning Activity
              </Typography>
              <Typography sx={{ color: colors.text, mt: .4, fontSize: '.88rem' }}>
                Your learning consistency over the last year.
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
              <LocalFireDepartmentOutlinedIcon sx={{ color: '#E07B22' }} />
              <Box>
                <Typography sx={{ color: colors.navy, fontWeight: 800 }}>
                  {currentStreak} day{currentStreak === 1 ? '' : 's'}
                </Typography>
                <Typography sx={{ color: colors.text, fontSize: '.7rem' }}>
                  current streak
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              mt: 3,
              p: { xs: 1.5, md: 2.5 },
              bgcolor: '#FAFCFD',
              borderRadius: 2.5,
              border: `1px solid ${colors.border}`,
              overflowX: 'auto',
            }}
          >
            <Box
              sx={{
                minWidth: 850,
                display: 'grid',
                gridTemplateColumns: 'repeat(53, 1fr)',
                gridAutoRows: '12px',
                gridAutoFlow: 'column',
                gap: '4px',
              }}
            >
              {heatmapDays.map((day) => (
                <Box
                  key={day.date}
                  title={`${day.date}: ${day.count} learning activity`}
                  sx={{
                    width: 11,
                    height: 11,
                    borderRadius: '2px',
                    bgcolor: activityLevel(day.count),
                  }}
                />
              ))}
            </Box>

            <Box
              sx={{
                mt: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography sx={{ color: colors.text, fontSize: '.72rem' }}>
                {activeDays} active learning days
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: .7 }}>
                <Typography sx={{ color: colors.text, fontSize: '.7rem' }}>
                  Less
                </Typography>

                {[0, 1, 2, 3, 4].map((level) => (
                  <Box
                    key={level}
                    sx={{
                      width: 11,
                      height: 11,
                      borderRadius: '2px',
                      bgcolor: activityLevel(level),
                    }}
                  />
                ))}

                <Typography sx={{ color: colors.text, fontSize: '.7rem' }}>
                  More
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box
            sx={{
              mt: 2.5,
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
              gap: 2,
            }}
          >
            <Box sx={{ p: 2, bgcolor: colors.lightOrange, borderRadius: 2 }}>
              <AccessTimeOutlinedIcon sx={{ color: colors.orange }} />
              <Typography sx={{ color: colors.navy, fontWeight: 800, mt: .6 }}>
                {currentStreak}
              </Typography>
              <Typography sx={{ color: colors.text, fontSize: '.75rem' }}>
                Current streak
              </Typography>
            </Box>

            <Box sx={{ p: 2, bgcolor: colors.lightGreen, borderRadius: 2 }}>
              <TrendingUpOutlinedIcon sx={{ color: colors.green }} />
              <Typography sx={{ color: colors.navy, fontWeight: 800, mt: .6 }}>
                {activeDays}
              </Typography>
              <Typography sx={{ color: colors.text, fontSize: '.75rem' }}>
                Active days
              </Typography>
            </Box>

            <Box sx={{ p: 2, bgcolor: colors.lightBlue, borderRadius: 2 }}>
              <MenuBookOutlinedIcon sx={{ color: colors.blue }} />
              <Typography sx={{ color: colors.navy, fontWeight: 800, mt: .6 }}>
                {enrolledCourses.length}
              </Typography>
              <Typography sx={{ color: colors.text, fontSize: '.75rem' }}>
                Learning programmes
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* FOOTER CTA */}
        <Paper
          elevation={0}
          sx={{
            ...cardSx,
            p: { xs: 2.5, md: 3 },
            mb: 2,
            bgcolor: '#173F60',
            color: '#fff',
            border: 0,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 2,
              flexWrap: 'wrap',
            }}
          >
            <Box>
              <Typography sx={{ fontWeight: 800, fontSize: '1.15rem' }}>
                Build your next capability.
              </Typography>
              <Typography sx={{ color: '#C8D9E5', fontSize: '.84rem', mt: .5 }}>
                Use your learning data and AI guidance to decide what to work on next.
              </Typography>
            </Box>

            <Button
              component={RouterLink}
              to="/ai-assistant"
              variant="contained"
              startIcon={<PsychologyOutlinedIcon />}
              sx={{
                bgcolor: '#fff',
                color: colors.blue,
                textTransform: 'none',
                fontWeight: 750,
                '&:hover': { bgcolor: '#EEF5F9' },
              }}
            >
              Get AI guidance
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Dashboard;
