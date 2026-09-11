import keycloak from './keycloak';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL || ''}/api`;

async function apiFetch(
    path: string,
    options: RequestInit = {}
) {
    if (keycloak.authenticated) {
        try {
            await keycloak.updateToken(30);
        } catch {
            await keycloak.login();
            throw new Error('Authentication required');
        }
    }

    const headers = new Headers(options.headers);

    if (keycloak.token) {
        headers.set('Authorization', `Bearer ${keycloak.token}`);
    }

    if (
        options.body &&
        !(options.body instanceof FormData) &&
        !headers.has('Content-Type')
    ) {
        headers.set('Content-Type', 'application/json');
    }

    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers,
    });

    if (response.status === 401) {
        await keycloak.login();
        throw new Error('Authentication required');
    }

    if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
}

export async function getCurrentUser() {
    return apiFetch('/auth/me');
}

export async function getCurrentUserProfilePhoto() {
    if (keycloak.authenticated) {
        await keycloak.updateToken(30);
    }

    const headers = new Headers();

    if (keycloak.token) {
        headers.set('Authorization', `Bearer ${keycloak.token}`);
    }

    const response = await fetch(
        `${API_BASE_URL}/auth/profile-photo`,
        { headers }
    );

    if (!response.ok) {
        throw new Error(`Profile photo request failed: ${response.status}`);
    }

    return response.blob();
}

export async function apiFetchBlob(path: string) {
  if (keycloak.authenticated) {
    try {
      await keycloak.updateToken(30);
    } catch {
      await keycloak.login();
      throw new Error('Authentication required');
    }
  }

  const headers = new Headers();

  if (keycloak.token) {
    headers.set('Authorization', `Bearer ${keycloak.token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers,
  });

  if (response.status === 401) {
    await keycloak.login();
    throw new Error('Authentication required');
  }

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.blob();
}

export async function getDepartments() {
  return apiFetch('/departments');
}

export async function getCourses() {
    return apiFetch('/courses');
}

export async function getCourseById(id: number) {
    return apiFetch(`/courses/${id}`);
}

export async function getAssessments() {
    return apiFetch('/assessments');
}

export async function getQuestionsByAssessment(assessmentId: number) {
    return apiFetch(`/questions/assessment/${assessmentId}`);
}

