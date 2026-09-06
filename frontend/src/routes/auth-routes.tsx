import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthStatusPage } from '../components/auth/AuthStatusPage';
import { LoginPage } from '../components/auth/LoginPage';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { SessionExpiredPage } from '../components/auth/SessionExpiredPage';
import { UnauthorizedPage } from '../components/auth/UnauthorizedPage';

export function AuthRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="/session-expired" element={<SessionExpiredPage />} />
      <Route
        path="/session"
        element={
          <ProtectedRoute>
            <AuthStatusPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
