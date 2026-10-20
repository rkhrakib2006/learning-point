import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ExamRoom from './pages/ExamRoom';
import AccessCode from './pages/AccessCode';
import ExamResults from './pages/ExamResults';
import EditExam from './pages/EditExam';
import TeacherStudents from './pages/TeacherStudents';
import TeacherResults from './pages/TeacherResults';
import ManageExams from './pages/ManageExams';
import CreateExam from './pages/CreateExam';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import Loader from './components/Loader';

function RootRedirect() {
  const { user, loading } = useAuth();
  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'ADMIN') return <Navigate to="/admin" replace />;
  if (user.role === 'STUDENT' && !user.isAccessUnlocked) return <Navigate to="/access-code" replace />;
  return <Navigate to={user.role === 'STUDENT' ? '/student' : '/teacher'} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/access-code" element={<AccessCode />} />
          
          <Route path="/admin" element={<ProtectedRoute roles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/student" element={<ProtectedRoute roles={['STUDENT']}><StudentDashboard /></ProtectedRoute>} />
          
          <Route path="/teacher" element={<ProtectedRoute roles={['TEACHER', 'ADMIN']}><TeacherDashboard /></ProtectedRoute>} />
          <Route path="/teacher/students" element={<ProtectedRoute roles={['TEACHER', 'ADMIN']}><TeacherStudents /></ProtectedRoute>} />
          <Route path="/teacher/results" element={<ProtectedRoute roles={['TEACHER', 'ADMIN']}><TeacherResults /></ProtectedRoute>} />
          <Route path="/teacher/manage-exams" element={<ProtectedRoute roles={['TEACHER', 'ADMIN']}><ManageExams /></ProtectedRoute>} />
          <Route path="/teacher/create-exam" element={<ProtectedRoute roles={['TEACHER', 'ADMIN']}><CreateExam /></ProtectedRoute>} />
          
          <Route path="/exam/:examId/results" element={<ProtectedRoute roles={['TEACHER', 'ADMIN']}><ExamResults /></ProtectedRoute>} />
          <Route path="/exam/:examId/edit" element={<ProtectedRoute roles={['TEACHER', 'ADMIN']}><EditExam /></ProtectedRoute>} />
          <Route path="/exam/:examId" element={<ProtectedRoute roles={['STUDENT']}><ExamRoom /></ProtectedRoute>} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}