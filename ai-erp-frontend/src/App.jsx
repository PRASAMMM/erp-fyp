import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense } from 'react';
import { AuthProvider } from './context/AuthContext';

import HomePage  from './components/HomePage';
import LoginPage from './components/LoginPage';

import Login from './pages/Login';

// ── Admin ──────────────────────────────────────────────────────────────────────
import AdminDashboard    from './pages/admin/AdminDashboard';
import AdminStudents     from './pages/admin/AdminStudents';
import AdminFaculty      from './pages/admin/AdminFaculty';
import AdminSubjects     from './pages/admin/AdminSubjects';       // NEW
import AdminAnnouncements from './pages/admin/AdminAnnouncements';
import AdminMarks        from './pages/admin/AdminMarks';
import AdminAttendance   from './pages/admin/AdminAttendance';
import AdminAssignments  from './pages/admin/AdminAssignments';
import AdminMaterials    from './pages/admin/AdminMaterials';
import AdminCollegeInfo  from './pages/admin/AdminCollegeInfo';

// ── Faculty ────────────────────────────────────────────────────────────────────
import FacultyDashboard   from './pages/faculty/FacultyDashboard';
import FacultyStudents    from './pages/faculty/FacultyStudents';
import FacultyMarks       from './pages/faculty/FacultyMarks';
import FacultyAttendance  from './pages/faculty/FacultyAttendance';
import FacultyAssignments from './pages/faculty/FacultyAssignments';
import FacultyProfile     from './pages/faculty/FacultyProfile';
import FacultyMaterials   from './pages/faculty/FacultyMaterials';

// ── Student ────────────────────────────────────────────────────────────────────
import StudentDashboard  from './pages/student/StudentDashboard';
import StudentMaterials  from './pages/student/StudentMaterials';
import StudentFaculty    from './pages/student/StudentFaculty';    // NEW
import {
  StudentMarks,
  StudentAttendance,
  StudentAssignments,
  StudentPerformance,
  StudentProfile,
} from './pages/student/StudentPages';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<div />}>
          <Routes>
            <Route path="/"      element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* ── Admin ───────────────────────────────────────────── */}
            <Route path="/admin"                element={<AdminDashboard />} />
            <Route path="/admin/students"       element={<AdminStudents />} />
            <Route path="/admin/faculty"        element={<AdminFaculty />} />
            <Route path="/admin/subjects"       element={<AdminSubjects />} />   {/* NEW */}
            <Route path="/admin/announcements"  element={<AdminAnnouncements />} />
            <Route path="/admin/marks"          element={<AdminMarks />} />
            <Route path="/admin/attendance"     element={<AdminAttendance />} />
            <Route path="/admin/assignments"    element={<AdminAssignments />} />
            <Route path="/admin/materials"      element={<AdminMaterials />} />
            <Route path="/admin/college-info"   element={<AdminCollegeInfo />} />

            {/* ── Faculty ─────────────────────────────────────────── */}
            <Route path="/faculty"                element={<FacultyDashboard />} />
            <Route path="/faculty/students"       element={<FacultyStudents />} />
            <Route path="/faculty/marks"          element={<FacultyMarks />} />
            <Route path="/faculty/attendance"     element={<FacultyAttendance />} />
            <Route path="/faculty/assignments"    element={<FacultyAssignments />} />
            <Route path="/faculty/profile"        element={<FacultyProfile />} />
            <Route path="/faculty/materials"      element={<FacultyMaterials />} />

            {/* ── Student ─────────────────────────────────────────── */}
            <Route path="/student"               element={<StudentDashboard />} />
            <Route path="/student/materials"     element={<StudentMaterials />} />
            <Route path="/student/marks"         element={<StudentMarks />} />
            <Route path="/student/attendance"    element={<StudentAttendance />} />
            <Route path="/student/assignments"   element={<StudentAssignments />} />
            <Route path="/student/performance"   element={<StudentPerformance />} />
            <Route path="/student/faculty"       element={<StudentFaculty />} />  {/* NEW */}
            <Route path="/student/profile"       element={<StudentProfile />} />
            <Route path="/student/dashboard"  element={<StudentDashboard />} />
<Route path="/faculty/dashboard"  element={<FacultyDashboard />} />
<Route path="/admin/dashboard"    element={<AdminDashboard />} />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}
