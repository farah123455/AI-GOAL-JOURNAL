import {
  Settings as SettingsIcon,
  Bell,
  Sparkles,
  BookOpen,
  Moon,
  Save,
  Check,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useData } from "../context/DataContext";
import { userApi } from "../services/api";

const defaults = {
  notifications: true,
  aiInsights: true,
  journalReminders: true,
  compactMode: false,
};

function mergeWithDefaults(preferences) {
  return { ...defaults, ...(preferences || {}) };
}

export default function Settings() {
  const { userProfile, updateProfileLocal } = useData();
  const [settings, setSettings] = useState(defaults);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (userProfile?.preferences) {
      setSettings(mergeWithDefaults(userProfile.preferences));
    }
  }, [userProfile]);

  function update(key) {
    setSettings((current) => ({
      ...current,
      [key]: !current[key],
    }));
    setSaved(false);
    setError("");
  }

  async function saveSettings() {
    setSaving(true);
    setError("");
    setSaved(false);

    try {
      const updatedUser = await userApi.updatePreferences(settings);
      if (updateProfileLocal) {
        updateProfileLocal(updatedUser);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err.message || "Failed to save settings.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="app-page">
      <header className="border-b border-border bg-surface px-5 py-7 md:px-8 lg:px-10">
        <div className="mx-auto max-w-[1000px]">
          <p className="section-label">PREFERENCES</p>
          <div className="mt-2 flex items-center gap-3">
            <SettingsIcon size={23} className="text-beige" />
            <h1 className="text-3xl font-semibold text-cream">Settings</h1>
          </div>
          <p className="mt-2 text-sm text-beige/60">
            Customize how AI Goal Journal works for you.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-[1000px] px-5 py-7 md:px-8 lg:px-10">
        <div className="space-y-5">
          {error && (
            <div className="rounded-xl border border-red-900/40 bg-red-950/20 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <SettingSection
            icon={Bell}
            title="Notifications"
            description="Stay updated with reminders."
          >
            <SettingRow
              title="Enable notifications"
              description="Receive important reminders and updates."
              enabled={settings.notifications}
              onChange={() => update("notifications")}
              disabled={saving}
            />
          </SettingSection>

          <SettingSection
            icon={Sparkles}
            title="AI Preferences"
            description="Control personalized AI insights."
          >
            <SettingRow
              title="Enable AI insights"
              description="Generate reflections based on your activity."
              enabled={settings.aiInsights}
              onChange={() => update("aiInsights")}
              disabled={saving}
            />
          </SettingSection>

          <SettingSection
            icon={BookOpen}
            title="Journal"
            description="Manage your reflection experience."
          >
            <SettingRow
              title="Journal reminders"
              description="Receive reminders to maintain your journaling habit."
              enabled={settings.journalReminders}
              onChange={() => update("journalReminders")}
              disabled={saving}
            />
          </SettingSection>

          <SettingSection
            icon={Moon}
            title="Interface"
            description="Adjust the application layout."
          >
            <SettingRow
              title="Compact mode"
              description="Use a more condensed content layout."
              enabled={settings.compactMode}
              onChange={() => update("compactMode")}
              disabled={saving}
            />
          </SettingSection>

          <div className="flex justify-end gap-4 pt-2">
            {saved && (
              <div className="flex items-center gap-2 text-xs font-semibold text-accent">
                <Check size={14} />
                Settings saved
              </div>
            )}

            <button
              onClick={saveSettings}
              disabled={saving}
              className="primary-button"
            >
              <Save size={14} />
              {saving ? "Saving…" : "Save settings"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

function SettingSection({ icon: Icon, title, description, children }) {
  return (
    <section className="panel p-6 shadow-card">
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-burgundy text-beige">
          <Icon size={19} />
        </div>
        <div>
          <h2 className="font-semibold text-cream">{title}</h2>
          <p className="mt-1 text-xs text-beige/60">{description}</p>
        </div>
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function SettingRow({ title, description, enabled, onChange, disabled }) {
  return (
    <div className="flex items-center justify-between gap-5 rounded-xl border border-border bg-surface2 p-4">
      <div>
        <h3 className="text-sm font-semibold text-cream">{title}</h3>
        <p className="mt-1 text-xs leading-5 text-beige/60">{description}</p>
      </div>

      <button
        type="button"
        onClick={disabled ? undefined : onChange}
        aria-pressed={enabled}
        aria-disabled={disabled}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          enabled ? "bg-wine" : "bg-muted"
        } ${disabled ? "opacity-50" : ""}`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-cream transition-all ${
            enabled ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}
