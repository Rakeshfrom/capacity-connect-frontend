export interface ResumeLearningPoint {
  courseId: number;
  courseTitle: string;
  moduleId: number;
  moduleTitle: string;
  updatedAt: number;
}

const RESUME_KEY = 'capacity-connect.resume-learning';

type ResumeStore = Record<string, ResumeLearningPoint>;

const readStore = (): ResumeStore => {
  try {
    const raw = localStorage.getItem(RESUME_KEY);
    if (!raw) return {};

    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
};

const writeStore = (store: ResumeStore) => {
  try {
    localStorage.setItem(RESUME_KEY, JSON.stringify(store));
  } catch {
    // Ignore local storage failures.
  }
};

export const saveResumeLearningPoint = (
  point: Omit<ResumeLearningPoint, 'updatedAt'>
) => {
  const store = readStore();

  store[String(point.courseId)] = {
    ...point,
    updatedAt: Date.now(),
  };

  writeStore(store);
};

export const getResumeLearningPoint = (
  courseId: number
): ResumeLearningPoint | null => {
  const point = readStore()[String(courseId)];
  return point || null;
};

export const getLatestResumeLearningPoint =
  (): ResumeLearningPoint | null => {
    const points = Object.values(readStore());

    if (points.length === 0) return null;

    return points.sort(
      (a, b) => b.updatedAt - a.updatedAt
    )[0];
  };
