import { Navigate, Route, Routes } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import TraineeLayout from '../layouts/TraineeLayout';
import TrainerLayout from '../layouts/TrainerLayout';
import AdminLayout from '../layouts/AdminLayout';
import AuthGuard from './AuthGuard';

import Home from '../pages/public/Home/Home';
import About from '../pages/public/About/About';
import Courses from '../pages/public/Courses/Courses';
import CourseDetail from '../pages/public/CourseDetail/CourseDetail';
import Announcements from '../pages/public/Announcements/Announcements';

import Login from '../pages/auth/Login/Login';
import Signup from '../pages/auth/Signup/Signup';
import ForgotPassword from '../pages/auth/ForgotPassword/ForgotPassword';
import GoogleCallback from '../pages/auth/GoogleCallback';

import Assessments from '../pages/trainee/Assessments/Assessments';
import AssessmentAttempt from '../pages/trainee/Assessments/Attempt';
import AssessmentResult from '../pages/trainee/Assessments/Result';
import TraineeDashboard from '../pages/trainee/Dashboard/Dashboard';
import TraineeProfile from '../pages/trainee/Profile/Profile';
import TraineeCourses from '../pages/trainee/Courses/Courses';
import CourseWorkspace from '../pages/trainee/CourseWorkspace/CourseWorkspace';
import TrainerLibrary from '../pages/trainee/TrainerLibrary/TrainerLibrary';
import Feedback from '../pages/trainee/Feedback/Feedback';
import Notifications from '../pages/trainee/Notifications/Notifications';
import Certificates from '../pages/trainee/Certificates/Certificates';
import AiChatbot from '../components/AiChatbot';

import TrainerDashboard from '../pages/trainer/Dashboard/Dashboard';
import TrainerProfile from '../pages/trainer/Profile/Profile';
import TrainerCourses from '../pages/trainer/Courses/Courses';
import ManageCourse from '../pages/trainer/Courses/ManageCourse/ManageCourse';
import CourseBuilder from '../pages/trainer/Courses/CourseBuilder/CourseBuilder';
import Questionnaires from '../pages/trainer/Questionnaires/Questionnaires';
import TrainerResourceLibrary from '../pages/trainer/TrainerLibrary/TrainerLibrary';
import Trainees from '../pages/trainer/Trainees/Trainees';
import TraineeDetail from '../pages/trainer/TraineeDetail/TraineeDetail';
import TrainerAnalytics from '../pages/trainer/Analytics/Analytics';
import TrainerNotifications from '../pages/trainer/Notifications/Notifications';

import AdminDashboard from '../pages/admin/Dashboard/Dashboard';
import CompetencyMapping from '../pages/admin/CompetencyMapping/CompetencyMapping';
import AdminAnnouncements from '../pages/admin/Announcements/Announcements';
import Achievements from '../pages/admin/Achievements/Achievements';
import AuditLogs from '../pages/admin/AuditLogs/AuditLogs';
import AdminAnalytics from '../pages/admin/Analytics/Analytics';
import Certifications from '../pages/admin/Certifications/Certifications';
import AdminUsers from '../pages/admin/Users/Users';
import TrainerApplications from '../pages/admin/TrainerApplications/TrainerApplications';
import AdminCourses from '../pages/admin/Courses/Courses';
import AdminAssessments from '../pages/admin/Assessments/Assessments';

import CertificateVerification from '../pages/public/CertificateVerification/CertificateVerification';
import Search from '../pages/public/Search/Search';

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/certificate-verification" element={<CertificateVerification />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/search" element={<Search />} />
        <Route path="/courses/:courseId" element={<CourseDetail />} />
        <Route path="/announcements" element={<Announcements />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth/callback" element={<GoogleCallback />} />
      </Route>

      <Route
        element={
          <AuthGuard role="TRAINEE">
            <TraineeLayout />
          </AuthGuard>
        }
      >
        <Route path="/trainee/dashboard" element={<TraineeDashboard />} />
        <Route path="/trainee/profile" element={<TraineeProfile />} />
        <Route path="/trainee/courses" element={<TraineeCourses />} />
        <Route path="/trainee/courses/:courseId" element={<CourseWorkspace />} />
        <Route path="/trainee/assessments" element={<Assessments />} />
        <Route path="/trainee/assessments/:assessmentId" element={<AssessmentAttempt />} />
        <Route path="/trainee/assessments/:assessmentId/result" element={<AssessmentResult />} />
        <Route path="/trainee/trainer-library" element={<TrainerLibrary />} />
        <Route path="/trainee/feedback" element={<Feedback />} />
        <Route path="/trainee/notifications" element={<Notifications />} />
        <Route path="/trainee/certificates" element={<Certificates />} />
        <Route path="/trainee/ai" element={<AiChatbot />} />
        <Route path="/trainer/ai" element={<AiChatbot />} />
      </Route>

      <Route
        element={
          <AuthGuard role="TRAINER">
            <TrainerLayout />
          </AuthGuard>
        }
      >
        <Route path="/trainer/dashboard" element={<TrainerDashboard />} />
        <Route path="/trainer/profile" element={<TrainerProfile />} />
        <Route path="/trainer/courses" element={<TrainerCourses />} />
        <Route path="/trainer/courses/:courseId" element={<ManageCourse />} />
        <Route path="/trainer/courses/:courseId/builder" element={<CourseBuilder />} />
        <Route path="/trainer/questionnaires" element={<Questionnaires />} />
        <Route path="/trainer/library" element={<TrainerResourceLibrary />} />
        <Route path="/trainer/trainees" element={<Trainees />} />
        <Route path="/trainer/trainees/:traineeId" element={<TraineeDetail />} />
        <Route path="/trainer/analytics" element={<TrainerAnalytics />} />
      <Route path="/trainer/notifications" element={<TrainerNotifications />} />
      </Route>

      <Route
        element={
          <AuthGuard role="ADMIN">
            <AdminLayout />
          </AuthGuard>
        }
      >
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/trainer-applications" element={<TrainerApplications />} />
        <Route path="/admin/courses" element={<AdminCourses />} />
        <Route path="/admin/assessments" element={<AdminAssessments />} />
        <Route path="/admin/certifications" element={<Certifications />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />
        <Route path="/admin/competency-mapping" element={<CompetencyMapping />} />
        <Route path="/admin/announcements" element={<AdminAnnouncements />} />
        <Route path="/admin/achievements" element={<Achievements />} />
        <Route path="/admin/audit-logs" element={<AuditLogs />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
