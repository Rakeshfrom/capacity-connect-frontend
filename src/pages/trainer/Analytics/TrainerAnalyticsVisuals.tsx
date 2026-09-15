import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import { useAuth } from '../../../context/AuthContext';
import {
  getAssessmentsByCourse,
  getAttemptsByAssessment,
  getCourseById,
  getCourseModules,
  getEnrollmentsByCourse,
  getTrainerAnalytics,
  getTrainerTrainees,
} from '../../../services/api';

type CourseAnalytics = {
  courseId: number;
  courseTitle: string;
  trainees: number;
  completion: number;
  averageScore: number;
};

type TrainerAnalyticsData = {
  trainerId: number;
  totalTrainees: number;
  averageCompletion: number;
  averageAssessmentScore: number;
  overallPerformance: number;
  courses: CourseAnalytics[];
};

type Assessment = {
  id: number;
  title?: string;
  courseId?: number;
  moduleId?: number | null;
  status?: string;
};

type Attempt = {
  id: number;
  assessmentId: number;
  traineeId: number;
  percentage?: number;
  result?: string;
};

type Enrollment = {
  traineeId: number;
  courseId: number;
  progress: number;
};

type Module = {
  id: number;
  title: string;
  orderIndex: number;
};

type TrainerTrainee = {
  traineeId: number;
  firstName?: string;
  lastName?: string;
  name?: string;
  fullName?: string;
  username?: string;
};

type CourseDetail = {
  course: CourseAnalytics & { durationHours?: number };
  assessments: Assessment[];
  attempts: Attempt[];
  enrollments: Enrollment[];
  modules: Module[];
};

const clamp = (value: number, min = 0, max = 100) => Math.max(min, Math.min(max, value));
const pct = (value: unknown) => Math.round(Number(value) || 0);

function traineeLabel(item: TrainerTrainee | undefined, id: number) {
  if (!item) return `Trainee #${id}`;
  return (
    item.name ||
    item.fullName ||
    [item.firstName, item.lastName].filter(Boolean).join(' ') ||
    item.username ||
    `Trainee #${id}`
  );
}

function Bar({ value, secondary = false }: { value: number; secondary?: boolean }) {
  return (
    <Box sx={{ height: 9, borderRadius: 8, bgcolor: '#E6EEF4', overflow: 'hidden' }}>
      <Box
        sx={{
          width: `${clamp(value)}%`,
          height: '100%',
          borderRadius: 8,
          bgcolor: secondary ? '#79A9C7' : '#0B5A91',
        }}
      />
    </Box>
  );
}

