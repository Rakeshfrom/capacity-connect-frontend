import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from '@mui/material';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import {
  getEnrollments,
  getAssessmentsByCourse,
  getAttemptsByAssessment,
  getCourseModules,
} from '../../../services/api';

type Enrollment = {
  courseId: number;
};

type Assessment = {
  id: number;
  title?: string;
  courseId?: number;
  moduleId?: number;
};

type Attempt = {
  assessmentId?: number;
  score?: number;
  percentage?: number;
  result?: string;
  submittedAt?: string;
  startedAt?: string;
};

type ModuleRow = {
  courseId: number;
  moduleId: number | null;
  moduleTitle: string;
  attempts: number;
  scores: number[];
  lastAttempt?: string;
};

const average = (values: number[]) =>
  values.length
    ? Math.round(values.reduce((a, b) => a + b, 0) / values.length)
    : 0;

const TraineeAssessmentAnalytics = () => {
  const [rows, setRows] = useState<ModuleRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const enrollments = (await getEnrollments()) as Enrollment[];

        const courseIds = [
          ...new Set(
            (Array.isArray(enrollments) ? enrollments : [])
              .map((item) => Number(item.courseId))
              .filter(Number.isFinite)
          ),
        ];

        const courseResults = await Promise.all(
          courseIds.map(async (courseId) => {
            const [assessments, modules] = await Promise.all([
              getAssessmentsByCourse(courseId),
              getCourseModules(courseId),
            ]);

            const moduleMap = new Map<number, string>();

            for (const module of Array.isArray(modules) ? modules : []) {
              moduleMap.set(
                Number(module.id),
                String(module.title || `Module #${module.id}`)
              );
            }

            const assessmentList = (
              Array.isArray(assessments) ? assessments : []
            ) as Assessment[];

            const attemptResults = await Promise.all(
              assessmentList.map(async (assessment) => {
                try {
                  const attempts = await getAttemptsByAssessment(
                    Number(assessment.id)
                  );

                  return {
                    assessment,
                    attempts: Array.isArray(attempts)
                      ? (attempts as Attempt[])
                      : [],
                  };
                } catch (error) {
                  console.warn(
                    'Unable to load assessment attempts:',
                    assessment.id,
                    error
                  );

                  return {
                    assessment,
                    attempts: [],
                  };
                }
              })
            );

            return { courseId, moduleMap, attemptResults };
          })
        );

        const aggregate = new Map<string, ModuleRow>();

        for (const course of courseResults) {
          for (const item of course.attemptResults) {
            const moduleId =
              item.assessment.moduleId != null
                ? Number(item.assessment.moduleId)
                : null;

            const key = `${course.courseId}:${moduleId ?? 'course'}`;

            const current =
              aggregate.get(key) ||
              {
                courseId: course.courseId,
                moduleId,
                moduleTitle:
                  moduleId != null
                    ? course.moduleMap.get(moduleId) ||
                      `Module #${moduleId}`
                    : 'Course-level assessment',
                attempts: 0,
                scores: [],
              };

            for (const attempt of item.attempts) {
              current.attempts += 1;

              const score = Number(
                attempt.percentage ?? attempt.score ?? NaN
              );

              if (Number.isFinite(score)) {
                current.scores.push(Math.max(0, Math.min(100, score)));
              }

              const activityDate =
                attempt.submittedAt || attempt.startedAt;

              if (
                activityDate &&
                (!current.lastAttempt ||
                  new Date(activityDate) >
                    new Date(current.lastAttempt))
              ) {
                current.lastAttempt = activityDate;
              }
            }

            aggregate.set(key, current);
          }
        }

        const result = [...aggregate.values()]
          .filter((row) => row.attempts > 0)
          .sort((a, b) => b.attempts - a.attempts);

        if (active) {
          setRows(result);
        }
      } catch (error) {
        console.warn(
          'Unable to load trainee assessment analytics:',
          error
        );

        if (active) {
          setRows([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      active = false;
    };
  }, []);

  const totals = useMemo(() => {
    const attempts = rows.reduce((sum, row) => sum + row.attempts, 0);

    const scores = rows.flatMap((row) => row.scores);

    const best = scores.length ? Math.max(...scores) : 0;

    return {
      attempts,
      average: average(scores),
      best,
    };
  }, [rows]);

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
            gap: 2,
            mb: 2.4,
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
              Assessment Analytics
            </Typography>

            <Typography sx={{ color: '#657887', mt: 0.4 }}>
              Module-wise assessment attempts and performance.
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
            <Chip
              icon={<AssessmentOutlinedIcon />}
              label={`${totals.attempts} attempts`}
              sx={{
                bgcolor: '#EAF4FB',
                color: '#0B5A91',
                fontWeight: 800,
              }}
            />

            <Chip
              icon={<TrendingUpOutlinedIcon />}
              label={`Avg ${totals.average}%`}
              sx={{
                bgcolor: '#F3EDF9',
                color: '#7050A5',
                fontWeight: 800,
              }}
            />

            <Chip
              icon={<CheckCircleOutlineOutlinedIcon />}
              label={`Best ${totals.best}%`}
              sx={{
                bgcolor: '#EAF6EF',
                color: '#147A45',
                fontWeight: 800,
              }}
            />
          </Stack>
        </Stack>

        {rows.length === 0 ? (
          <Box
            sx={{
              py: 4,
              textAlign: 'center',
              border: '1px dashed #D7E3EA',
              borderRadius: 2,
            }}
          >
            <AssessmentOutlinedIcon
              sx={{ color: '#9AAAB4', fontSize: 34 }}
            />

            <Typography
              sx={{
                color: '#657887',
                mt: 1,
                fontWeight: 600,
              }}
            >
              No assessment attempts recorded yet.
            </Typography>
          </Box>
        ) : (
          <Stack spacing={1.2}>
            {rows.map((row) => {
              const avgScore = average(row.scores);
              const bestScore = row.scores.length
                ? Math.max(...row.scores)
                : 0;

              return (
                <Box
                  key={`${row.courseId}-${row.moduleId ?? 'course'}`}
                  sx={{
                    p: 1.7,
                    border: '1px solid #E0E9EE',
                    borderRadius: 2,
                    bgcolor: '#FBFDFE',
                  }}
                >
                  <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    sx={{
                      justifyContent: 'space-between',
                      gap: 1.5,
                    }}
                  >
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        sx={{
                          color: '#173F60',
                          fontWeight: 800,
                          fontSize: '.88rem',
                        }}
                      >
                        {row.moduleTitle}
                      </Typography>

                      <Typography
                        sx={{
                          color: '#718594',
                          fontSize: '.74rem',
                          mt: .3,
                        }}
                      >
                        Course #{row.courseId}
                      </Typography>
                    </Box>

                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ alignItems: 'center' }}
                    >
                      <Chip
                        size="small"
                        label={`${row.attempts} attempts`}
                        sx={{
                          bgcolor: '#EAF4FB',
                          color: '#0B5A91',
                          fontWeight: 700,
                        }}
                      />

                      <Chip
                        size="small"
                        label={`Avg ${avgScore}%`}
                        sx={{
                          bgcolor:
                            avgScore >= 60
                              ? '#EAF6EF'
                              : '#FFF4E5',
                          color:
                            avgScore >= 60
                              ? '#147A45'
                              : '#B56A00',
                          fontWeight: 700,
                        }}
                      />

                      <Chip
                        size="small"
                        label={`Best ${bestScore}%`}
                        sx={{
                          bgcolor: '#F3EDF9',
                          color: '#7050A5',
                          fontWeight: 700,
                        }}
                      />
                    </Stack>
                  </Stack>

                  {row.lastAttempt && (
                    <Typography
                      sx={{
                        color: '#718594',
                        fontSize: '.7rem',
                        mt: .8,
                      }}
                    >
                      Last attempt:{' '}
                      {new Date(row.lastAttempt).toLocaleString('en-IN')}
                    </Typography>
                  )}
                </Box>
              );
            })}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};

export default TraineeAssessmentAnalytics;
