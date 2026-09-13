import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  Stack,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';

import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';
import PublishedWithChangesOutlinedIcon from '@mui/icons-material/PublishedWithChangesOutlined';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import SortOutlinedIcon from '@mui/icons-material/SortOutlined';
import DraftsOutlinedIcon from '@mui/icons-material/DraftsOutlined';

import {
  createCourse,
  createCourseModule,
  generateAiCourse,
  getTrainerAnalytics,
  getTrainerCourses,
} from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

type Course = {
  id: number;
  title: string;
  description?: string | null;
  category?: string | null;
  durationHours?: number | null;
  level?: string | null;
  status?: string | null;
  department?: string | null;
  departmentId?: number | null;
};

type CourseAnalytics = {
  courseId: number;
  courseTitle?: string;
  trainees?: number;
  completion?: number;
  averageScore?: number;
};

type CourseForm = {
  title: string;
  description: string;
  category: string;
  durationHours: string;
  level: string;
  status: string;
  department: string;
};

type AiModule = {
  title: string;
  description: string;
};

const initialForm: CourseForm = {
  title: '',
  description: '',
  category: '',
  durationHours: '',
  level: 'BEGINNER',
  status: 'DRAFT',
  department: '',
};

const normalizeStatus = (status?: string | null) =>
  String(status || 'DRAFT').toUpperCase();

const normalizeLevel = (level?: string | null) =>
  String(level || 'BEGINNER').toUpperCase();

const statusLabel = (status: string) => {
  switch (status) {
    case 'PUBLISHED':
      return 'Published';
    case 'ARCHIVED':
      return 'Archived';
    default:
      return 'Draft';
  }
};

const levelLabel = (level?: string | null) => {
  switch (normalizeLevel(level)) {
    case 'INTERMEDIATE':
      return 'Intermediate';
    case 'ADVANCED':
      return 'Advanced';
    default:
      return 'Beginner';
  }
};

const statusStyles = (status: string) => {
  switch (status) {
    case 'PUBLISHED':
      return {
        bgcolor: '#EAF6EF',
        color: '#147A45',
      };
    case 'ARCHIVED':
      return {
        bgcolor: '#EEF1F4',
        color: '#64727C',
      };
    default:
      return {
        bgcolor: '#FFF4E5',
        color: '#A35A00',
      };
  }
};

