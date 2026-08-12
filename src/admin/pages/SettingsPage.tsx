import React, { useEffect, useState } from "react";
import { Save, RotateCcw, Globe, Shield, Users, DollarSign, BarChart3, AlertTriangle } from "lucide-react";
import { listenToSettings, updateSettings, AppSettings } from "../services/adminService";

function Toggle({ checked, onChange, label, description }: { checked: boolean; onChange: (v: boolean) => void; label: string; description?: string }) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-white/5 last:border-0">
      <div>
        <p className="text-sm font-medium text-white">{label}</p>
        {description && <p className="text-xs text-white/40 mt-0.5">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${checked ? "bg-violet-500" : "bg-white/10"}`}
      >
        <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${checked ? "left-6" : "left-1"}`} />
      </button>
    </div>
  );
}

function NumberInput({ label, description, value, onChange, min, max, prefix, suffix }: {
  label: string; description?: string; value: number; onChange: (v: number) => void;
  min?: number; max?: number; prefix?: string; suffix?: string;
}) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-white/5 last:border-0">
      <div>
        <p className="text-sm font-medium text-white">{label}</p>
        {description && <p className="text-xs text-white/40 mt-0.5">{description}</p>}
      </div>
      <div className="flex items-center gap-1.5 bg-[#0f0f14] border border-white/10 rounded-xl px-3 py-1.5">
        {prefix && <span className="text-xs text-white/40">{prefix}</span>}
        <input
          type="number"
          value={value || 0}
          min={min}
          max={max}
          onChange={e => onChange(Number(e.target.value))}
          className="w-16 bg-transparent text-sm text-white text-right focus:outline-none"
        />
        {suffix && <span className="text-xs text-white/40">{suffix}</span>}
      </div>
    </div>
  );
}

function Section({ title, icon: Icon, color, children }: { title: string; icon: React.ElementType; color: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-[#1a1a24] overflow-hidden">
      <div className="px-5 py-4 border-b border-white/5 flex items-center gap-3">
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        <p className="text-sm font-semibold text-white">{title}</p>
      </div>
      <div className="px-5">{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const unsub = listenToSettings((data) => {
      setSettings(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  const set = (key: keyof AppSettings, value: any) => {
    setSettings(prev => prev ? { ...prev, [key]: value } : prev);
    setSaved(false);
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    try {
      await updateSettings(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error("Error saving settings to Firestore:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-white/40 text-sm mt-0.5">Real-time configuration limits and platform switches</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-sm text-white/60 hover:text-white hover:bg-white/10 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
              saved ? "bg-emerald-500 text-white" : "bg-violet-500 hover:bg-violet-600 text-white disabled:opacity-50"
            }`}
          >
            <Save className="w-3.5 h-3.5" />
            {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Maintenance warning */}
      {settings.maintenanceMode && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>Maintenance mode is <strong>ON</strong> — the site is currently inaccessible to users.</span>
        </div>
      )}

      {/* Site info */}
      <Section title="Site Information" icon={Globe} color="bg-violet-500/20">
        <div className="py-3.5 border-b border-white/5">
          <p className="text-sm font-medium text-white mb-1.5">Site Name</p>
          <input
            value={settings.siteName || ""}
            onChange={e => set("siteName", e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[#0f0f14] border border-white/10 text-sm text-white focus:outline-none focus:border-violet-500/40"
          />
        </div>
        <div className="py-3.5">
          <p className="text-sm font-medium text-white mb-1.5">Site Description</p>
          <textarea
            value={settings.siteDescription || ""}
            onChange={e => set("siteDescription", e.target.value)}
            rows={2}
            className="w-full px-3 py-2 rounded-xl bg-[#0f0f14] border border-white/10 text-sm text-white focus:outline-none focus:border-violet-500/40 resize-none"
          />
        </div>
      </Section>

      {/* Auth settings */}
      <Section title="Authentication" icon={Shield} color="bg-sky-500/20">
        <Toggle checked={!!settings.allowSignup} onChange={v => set("allowSignup", v)} label="Allow New Sign-ups" description="If disabled, only existing users can log in" />
        <Toggle checked={!!settings.requireEmailVerification} onChange={v => set("requireEmailVerification", v)} label="Require Email Verification" description="New users must verify their email before accessing the platform" />
      </Section>

      {/* User limits */}
      <Section title="User Limits" icon={Users} color="bg-amber-500/20">
        <NumberInput label="Max Photos per Celebration" description="Maximum photos a user can upload" value={settings.maxPhotosPerCelebration} onChange={v => set("maxPhotosPerCelebration", v)} min={1} max={50} suffix="photos" />
        <NumberInput label="Max Celebrations per User" description="Free tier limit" value={settings.maxCelebrationsPerUser} onChange={v => set("maxCelebrationsPerUser", v)} min={1} max={1000} suffix="items" />
      </Section>

      {/* Billing */}
      <Section title="Billing" icon={DollarSign} color="bg-emerald-500/20">
        <NumberInput label="Premium Plan Price" description="Monthly subscription price in USD" value={settings.premiumPrice} onChange={v => set("premiumPrice", v)} min={1} max={999} prefix="$" suffix="/mo" />
      </Section>

      {/* Platform features */}
      <Section title="Platform Features" icon={BarChart3} color="bg-pink-500/20">
        <Toggle checked={!!settings.analyticsEnabled} onChange={v => set("analyticsEnabled", v)} label="Enable Analytics" description="Collect and display platform usage data" />
        <Toggle checked={!!settings.emailNotifications} onChange={v => set("emailNotifications", v)} label="Email Notifications" description="Send automated emails to users on key events" />
        <Toggle checked={!!settings.maintenanceMode} onChange={v => set("maintenanceMode", v)} label="Maintenance Mode" description="Take the site offline for maintenance — use with caution!" />
      </Section>
    </div>
  );
}
