import { Link, useNavigate } from 'react-router-dom';
import { Target } from 'lucide-react';

export default function PublicNavbar() {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-md px-5 sm:px-8 py-4 transition-all">
      <div className="mx-auto flex max-w-[1250px] items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 shadow-sm">
            <Target size={18} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold tracking-tight text-slate-900">
              GOAL JOURNAL
            </p>
            <p className="text-[9px] uppercase tracking-[0.18em] text-slate-500 font-semibold">
              Growth workspace
            </p>
          </div>
        </Link>

        {/* Anchor Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-slate-600">
          <a href="#features" className="hover:text-indigo-600 transition">Features</a>
          <a href="#how-it-works" className="hover:text-indigo-600 transition">How It Works</a>
          <a href="#privacy" className="hover:text-indigo-600 transition">Privacy</a>
        </nav>

        {/* Auth CTAs */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-semibold text-slate-700 border border-slate-200 hover:bg-slate-50 transition shadow-sm"
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
