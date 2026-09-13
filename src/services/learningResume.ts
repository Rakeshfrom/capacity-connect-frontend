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


export interface ResourceLearningPoint {
  courseId: number;
  resourceId: number;
  moduleId?: number | null;
  resourceTitle: string;
  positionSeconds: number;
  pageNumber?: number;
  completed: boolean;
  updatedAt: number;
}

const RESOURCE_PROGRESS_KEY =
  'capacity-connect.resource-progress';

type ResourceProgressStore =
  Record<string, ResourceLearningPoint>;

const readResourceStore = (): ResourceProgressStore => {
  try {
    const raw = localStorage.getItem(RESOURCE_PROGRESS_KEY);
    if (!raw) return {};

    const parsed = JSON.parse(raw);

    return parsed && typeof parsed === 'object'
      ? parsed
      : {};
  } catch {
    return {};
  }
};

const writeResourceStore = (
  store: ResourceProgressStore
) => {
  try {
    localStorage.setItem(
      RESOURCE_PROGRESS_KEY,
      JSON.stringify(store)
    );
  } catch {
    // Ignore local storage failures.
  }
};

const resourceProgressKey = (
  courseId: number,
  resourceId: number
) => `${courseId}:${resourceId}`;

export const saveResourceLearningPoint = (
  point: Omit<ResourceLearningPoint, 'updatedAt'>
) => {
  const store = readResourceStore();

  store[resourceProgressKey(
    point.courseId,
    point.resourceId
  )] = {
    ...point,
    updatedAt: Date.now(),
  };

  writeResourceStore(store);
};

export const getResourceLearningPoint = (
  courseId: number,
  resourceId: number
): ResourceLearningPoint | null => {
  return (
    readResourceStore()[
      resourceProgressKey(courseId, resourceId)
    ] || null
  );
};
