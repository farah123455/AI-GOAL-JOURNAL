import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import ProfileCard from './ProfileCard';
import ProfileEditForm from './ProfileEditForm';
import PreferencesForm from './PreferencesForm';
import { UserService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { User, Sliders, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

export default function UserProfilePage() {
  const { user: authUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Derived active Firebase UID from authenticated user or fallback demo UID
  const activeUid = authUser?.uid || 'aditya_fb_uid_2026';
  const activeEmail = authUser?.email || 'aditya.verlekar@aigoaljournal.com';

  useEffect(() => {
    loadUserProfile();
  }, [activeUid]);

  const loadUserProfile = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const profile = await UserService.getProfile(activeUid);
      setUserProfile(profile);
    } catch (err) {
      console.error("Failed to load user profile:", err);
      setErrorMessage("Could not load user profile from backend.");
    } finally {
      setLoading(false);
    }
  };

  const handleSyncFirebaseUser = async () => {
    setSaving(true);
    try {
      const syncData = {
        firebase_uid: activeUid,
        email: activeEmail,
        display_name: authUser?.displayName || userProfile?.display_name || "Aditya Verlekar",
        profession: userProfile?.profession || "AI & Backend Engineer",
        bio: userProfile?.bio || "Developing AI Goal Journal & Accountability Coach for students and professionals.",
        timezone: userProfile?.timezone || "Asia/Kolkata",
        preferences: userProfile?.preferences || {
          theme: "dark",
          daily_reminder_time: "21:00",
          ai_coaching_tone: "encouraging",
          focus_areas: ["Productivity", "Software Development", "Placement Prep"],
          email_notifications: true,
          push_notifications: true
        }
      };

      const syncedUser = await UserService.syncUser(syncData);
      setUserProfile(syncedUser);
      showToast("Firebase user identity synced to PostgreSQL database!");
    } catch (err) {
      console.error("Sync error:", err);
      setErrorMessage("Failed to sync Firebase user.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveProfile = async (updatedFields) => {
    setSaving(true);
    try {
      const updatedUser = await UserService.updateProfile(updatedFields, activeUid);
      setUserProfile(updatedUser);
      showToast("Profile details updated successfully!");
    } catch (err) {
      console.error("Save profile error:", err);
      showToast("Error updating profile. Check console.");
    } finally {
      setSaving(false);
    }
  };

  const handleSavePreferences = async (updatedPreferences) => {
    setSaving(true);
    try {
      const updatedUser = await UserService.updatePreferences(updatedPreferences, activeUid);
      setUserProfile(updatedUser);
      showToast("Preferences & AI Coaching settings saved!");
    } catch (err) {
      console.error("Save preferences error:", err);
      showToast("Error saving preferences. Check console.");
    } finally {
      setSaving(false);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="max-w-6xl mx-auto px-5 py-8 min-h-screen">
      <Navbar currentUid={activeUid} />

      {/* Header Banner */}
      <div className="glass-panel p-8 mb-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-white mb-2">
              User Profile & Settings
            </h1>
            <p className="text-slate-400 text-sm">
              Manage user identity mapping, timezone, and AI coaching preferences.
            </p>
          </div>

          <button
            onClick={handleSyncFirebaseUser}
            className="btn-outline self-start md:self-auto"
            disabled={saving}
          >
            <RefreshCw size={16} className={saving ? 'spin' : ''} />
            Sync Firebase Identity
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="glass-panel p-4 mb-6 border-red-500/40 bg-red-500/10 text-red-300 flex items-center gap-3 text-sm">
          <AlertCircle size={18} className="text-red-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {loading ? (
        <div className="glass-panel p-16 text-center text-slate-400">
          <RefreshCw size={32} className="spin mx-auto mb-4 text-indigo-400" />
          <div className="text-sm font-medium">Connecting to FastAPI backend & mapping PostgreSQL user...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-7">
          {/* Left Column: User Profile Card */}
          <ProfileCard user={userProfile} />

          {/* Right Column: Tabbed Forms */}
          <div className="space-y-5">
            <div className="flex gap-2 border-b border-slate-800 pb-3">
              <button
                className={`px-4 py-2.5 rounded-xl font-medium text-xs md:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'profile'
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
                onClick={() => setActiveTab('profile')}
              >
                <User size={16} />
                Profile Details
              </button>

              <button
                className={`px-4 py-2.5 rounded-xl font-medium text-xs md:text-sm flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'preferences'
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
                onClick={() => setActiveTab('preferences')}
              >
                <Sliders size={16} />
                Preferences & Settings
              </button>
            </div>

            {activeTab === 'profile' ? (
              <ProfileEditForm user={userProfile} onSave={handleSaveProfile} loading={saving} />
            ) : (
              <PreferencesForm preferences={userProfile?.preferences} onSave={handleSavePreferences} loading={saving} />
            )}
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-emerald-500 text-white px-5 py-3.5 rounded-xl font-semibold text-sm shadow-xl shadow-emerald-500/30 flex items-center gap-2.5 z-50 animate-bounce">
          <CheckCircle2 size={18} />
          {toastMessage}
        </div>
      )}
    </div>
  );
}