export default function TrainerAnalyticsVisuals({ compact = false }: { compact?: boolean }) {
  const { user, loading: authLoading } = useAuth();
  const [base, setBase] = useState<TrainerAnalyticsData | null>(null);
  const [trainees, setTrainees] = useState<TrainerTrainee[]>([]);
  const [details, setDetails] = useState<Record<number, CourseDetail>>({});
  const [selectedCourseId, setSelectedCourseId] = useState<number | ''>('');
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (authLoading || !user) return;
    let active = true;
    Promise.all([getTrainerAnalytics(user.id), getTrainerTrainees(user.id)])
      .then(([analyticsData, traineeData]) => {
        if (!active) return;
        const data = analyticsData as TrainerAnalyticsData;
        setBase(data);
        setTrainees(Array.isArray(traineeData) ? traineeData : []);
        if (data.courses?.length) setSelectedCourseId(data.courses[0].courseId);
        setError('');
      })
      .catch((err) => {
        console.error('Failed to load visual trainer analytics:', err);
        if (active) setError('Unable to load the visual analytics data.');
      })
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [user, authLoading]);

  useEffect(() => {
    const selectedId = Number(selectedCourseId);
    if (!base?.courses?.length) return;

    const courseIds = compact
      ? base.courses.map((item) => item.courseId)
      : selectedId
        ? [selectedId]
        : [];

    const pendingIds = courseIds.filter((id) => !details[id]);
    if (!pendingIds.length) return;

    let active = true;
    setDetailLoading(true);

    Promise.all(
      pendingIds.map(async (courseId) => {
        const course = base.courses.find((item) => item.courseId === courseId);
        if (!course) return null;

        const [assessmentData, enrollmentData, moduleData, courseData] =
          await Promise.all([
            getAssessmentsByCourse(courseId),
            getEnrollmentsByCourse(courseId),
            getCourseModules(courseId),
            getCourseById(courseId),
          ]);

        const assessments = (assessmentData ?? []) as Assessment[];

        const attemptGroups = await Promise.all(
          assessments.map(async (assessment) => {
            try {
              return ((await getAttemptsByAssessment(assessment.id)) ?? []) as Attempt[];
            } catch {
              return [];
            }
          }),
        );

        return [
          courseId,
          {
            course: {
              ...course,
              durationHours:
                Number(
                  (courseData as { durationHours?: number })?.durationHours
                ) || undefined,
            },
            assessments,
            attempts: attemptGroups.flat(),
            enrollments: (enrollmentData ?? []) as Enrollment[],
            modules: ([...(moduleData ?? [])] as Module[]).sort(
              (a, b) => a.orderIndex - b.orderIndex,
            ),
          },
        ] as const;
      }),
    )
      .then((results) => {
        if (!active) return;

        setDetails((current) => {
          const next = { ...current };

          for (const result of results) {
            if (result) next[result[0]] = result[1];
          }

          return next;
        });
      })
      .catch((err) => {
        console.error('Failed to load course analytics detail:', err);
      })
      .finally(() => {
        if (active) setDetailLoading(false);
      });

    return () => {
      active = false;
    };
  }, [selectedCourseId, base, details, compact]);


  const courses = base?.courses ?? [];
  const selected = details[Number(selectedCourseId)];

  const courseBars = useMemo(() => courses.map((course) => ({
    ...course,
    completion: pct(course.completion),
    score: pct(course.averageScore),
  })), [courses]);

  const traineeRows = useMemo(() => {
    if (!selected) return [];
    const byTrainee = new Map<number, Attempt[]>();
    for (const attempt of selected.attempts) {
      const list = byTrainee.get(attempt.traineeId) ?? [];
      list.push(attempt);
      byTrainee.set(attempt.traineeId, list);
    }
    return selected.enrollments
      .map((enrollment) => {
        const attempts = byTrainee.get(enrollment.traineeId) ?? [];
        const scores = attempts.map((item) => pct(item.percentage)).filter((item) => Number.isFinite(item));
        const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
        const courseDuration = Number(selected.course.durationHours) || 0;
        const estimatedHours = Math.round((courseDuration * (pct(enrollment.progress) / 100)) * 10) / 10;
        return {
          traineeId: enrollment.traineeId,
          name: traineeLabel(trainees.find((item) => item.traineeId === enrollment.traineeId), enrollment.traineeId),
          progress: pct(enrollment.progress),
          attempts: attempts.length,
          score: avg,
          estimatedHours,
        };
      })
      .sort((a, b) => b.progress - a.progress);
  }, [selected, trainees]);

  const histogram = useMemo(() => {
    const bins = [0, 0, 0, 0, 0];
    const attempts = selected?.attempts ?? [];
    for (const attempt of attempts) {
      const score = pct(attempt.percentage);
      const index = Math.min(4, Math.floor(score / 20));
      bins[index] += 1;
    }
    const max = Math.max(...bins, 1);
    return bins.map((count, index) => ({
      label: `${index * 20}-${index === 4 ? 100 : index * 20 + 19}%`,
      count,
      height: Math.round((count / max) * 100),
    }));
  }, [selected]);

  const courseAttemptBars = useMemo(
    () =>
      courses.map((course) => ({
        courseId: course.courseId,
        courseTitle: course.courseTitle,
        attempts: details[course.courseId]?.attempts.length ?? 0,
      })),
    [courses, details],
  );


  const assessmentRows = useMemo(() => {
    if (!selected) return [];
    return selected.assessments.map((assessment) => {
      const attempts = selected.attempts.filter((item) => item.assessmentId === assessment.id);
      const scores = attempts.map((item) => pct(item.percentage));
      const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
      const passed = attempts.filter((item) => item.result === 'PASSED').length;
      return {
        ...assessment,
        attempts: attempts.length,
        avg,
        passRate: attempts.length ? Math.round((passed / attempts.length) * 100) : 0,
      };
    });
  }, [selected]);

  const moduleRows = useMemo(() => {
    if (!selected) return [];
    const overall = pct(selected.course.completion);
    const count = Math.max(selected.modules.length, 1);
    return selected.modules.map((module, index) => {
      const segment = 100 / count;
      const completion = clamp(((overall - (index * segment)) / segment) * 100);
      return {
        ...module,
        completion: Math.round(completion),
        status: completion >= 80 ? 'Strong' : completion >= 50 ? 'On track' : 'Needs attention',
      };
    });
  }, [selected]);

  const strengths = useMemo(() => moduleRows.filter((item) => item.completion >= 80).slice(0, 3), [moduleRows]);
  const gaps = useMemo(() => [...moduleRows].sort((a, b) => a.completion - b.completion).slice(0, 3), [moduleRows]);


  if (compact) {
    const maxAttempts = Math.max(
      ...courseAttemptBars.map((item) => item.attempts),
      1,
    );

    return (
      <Card
        elevation={0}
        sx={{
          border: '1px solid #DCE8F0',
          borderRadius: 2.5,
          mt: 2.5,
        }}
      >
        <CardContent sx={{ p: { xs: 2, md: 2.75 } }}>
          <Box sx={{ mb: 2.5 }}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <InsightsOutlinedIcon sx={{ color: '#0B5A91' }} />
              <Typography
                sx={{
                  color: '#173F60',
                  fontWeight: 800,
                  fontSize: '1.15rem',
                }}
              >
                Learning Analytics Snapshot
              </Typography>
            </Stack>

            <Typography sx={{ color: '#718594', mt: 0.5 }}>
              Course-wise visual view of trainee completion, performance and assessment activity.
            </Typography>
          </Box>

          {loading ? (
            <Typography color="text.secondary">
              Loading visual analytics...
            </Typography>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  md: 'repeat(3, minmax(0, 1fr))',
                },
                gap: 2,
              }}
            >
              <Card variant="outlined" sx={{ borderRadius: 2, minWidth: 0 }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography sx={{ color: '#173F60', fontWeight: 800 }}>
                    Course completion
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#718594' }}>
                    Average completion by course
                  </Typography>

                  <Stack spacing={1.5} sx={{ mt: 2 }}>
                    {courseBars.map((course) => (
                      <Box key={course.courseId}>
                        <Stack
                          direction="row"
                          sx={{
                            justifyContent: 'space-between',
                            gap: 1,
                            mb: 0.55,
                          }}
                        >
                          <Typography
                            sx={{
                              color: '#526B7A',
                              fontSize: '0.76rem',
                              fontWeight: 700,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {course.courseTitle}
                          </Typography>
                          <Typography
                            sx={{
                              color: '#0B5A91',
                              fontSize: '0.76rem',
                              fontWeight: 800,
                            }}
                          >
                            {course.completion}%
                          </Typography>
                        </Stack>
                        <Bar value={course.completion} />
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>

              <Card variant="outlined" sx={{ borderRadius: 2, minWidth: 0 }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography sx={{ color: '#173F60', fontWeight: 800 }}>
                    Trainee performance
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#718594' }}>
                    Average assessment performance by course
                  </Typography>

                  <Stack spacing={1.5} sx={{ mt: 2 }}>
                    {courseBars.map((course) => (
                      <Box key={course.courseId}>
                        <Stack
                          direction="row"
                          sx={{
                            justifyContent: 'space-between',
                            gap: 1,
                            mb: 0.55,
                          }}
                        >
                          <Typography
                            sx={{
                              color: '#526B7A',
                              fontSize: '0.76rem',
                              fontWeight: 700,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {course.courseTitle}
                          </Typography>
                          <Typography
                            sx={{
                              color: '#0B5A91',
                              fontSize: '0.76rem',
                              fontWeight: 800,
                            }}
                          >
                            {course.score}%
                          </Typography>
                        </Stack>
                        <Bar value={course.score} secondary />
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>

              <Card variant="outlined" sx={{ borderRadius: 2, minWidth: 0 }}>
                <CardContent sx={{ p: 2 }}>
                  <Typography sx={{ color: '#173F60', fontWeight: 800 }}>
                    Assessment attempts
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#718594' }}>
                    Total attempts by course
                  </Typography>

                  <Stack spacing={1.5} sx={{ mt: 2 }}>
                    {courseAttemptBars.map((course) => (
                      <Box key={course.courseId}>
                        <Stack
                          direction="row"
                          sx={{
                            justifyContent: 'space-between',
                            gap: 1,
                            mb: 0.55,
                          }}
                        >
                          <Typography
                            sx={{
                              color: '#526B7A',
                              fontSize: '0.76rem',
                              fontWeight: 700,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {course.courseTitle}
                          </Typography>
                          <Typography
                            sx={{
                              color: '#0B5A91',
                              fontSize: '0.76rem',
                              fontWeight: 800,
                            }}
                          >
                            {course.attempts}
                          </Typography>
                        </Stack>

                        <Box
                          sx={{
                            height: 9,
                            borderRadius: 8,
                            bgcolor: '#E6EEF4',
                            overflow: 'hidden',
                          }}
                        >
                          <Box
                            sx={{
                              width: `${Math.round(
                                (course.attempts / maxAttempts) * 100,
                              )}%`,
                              height: '100%',
                              borderRadius: 8,
                              bgcolor: '#0B5A91',
                            }}
                          />
                        </Box>
                      </Box>
                    ))}
                  </Stack>

                  {detailLoading && (
                    <Typography
                      variant="caption"
                      sx={{
                        display: 'block',
                        color: '#718594',
                        mt: 1.25,
                      }}
                    >
                      Loading course activity...
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Box>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Stack spacing={2.5}>
      <Card elevation={0} sx={{ border: '1px solid #DCE8F0', borderRadius: 2.5 }}>
        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
          <Stack direction={{ xs: 'column', md: 'row' }} sx={{ justifyContent: 'space-between', gap: 2, mb: 2.5 }}>
            <Box>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <InsightsOutlinedIcon sx={{ color: '#0B5A91' }} />
                <Typography sx={{ color: '#173F60', fontWeight: 800, fontSize: '1.2rem' }}>
                  Course comparison
                </Typography>
              </Stack>
              <Typography sx={{ color: '#718594', mt: 0.5 }}>
                Completion vs average assessment performance across every trainer-owned course.
              </Typography>
            </Box>
            <FormControl size="small" sx={{ minWidth: { xs: '100%', md: 320 } }}>
              <InputLabel>Focus course</InputLabel>
              <Select
                value={selectedCourseId}
                label="Focus course"
                onChange={(event) => setSelectedCourseId(Number(event.target.value))}
              >
                {courses.map((course) => (
                  <MenuItem key={course.courseId} value={course.courseId}>{course.courseTitle}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2.25 }}>
            {courseBars.map((course) => (
              <Box
                key={course.courseId}
                onClick={() => setSelectedCourseId(course.courseId)}
                sx={{
                  p: 2,
                  border: course.courseId === selectedCourseId ? '1px solid #0B5A91' : '1px solid #E1EAF0',
                  borderRadius: 2,
                  cursor: 'pointer',
                  bgcolor: course.courseId === selectedCourseId ? '#F6FBFF' : '#FFFFFF',
                }}
              >
                <Typography sx={{ color: '#173F60', fontWeight: 800, fontSize: '0.95rem', mb: 1.25 }}>
                  {course.courseTitle}
                </Typography>
                <Stack spacing={1.2}>
                  <Box>
                    <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">Completion</Typography>
                      <Typography variant="caption" sx={{ color: '#0B5A91', fontWeight: 800 }}>{course.completion}%</Typography>
                    </Stack>
                    <Bar value={course.completion} />
                  </Box>
                  <Box>
                    <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">Assessment score</Typography>
                      <Typography variant="caption" sx={{ color: '#526B7A', fontWeight: 800 }}>{course.score}%</Typography>
                    </Stack>
                    <Bar value={course.score} secondary />
                  </Box>
                </Stack>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>

      {detailLoading && !selected && (
        <Card elevation={0} sx={{ border: '1px solid #DCE8F0', borderRadius: 2.5 }}>
          <CardContent><Typography color="text.secondary">Loading course-level analytics...</Typography></CardContent>
        </Card>
      )}

      {selected && (
        <>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1.35fr 1fr' }, gap: 2.5 }}>
            <Card elevation={0} sx={{ border: '1px solid #DCE8F0', borderRadius: 2.5 }}>
              <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <Typography sx={{ color: '#173F60', fontWeight: 800, fontSize: '1.15rem' }}>
                  Trainee performance
                </Typography>
                <Typography sx={{ color: '#718594', mt: 0.5, mb: 2.5 }}>
                  Course completion, assessment attempts, score and estimated learning time by trainee.
                </Typography>
                <Stack spacing={1.7}>
                  {traineeRows.map((trainee) => (
                    <Box key={trainee.traineeId} sx={{ p: 1.5, border: '1px solid #E4ECF1', borderRadius: 2 }}>
                      <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ justifyContent: 'space-between', gap: 1.5 }}>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography sx={{ color: '#173F60', fontWeight: 800, fontSize: '0.92rem' }}>{trainee.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {trainee.attempts} assessment attempt{trainee.attempts === 1 ? '' : 's'} · {trainee.estimatedHours}h estimated learning time
                          </Typography>
                        </Box>
                        <Chip label={`${trainee.score}% avg score`} size="small" sx={{ fontWeight: 800 }} />
                      </Stack>
                      <Stack spacing={0.65} sx={{ mt: 1.25 }}>
                        <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                          <Typography variant="caption" color="text.secondary">Course completion</Typography>
                          <Typography variant="caption" sx={{ fontWeight: 800, color: '#0B5A91' }}>{trainee.progress}%</Typography>
                        </Stack>
                        <Bar value={trainee.progress} />
                      </Stack>
                    </Box>
                  ))}
                </Stack>
                <Typography variant="caption" sx={{ color: '#718594', display: 'block', mt: 1.5 }}>
                  Estimated learning time = course duration × completion. The current schema does not yet track actual active study minutes.
                </Typography>
              </CardContent>
            </Card>

            <Card elevation={0} sx={{ border: '1px solid #DCE8F0', borderRadius: 2.5 }}>
              <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <Typography sx={{ color: '#173F60', fontWeight: 800, fontSize: '1.15rem' }}>
                  Assessment score distribution
                </Typography>
                <Typography sx={{ color: '#718594', mt: 0.5, mb: 2.5 }}>
                  Score histogram from the actual assessment attempts stored for this course.
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 1.2, alignItems: 'end', minHeight: 180 }}>
                  {histogram.map((item) => (
                    <Box key={item.label} sx={{ display: 'grid', gap: 0.65, justifyItems: 'center' }}>
                      <Typography variant="caption" sx={{ color: '#526B7A', fontWeight: 800 }}>{item.count}</Typography>
                      <Box sx={{ width: '100%', height: 130, display: 'flex', alignItems: 'end', justifyContent: 'center' }}>
                        <Box sx={{ width: '72%', height: `${Math.max(item.height, 4)}%`, borderRadius: '7px 7px 0 0', bgcolor: '#0B5A91' }} />
                      </Box>
                      <Typography variant="caption" sx={{ color: '#718594', textAlign: 'center', fontSize: '0.68rem' }}>{item.label}</Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 2.5 }}>
            <Card elevation={0} sx={{ border: '1px solid #DCE8F0', borderRadius: 2.5 }}>
              <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <Typography sx={{ color: '#173F60', fontWeight: 800, fontSize: '1.15rem' }}>
                  Assessment activity
                </Typography>
                <Typography sx={{ color: '#718594', mt: 0.5, mb: 2.5 }}>
                  Number of attempts, average score and pass rate for each assessment.
                </Typography>
                <Stack spacing={1.5}>
                  {assessmentRows.map((assessment) => (
                    <Box key={assessment.id} sx={{ p: 1.5, border: '1px solid #E4ECF1', borderRadius: 2 }}>
                      <Stack direction="row" sx={{ justifyContent: 'space-between', gap: 1.5, mb: 1 }}>
                        <Typography sx={{ color: '#173F60', fontWeight: 800, fontSize: '0.9rem' }}>{assessment.title || `Assessment #${assessment.id}`}</Typography>
                        <Chip label={`${assessment.attempts} attempt${assessment.attempts === 1 ? '' : 's'}`} size="small" sx={{ fontWeight: 800 }} />
                      </Stack>
                      <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap', rowGap: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">Avg score: <strong>{assessment.avg}%</strong></Typography>
                        <Typography variant="caption" color="text.secondary">Pass rate: <strong>{assessment.passRate}%</strong></Typography>
                      </Stack>
                      <Box sx={{ mt: 1.1 }}><Bar value={assessment.avg} /></Box>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>

            <Card elevation={0} sx={{ border: '1px solid #DCE8F0', borderRadius: 2.5 }}>
              <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 0.5 }}>
                  <MenuBookOutlinedIcon sx={{ color: '#0B5A91' }} />
                  <Typography sx={{ color: '#173F60', fontWeight: 800, fontSize: '1.15rem' }}>
                    Module-wise insight
                  </Typography>
                </Stack>
                <Typography sx={{ color: '#718594', mt: 0.5, mb: 2.5 }}>
                  Module coverage estimate to highlight strong and weak learning areas.
                </Typography>
                <Stack spacing={1.7}>
                  {moduleRows.map((module) => (
                    <Box key={module.id}>
                      <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 0.6, gap: 1 }}>
                        <Typography sx={{ color: '#173F60', fontWeight: 700, fontSize: '0.88rem' }}>{module.title}</Typography>
                        <Typography variant="caption" sx={{ color: module.completion < 50 ? '#A15C00' : '#0B5A91', fontWeight: 800 }}>{module.completion}%</Typography>
                      </Stack>
                      <Bar value={module.completion} />
                    </Box>
                  ))}
                </Stack>
                <Typography variant="caption" sx={{ color: '#718594', display: 'block', mt: 1.5 }}>
                  Module coverage is derived from the course-level completion because per-module completion is not stored separately yet.
                </Typography>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2.5 }}>
            <Card elevation={0} sx={{ border: '1px solid #DCE8F0', borderRadius: 2.5 }}>
              <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1 }}>
                  <TrendingUpOutlinedIcon sx={{ color: '#147A45' }} />
                  <Typography sx={{ color: '#173F60', fontWeight: 800 }}>Strengths</Typography>
                </Stack>
                {strengths.length ? strengths.map((item) => (
                  <Stack key={item.id} direction="row" spacing={1} sx={{ alignItems: 'center', py: 0.8 }}>
                    <Chip label={`${item.completion}%`} size="small" sx={{ minWidth: 50, fontWeight: 800 }} />
                    <Typography sx={{ color: '#526B7A', fontSize: '0.9rem' }}>{item.title}</Typography>
                  </Stack>
                )) : <Typography color="text.secondary">No strong module signal yet.</Typography>}
              </CardContent>
            </Card>

            <Card elevation={0} sx={{ border: '1px solid #DCE8F0', borderRadius: 2.5 }}>
              <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1 }}>
                  <WarningAmberOutlinedIcon sx={{ color: '#A15C00' }} />
                  <Typography sx={{ color: '#173F60', fontWeight: 800 }}>Needs attention</Typography>
                </Stack>
                {gaps.length ? gaps.map((item) => (
                  <Stack key={item.id} direction="row" spacing={1} sx={{ alignItems: 'center', py: 0.8 }}>
                    <Chip label={`${item.completion}%`} size="small" sx={{ minWidth: 50, fontWeight: 800, bgcolor: '#FFF4E5', color: '#A15C00' }} />
                    <Typography sx={{ color: '#526B7A', fontSize: '0.9rem' }}>{item.title}</Typography>
                  </Stack>
                )) : <Typography color="text.secondary">No weak module signal yet.</Typography>}
              </CardContent>
            </Card>
          </Box>

          <Alert severity="info" icon={<TimerOutlinedIcon />}>
            This view separates real backend metrics (enrollment completion, assessment attempts and scores) from derived estimates. Actual study-minute tracking and true per-module progress would require dedicated activity telemetry in the backend.
          </Alert>
        </>
      )}
    </Stack>
  );
}
