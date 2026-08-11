import { useNavigate } from 'react-router-dom';
import Button from './Button';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  }

  const email = user?.email || '';

  return (
    <header className="flex items-center justify-between border-b border-line bg-paper/95 px-6 py-4 backdrop-blur">

      <button
        onClick={() => navigate('/dashboard')}
        className="font-display text-lg font-semibold text-moss-700"
      >
        Goal Journal
      </button>

      <div className="flex items-center gap-3">

        {email && (
          <span className="hidden text-sm text-ink/70 md:block">
            {email}
          </span>
        )}

        <Button
          variant="secondary"
          onClick={handleLogout}
        >
          Log out
        </Button>

      </div>

    </header>
  );
}