export async function createQuestion(data: {
  assessmentId: number;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: 'A' | 'B' | 'C' | 'D';
  marks: number;
}) {
  return apiFetch('/questions', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateQuestion(
  id: number,
  data: {
    assessmentId: number;
    questionText: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
    correctOption: 'A' | 'B' | 'C' | 'D';
    marks: number;
  }
) {
  return apiFetch(`/questions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteQuestion(id: number) {
  return apiFetch(`/questions/${id}`, {
    method: 'DELETE',
  });
}

export async function getEnrollments() {
    return apiFetch('/enrollments/me');
}

export async function enrollInCourse(courseId: number) {
    return apiFetch(`/enrollments/me/${courseId}`, {
        method: 'POST',
    });
}

export async function getAttemptsByTrainee() {
    return apiFetch('/assessment-attempts/me');
}

export async function startAssessmentAttempt(
    assessmentId: number
) {
    return apiFetch('/assessment-attempts', {
        method: 'POST',
        body: JSON.stringify({
            assessmentId,
        }),
    });
}

export async function getAssessment(id: number) {
    return apiFetch(`/assessments/${id}`);
}

export async function terminateAssessmentAttempt(id: number) {
    return apiFetch(`/assessment-attempts/${id}/terminate`, {
        method: 'PATCH',
    });
}

export async function submitAssessmentAttempt(
    id: number,
    answers: Record<number, string>
) {
    return apiFetch(`/assessment-attempts/${id}/submit`, {
        method: 'PATCH',
        body: JSON.stringify({ answers }),
    });
}

export async function getMyCertificates() {
    return apiFetch('/certificates/me');
}

export async function getMyFeedback() {
    return apiFetch('/feedback/me');
}

export async function getMyQuestionnaireResponses() {
    return apiFetch('/questionnaire-responses/me');
}

export async function getTrainerCourses(trainerId: number) {
  return apiFetch(`/courses/trainer/${trainerId}`);
}

export async function getTrainerTrainees(trainerId: number) {
  return apiFetch(`/trainer-trainees/trainer/${trainerId}`);
}

export async function getTrainerAnalytics(trainerId: number) {
  return apiFetch(`/trainer-analytics/trainer/${trainerId}`);
}

export async function getAssessmentsByCourse(courseId: number) {
  return apiFetch(`/assessments/course/${courseId}`);
}

export async function getMyCourseResources(courseId: number) {
  return apiFetch(`/trainer-resources/trainee/course/${courseId}`);
}

export async function getMyCourseAssessments(courseId: number) {
  return apiFetch(`/assessments/trainee/course/${courseId}`);
}

export async function getEnrollmentsByCourse(courseId: number) {
  return apiFetch(`/enrollments/course/${courseId}`);
}

export async function getTrainerProfile(trainerId: number) {
  return apiFetch(`/trainer-profiles/${trainerId}`);
}

export async function updateTrainerProfile(
  trainerId: number,
  data: {
    trainerId: number;
    designation?: string;
    department?: string;
    specialization?: string;
    expertise?: string;
    experienceYears?: number;
    qualifications?: string;
    bio?: string;
  }
) {
  return apiFetch(`/trainer-profiles/${trainerId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function getTrainerQuestionnaires(trainerId: number) {
  return apiFetch(`/questionnaires/trainer/${trainerId}`);
}

export async function getTrainerTraineeDetail(
  trainerId: number,
  traineeId: number
) {
  return apiFetch(`/trainer-trainees/trainer/${trainerId}/trainee/${traineeId}`);
}


export async function getCourseModules(courseId: number) {
  return apiFetch(`/course-modules/course/${courseId}`);
}

export async function createCourseModule(
  courseId: number,
  data: {
    title: string;
    description?: string;
    orderIndex?: number;
  }
) {
  return apiFetch(`/course-modules/course/${courseId}`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateCourseModule(
  id: number,
  data: {
    title: string;
    description?: string;
    orderIndex?: number;
  }
) {
  return apiFetch(`/course-modules/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteCourseModule(id: number) {
  return apiFetch(`/course-modules/${id}`, {
    method: 'DELETE',
  });
}

export async function getTrainerResources(trainerId: number) {
  return apiFetch(`/trainer-resources/trainer/${trainerId}`);
}

export async function getCourseResources(courseId: number) {
  return apiFetch(`/trainer-resources/course/${courseId}`);
}

export async function uploadCourseResource(data: {
  trainerId: number;
  courseId: number;
  moduleId?: number;
  title: string;
  description?: string;
  resourceType: string;
  file: File;
}) {
  const formData = new FormData();

  formData.append('trainerId', String(data.trainerId));
  formData.append('courseId', String(data.courseId));
  if (data.moduleId) formData.append('moduleId', String(data.moduleId));
  formData.append('title', data.title);
  formData.append('description', data.description || '');
  formData.append('resourceType', data.resourceType);
  formData.append('file', data.file);

  return apiFetch('/trainer-resources/upload', {
    method: 'POST',
    body: formData,
  });
}

export async function getTrainerResourceCourses(trainerId: number) {
  return apiFetch(`/courses/trainer/${trainerId}`);
}

export async function deleteTrainerResource(id: number) {
  return apiFetch(`/trainer-resources/${id}`, {
    method: 'DELETE',
  });
}

export async function downloadTrainerResource(id: number) {
  if (keycloak.authenticated) {
    try {
      await keycloak.updateToken(30);
    } catch {
      await keycloak.login();
      throw new Error('Authentication required');
    }
  }

  const headers = new Headers();
  if (keycloak.token) {
    headers.set('Authorization', `Bearer ${keycloak.token}`);
  }

  const response = await fetch(
    `${API_BASE_URL}/trainer-resources/download/${id}`,
    { headers }
  );

  if (response.status === 401) {
    await keycloak.login();
    throw new Error('Authentication required');
  }

  if (!response.ok) {
    throw new Error(`Download failed: ${response.status}`);
  }

  return response.blob();
}


export async function getAdminDashboard() {
  return apiFetch('/admin-dashboard');
}


export async function getUsers() {
  return apiFetch('/users');
}

export async function updateUser(id: number, data: unknown) {
  return apiFetch(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}


export async function createCourse(data: unknown) {
  return apiFetch('/courses', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateCourse(id: number, data: unknown) {
  return apiFetch(`/courses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}


export async function createAssessment(data: unknown) {
  return apiFetch('/assessments', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateAssessment(id: number, data: unknown) {
  return apiFetch(`/assessments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}


export async function getCertificates() {
  return apiFetch('/certificates');
}

export async function issueCertificate(traineeId: number, courseId: number) {
  return apiFetch(
    `/certificates/issue?traineeId=${traineeId}&courseId=${courseId}`,
    { method: 'POST' },
  );
}

export async function viewCertificate(id: number) {
  return apiFetchBlob(`/certificates/${id}/view`);
}

export async function downloadCertificate(id: number) {
  return apiFetchBlob(`/certificates/${id}/download`);
}

export async function revokeCertificate(id: number) {
  return apiFetch(`/certificates/${id}/revoke`, {
    method: 'PATCH',
  });
}

export async function getAdminAnalytics() {
  return apiFetch('/admin/analytics');
}

export async function getCompetencyMapping(competency: string) {
  return apiFetch(
    `/admin/competency-mapping?competency=${encodeURIComponent(competency)}`
  );
}

export async function getAnnouncements() {
  return apiFetch('/announcements');
}

export async function getPublishedAnnouncements() {
  return apiFetch('/announcements/published');
}

export async function getAnnouncementById(id: number) {
  return apiFetch(`/announcements/${id}`);
}

export async function createAnnouncement(data: {
  title: string;
  audience: string;
  status: string;
  type: string;
}) {
  return apiFetch('/announcements', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateAnnouncement(
  id: number,
  data: {
    title: string;
    audience: string;
    status: string;
    type: string;
  }
) {
  return apiFetch(`/announcements/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteAnnouncement(id: number) {
  return apiFetch(`/announcements/${id}`, {
    method: 'DELETE',
  });
}


export async function updateCurrentUserProfile(data: {
  phoneNumber?: string;
  department?: string;
  qualifications?: string;
  skills?: string;
  experienceYears?: number;
  interests?: string;
  profilePhoto?: File | null;
}) {
  const formData = new FormData();

  formData.append(
    'data',
    new Blob(
      [
        JSON.stringify({
          phoneNumber: data.phoneNumber,
          department: data.department,
          qualifications: data.qualifications,
          skills: data.skills,
          experienceYears: data.experienceYears,
          interests: data.interests,
        }),
      ],
      { type: 'application/json' }
    )
  );

  if (data.profilePhoto) {
    formData.append('profilePhoto', data.profilePhoto);
  }

  return apiFetch('/auth/profile', {
    method: 'PUT',
    body: formData,
  });
}

export async function getMyTrainerApplication() {
    return apiFetch('/trainer-applications/me');
}

export async function applyForTrainer(data: {
    reason?: string;
    supportingDocumentUrl?: string;
    supportingDocument?: File | null;
}) {
    const formData = new FormData();

    formData.append(
        'data',
        new Blob(
            [
                JSON.stringify({
                    reason: data.reason,
                    supportingDocumentUrl: data.supportingDocumentUrl,
                }),
            ],
            { type: 'application/json' }
        )
    );

    if (data.supportingDocument) {
        formData.append('supportingDocument', data.supportingDocument);
    }

    return apiFetch('/trainer-applications', {
        method: 'POST',
        body: formData,
    });
}


export async function getPendingTrainerApplications() {
    return apiFetch('/trainer-applications/pending');
}

export async function getTrainerApplications() {
    return apiFetch('/trainer-applications');
}

export async function getTrainerApplication(id: number) {
    return apiFetch(`/trainer-applications/${id}`);
}

export async function getTrainerApplicationDocument(id: number) {
    if (keycloak.authenticated) {
        await keycloak.updateToken(30);
    }

    const headers = new Headers();

    if (keycloak.token) {
        headers.set('Authorization', `Bearer ${keycloak.token}`);
    }

    const response = await fetch(
        `${API_BASE_URL}/trainer-applications/${id}/document`,
        { headers }
    );

    if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
    }

    return response.blob();
}


export async function reviewTrainerApplication(
    id: number,
    status: 'APPROVED' | 'REJECTED',
    adminComment?: string
) {
    return apiFetch(`/trainer-applications/${id}/review`, {
        method: 'PUT',
        body: JSON.stringify({
            status,
            adminComment,
        }),
    });
}

export async function searchPublicContent(query: string) {
  const [courses, announcements] = await Promise.all([
    getCourses(),
    getPublishedAnnouncements(),
  ]);

  const q = query.trim().toLowerCase();

  const filteredCourses = (courses || []).filter((course: any) =>
    [
      course.title,
      course.description,
      course.category,
      course.level,
    ]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(q))
  );

  const filteredAnnouncements = (announcements || []).filter(
    (announcement: any) =>
      [
        announcement.title,
        announcement.description,
        announcement.audience,
        announcement.type,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(q))
  );

  return {
    courses: filteredCourses,
    announcements: filteredAnnouncements,
  };
}
