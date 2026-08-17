import React, { useState, useEffect } from 'react';
import { Save, User } from 'lucide-react';

export default function ProfileEditForm({ user, onSave, loading }) {
  const [formData, setFormData] = useState({
    display_name: '',
    profession: '',
    bio: '',
    timezone: 'UTC',
    avatar_url: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        display_name: user.display_name || '',
        profession: user.profession || '',
        bio: user.bio || '',
        timezone: user.timezone || 'UTC',
        avatar_url: user.avatar_url || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="glass-panel p-7">
      <h3 className="text-lg font-heading font-bold text-white mb-6 flex items-center gap-2">
        <User size={20} className="text-indigo-400" />
        Edit Profile Details
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">Display Name</label>
          <input
            type="text"
            name="display_name"
            value={formData.display_name}
            onChange={handleChange}
            placeholder="e.g. Aditya Verlekar"
            className="form-input-tailwind"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">Profession / Role</label>
          <input
            type="text"
            name="profession"
            value={formData.profession}
            onChange={handleChange}
            placeholder="e.g. Software Engineer / Student"
            className="form-input-tailwind"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">Timezone</label>
          <select
            name="timezone"
            value={formData.timezone}
            onChange={handleChange}
            className="form-input-tailwind cursor-pointer"
          >
            <option value="UTC">UTC (Universal Coordinated Time)</option>
            <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
            <option value="America/New_York">America/New_York (EST)</option>
            <option value="America/Los_Angeles">America/Los_Angeles (PST)</option>
            <option value="Europe/London">Europe/London (GMT)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">Avatar URL</label>
          <input
            type="url"
            name="avatar_url"
            value={formData.avatar_url}
            onChange={handleChange}
            placeholder="https://example.com/avatar.jpg"
            className="form-input-tailwind"
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-xs font-semibold text-slate-300 mb-2">Bio & Goals Background</label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          rows="4"
          placeholder="Share your productivity focus, current study goals, or target milestones..."
          className="form-input-tailwind resize-none"
        ></textarea>
      </div>

      <div className="flex justify-end">
        <button type="submit" className="btn-gradient" disabled={loading}>
          <Save size={18} />
          {loading ? 'Saving Profile...' : 'Save Profile Changes'}
        </button>
      </div>
    </form>
  );
}
