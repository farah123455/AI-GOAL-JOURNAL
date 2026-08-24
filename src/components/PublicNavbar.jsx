import { Link, useNavigate } from 'react-router-dom';
import { Target } from 'lucide-react';

export default function PublicNavbar() {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-[#190D0F]/95 backdrop-blur-xl px-5 sm:px-8 py-4 transition-all">
      <div className="mx-auto flex max-w-[1250px] items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-burgundy shadow-card">
            <Target size={18} className="text-cream" />
          </div>
          <div>
            <p className="text-sm font-bold tracking-wide text-cream">
              GOAL JOURNAL
            </p>
            <p className="text-[9px] uppercase tracking-[0.18em] text-beige/70">
              Growth workspace
            </p>
          </div>
        </Link>

        {/* Anchor Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-beige/70">
          <a href="#features" className="hover:text-cream transition">Features</a>
          <a href="#how-it-works" className="hover:text-cream transition">How It Works</a>
          <a href="#privacy" className="hover:text-cream transition">Privacy</a>
        </nav>

        {/* Auth CTAs */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 rounded-xl bg-surface2 px-4 py-2 text-xs font-semibold text-cream border border-border hover:bg-wine/40 transition"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/register')}
            className="primary-button text-xs"
          >
            Start Free
          </button>
        </div>
      </div>
    </header>
  );
}