const TrainerCourses = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [courses, setCourses] = useState<Course[]>([]);
  const [analytics, setAnalytics] = useState<CourseAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [levelFilter, setLevelFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('UPDATED');

  const [openDialog, setOpenDialog] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<CourseForm>(initialForm);

  const [aiMode, setAiMode] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [aiContext, setAiContext] = useState('');
  const [aiModuleCount, setAiModuleCount] = useState(5);
  const [aiModules, setAiModules] = useState<AiModule[]>([]);
  const [generatingAI, setGeneratingAI] = useState(false);

  const loadCourses = async (showSpinner = true) => {
    if (!user) return;

    if (showSpinner) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    setError('');

    let courseError = false;

    try {
      const courseData = await getTrainerCourses(user.id);

      setCourses(
        Array.isArray(courseData)
          ? courseData
          : []
      );
    } catch (err) {
      console.error(
        'Failed to load trainer courses:',
        err
      );
      courseError = true;
      setCourses([]);
    }

    try {
      const analyticsData =
        await getTrainerAnalytics(user.id);

      const courseAnalytics =
        Array.isArray(analyticsData?.courses)
          ? analyticsData.courses
          : [];

      setAnalytics(courseAnalytics);
    } catch (err) {
      console.error(
        'Failed to load trainer analytics:',
        err
      );

      setAnalytics([]);
    }

    if (courseError) {
      setError(
        'Unable to load your course catalogue right now.'
      );
    }

    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    if (authLoading || !user) return;

    loadCourses();
  }, [user, authLoading]);

  const analyticsMap = useMemo(() => {
    const map = new Map<
      number,
      CourseAnalytics
    >();

    analytics.forEach((item) => {
      map.set(Number(item.courseId), item);
    });

    return map;
  }, [analytics]);

  const categories = useMemo(() => {
    return Array.from(
      new Set(
        courses
          .map((course) =>
            String(course.category || '').trim()
          )
          .filter(Boolean)
      )
    ).sort((a, b) =>
      a.localeCompare(b)
    );
  }, [courses]);

  const publishedCount = useMemo(
    () =>
      courses.filter(
        (course) =>
          normalizeStatus(course.status) ===
          'PUBLISHED'
      ).length,
    [courses]
  );

  const draftCount = useMemo(
    () =>
      courses.filter(
        (course) =>
          normalizeStatus(course.status) ===
          'DRAFT'
      ).length,
    [courses]
  );

  const archivedCount = useMemo(
    () =>
      courses.filter(
        (course) =>
          normalizeStatus(course.status) ===
          'ARCHIVED'
      ).length,
    [courses]
  );

  const totalTrainees = useMemo(
    () =>
      analytics.reduce(
        (total, item) =>
          total + Number(item.trainees || 0),
        0
      ),
    [analytics]
  );

  const filteredCourses = useMemo(() => {
    const normalizedQuery =
      query.trim().toLowerCase();

    const filtered = courses.filter((course) => {
      const status =
        normalizeStatus(course.status);
      const category = String(
        course.category || ''
      );
      const level =
        normalizeLevel(course.level);

      const searchable = [
        course.title,
        course.description,
        course.category,
        course.department,
        course.level,
        course.status,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      if (
        normalizedQuery &&
        !searchable.includes(normalizedQuery)
      ) {
        return false;
      }

      if (
        statusFilter !== 'ALL' &&
        status !== statusFilter
      ) {
        return false;
      }

      if (
        categoryFilter !== 'ALL' &&
        category !== categoryFilter
      ) {
        return false;
      }

      if (
        levelFilter !== 'ALL' &&
        level !== levelFilter
      ) {
        return false;
      }

      return true;
    });

    return [...filtered].sort((a, b) => {
      const analyticsA =
        analyticsMap.get(a.id);
      const analyticsB =
        analyticsMap.get(b.id);

      if (sortBy === 'TITLE') {
        return a.title.localeCompare(b.title);
      }

      if (sortBy === 'TRAINEES') {
        return (
          Number(
            analyticsB?.trainees || 0
          ) -
          Number(
            analyticsA?.trainees || 0
          )
        );
      }

      if (sortBy === 'PROGRESS') {
        return (
          Number(
            analyticsB?.completion || 0
          ) -
          Number(
            analyticsA?.completion || 0
          )
        );
      }

      if (sortBy === 'DURATION') {
        return (
          Number(
            b.durationHours || 0
          ) -
          Number(
            a.durationHours || 0
          )
        );
      }

      return (
        b.id -
        a.id
      );
    });
  }, [
    courses,
    query,
    statusFilter,
    categoryFilter,
    levelFilter,
    sortBy,
    analyticsMap,
  ]);

  const openCreate = () => {
    setForm(initialForm);
    setAiMode(false);
    setAiTopic('');
    setAiContext('');
    setAiModuleCount(5);
    setAiModules([]);
    setError('');
    setOpenDialog(true);
  };

  const closeDialog = () => {
    if (saving || generatingAI) return;

    setOpenDialog(false);
    setError('');
  };

  const updateField = (
    field: keyof CourseForm,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const clearFilters = () => {
    setQuery('');
    setStatusFilter('ALL');
    setCategoryFilter('ALL');
    setLevelFilter('ALL');
    setSortBy('UPDATED');
  };

  const saveCourse = async () => {
    if (!form.title.trim()) {
      setError(
        'Course title is required.'
      );
      return;
    }

    if (
      !form.durationHours ||
      Number(form.durationHours) < 1
    ) {
      setError(
        'Duration must be at least 1 hour.'
      );
      return;
    }

    setSaving(true);
    setError('');

    try {
      const createdCourse =
        await createCourse({
          title: form.title.trim(),
          description:
            form.description.trim(),
          category:
            form.category.trim(),
          durationHours:
            Number(
              form.durationHours
            ),
          level:
            form.level,
          status:
            form.status,
          department:
            form.department.trim(),
        });

      const courseId =
        Number(createdCourse?.id);

      if (
        courseId &&
        aiModules.length > 0
      ) {
        for (
          let index = 0;
          index < aiModules.length;
          index += 1
        ) {
          const module =
            aiModules[index];

          if (
            !module.title.trim()
          ) {
            continue;
          }

          await createCourseModule(
            courseId,
            {
              title:
                module.title.trim(),
              description:
                module.description.trim(),
              orderIndex:
                index,
            }
          );
        }
      }

      setOpenDialog(false);
      setForm(initialForm);
      setAiModules([]);
      await loadCourses(false);
    } catch (err) {
      console.error(
        'Failed to create course:',
        err
      );

      setError(
        'Unable to create course. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  const generateCourseDraft =
    async () => {
      if (!aiTopic.trim()) {
        setError(
          'Course topic is required for AI generation.'
        );
        return;
      }

      try {
        setGeneratingAI(true);
        setError('');

        const raw =
          await generateAiCourse(
            aiTopic.trim(),
            aiContext.trim(),
            form.level,
            aiModuleCount
          );

        const generated =
          typeof raw === 'string'
            ? JSON.parse(raw)
            : raw;

        const modules =
          Array.isArray(
            generated?.modules
          )
            ? generated.modules
                .map(
                  (
                    module: {
                      title?: string;
                      description?: string;
                    }
                  ) => ({
                    title:
                      module.title ||
                      '',
                    description:
                      module.description ||
                      '',
                  })
                )
            : [];

        setAiModules(modules);

        setForm((current) => ({
          ...current,
          title:
            generated?.title ||
            current.title,
          description:
            generated?.description ||
            current.description,
          category:
            generated?.category ||
            current.category,
          department:
            generated?.department ||
            current.department,
          level:
            generated?.level ||
            current.level,
          durationHours:
            String(
              generated?.durationHours ||
                current.durationHours ||
                ''
            ),
        }));
      } catch (err) {
        console.error(
          'AI course generation failed:',
          err
        );

        setError(
          'AI could not generate the course draft. Please try again.'
        );
      } finally {
        setGeneratingAI(false);
      }
    };

  if (
    authLoading ||
    loading
  ) {
    return (
      <Box
        sx={{
          minHeight: '70vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent:
            'center',
        }}
      >
        <CircularProgress
          sx={{ color: '#0B5A91' }}
        />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        bgcolor: '#F5F8FA',
        minHeight: '100vh',
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          py: {
            xs: 3,
            md: 5,
          },
        }}
      >
        <Stack
          direction={{
            xs: 'column',
            md: 'row',
          }}
          sx={{
            justifyContent:
              'space-between',
            alignItems: {
              xs: 'stretch',
              md: 'center',
            },
            gap: 2,
            mb: 3,
          }}
        >
          <Box>
            <Typography
              sx={{
                color: '#0B5A91',
                fontSize: '.77rem',
                fontWeight: 800,
                letterSpacing:
                  '.09em',
                textTransform:
                  'uppercase',
              }}
            >
              Trainer Portal
            </Typography>

            <Typography
              sx={{
                color: '#173F60',
                fontSize: {
                  xs: '2rem',
                  md: '2.55rem',
                },
                lineHeight: 1.1,
                fontWeight: 800,
                mt: .45,
              }}
            >
              My Courses
            </Typography>

            <Typography
              sx={{
                color: '#657887',
                mt: 1,
                maxWidth: 720,
              }}
            >
              Create, organise and
              monitor your training
              programmes from one
              workspace.
            </Typography>
          </Box>

          <Stack
            direction={{
              xs: 'column',
              sm: 'row',
            }}
            spacing={1}
          >
            <Tooltip title="Refresh course data">
              <span>
                <IconButton
                  onClick={() =>
                    loadCourses(false)
                  }
                  disabled={refreshing}
                  sx={{
                    width: 42,
                    height: 42,
                    border:
                      '1px solid #C9D9E4',
                    bgcolor: '#FFFFFF',
                  }}
                >
                  <RefreshOutlinedIcon
                    sx={{
                      color:
                        '#0B5A91',
                    }}
                  />
                </IconButton>
              </span>
            </Tooltip>

            <Button
              variant="contained"
              startIcon={
                <AddOutlinedIcon />
              }
              onClick={openCreate}
              sx={{
                px: 2.3,
                py: 1.15,
                bgcolor: '#0B5A91',
                textTransform:
                  'none',
                fontWeight: 800,
                borderRadius: 1.7,
                boxShadow:
                  '0 5px 14px rgba(11,90,145,.16)',
                '&:hover': {
                  bgcolor: '#084873',
                },
              }}
            >
              Create New Course
            </Button>
          </Stack>
        </Stack>

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 2.5,
              borderRadius: 1.7,
            }}
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() =>
                  loadCourses()
                }
                sx={{
                  textTransform:
                    'none',
                  fontWeight: 700,
                }}
              >
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr 1fr',
              md: 'repeat(4, 1fr)',
            },
            gap: 1.8,
            mb: 2.5,
          }}
        >
          {[
            {
              label: 'Total courses',
              value: courses.length,
              icon:
                <MenuBookOutlinedIcon />,
            },
            {
              label: 'Published',
              value:
                publishedCount,
              icon:
                <PublishedWithChangesOutlinedIcon />,
            },
            {
              label: 'Drafts',
              value:
                draftCount,
              icon:
                <DraftsOutlinedIcon />,
            },
            {
              label: 'Total trainees',
              value:
                totalTrainees,
              icon:
                <PeopleOutlineOutlinedIcon />,
            },
          ].map((stat) => (
            <Card
              key={stat.label}
              elevation={0}
              sx={{
                border:
                  '1px solid #DCE8F0',
                borderRadius: 2,
              }}
            >
              <CardContent
                sx={{
                  p: {
                    xs: 1.7,
                    md: 2.2,
                  },
                  '&:last-child': {
                    pb: {
                      xs: 1.7,
                      md: 2.2,
                    },
                  },
                }}
              >
                <Stack
                  direction="row"
                  sx={{
                    justifyContent:
                      'space-between',
                    alignItems:
                      'center',
                    gap: 1,
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        color:
                          '#718594',
                        fontSize:
                          '.72rem',
                        fontWeight:
                          700,
                        textTransform:
                          'uppercase',
                        letterSpacing:
                          '.04em',
                      }}
                    >
                      {stat.label}
                    </Typography>

                    <Typography
                      sx={{
                        mt: .55,
                        color:
                          '#173F60',
                        fontSize:
                          {
                            xs: '1.4rem',
                            md: '1.7rem',
                          },
                        fontWeight:
                          800,
                      }}
                    >
                      {stat.value}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius:
                        1.5,
                      bgcolor:
                        '#EAF4FB',
                      color:
                        '#0B5A91',
                      display:
                        'flex',
                      alignItems:
                        'center',
                      justifyContent:
                        'center',
                    }}
                  >
                    {stat.icon}
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Box>

        <Card
          elevation={0}
          sx={{
            border:
              '1px solid #DCE8F0',
            borderRadius: 2,
            mb: 2.5,
            overflow:
              'hidden',
          }}
        >
          <Box
            sx={{
              px: {
                xs: 1.5,
                md: 2.2,
              },
              pt: .8,
            }}
          >
            <Tabs
              value={statusFilter}
              onChange={(
                _event,
                value: string
              ) =>
                setStatusFilter(
                  value
                )
              }
              variant="scrollable"
              allowScrollButtonsMobile
              sx={{
                minHeight: 46,
                '& .MuiTab-root': {
                  minHeight: 46,
                  textTransform:
                    'none',
                  fontWeight: 700,
                  color: '#718594',
                  px: 1.5,
                },
                '& .Mui-selected': {
                  color:
                    '#0B5A91',
                },
                '& .MuiTabs-indicator':
                  {
                    bgcolor:
                      '#0B5A91',
                    height: 2,
                  },
              }}
            >
              <Tab
                value="ALL"
                label={
                  `All (${courses.length})`
                }
              />
              <Tab
                value="PUBLISHED"
                label={
                  `Published (${publishedCount})`
                }
              />
              <Tab
                value="DRAFT"
                label={
                  `Drafts (${draftCount})`
                }
              />
              <Tab
                value="ARCHIVED"
                label={
                  `Archived (${archivedCount})`
                }
              />
            </Tabs>
          </Box>

          <Divider />

          <CardContent
            sx={{
              p: {
                xs: 1.7,
                md: 2.2,
              },
              '&:last-child': {
                pb: {
                  xs: 1.7,
                  md: 2.2,
                },
              },
            }}
          >
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  md: 'minmax(260px, 1.8fr) repeat(3, minmax(150px, .75fr)) auto',
                },
                gap: 1.3,
                alignItems:
                  'center',
              }}
            >
              <TextField
                fullWidth
                size="small"
                value={query}
                onChange={(e) =>
                  setQuery(
                    e.target.value
                  )
                }
                placeholder="Search courses, topics, categories..."
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchOutlinedIcon
                          sx={{
                            color:
                              '#7A8A95',
                          }}
                        />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <FormControl
                fullWidth
                size="small"
              >
                <InputLabel id="trainer-course-category">
                  Category
                </InputLabel>

                <Select
                  labelId="trainer-course-category"
                  value={categoryFilter}
                  label="Category"
                  onChange={(e) =>
                    setCategoryFilter(
                      e.target.value
                    )
                  }
                >
                  <MenuItem value="ALL">
                    All categories
                  </MenuItem>

                  {categories.map(
                    (category) => (
                      <MenuItem
                        key={
                          category
                        }
                        value={
                          category
                        }
                      >
                        {category}
                      </MenuItem>
                    )
                  )}
                </Select>
              </FormControl>

              <FormControl
                fullWidth
                size="small"
              >
                <InputLabel id="trainer-course-level">
                  Level
                </InputLabel>

                <Select
                  labelId="trainer-course-level"
                  value={levelFilter}
                  label="Level"
                  onChange={(e) =>
                    setLevelFilter(
                      e.target.value
                    )
                  }
                >
                  <MenuItem value="ALL">
                    All levels
                  </MenuItem>
                  <MenuItem value="BEGINNER">
                    Beginner
                  </MenuItem>
                  <MenuItem value="INTERMEDIATE">
                    Intermediate
                  </MenuItem>
                  <MenuItem value="ADVANCED">
                    Advanced
                  </MenuItem>
                </Select>
              </FormControl>

              <FormControl
                fullWidth
                size="small"
              >
                <InputLabel id="trainer-course-sort">
                  Sort by
                </InputLabel>

                <Select
                  labelId="trainer-course-sort"
                  value={sortBy}
                  label="Sort by"
                  onChange={(e) =>
                    setSortBy(
                      e.target.value
                    )
                  }
                  startAdornment={
                    <InputAdornment position="start">
                      <SortOutlinedIcon
                        sx={{
                          ml: .4,
                          color:
                            '#7A8A95',
                        }}
                      />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="UPDATED">
                    Recently updated
                  </MenuItem>
                  <MenuItem value="TITLE">
                    Title
                  </MenuItem>
                  <MenuItem value="TRAINEES">
                    Trainees
                  </MenuItem>
                  <MenuItem value="PROGRESS">
                    Progress
                  </MenuItem>
                  <MenuItem value="DURATION">
                    Duration
                  </MenuItem>
                </Select>
              </FormControl>

              <Tooltip title="Clear all filters">
                <IconButton
                  onClick={
                    clearFilters
                  }
                  disabled={
                    !query &&
                    statusFilter ===
                      'ALL' &&
                    categoryFilter ===
                      'ALL' &&
                    levelFilter ===
                      'ALL' &&
                    sortBy ===
                      'UPDATED'
                  }
                  sx={{
                    width: 40,
                    height: 40,
                    border:
                      '1px solid #C9D9E4',
                    borderRadius:
                      1.4,
                    bgcolor:
                      '#FFFFFF',
                  }}
                >
                  <ClearOutlinedIcon
                    sx={{
                      color:
                        '#0B5A91',
                    }}
                  />
                </IconButton>
              </Tooltip>
            </Box>

            <Stack
              direction="row"
              spacing={1}
              sx={{
                alignItems:
                  'center',
                mt: 1.5,
              }}
            >
              <FilterListOutlinedIcon
                sx={{
                  color:
                    '#8798A3',
                  fontSize:
                    18,
                }}
              />

              <Typography
                sx={{
                  color:
                    '#718594',
                  fontSize:
                    '.78rem',
                }}
              >
                Showing{' '}
                <strong>
                  {
                    filteredCourses.length
                  }
                </strong>{' '}
                of{' '}
                <strong>
                  {courses.length}
                </strong>{' '}
                courses
              </Typography>
            </Stack>
          </CardContent>
        </Card>

        {filteredCourses.length ===
        0 ? (
          <Card
            elevation={0}
            sx={{
              border:
                '1px solid #DCE8F0',
              borderRadius: 2,
            }}
          >
            <CardContent
              sx={{
                py: 8,
                textAlign: 'center',
              }}
            >
              <Box
                sx={{
                  width: 58,
                  height: 58,
                  mx: 'auto',
                  borderRadius: 2,
                  bgcolor:
                    '#EAF4FB',
                  display:
                    'flex',
                  alignItems:
                    'center',
                  justifyContent:
                    'center',
                }}
              >
                <MenuBookOutlinedIcon
                  sx={{
                    fontSize: 30,
                    color:
                      '#7CA0B8',
                  }}
                />
              </Box>

              <Typography
                sx={{
                  mt: 1.7,
                  color:
                    '#173F60',
                  fontSize:
                    '1.15rem',
                  fontWeight:
                    800,
                }}
              >
                {courses.length ===
                0
                  ? 'No courses created yet'
                  : 'No courses match your filters'}
              </Typography>

              <Typography
                sx={{
                  mt: .7,
                  color:
                    '#718594',
                  maxWidth:
                    560,
                  mx: 'auto',
                }}
              >
                {courses.length ===
                0
                  ? 'Create your first training programme and start building its learning content.'
                  : 'Try changing the search or filters to see more of your courses.'}
              </Typography>

              {courses.length ===
              0 ? (
                <Button
                  variant="contained"
                  startIcon={
                    <AddOutlinedIcon />
                  }
                  onClick={
                    openCreate
                  }
                  sx={{
                    mt: 2.2,
                    bgcolor:
                      '#0B5A91',
                    textTransform:
                      'none',
                    fontWeight:
                      800,
                  }}
                >
                  Create Course
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  onClick={
                    clearFilters
                  }
                  sx={{
                    mt: 2.2,
                    color:
                      '#0B5A91',
                    borderColor:
                      '#B7CBD9',
                    textTransform:
                      'none',
                    fontWeight:
                      800,
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <Grid
            container
            spacing={2.2}
          >
            {filteredCourses.map(
              (course) => {
                const itemAnalytics =
                  analyticsMap.get(
                    course.id
                  );

                const trainees =
                  Number(
                    itemAnalytics?.trainees ||
                      0
                  );

                const progress =
                  Math.min(
                    100,
                    Math.max(
                      0,
                      Number(
                        itemAnalytics?.completion ||
                          0
                      )
                    )
                  );

                const status =
                  normalizeStatus(
                    course.status
                  );

                const level =
                  normalizeLevel(
                    course.level
                  );

                return (
                  <Grid
                    key={
                      course.id
                    }
                    size={{
                      xs: 12,
                      md: 6,
                    }}
                  >
                    <Card
                      elevation={0}
                      sx={{
                        height:
                          '100%',
                        border:
                          '1px solid #DCE8F0',
                        borderRadius: 2,
                        transition:
                          'transform .16s ease, box-shadow .16s ease',
                        '&:hover':
                          {
                            transform:
                              'translateY(-2px)',
                            boxShadow:
                              '0 10px 26px rgba(29,65,92,.08)',
                          },
                      }}
                    >
                      <CardContent
                        sx={{
                          p: {
                            xs: 2.2,
                            md: 2.7,
                          },
                          '&:last-child':
                            {
                              pb: {
                                xs: 2.2,
                                md: 2.7,
                              },
                            },
                        }}
                      >
                        <Stack
                          direction="row"
                          sx={{
                            justifyContent:
                              'space-between',
                            alignItems:
                              'flex-start',
                            gap: 1.5,
                          }}
                        >
                          <Box
                            sx={{
                              width: 46,
                              height: 46,
                              borderRadius:
                                1.5,
                              bgcolor:
                                '#EAF4FB',
                              display:
                                'flex',
                              alignItems:
                                'center',
                              justifyContent:
                                'center',
                              flexShrink: 0,
                            }}
                          >
                            <MenuBookOutlinedIcon
                              sx={{
                                color:
                                  '#0B5A91',
                              }}
                            />
                          </Box>

                          <Chip
                            label={
                              statusLabel(
                                status
                              )
                            }
                            size="small"
                            sx={{
                              ...statusStyles(
                                status
                              ),
                              fontWeight:
                                800,
                            }}
                          />
                        </Stack>

                        <Typography
                          sx={{
                            color:
                              '#173F60',
                            fontSize:
                              '1.17rem',
                            fontWeight:
                              800,
                            lineHeight:
                              1.35,
                            mt: 2,
                          }}
                        >
                          {
                            course.title
                          }
                        </Typography>

                        {course.description && (
                          <Typography
                            sx={{
                              mt: .75,
                              color:
                                '#657887',
                              fontSize:
                                '.86rem',
                              lineHeight:
                                1.65,
                              display:
                                '-webkit-box',
                              WebkitLineClamp:
                                3,
                              WebkitBoxOrient:
                                'vertical',
                              overflow:
                                'hidden',
                            }}
                          >
                            {
                              course.description
                            }
                          </Typography>
                        )}

                        <Stack
                          direction="row"
                          spacing={1}
                          sx={{
                            mt: 1.5,
                            flexWrap:
                              'wrap',
                            rowGap:
                              .7,
                          }}
                        >
                          <Chip
                            size="small"
                            label={
                              course.category ||
                              'General'
                            }
                            sx={{
                              bgcolor:
                                '#F0F6FA',
                              color:
                                '#0B5A91',
                              fontWeight:
                                700,
                            }}
                          />

                          <Chip
                            size="small"
                            label={
                              levelLabel(
                                level
                              )
                            }
                            sx={{
                              bgcolor:
                                '#F4F6F8',
                              color:
                                '#62727E',
                              fontWeight:
                                700,
                            }}
                          />
                        </Stack>

                        <Divider
                          sx={{
                            my: 2,
                          }}
                        />

                        <Box
                          sx={{
                            display:
                              'grid',
                            gridTemplateColumns:
                              'repeat(3, 1fr)',
                            gap: 1.2,
                          }}
                        >
                          <Box>
                            <Typography
                              sx={{
                                color:
                                  '#8797A2',
                                fontSize:
                                  '.7rem',
                                textTransform:
                                  'uppercase',
                                fontWeight:
                                  700,
                              }}
                            >
                              Trainees
                            </Typography>

                            <Stack
                              direction="row"
                              spacing={.5}
                              sx={{
                                mt: .35,
                                alignItems:
                                  'center',
                              }}
                            >
                              <PeopleOutlineOutlinedIcon
                                sx={{
                                  fontSize:
                                    17,
                                  color:
                                    '#718594',
                                }}
                              />

                              <Typography
                                sx={{
                                  color:
                                    '#173F60',
                                  fontWeight:
                                    800,
                                }}
                              >
                                {
                                  trainees
                                }
                              </Typography>
                            </Stack>
                          </Box>

                          <Box>
                            <Typography
                              sx={{
                                color:
                                  '#8797A2',
                                fontSize:
                                  '.7rem',
                                textTransform:
                                  'uppercase',
                                fontWeight:
                                  700,
                              }}
                            >
                              Duration
                            </Typography>

                            <Typography
                              sx={{
                                mt: .35,
                                color:
                                  '#173F60',
                                fontWeight:
                                  800,
                              }}
                            >
                              {
                                course.durationHours ??
                                0
                              }{' '}
                              hrs
                            </Typography>
                          </Box>

                          <Box>
                            <Typography
                              sx={{
                                color:
                                  '#8797A2',
                                fontSize:
                                  '.7rem',
                                textTransform:
                                  'uppercase',
                                fontWeight:
                                  700,
                              }}
                            >
                              Progress
                            </Typography>

                            <Typography
                              sx={{
                                mt: .35,
                                color:
                                  '#173F60',
                                fontWeight:
                                  800,
                              }}
                            >
                              {
                                progress
                              }%
                            </Typography>
                          </Box>
                        </Box>

                        {status ===
                          'PUBLISHED' && (
                          <Box
                            sx={{
                              mt: 2,
                            }}
                          >
                            <Stack
                              direction="row"
                              sx={{
                                justifyContent:
                                  'space-between',
                                mb: .55,
                              }}
                            >
                              <Typography
                                sx={{
                                  color:
                                    '#718594',
                                  fontSize:
                                    '.76rem',
                                }}
                              >
                                Average
                                learner
                                progress
                              </Typography>

                              <Typography
                                sx={{
                                  color:
                                    '#0B5A91',
                                  fontSize:
                                    '.76rem',
                                  fontWeight:
                                    800,
                                }}
                              >
                                {
                                  progress
                                }%
                              </Typography>
                            </Stack>

                            <LinearProgress
                              variant="determinate"
                              value={
                                progress
                              }
                              sx={{
                                height:
                                  6,
                                borderRadius:
                                  4,
                                bgcolor:
                                  '#E3EBF0',
                                '& .MuiLinearProgress-bar':
                                  {
                                    bgcolor:
                                      '#0B5A91',
                                    borderRadius:
                                      4,
                                  },
                              }}
                            />
                          </Box>
                        )}

                        <Button
                          fullWidth
                          variant="outlined"
                          startIcon={
                            <EditOutlinedIcon />
                          }
                          onClick={() =>
                            navigate(
                              `/trainer/courses/${course.id}`
                            )
                          }
                          sx={{
                            mt: 2.2,
                            color:
                              '#0B5A91',
                            borderColor:
                              '#B9CEDC',
                            textTransform:
                              'none',
                            fontWeight:
                              800,
                            py: 1,
                            '&:hover':
                              {
                                borderColor:
                                  '#0B5A91',
                                bgcolor:
                                  '#F5F9FC',
                              },
                          }}
                        >
                          {status ===
                          'PUBLISHED'
                            ? 'Manage Course'
                            : 'Continue Editing'}
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              }
            )}
          </Grid>
        )}

        <Box
          sx={{
            mt: 3,
            p: {
              xs: 2,
              md: 2.3,
            },
            border:
              '1px solid #DCE8F0',
            borderRadius: 2,
            bgcolor:
              '#FAFCFD',
          }}
        >
          <Stack
            direction={{
              xs: 'column',
              md: 'row',
            }}
            sx={{
              justifyContent:
                'space-between',
              alignItems: {
                xs: 'flex-start',
                md: 'center',
              },
              gap: 1.5,
            }}
          >
            <Stack
              direction="row"
              spacing={1.2}
              sx={{
                alignItems:
                  'center',
              }}
            >
              <AutoAwesomeOutlinedIcon
                sx={{
                  color:
                    '#0B5A91',
                }}
              />

              <Box>
                <Typography
                  sx={{
                    color:
                      '#173F60',
                    fontWeight:
                      800,
                  }}
                >
                  AI-assisted course
                  authoring
                </Typography>

                <Typography
                  sx={{
                    color:
                      '#718594',
                    fontSize:
                      '.8rem',
                    mt: .25,
                  }}
                >
                  Generate a structured
                  course draft and
                  review it before
                  publishing.
                </Typography>
              </Box>
            </Stack>

            <Button
              variant="outlined"
              onClick={
                openCreate
              }
              sx={{
                color:
                  '#0B5A91',
                borderColor:
                  '#B9CEDC',
                textTransform:
                  'none',
                fontWeight:
                  800,
              }}
            >
              Start with AI
            </Button>
          </Stack>
        </Box>
      </Container>

      <Dialog
        open={openDialog}
        onClose={
          closeDialog
        }
        fullWidth
        maxWidth="md"
      >
        <DialogTitle
          sx={{
            color:
              '#173F60',
            fontWeight:
              800,
          }}
        >
          Create New Course
        </DialogTitle>

        <DialogContent>
          <Box
            sx={{
              mt: .5,
              mb: 2.5,
              p: 2,
              border:
                '1px solid #DCE8F0',
              borderRadius: 2,
              bgcolor:
                aiMode
                  ? '#F3F8FC'
                  : '#FAFCFD',
            }}
          >
            <Stack
              direction={{
                xs: 'column',
                sm: 'row',
              }}
              sx={{
                justifyContent:
                  'space-between',
                alignItems: {
                  xs: 'flex-start',
                  sm: 'center',
                },
                gap: 1.5,
              }}
            >
              <Box>
                <Typography
                  sx={{
                    color:
                      '#173F60',
                    fontWeight:
                      800,
                  }}
                >
                  Build with AI
                </Typography>

                <Typography
                  sx={{
                    mt: .25,
                    color:
                      '#718594',
                    fontSize:
                      '.8rem',
                  }}
                >
                  Generate the
                  course structure,
                  then review every
                  field before saving.
                </Typography>
              </Box>

              <Button
                variant={
                  aiMode
                    ? 'contained'
                    : 'outlined'
                }
                startIcon={
                  <AutoAwesomeOutlinedIcon />
                }
                onClick={() =>
                  setAiMode(
                    (value) =>
                      !value
                  )
                }
                sx={{
                  textTransform:
                    'none',
                  fontWeight:
                    800,
                  ...(aiMode
                    ? {
                        bgcolor:
                          '#0B5A91',
                      }
                    : {
                        color:
                          '#0B5A91',
                        borderColor:
                          '#B9CEDC',
                      }),
                }}
              >
                {aiMode
                  ? 'AI Enabled'
                  : 'Use AI'}
              </Button>
            </Stack>

            {aiMode && (
              <Stack
                spacing={1.7}
                sx={{
                  mt: 2.2,
                }}
              >
                <TextField
                  fullWidth
                  label="Course topic"
                  value={aiTopic}
                  onChange={(e) =>
                    setAiTopic(
                      e.target.value
                    )
                  }
                  placeholder="e.g. Weather Forecasting Fundamentals"
                />

                <TextField
                  fullWidth
                  multiline
                  minRows={3}
                  label="Learning context"
                  value={aiContext}
                  onChange={(e) =>
                    setAiContext(
                      e.target.value
                    )
                  }
                  placeholder="Optional: objectives, learner profile, syllabus points..."
                />

                <Stack
                  direction={{
                    xs: 'column',
                    sm: 'row',
                  }}
                  spacing={1.5}
                >
                  <TextField
                    select
                    fullWidth
                    label="Level"
                    value={
                      form.level
                    }
                    onChange={(e) =>
                      updateField(
                        'level',
                        e.target.value
                      )
                    }
                  >
                    <MenuItem value="BEGINNER">
                      Beginner
                    </MenuItem>
                    <MenuItem value="INTERMEDIATE">
                      Intermediate
                    </MenuItem>
                    <MenuItem value="ADVANCED">
                      Advanced
                    </MenuItem>
                  </TextField>

                  <TextField
                    fullWidth
                    type="number"
                    label="Number of modules"
                    value={
                      aiModuleCount
                    }
                    onChange={(e) =>
                      setAiModuleCount(
                        Math.min(
                          15,
                          Math.max(
                            1,
                            Number(
                              e.target
                                .value
                            ) || 1
                          )
                        )
                      )
                    }
                    slotProps={{
                      htmlInput: {
                        min: 1,
                        max: 15,
                      },
                    }}
                  />

                  <Button
                    variant="contained"
                    startIcon={
                      generatingAI ? (
                        <CircularProgress
                          size={17}
                          color="inherit"
                        />
                      ) : (
                        <AutoAwesomeOutlinedIcon />
                      )
                    }
                    disabled={
                      generatingAI ||
                      !aiTopic.trim()
                    }
                    onClick={
                      generateCourseDraft
                    }
                    sx={{
                      minWidth:
                        {
                          xs:
                            '100%',
                          sm:
                            170,
                        },
                      bgcolor:
                        '#0B5A91',
                      textTransform:
                        'none',
                      fontWeight:
                        800,
                    }}
                  >
                    {generatingAI
                      ? 'Generating...'
                      : 'Generate Draft'}
                  </Button>
                </Stack>

                {aiModules.length >
                  0 && (
                  <Box>
                    <Typography
                      sx={{
                        color:
                          '#173F60',
                        fontWeight:
                          800,
                        mb: 1,
                      }}
                    >
                      Generated
                      modules
                    </Typography>

                    <Stack
                      spacing={1}
                    >
                      {aiModules.map(
                        (
                          module,
                          index
                        ) => (
                          <Box
                            key={
                              index
                            }
                            sx={{
                              p: 1.5,
                              border:
                                '1px solid #DCE8F0',
                              borderRadius:
                                1.5,
                              bgcolor:
                                '#FFFFFF',
                            }}
                          >
                            <TextField
                              fullWidth
                              size="small"
                              label={`Module ${index + 1}`}
                              value={
                                module.title
                              }
                              onChange={(
                                e
                              ) => {
                                const next =
                                  [
                                    ...aiModules,
                                  ];

                                next[
                                  index
                                ] = {
                                  ...next[
                                    index
                                  ],
                                  title:
                                    e.target
                                      .value,
                                };

                                setAiModules(
                                  next
                                );
                              }}
                            />

                            <TextField
                              fullWidth
                              size="small"
                              multiline
                              minRows={2}
                              label="Module description"
                              value={
                                module.description
                              }
                              onChange={(
                                e
                              ) => {
                                const next =
                                  [
                                    ...aiModules,
                                  ];

                                next[
                                  index
                                ] = {
                                  ...next[
                                    index
                                  ],
                                  description:
                                    e.target
                                      .value,
                                };

                                setAiModules(
                                  next
                                );
                              }}
                              sx={{
                                mt: 1,
                              }}
                            />
                          </Box>
                        )
                      )}
                    </Stack>
                  </Box>
                )}
              </Stack>
            )}
          </Box>

          <Stack
            spacing={2}
            sx={{
              pt: .5,
            }}
          >
            <TextField
              fullWidth
              required
              label="Course title"
              value={
                form.title
              }
              onChange={(e) =>
                updateField(
                  'title',
                  e.target.value
                )
              }
            />

            <TextField
              fullWidth
              multiline
              minRows={4}
              label="Description"
              value={
                form.description
              }
              onChange={(e) =>
                updateField(
                  'description',
                  e.target.value
                )
              }
            />

            <Grid
              container
              spacing={1.6}
            >
              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                }}
              >
                <TextField
                  fullWidth
                  label="Category"
                  value={
                    form.category
                  }
                  onChange={(e) =>
                    updateField(
                      'category',
                      e.target.value
                    )
                  }
                  placeholder="Meteorology"
                />
              </Grid>

              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                }}
              >
                <TextField
                  fullWidth
                  label="Department"
                  value={
                    form.department
                  }
                  onChange={(e) =>
                    updateField(
                      'department',
                      e.target.value
                    )
                  }
                  placeholder="IMD / Meteorology"
                />
              </Grid>

              <Grid
                size={{
                  xs: 12,
                  sm: 4,
                }}
              >
                <TextField
                  fullWidth
                  required
                  type="number"
                  label="Duration (hours)"
                  value={
                    form.durationHours
                  }
                  onChange={(e) =>
                    updateField(
                      'durationHours',
                      e.target.value
                    )
                  }
                  slotProps={{
                    htmlInput: {
                      min: 1,
                    },
                  }}
                />
              </Grid>

              <Grid
                size={{
                  xs: 12,
                  sm: 4,
                }}
              >
                <TextField
                  fullWidth
                  select
                  label="Level"
                  value={
                    form.level
                  }
                  onChange={(e) =>
                    updateField(
                      'level',
                      e.target.value
                    )
                  }
                >
                  <MenuItem value="BEGINNER">
                    Beginner
                  </MenuItem>
                  <MenuItem value="INTERMEDIATE">
                    Intermediate
                  </MenuItem>
                  <MenuItem value="ADVANCED">
                    Advanced
                  </MenuItem>
                </TextField>
              </Grid>

              <Grid
                size={{
                  xs: 12,
                  sm: 4,
                }}
              >
                <TextField
                  fullWidth
                  select
                  label="Publishing status"
                  value={
                    form.status
                  }
                  onChange={(e) =>
                    updateField(
                      'status',
                      e.target.value
                    )
                  }
                >
                  <MenuItem value="DRAFT">
                    Draft
                  </MenuItem>
                  <MenuItem value="PUBLISHED">
                    Published
                  </MenuItem>
                </TextField>
              </Grid>
            </Grid>

            {error && (
              <Alert
                severity="error"
                sx={{
                  borderRadius: 1.5,
                }}
              >
                {error}
              </Alert>
            )}
          </Stack>
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            pb: 2.5,
            gap: .8,
          }}
        >
          <Button
            onClick={
              closeDialog
            }
            disabled={
              saving ||
              generatingAI
            }
            sx={{
              textTransform:
                'none',
              color:
                '#657887',
              fontWeight:
                700,
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={
              saveCourse
            }
            disabled={
              saving ||
              generatingAI
            }
            sx={{
              bgcolor:
                '#0B5A91',
              textTransform:
                'none',
              fontWeight:
                800,
              px: 2,
              '&:hover': {
                bgcolor:
                  '#084873',
              },
            }}
          >
            {saving
              ? 'Creating...'
              : 'Create Course'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TrainerCourses;
