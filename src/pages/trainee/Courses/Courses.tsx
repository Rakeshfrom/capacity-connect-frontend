import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Stack,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import BookmarkBorderOutlinedIcon from '@mui/icons-material/BookmarkBorderOutlined';
import BookmarkOutlinedIcon from '@mui/icons-material/BookmarkOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import PlayCircleOutlineRoundedIcon from '@mui/icons-material/PlayCircleOutlineRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import { Link as RouterLink } from 'react-router-dom';
import {
  enrollInCourse,
  getCourses,
  getCurrentUser,
  getEnrollments,
} from '../../../services/api';

type Course = {
  id: number;
  title: string;
  description?: string | null;
  category?: string | null;
  level?: string | null;
  durationHours?: number | null;
  department?: string | null;
  status?: string | null;
  trainerId?: number | null;
  createdAt?: string | null;
};

type Enrollment = {
  id: number;
  traineeId: number;
  courseId: number;
  status: string;
  progress: number;
};

type UserProfile = {
  department?: string | null;
  skills?: string | null;
  interests?: string | null;
};

type TabKey = 'my' | 'recommended' | 'all';

const SAVED_KEY = 'capacity-connect.saved-courses';

const text = (value: unknown) => String(value ?? '').trim();

const levelName = (value: unknown) => {
  const valueText = text(value).toLowerCase();
  if (valueText === 'beginner') return 'Beginner';
  if (valueText === 'advanced') return 'Advanced';
  return valueText ? 'Intermediate' : 'Not specified';
};

