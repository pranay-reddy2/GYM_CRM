import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Building2, Phone, Mail, MapPin, Image,
  Database, ShieldAlert, Bell, Palette,
  Globe, Lock, ChevronRight, Check,
  ToggleLeft, ToggleRight, Save, Zap,
  Users, CreditCard, Download, Trash2,
  RefreshCw, Eye, EyeOff, Info
} from "lucide-react";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const Toggle = ({ enabled, onToggle }) => (
  <button
    onClick={onToggle}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
      enabled ? "bg-teal-500" : "bg-gray-200"
    }`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
        enabled ? "translate-x-6" : "translate-x-1"
      }`}
    />
  </button>
);

const SectionHeader = ({ icon: Icon, title, description }) => (
  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
    <div className="w-9 h-9 rounded-xl bg-gray-900 flex items-center justify-center">
      <Icon size={17} className="text-white" />
    </div>
    <div>
      <h2 className="font-semibold text-gray-900 text-sm">{title}</h2>
      {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
    </div>
  </div>
);

const SettingRow = ({ label, description, children, danger }) => (
  <div className={`flex items-center justify-between py-3.5 border-b border-gray-50 last:border-0 ${danger ? "opacity-80" : ""}`}>
    <div className="flex-1 mr-4">
      <p className={`text-sm font-medium ${danger ? "text-red-600" : "text-gray-800"}`}>{label}</p>
      {description && <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{description}</p>}
    </div>
    <div className="flex-shrink-0">{children}</div>
  </div>
);

const NavItem = ({ icon: Icon, label, active, onClick, badge }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
      active
        ? "bg-gray-900 text-white"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
    }`}
  >
    <Icon size={16} />
    <span className="font-medium">{label}</span>
    {badge && (
      <span className="ml-auto text-xs bg-teal-500 text-white px-1.5 py-0.5 rounded-full">{badge}</span>
    )}
    {!badge && <ChevronRight size={14} className={`ml-auto opacity-40 ${active ? "opacity-60" : ""}`} />}
  </button>
);

export default function Settings() {
  const [activeSection, setActiveSection] = useState("gym");
  const [saved, setSaved] = useState(false);

  const [gymForm, setGymForm] = useState({
    gym_name: "", phone: "", email: "", address: "", logo_url: "",
  });

  const [notifications, setNotifications] = useState({
    checkin_alerts: true,
    at_risk_alerts: true,
    payment_reminders: false,
    weekly_report: true,
    lead_updates: false,
  });

  const [appearance, setAppearance] = useState({
    compact_mode: false,
    show_avatars: true,
    animations: true,
  });

  const { data: settings, isLoading, refetch } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/settings`);
      if (!res.ok) throw new Error("Failed to fetch settings");
      return res.json();
    },
  });

  useEffect(() => {
    if (settings) {
      setGymForm({
        gym_name: settings.gym_name || "",
        phone: settings.phone || "",
        email: settings.email || "",
        address: settings.address || "",
        logo_url: settings.logo_url || "",
      });
    }
  }, [settings]);

  const handleSave = async () => {
    try {
      await fetch(`${API_URL}/api/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(gymForm),
      });
      await refetch();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const navSections = [
    { id: "gym", icon: Building2, label: "Gym Profile" },
    { id: "notifications", icon: Bell, label: "Notifications" },
    { id: "appearance", icon: Palette, label: "Appearance" },
    { id: "data", icon: Database, label: "Data & Export" },
    { id: "danger", icon: ShieldAlert, label: "Danger Zone" },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Settings</h1>
          <p className="text-sm text-gray-400 mt-1">Manage your gym CRM preferences and configuration</p>
        </div>

        <div className="flex gap-6">

          {/* Sidebar Nav */}
          <div className="w-52 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-2 sticky top-6">
              <div className="space-y-0.5">
                {navSections.map((s) => (
                  <NavItem
                    key={s.id}
                    icon={s.icon}
                    label={s.label}
                    active={activeSection === s.id}
                    onClick={() => setActiveSection(s.id)}
                    badge={s.badge}
                  />
                ))}
              </div>

              {/* Status */}
              <div className="mt-4 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2 px-3 py-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs text-gray-400">System Online</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">

            {/* GYM PROFILE */}
            {activeSection === "gym" && (
              <div className="space-y-4">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <SectionHeader icon={Building2} title="Gym Identity" description="Basic information displayed across the CRM" />

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Gym Name</label>
                      <input
                        type="text"
                        value={gymForm.gym_name}
                        onChange={e => setGymForm({ ...gymForm, gym_name: e.target.value })}
                        placeholder="e.g. Iron Peak Fitness"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Phone</label>
                        <input
                          type="text"
                          value={gymForm.phone}
                          onChange={e => setGymForm({ ...gymForm, phone: e.target.value })}
                          placeholder="+91 98765 43210"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Email</label>
                        <input
                          type="email"
                          value={gymForm.email}
                          onChange={e => setGymForm({ ...gymForm, email: e.target.value })}
                          placeholder="hello@gym.com"
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Address</label>
                      <textarea
                        rows={2}
                        value={gymForm.address}
                        onChange={e => setGymForm({ ...gymForm, address: e.target.value })}
                        placeholder="123 Fitness Street, Mumbai 400001"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent resize-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Logo URL</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={gymForm.logo_url}
                          onChange={e => setGymForm({ ...gymForm, logo_url: e.target.value })}
                          placeholder="https://..."
                          className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                        />
                        {gymForm.logo_url && (
                          <div className="w-10 h-10 rounded-xl border border-gray-200 overflow-hidden flex-shrink-0">
                            <img src={gymForm.logo_url} alt="logo" className="w-full h-full object-cover" onError={e => e.target.style.display='none'} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-400">Changes are saved to your database</p>
                    <button
                      onClick={handleSave}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                        saved
                          ? "bg-green-500 text-white"
                          : "bg-gray-900 hover:bg-gray-700 text-white"
                      }`}
                    >
                      {saved ? <Check size={15} /> : <Save size={15} />}
                      {saved ? "Saved!" : "Save Changes"}
                    </button>
                  </div>
                </div>

                {/* Live Preview Card */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <SectionHeader icon={Eye} title="Receipt Preview" description="How your gym appears on WhatsApp bills" />
                  <div className="bg-gray-900 rounded-xl p-4 font-mono text-xs text-green-400 leading-relaxed">
                    <p>🏋️ <span className="text-white font-bold">{gymForm.gym_name?.toUpperCase() || "YOUR GYM"}</span></p>
                    <p className="text-gray-500">━━━━━━━━━━━━━━━</p>
                    <p>📄 PAYMENT RECEIPT</p>
                    <p className="text-gray-500">━━━━━━━━━━━━━━━</p>
                    <p>📞 {gymForm.phone || "Phone not set"}</p>
                    <p>✉️  {gymForm.email || "Email not set"}</p>
                    <p>📍 {gymForm.address || "Address not set"}</p>
                  </div>
                </div>
              </div>
            )}

            {/* NOTIFICATIONS */}
            {activeSection === "notifications" && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <SectionHeader icon={Bell} title="Notification Preferences" description="Choose what alerts matter to you" />

                <div className="space-y-0">
                  <SettingRow
                    label="Check-in Alerts"
                    description="Get notified when members check in or out"
                  >
                    <Toggle enabled={notifications.checkin_alerts} onToggle={() => setNotifications(p => ({ ...p, checkin_alerts: !p.checkin_alerts }))} />
                  </SettingRow>
                  <SettingRow
                    label="At-Risk Member Alerts"
                    description="Alert when members haven't visited in 10+ days"
                  >
                    <Toggle enabled={notifications.at_risk_alerts} onToggle={() => setNotifications(p => ({ ...p, at_risk_alerts: !p.at_risk_alerts }))} />
                  </SettingRow>
                  <SettingRow
                    label="Payment Reminders"
                    description="Notify when member payments are overdue"
                  >
                    <Toggle enabled={notifications.payment_reminders} onToggle={() => setNotifications(p => ({ ...p, payment_reminders: !p.payment_reminders }))} />
                  </SettingRow>
                  <SettingRow
                    label="Weekly Summary Report"
                    description="Receive a weekly digest of gym performance"
                  >
                    <Toggle enabled={notifications.weekly_report} onToggle={() => setNotifications(p => ({ ...p, weekly_report: !p.weekly_report }))} />
                  </SettingRow>
                  <SettingRow
                    label="Lead Pipeline Updates"
                    description="Alert when leads change stages"
                  >
                    <Toggle enabled={notifications.lead_updates} onToggle={() => setNotifications(p => ({ ...p, lead_updates: !p.lead_updates }))} />
                  </SettingRow>
                </div>

                <div className="mt-4 p-3 bg-blue-50 rounded-xl flex gap-2">
                  <Info size={14} className="text-blue-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-600">Notification delivery coming in a future update. Settings are saved for when the feature launches.</p>
                </div>
              </div>
            )}

            {/* APPEARANCE */}
            {activeSection === "appearance" && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <SectionHeader icon={Palette} title="Appearance" description="Customize how the CRM looks and feels" />

                <SettingRow label="Compact Mode" description="Reduce spacing for a denser layout">
                  <Toggle enabled={appearance.compact_mode} onToggle={() => setAppearance(p => ({ ...p, compact_mode: !p.compact_mode }))} />
                </SettingRow>
                <SettingRow label="Show Member Avatars" description="Display initials avatars in lists">
                  <Toggle enabled={appearance.show_avatars} onToggle={() => setAppearance(p => ({ ...p, show_avatars: !p.show_avatars }))} />
                </SettingRow>
                <SettingRow label="UI Animations" description="Enable smooth transitions and animations">
                  <Toggle enabled={appearance.animations} onToggle={() => setAppearance(p => ({ ...p, animations: !p.animations }))} />
                </SettingRow>

                <div className="mt-6 pt-4 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Accent Color</p>
                  <div className="flex gap-2">
                    {["bg-teal-500","bg-blue-500","bg-violet-500","bg-orange-500","bg-pink-500","bg-gray-900"].map(c => (
                      <button key={c} className={`w-7 h-7 rounded-full ${c} ring-2 ring-offset-2 ring-transparent hover:ring-gray-300 transition-all`} />
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Theme customization coming soon</p>
                </div>
              </div>
            )}

            {/* DATA & EXPORT */}
            {activeSection === "data" && (
              <div className="space-y-4">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <SectionHeader icon={Download} title="Export Data" description="Download your CRM data as CSV" />
                  <div className="space-y-2">
                    {[
                      { label: "Export Members", desc: "All member profiles and details", icon: Users },
                      { label: "Export Leads", desc: "Pipeline leads and stages", icon: Zap },
                      { label: "Export Payments", desc: "Complete payment history", icon: CreditCard },
                    ].map(({ label, desc, icon: Icon }) => (
                      <button
                        key={label}
                        className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-gray-300 hover:bg-gray-50 transition group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-gray-200 flex items-center justify-center transition">
                            <Icon size={15} className="text-gray-600" />
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-medium text-gray-800">{label}</p>
                            <p className="text-xs text-gray-400">{desc}</p>
                          </div>
                        </div>
                        <Download size={15} className="text-gray-400 group-hover:text-gray-700 transition" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <SectionHeader icon={RefreshCw} title="System Preferences" description="Upcoming automation features" />
                  <SettingRow label="Auto WhatsApp Receipts" description="Automatically send payment receipts via WhatsApp">
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium">Soon</span>
                  </SettingRow>
                  <SettingRow label="Membership Expiry Rules" description="Auto-update member status on expiry">
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium">Soon</span>
                  </SettingRow>
                  <SettingRow label="Auto Churn Detection" description="AI-powered member risk scoring">
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">Planned</span>
                  </SettingRow>
                </div>
              </div>
            )}

            {/* DANGER ZONE */}
            {activeSection === "danger" && (
              <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-6">
                <SectionHeader icon={ShieldAlert} title="Danger Zone" description="Irreversible actions — proceed with caution" />

                <div className="space-y-3">
                  {[
                    { label: "Clear All Check-ins", desc: "Removes all today's check-in records permanently", btn: "Clear" },
                    { label: "Reset Lead Pipeline", desc: "Deletes all leads from all stages", btn: "Reset" },
                    { label: "Factory Reset CRM", desc: "Wipes all data including members, payments, and settings", btn: "Reset All" },
                  ].map(({ label, desc, btn }) => (
                    <div key={label} className="flex items-center justify-between p-4 rounded-xl border border-red-100 bg-red-50">
                      <div>
                        <p className="text-sm font-semibold text-red-700">{label}</p>
                        <p className="text-xs text-red-400 mt-0.5">{desc}</p>
                      </div>
                      <button
                        disabled
                        className="text-xs bg-red-100 text-red-400 border border-red-200 px-3 py-1.5 rounded-lg cursor-not-allowed"
                      >
                        {btn}
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-3 bg-red-50 rounded-xl border border-red-100 flex gap-2">
                  <ShieldAlert size={14} className="text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-red-500">Destructive actions are disabled in this version. They will require confirmation and a cooldown period when enabled.</p>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}