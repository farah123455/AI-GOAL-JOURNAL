import React from 'react';
import { Target, ShieldCheck, LogOut, LogIn, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Navbar({ currentUid }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <nav className="glass-panel px-6 py-4 mb-8 flex justify-between items-center flex-wrap gap-4">
      <Link to="/profile" className="flex items-center gap-3 text-white no-underline">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
          <Target size={22} className="text-white" />
        </div>
        <div>
          <span className="font-heading font-bold text-lg text-white tracking-tight block">AI Goal Journal</span>
          <span className="text-xs text-slate-400 font-normal">Accountability Coach</span>
        </div>
      </Link>

      <div className="flex items-center gap-3">
        <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400"></span>
          PostgreSQL Sync Active
        </div>

        <div className="flex items-center gap-2 bg-[#151D2F] px-3 py-1.5 rounded-full border border-slate-800 text-xs text-slate-400">
          <ShieldCheck size={14} className="text-indigo-400" />
          <span>Firebase Auth</span>
        </div>

        {user ? (
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer"
            title="Log out of Firebase"
          >
            <LogOut size={13} />
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            className="flex items-center gap-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer"
          >
            <LogIn size={13} />
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