const progressValue = (value: unknown) =>
  Math.min(100, Math.max(0, Number(value) || 0));

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [user, setUser] = useState<UserProfile>({});
  const [savedCourses, setSavedCourses] = useState<number[]>([]);

  const [tab, setTab] = useState<TabKey>('my');
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('all');
  const [trainer, setTrainer] = useState('all');
  const [category, setCategory] = useState('all');
  const [level, setLevel] = useState('all');
  const [duration, setDuration] = useState('all');
  const [enrollmentFilter, setEnrollmentFilter] = useState('all');
  const [sort, setSort] = useState('recommended');
  const [savedOnly, setSavedOnly] = useState(false);

  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState<number | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [courseResult, enrollmentResult, userResult] =
          await Promise.allSettled([
            getCourses(),
            getEnrollments(),
            getCurrentUser(),
          ]);

        if (courseResult.status === 'rejected') {
          throw courseResult.reason;
        }

        setCourses(
          Array.isArray(courseResult.value)
            ? courseResult.value
            : []
        );

        if (enrollmentResult.status === 'fulfilled') {
          setEnrollments(
            Array.isArray(enrollmentResult.value)
              ? enrollmentResult.value
              : []
          );
        } else {
          console.warn(
            'Unable to load trainee enrollments:',
            enrollmentResult.reason
          );
          setEnrollments([]);
        }

        if (userResult.status === 'fulfilled') {
          setUser(userResult.value || {});
        } else {
          console.warn(
            'Unable to load trainee profile for recommendations:',
            userResult.reason
          );
          setUser({});
        }

        try {
          const stored = localStorage.getItem(SAVED_KEY);
          const parsed = stored ? JSON.parse(stored) : [];
          setSavedCourses(Array.isArray(parsed) ? parsed : []);
        } catch {
          setSavedCourses([]);
        }
      } catch (err) {
        console.error('Failed to load trainee course catalogue:', err);

        setError(
          err instanceof Error
            ? `Unable to load course catalogue: ${err.message}`
            : 'Unable to load course catalogue. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const enrollmentMap = useMemo(
    () => new Map(enrollments.map((item) => [item.courseId, item])),
    [enrollments]
  );

  const publishedCourses = useMemo(
    () =>
      courses.filter(
        (course) => text(course.status).toUpperCase() === 'PUBLISHED'
      ),
    [courses]
  );

  const myCourses = useMemo(
    () =>
      enrollments
        .map((enrollment) => {
          const course = courses.find((item) => item.id === enrollment.courseId);
          return course ? { course, enrollment } : null;
        })
        .filter(
          (
            item
          ): item is { course: Course; enrollment: Enrollment } =>
            item !== null
        ),
    [courses, enrollments]
  );

  const departments = useMemo(
    () =>
      Array.from(
        new Set(
          publishedCourses
            .map((course) => text(course.department))
            .filter(Boolean)
        )
      ).sort(),
    [publishedCourses]
  );

  const categories = useMemo(
    () =>
      Array.from(
        new Set(
          publishedCourses
            .map((course) => text(course.category))
            .filter(Boolean)
        )
      ).sort(),
    [publishedCourses]
  );

  const trainers = useMemo(
    () =>
      Array.from(
        new Set(
          publishedCourses
            .map((course) => course.trainerId)
            .filter((id): id is number => typeof id === 'number')
        )
      ).sort((a, b) => a - b),
    [publishedCourses]
  );

  const recommendationScore = (course: Course) => {
    const haystack = [
      course.title,
      course.description,
      course.category,
      course.department,
      course.level,
    ]
      .map((value) => text(value).toLowerCase())
      .join(' ');

    const profileTerms = [
      user.department,
      user.skills,
      user.interests,
    ]
      .flatMap((value) => text(value).toLowerCase().split(/[,;|]/))
      .map((value) => value.trim())
      .filter((value) => value.length > 2);

    let score = 0;
    const userDepartment = text(user.department).toLowerCase();

    if (
      userDepartment &&
      userDepartment === text(course.department).toLowerCase()
    ) {
      score += 5;
    }

    profileTerms.forEach((term) => {
      if (haystack.includes(term)) score += 2;
    });

    return score;
  };

  const sourceCourses =
    tab === 'my' ? myCourses.map((item) => item.course) : publishedCourses;

  const visibleCourses = useMemo(() => {
    let result = sourceCourses.filter((course) => {
      const enrollment = enrollmentMap.get(course.id);
      const query = search.trim().toLowerCase();

      const haystack = [
        course.title,
        course.description,
        course.category,
        course.department,
        course.level,
        course.trainerId ? `trainer ${course.trainerId}` : '',
      ]
        .map((value) => text(value).toLowerCase())
        .join(' ');

      if (query && !haystack.includes(query)) return false;

      if (
        department !== 'all' &&
        text(course.department) !== department
      ) {
        return false;
      }

      if (
        trainer !== 'all' &&
        String(course.trainerId ?? '') !== trainer
      ) {
        return false;
      }

      if (
        category !== 'all' &&
        text(course.category) !== category
      ) {
        return false;
      }

      if (
        level !== 'all' &&
        levelName(course.level) !== level
      ) {
        return false;
      }

      const hours = Number(course.durationHours) || 0;

      if (duration === 'short' && hours >= 2) return false;
      if (duration === 'medium' && (hours < 2 || hours > 5)) return false;
      if (duration === 'long' && hours <= 5) return false;

      if (savedOnly && !savedCourses.includes(course.id)) return false;

      if (
        enrollmentFilter === 'enrolled' &&
        !enrollment
      ) {
        return false;
      }

      if (
        enrollmentFilter === 'not-enrolled' &&
        enrollment
      ) {
        return false;
      }

      if (tab === 'recommended' && enrollment) return false;

      return true;
    });

    if (tab === 'recommended' || sort === 'recommended') {
      result = result.sort(
        (a, b) => recommendationScore(b) - recommendationScore(a)
      );
    } else if (sort === 'recent') {
      result = result.sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      );
    } else if (sort === 'title') {
      result = result.sort((a, b) =>
        a.title.localeCompare(b.title)
      );
    } else if (sort === 'duration') {
      result = result.sort(
        (a, b) =>
          (Number(a.durationHours) || 0) -
          (Number(b.durationHours) || 0)
      );
    }

    return result;
  }, [
    sourceCourses,
    search,
    department,
    trainer,
    category,
    level,
    duration,
    enrollmentFilter,
    savedOnly,
    savedCourses,
    enrollmentMap,
    tab,
    sort,
    user.department,
    user.skills,
    user.interests,
  ]);

  const activeCount = enrollments.filter(
    (item) => item.status !== 'COMPLETED'
  ).length;

  const completedCount = enrollments.filter(
    (item) => item.status === 'COMPLETED'
  ).length;

  const toggleSaved = (courseId: number) => {
    setSavedCourses((current) => {
      const next = current.includes(courseId)
        ? current.filter((id) => id !== courseId)
        : [...current, courseId];

      localStorage.setItem(SAVED_KEY, JSON.stringify(next));
      return next;
    });
  };

  const handleEnroll = async (courseId: number) => {
    try {
      setError('');
      setEnrollingId(courseId);

      await enrollInCourse(courseId);

      const updated = await getEnrollments();
      setEnrollments(Array.isArray(updated) ? updated : []);
      setTab('my');
    } catch (err) {
      console.error('Enrollment failed:', err);
      setError('Unable to enroll in this course. Please try again.');
    } finally {
      setEnrollingId(null);
    }
  };

  const clearFilters = () => {
    setSearch('');
    setDepartment('all');
    setTrainer('all');
    setCategory('all');
    setLevel('all');
    setDuration('all');
    setEnrollmentFilter('all');
    setSort('recommended');
    setSavedOnly(false);
  };

  const renderCourse = (course: Course) => {
    const enrollment = enrollmentMap.get(course.id);
    const progress = progressValue(enrollment?.progress);
    const completed = enrollment?.status === 'COMPLETED';
    const saved = savedCourses.includes(course.id);
    const score = recommendationScore(course);

    return (
      <Paper
        key={course.id}
        elevation={0}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid #D9E5EC',
          borderRadius: 2.5,
          overflow: 'hidden',
          bgcolor: '#fff',
          transition: 'transform .18s ease, box-shadow .18s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 12px 30px rgba(24,60,86,.08)',
          },
        }}
      >
        <Box sx={{ height: 6, bgcolor: '#0B5A91' }} />

        <Box
          sx={{
            p: 2.4,
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
          }}
        >
          <Stack
            direction="row"
           sx={{justifyContent: 'space-between', alignItems: 'flex-start'}}>
            <Chip
              label={text(course.category) || 'General'}
              size="small"
              sx={{
                bgcolor: '#EEF6FC',
                color: '#0B5A91',
                fontWeight: 700,
              }}
            />

            <Tooltip
              title={
                saved
                  ? 'Remove from saved courses'
                  : 'Save for later'
              }
            >
              <IconButton
                size="small"
                onClick={() => toggleSaved(course.id)}
                sx={{ color: saved ? '#0B5A91' : '#657887' }}
              >
                {saved ? (
                  <BookmarkOutlinedIcon />
                ) : (
                  <BookmarkBorderOutlinedIcon />
                )}
              </IconButton>
            </Tooltip>
          </Stack>

          <Typography
            sx={{
              mt: 1.7,
              color: '#173F60',
              fontWeight: 750,
              fontSize: '1.05rem',
              lineHeight: 1.4,
            }}
          >
            {course.title}
          </Typography>

          {tab === 'recommended' && score > 0 && (
            <Chip
              icon={
                <AutoAwesomeRoundedIcon sx={{ fontSize: 16 }} />
              }
              label={
                text(course.department).toLowerCase() ===
                  text(user.department).toLowerCase() &&
                user.department
                  ? 'Matches your department'
                  : 'Matches your profile'
              }
              size="small"
              sx={{
                mt: 1.2,
                alignSelf: 'flex-start',
                bgcolor: '#F0F7FF',
                color: '#25658A',
                fontWeight: 650,
              }}
            />
          )}

          <Typography
            sx={{
              mt: 1,
              color: '#687D8C',
              fontSize: '.86rem',
              lineHeight: 1.65,
            }}
          >
            {text(course.description)
              ? text(course.description).length > 145
                ? `${text(course.description).slice(0, 145)}…`
                : text(course.description)
              : 'Build practical knowledge and job-relevant capability through this learning programme.'}
          </Typography>

          <Stack spacing={0.9} sx={{ mt: 2.1, color: '#637888' }}>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <BusinessOutlinedIcon sx={{ fontSize: 17 }} />
              <Typography variant="body2">
                {text(course.department) || 'Department not specified'}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <PersonOutlineOutlinedIcon sx={{ fontSize: 17 }} />
              <Typography variant="body2">
                {course.trainerId
                  ? `Trainer #${course.trainerId}`
                  : 'Trainer not assigned'}
              </Typography>
            </Stack>

            <Stack
              direction="row"
              spacing={2}
             sx={{alignItems: 'center', flexWrap: 'wrap'}}>
              <Stack
                  direction="row"
                  spacing={0.7}
                  sx={{ alignItems: "center" }}
                >
                <AccessTimeOutlinedIcon sx={{ fontSize: 17 }} />
                <Typography variant="body2">
                  {Number(course.durationHours) || 0} hrs
                </Typography>
              </Stack>

              <Stack
                  direction="row"
                  spacing={0.7}
                  sx={{ alignItems: "center" }}
                >
                <SchoolOutlinedIcon sx={{ fontSize: 17 }} />
                <Typography variant="body2">
                  {levelName(course.level)}
                </Typography>
              </Stack>
            </Stack>
          </Stack>

          <Box sx={{ flexGrow: 1 }} />

          {enrollment && (
            <Box sx={{ mt: 2.3 }}>
              <Stack
                direction="row"
                sx={{ justifyContent: "space-between", mb: .75 }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: '#637888' }}
                >
                  Progress
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ color: '#0B5A91', fontWeight: 750 }}
                >
                  {progress}%
                </Typography>
              </Stack>

              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: 7,
                  borderRadius: 8,
                  bgcolor: '#E7EEF3',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: '#0B5A91',
                    borderRadius: 8,
                  },
                }}
              />
            </Box>
          )}

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1}
            sx={{ mt: 2.3 }}
          >
            <Button
              component={RouterLink}
              to={
                enrollment
                  ? `/trainee/courses/${course.id}`
                  : `/courses/${course.id}`
              }
              variant="contained"
              fullWidth
              endIcon={
                enrollment ? (
                  completed ? (
                    <CheckCircleOutlineRoundedIcon />
                  ) : (
                    <PlayCircleOutlineRoundedIcon />
                  )
                ) : (
                  <ArrowForwardRoundedIcon />
                )
              }
              sx={{
                bgcolor: '#0B5A91',
                textTransform: 'none',
                fontWeight: 700,
                borderRadius: 1.5,
                '&:hover': { bgcolor: '#084873' },
              }}
            >
              {enrollment
                ? completed
                  ? 'Review course'
                  : 'Continue learning'
                : 'View course'}
            </Button>

            {!enrollment && (
              <Button
                variant="outlined"
                fullWidth
                disabled={enrollingId === course.id}
                onClick={() => handleEnroll(course.id)}
                sx={{
                  borderColor: '#AFC2D0',
                  color: '#0B5A91',
                  textTransform: 'none',
                  fontWeight: 700,
                  borderRadius: 1.5,
                }}
              >
                {enrollingId === course.id
                  ? 'Enrolling…'
                  : 'Enroll'}
              </Button>
            )}
          </Stack>
        </Box>
      </Paper>
    );
  };

  return (
    <Box
      sx={{
        bgcolor: '#F4F8FB',
        minHeight: '100vh',
        py: { xs: 2.5, md: 4 },
      }}
    >
      <Container maxWidth="xl">
        <Stack spacing={2.4}>
          <Paper
            elevation={0}
            sx={{
              border: '1px solid #D9E5EC',
              borderRadius: 2.5,
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                px: { xs: 2.2, md: 3.2 },
                py: { xs: 2.5, md: 3 },
                background:
                  'linear-gradient(135deg, #F7FBFD 0%, #EDF6FA 100%)',
              }}
            >
              <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2}
              sx={{
                justifyContent: "space-between",
                alignItems: { md: "center" },
              }}
            >
                <Box>
                  <Typography
                    sx={{
                      color: '#173F60',
                      fontWeight: 800,
                      fontSize: { xs: '1.75rem', md: '2.15rem' },
                    }}
                  >
                    Courses
                  </Typography>

                  <Typography
                    sx={{
                      mt: .6,
                      color: '#657887',
                      maxWidth: 720,
                      lineHeight: 1.65,
                    }}
                  >
                    Continue learning, discover new programmes and
                    build job-relevant competencies.
                  </Typography>
                </Box>

                <Button
                  component={RouterLink}
                  to="/trainee/ai"
                  variant="contained"
                  startIcon={<SmartToyOutlinedIcon />}
                  sx={{
                    alignSelf: { xs: 'stretch', md: 'auto' },
                    bgcolor: '#173F60',
                    textTransform: 'none',
                    fontWeight: 700,
                    borderRadius: 1.5,
                    px: 2.2,
                    py: 1.1,
                    '&:hover': { bgcolor: '#102F49' },
                  }}
                >
                  Ask AI Learning Advisor
                </Button>
              </Stack>
            </Box>

            <Box
              sx={{
                px: { xs: 1.2, md: 2.2 },
                bgcolor: '#fff',
                borderTop: '1px solid #E3EBF0',
              }}
            >
              <Tabs
                value={tab}
                onChange={(_, value) => setTab(value)}
                variant="scrollable"
                allowScrollButtonsMobile
                sx={{
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 700,
                    minHeight: 54,
                  },
                }}
              >
                <Tab
                  value="my"
                  label={`My Courses (${myCourses.length})`}
                />
                <Tab value="recommended" label="Recommended" />
                <Tab
                  value="all"
                  label={`All Courses (${publishedCourses.length})`}
                />
              </Tabs>
            </Box>
          </Paper>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(2, 1fr)',
                sm: 'repeat(4, 1fr)',
              },
              gap: 1.5,
            }}
          >
            {[
              ['In learning', activeCount, 'Courses underway'],
              ['Completed', completedCount, 'Finished programmes'],
              ['Available', publishedCourses.length, 'Published courses'],
              ['Saved', savedCourses.length, 'Saved for later'],
            ].map(([label, value, caption]) => (
              <Paper
                key={String(label)}
                elevation={0}
                sx={{
                  p: 2,
                  border: '1px solid #D9E5EC',
                  borderRadius: 2,
                }}
              >
                <Typography
                  sx={{
                    color: '#667B89',
                    fontSize: '.76rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                  }}
                >
                  {label}
                </Typography>
                <Typography
                  sx={{
                    mt: .55,
                    color: '#173F60',
                    fontWeight: 800,
                    fontSize: '1.45rem',
                  }}
                >
                  {value}
                </Typography>
                <Typography
                  sx={{
                    mt: .2,
                    color: '#7A8B96',
                    fontSize: '.72rem',
                  }}
                >
                  {caption}
                </Typography>
              </Paper>
            ))}
          </Box>

          {tab === 'recommended' && (
            <Paper
              elevation={0}
              sx={{
                p: 2.2,
                border: '1px solid #D9E7EF',
                borderRadius: 2,
                bgcolor: '#F7FBFE',
              }}
            >
              <Stack direction="row" spacing={1.3}>
                <AutoAwesomeRoundedIcon
                  sx={{ color: '#0B5A91', mt: .15 }}
                />
                <Box>
                  <Typography
                    sx={{ color: '#173F60', fontWeight: 750 }}
                  >
                    Personalized learning picks
                  </Typography>

                  <Typography
                    sx={{
                      mt: .35,
                      color: '#687D8C',
                      fontSize: '.83rem',
                      lineHeight: 1.55,
                    }}
                  >
                    Recommendations consider your department,
                    skills and interests. Use the AI Learning Advisor
                    for deeper skill-gap and next-step guidance.
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          )}

          <Paper
            elevation={0}
            sx={{
              border: '1px solid #D9E5EC',
              borderRadius: 2.2,
              overflow: 'hidden',
            }}
          >
            <Box sx={{ p: { xs: 1.7, md: 2.1 } }}>
              <Stack
                direction={{ xs: 'column', lg: 'row' }}
                spacing={1.3}
              >
                <TextField
                  fullWidth
                  size="small"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search courses, topics, skills or trainers"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchRoundedIcon
                            sx={{ color: '#6D8495' }}
                          />
                        </InputAdornment>
                      ),
                    },
                  }}
                />

                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={1.1}
                 sx={{flexWrap: 'wrap'}}>
                  <FormControl size="small" sx={{ minWidth: 155 }}>
                    <InputLabel>Department</InputLabel>
                    <Select
                      value={department}
                      label="Department"
                      onChange={(e) =>
                        setDepartment(e.target.value)
                      }
                    >
                      <MenuItem value="all">
                        All departments
                      </MenuItem>
                      {departments.map((item) => (
                        <MenuItem key={item} value={item}>
                          {item}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl size="small" sx={{ minWidth: 145 }}>
                    <InputLabel>Trainer</InputLabel>
                    <Select
                      value={trainer}
                      label="Trainer"
                      onChange={(e) => setTrainer(e.target.value)}
                    >
                      <MenuItem value="all">All trainers</MenuItem>
                      {trainers.map((id) => (
                        <MenuItem key={id} value={String(id)}>
                          Trainer #{id}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl size="small" sx={{ minWidth: 140 }}>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={category}
                      label="Category"
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <MenuItem value="all">
                        All categories
                      </MenuItem>
                      {categories.map((item) => (
                        <MenuItem key={item} value={item}>
                          {item}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl size="small" sx={{ minWidth: 125 }}>
                    <InputLabel>Level</InputLabel>
                    <Select
                      value={level}
                      label="Level"
                      onChange={(e) => setLevel(e.target.value)}
                    >
                      <MenuItem value="all">All levels</MenuItem>
                      <MenuItem value="Beginner">Beginner</MenuItem>
                      <MenuItem value="Intermediate">
                        Intermediate
                      </MenuItem>
                      <MenuItem value="Advanced">Advanced</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
              </Stack>

              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1.1}
                sx={{ mt: 1.3 }}
              >
                <FormControl size="small" sx={{ minWidth: 160 }}>
                  <InputLabel>Duration</InputLabel>
                  <Select
                    value={duration}
                    label="Duration"
                    onChange={(e) => setDuration(e.target.value)}
                  >
                    <MenuItem value="all">Any duration</MenuItem>
                    <MenuItem value="short">
                      Under 2 hours
                    </MenuItem>
                    <MenuItem value="medium">2–5 hours</MenuItem>
                    <MenuItem value="long">
                      Over 5 hours
                    </MenuItem>
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 170 }}>
                  <InputLabel>Enrollment</InputLabel>
                  <Select
                    value={enrollmentFilter}
                    label="Enrollment"
                    onChange={(e) =>
                      setEnrollmentFilter(e.target.value)
                    }
                  >
                    <MenuItem value="all">All courses</MenuItem>
                    <MenuItem value="enrolled">Enrolled</MenuItem>
                    <MenuItem value="not-enrolled">
                      Not enrolled
                    </MenuItem>
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>Sort by</InputLabel>
                  <Select
                    value={sort}
                    label="Sort by"
                    onChange={(e) => setSort(e.target.value)}
                  >
                    <MenuItem value="recommended">
                      Recommended
                    </MenuItem>
                    <MenuItem value="recent">
                      Recently added
                    </MenuItem>
                    <MenuItem value="title">Title A–Z</MenuItem>
                    <MenuItem value="duration">
                      Shortest first
                    </MenuItem>
                  </Select>
                </FormControl>

                <Button
                  variant={savedOnly ? 'contained' : 'outlined'}
                  startIcon={
                    savedOnly ? (
                      <BookmarkOutlinedIcon />
                    ) : (
                      <BookmarkBorderOutlinedIcon />
                    )
                  }
                  onClick={() =>
                    setSavedOnly((value) => !value)
                  }
                  sx={{
                    textTransform: 'none',
                    fontWeight: 700,
                    borderColor: '#AFC2D0',
                    color: savedOnly ? '#fff' : '#0B5A91',
                    bgcolor: savedOnly ? '#0B5A91' : 'transparent',
                  }}
                >
                  Saved only
                </Button>

                <Button
                  startIcon={<TuneOutlinedIcon />}
                  onClick={clearFilters}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 700,
                    color: '#657887',
                  }}
                >
                  Clear filters
                </Button>
              </Stack>
            </Box>

            <Divider />

            <Stack
              direction="row"
              spacing={1}
              sx={{
                alignItems: "center",
                px: 2,
                py: 1.1,
                bgcolor: '#FBFCFD',
              }}
            >
              <FilterAltOutlinedIcon
                sx={{ fontSize: 17, color: '#6D8495' }}
              />
              <Typography
                sx={{
                  color: '#748692',
                  fontSize: '.76rem',
                }}
              >
                {visibleCourses.length} course
                {visibleCourses.length === 1 ? '' : 's'} matching
                your filters
              </Typography>
            </Stack>
          </Paper>

          {error && (
            <Alert severity="error" sx={{ borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          {loading ? (
            <Paper
              elevation={0}
              sx={{
                p: 5,
                border: '1px solid #D9E5EC',
                borderRadius: 2,
                textAlign: 'center',
              }}
            >
              <Typography sx={{ color: '#657887' }}>
                Loading your learning catalogue…
              </Typography>
              <LinearProgress
                sx={{
                  mt: 2,
                  maxWidth: 420,
                  mx: 'auto',
                }}
              />
            </Paper>
          ) : visibleCourses.length === 0 ? (
            <Paper
              elevation={0}
              sx={{
                p: { xs: 4, md: 6 },
                border: '1px solid #D9E5EC',
                borderRadius: 2.2,
                textAlign: 'center',
              }}
            >
              <SchoolOutlinedIcon
                sx={{ fontSize: 48, color: '#9AB0BE' }}
              />

              <Typography
                sx={{
                  mt: 1.4,
                  color: '#173F60',
                  fontWeight: 750,
                  fontSize: '1.1rem',
                }}
              >
                {tab === 'my'
                  ? 'No courses in your learning shelf'
                  : tab === 'recommended'
                    ? 'No matching recommendations yet'
                    : 'No courses match these filters'}
              </Typography>

              <Typography
                sx={{
                  mt: .6,
                  color: '#718594',
                  maxWidth: 560,
                  mx: 'auto',
                  lineHeight: 1.6,
                }}
              >
                {tab === 'my'
                  ? 'Explore All Courses to find a programme and enroll.'
                  : 'Try clearing a filter or changing your search.'}
              </Typography>

              {tab === 'my' && (
                <Button
                  onClick={() => setTab('all')}
                  sx={{
                    mt: 2,
                    textTransform: 'none',
                    fontWeight: 700,
                  }}
                >
                  Explore all courses
                </Button>
              )}
            </Paper>
          ) : (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  xl: 'repeat(3, 1fr)',
                },
                gap: { xs: 1.8, md: 2.2 },
              }}
            >
              {visibleCourses.map(renderCourse)}
            </Box>
          )}

          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.2, md: 2.8 },
              border: '1px solid #D9E5EC',
              borderRadius: 2.2,
            }}
          >
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={1.5}
              sx={{
                justifyContent: "space-between",
                alignItems: { md: "center" },
              }}
            >
              <Stack
                direction="row"
                spacing={1.3}
               sx={{alignItems: 'flex-start'}}>
                <SmartToyOutlinedIcon
                  sx={{ color: '#0B5A91', mt: .15 }}
                />

                <Box>
                  <Typography
                    sx={{
                      color: '#173F60',
                      fontWeight: 750,
                    }}
                  >
                    AI Learning Advisor
                  </Typography>

                  <Typography
                    sx={{
                      mt: .35,
                      color: '#6C7F8D',
                      fontSize: '.83rem',
                    }}
                  >
                    Get a personalized next-step learning plan,
                    understand skill gaps and ask questions about your
                    learning journey.
                  </Typography>
                </Box>
              </Stack>

              <Button
                component={RouterLink}
                to="/trainee/ai"
                variant="outlined"
                endIcon={<ArrowForwardRoundedIcon />}
                sx={{
                  textTransform: 'none',
                  fontWeight: 700,
                  borderColor: '#AFC2D0',
                  color: '#0B5A91',
                  flexShrink: 0,
                }}
              >
                Open AI Assistant
              </Button>
            </Stack>
          </Paper>

          <Stack
            direction="row"
            spacing={1}
            sx={{ alignItems: "center", color: '#7A8B96', px: .4 }}
          >
            <WorkspacePremiumOutlinedIcon
              sx={{ fontSize: 17 }}
            />
            <Typography sx={{ fontSize: '.75rem' }}>
              Course completion and certificate eligibility follow the
              programme requirements and assessment outcomes.
            </Typography>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default Courses;
