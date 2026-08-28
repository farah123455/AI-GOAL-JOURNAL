import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, checkingAuth } = useAuth();

  // ===== TEMPORARY DEV-ONLY AUTH BYPASS (remove after Habit UI testing) =====
  // Activates ONLY on the Vite dev server (import.meta.env.DEV) AND only when
  // VITE_DEV_BYPASS_AUTH=true is set in .env. Production builds statically
  // evaluate DEV as false, so this branch is dead-code-eliminated and Firebase
  // authentication behavior in production is completely unaffected.
  if (import.meta.env.DEV && import.meta.env.VITE_DEV_BYPASS_AUTH === 'true') {
    return children;
  }
  // ===== END TEMPORARY DEV-ONLY AUTH BYPASS =====

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper">
        <div className="text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-moss-200 border-t-moss-600" />
          <p className="text-sm text-ink/60">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}