import React from 'react';
import { User, Mail, Briefcase, Globe, Database, Copy, Check } from 'lucide-react';

export default function ProfileCard({ user }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopyUid = () => {
    if (user?.firebase_uid) {
      navigator.clipboard.writeText(user.firebase_uid);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const defaultAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80";

  return (
    <div className="glass-panel p-6 flex flex-col justify-between">
      <div className="text-center mb-6">
        <div className="relative w-24 h-24 mx-auto mb-4">
          <img
            src={user?.avatar_url || defaultAvatar}
            alt={user?.display_name || 'User Avatar'}
            className="w-full h-full rounded-full object-cover border-2 border-indigo-500 shadow-lg shadow-indigo-500/20"
          />
          <div className="absolute bottom-0 right-0 p-1.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md">
            <User size={14} />
          </div>
        </div>

        <h2 className="text-xl font-heading font-bold text-white mb-1">
          {user?.display_name || 'Anonymous User'}
        </h2>
        <div className="text-xs font-semibold text-indigo-400 mb-3">
          {user?.profession || 'Productivity Enthusiast'}
        </div>
        <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">
          {user?.bio || 'No bio provided yet. Add your bio to personalize AI goal extraction and coaching!'}
        </p>
      </div>

      <div className="border-t border-slate-800/80 pt-5 space-y-3">
        <div className="flex items-center gap-3 text-xs text-slate-300">
          <Mail size={15} className="text-indigo-400 shrink-0" />
          <span className="truncate">{user?.email || 'N/A'}</span>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-300">
          <Briefcase size={15} className="text-indigo-400 shrink-0" />
          <span className="truncate">{user?.profession || 'Not specified'}</span>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-300">
          <Globe size={15} className="text-indigo-400 shrink-0" />
          <span>Timezone: {user?.timezone || 'UTC'}</span>
        </div>

        <div className="pt-2">
          <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400 block mb-1.5">
            FIREBASE IDENTITY MAPPING
          </span>
          <div className="bg-[#151D2F] border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-300 flex items-center justify-between gap-2">
            <span className="flex items-center gap-2 truncate">
              <Database size={13} className="text-emerald-400 shrink-0" />
              <span className="truncate">{user?.firebase_uid}</span>
            </span>
            <button
              onClick={handleCopyUid}
              className="text-slate-400 hover:text-white transition-colors"
              title="Copy Firebase UID"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
