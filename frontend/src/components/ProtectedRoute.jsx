import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (!token) return <Navigate to="/admin" replace />;
  return children;
}
