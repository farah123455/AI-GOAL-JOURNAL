import React, { useState, useEffect } from 'react';
import { Sliders, Moon, Bot, Clock, Target, Bell, Save } from 'lucide-react';

const AVAILABLE_FOCUS_AREAS = [
  "Productivity",
  "Study & Exams",
  "Placement Prep",
  "Software Development",
  "Freelancing",
  "Health & Fitness",
  "Business & Entrepreneurship"
];

export default function PreferencesForm({ preferences, onSave, loading }) {
  const [prefs, setPrefs] = useState({
    theme: 'dark',
    daily_reminder_time: '20:00',
    ai_coaching_tone: 'encouraging',
    focus_areas: ['Productivity', 'Software Development'],
    email_notifications: true,
    push_notifications: true
  });

  useEffect(() => {
    if (preferences) {
      setPrefs({
        theme: preferences.theme || 'dark',
        daily_reminder_time: preferences.daily_reminder_time || '20:00',
        ai_coaching_tone: preferences.ai_coaching_tone || 'encouraging',
        focus_areas: preferences.focus_areas || ['Productivity', 'Software Development'],
        email_notifications: preferences.email_notifications ?? true,
        push_notifications: preferences.push_notifications ?? true
      });
    }
  }, [preferences]);

  const handleToggleFocusArea = (area) => {
    setPrefs(prev => {
      const exists = prev.focus_areas.includes(area);
      const updated = exists
        ? prev.focus_areas.filter(a => a !== area)
        : [...prev.focus_areas, area];
      return { ...prev, focus_areas: updated };
    });
  };

  const handleToggle = (key) => {
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(prefs);
  };

  return (
    <form onSubmit={handleSubmit} className="glass-panel p-7">
      <h3 className="text-lg font-heading font-bold text-white mb-6 flex items-center gap-2">
        <Sliders size={20} className="text-indigo-400" />
        User Preferences & AI Coaching Settings
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-2">
            <Moon size={15} className="text-indigo-400" />
            UI Theme
          </label>
          <select
            value={prefs.theme}
            onChange={(e) => setPrefs({ ...prefs, theme: e.target.value })}
            className="form-input-tailwind cursor-pointer"
          >
            <option value="dark">Dark Mode (Recommended)</option>
            <option value="light">Light Mode</option>
            <option value="system">System Preference</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-2">
            <Bot size={15} className="text-indigo-400" />
            AI Coaching Tone
          </label>
          <select
            value={prefs.ai_coaching_tone}
            onChange={(e) => setPrefs({ ...prefs, ai_coaching_tone: e.target.value })}
            className="form-input-tailwind cursor-pointer"
          >
            <option value="encouraging">Encouraging & Empathetic</option>
            <option value="direct">Direct & Accountability Focused</option>
            <option value="analytical">Analytical & Metric Driven</option>
          </select>
        </div>
      </div>

      <div className="mb-5">
        <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-2">
          <Clock size={15} className="text-indigo-400" />
          Daily Journal Reminder Time
        </label>
        <input
          type="time"
          value={prefs.daily_reminder_time}
          onChange={(e) => setPrefs({ ...prefs, daily_reminder_time: e.target.value })}
          className="form-input-tailwind max-w-xs"
        />
      </div>

      <div className="mb-6">
        <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-2">
          <Target size={15} className="text-indigo-400" />
          Primary Focus Areas
        </label>
        <div className="flex flex-wrap gap-2 mt-2">
          {AVAILABLE_FOCUS_AREAS.map(area => {
            const isSelected = prefs.focus_areas.includes(area);
            return (
              <button
                key={area}
                type="button"
                onClick={() => handleToggleFocusArea(area)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : 'bg-slate-800/80 text-slate-400 border border-slate-700/60 hover:border-indigo-500/40 hover:text-slate-200'
                }`}
              >
                {isSelected ? '✓ ' : '+ '}{area}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-6 pt-4 border-t border-slate-800/80 space-y-3">
        <label className="block text-xs font-semibold text-slate-300 mb-3 flex items-center gap-2">
          <Bell size={15} className="text-indigo-400" />
          Notification Preferences
        </label>

        <div className="flex items-center justify-between p-4 bg-[#151D2F] border border-slate-800/80 rounded-xl">
          <div>
            <div className="text-xs font-semibold text-slate-200">Email Reminders & Summaries</div>
            <div className="text-[11px] text-slate-400">Receive daily journaling prompts and weekly AI progress reports</div>
          </div>
          <button
            type="button"
            onClick={() => handleToggle('email_notifications')}
            className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
              prefs.email_notifications ? 'bg-indigo-600' : 'bg-slate-700'
            }`}
          >
            <span
              className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                prefs.email_notifications ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between p-4 bg-[#151D2F] border border-slate-800/80 rounded-xl">
          <div>
            <div className="text-xs font-semibold text-slate-200">Push Notifications</div>
            <div className="text-[11px] text-slate-400">Instant goal streak & blocker alert notifications</div>
          </div>
          <button
            type="button"
            onClick={() => handleToggle('push_notifications')}
            className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
              prefs.push_notifications ? 'bg-indigo-600' : 'bg-slate-700'
            }`}
          >
            <span
              className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                prefs.push_notifications ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <button type="submit" className="btn-gradient" disabled={loading}>
          <Save size={18} />
          {loading ? 'Saving Preferences...' : 'Save User Preferences'}
        </button>
      </div>
    </form>
  );
}
