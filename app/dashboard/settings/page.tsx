'use client';

import { useState } from 'react';
import { Bell, Shield, Globe, Smartphone, Save } from 'lucide-react';

// ── Toggle ────────────────────────────────────────────────────────────────────

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
        checked ? 'bg-[#FCE32D]' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────

function Section({
  icon: Icon,
  title,
  items,
  values,
  onChange,
}: {
  icon: React.ElementType;
  title: string;
  items: { key: string; label: string }[];
  values: Record<string, boolean>;
  onChange: (key: string, val: boolean) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2.5 text-gray-500">
        <Icon className="w-4 h-4" />
        <span className="text-sm font-semibold text-gray-800">{title}</span>
      </div>
      <div className="space-y-3 pl-1">
        {items.map(({ key, label }) => (
          <div key={key} className="flex items-center justify-between">
            <span className="text-sm text-[#3b5bdb]">{label}</span>
            <Toggle checked={!!values[key]} onChange={(v) => onChange(key, v)} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Tabs ──────────────────────────────────────────────────────────────────────

const TABS = [
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'privacy',       label: 'Privacy',        icon: Shield },
  { id: 'preferences',   label: 'Preferences',    icon: Globe },
  { id: 'account',       label: 'Account',        icon: Smartphone },
] as const;

type TabId = typeof TABS[number]['id'];

// ── Default state ─────────────────────────────────────────────────────────────

const DEFAULT_NOTIFICATIONS = {
  email_order_updates: true,
  email_promotions: false,
  email_review_reminders: true,
  email_newsletter: false,
  push_order_status: true,
  push_flash_sales: false,
  push_review_requests: true,
  sms_critical_updates: false,
  sms_deals: false,
};

const DEFAULT_PRIVACY = {
  profile_visible: true,
  share_purchase_history: false,
  personalised_ads: true,
  analytics_tracking: true,
};

const DEFAULT_PREFERENCES = {
  dark_mode: false,
  compact_view: false,
  show_prices_incl_tax: true,
  language_auto_detect: true,
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('notifications');
  const [notifications, setNotifications] = useState(DEFAULT_NOTIFICATIONS);
  const [privacy, setPrivacy] = useState(DEFAULT_PRIVACY);
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function notifChange(key: string, val: boolean) {
    setNotifications((s) => ({ ...s, [key]: val }));
  }
  function privacyChange(key: string, val: boolean) {
    setPrivacy((s) => ({ ...s, [key]: val }));
  }
  function prefChange(key: string, val: boolean) {
    setPreferences((s) => ({ ...s, [key]: val }));
  }

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-gray-900">Settings</h2>
        <p className="text-xs text-gray-400 mt-0.5">Manage your account preferences and privacy settings</p>
      </div>

      <div className="flex gap-5">
        {/* Sidebar tabs */}
        <div className="w-48 flex-shrink-0">
          <div className="bg-white rounded-xl border border-gray-200 p-2 space-y-0.5 shadow-sm">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 text-left ${
                  activeTab === id
                    ? 'bg-[#FCE32D] text-black shadow-md'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${activeTab === id ? 'text-black' : 'text-gray-400'}`} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Content panel */}
        <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col gap-6">

          {activeTab === 'notifications' && (
            <>
              <h3 className="text-base font-bold text-gray-900">Notification Preferences</h3>
              <div className="border-t border-gray-100" />

              <Section
                icon={Bell}
                title="Email Notifications"
                items={[
                  { key: 'email_order_updates',    label: 'Order updates and shipping notifications' },
                  { key: 'email_promotions',        label: 'Promotional offers and discounts' },
                  { key: 'email_review_reminders',  label: 'Review reminders and responses' },
                  { key: 'email_newsletter',        label: 'Weekly newsletter and product updates' },
                ]}
                values={notifications}
                onChange={notifChange}
              />

              <div className="border-t border-gray-100" />

              <Section
                icon={Smartphone}
                title="Push Notifications"
                items={[
                  { key: 'push_order_status',    label: 'Order status updates' },
                  { key: 'push_flash_sales',     label: 'Flash sales and limited offers' },
                  { key: 'push_review_requests', label: 'Review requests and responses' },
                ]}
                values={notifications}
                onChange={notifChange}
              />

              <div className="border-t border-gray-100" />

              <Section
                icon={Smartphone}
                title="SMS Notifications"
                items={[
                  { key: 'sms_critical_updates', label: 'Critical order updates only' },
                  { key: 'sms_deals',            label: 'Exclusive SMS-only deals' },
                ]}
                values={notifications}
                onChange={notifChange}
              />
            </>
          )}

          {activeTab === 'privacy' && (
            <>
              <h3 className="text-base font-bold text-gray-900">Privacy Settings</h3>
              <div className="border-t border-gray-100" />
              <Section
                icon={Shield}
                title="Visibility & Data"
                items={[
                  { key: 'profile_visible',        label: 'Make profile visible to other users' },
                  { key: 'share_purchase_history',  label: 'Share purchase history for recommendations' },
                  { key: 'personalised_ads',        label: 'Allow personalised advertisements' },
                  { key: 'analytics_tracking',      label: 'Allow analytics and usage tracking' },
                ]}
                values={privacy}
                onChange={privacyChange}
              />
            </>
          )}

          {activeTab === 'preferences' && (
            <>
              <h3 className="text-base font-bold text-gray-900">App Preferences</h3>
              <div className="border-t border-gray-100" />
              <Section
                icon={Globe}
                title="Display & Behaviour"
                items={[
                  { key: 'dark_mode',             label: 'Dark mode' },
                  { key: 'compact_view',          label: 'Compact product listing view' },
                  { key: 'show_prices_incl_tax',  label: 'Show prices including tax' },
                  { key: 'language_auto_detect',  label: 'Auto-detect language from browser' },
                ]}
                values={preferences}
                onChange={prefChange}
              />
            </>
          )}

          {activeTab === 'account' && (
            <>
              <h3 className="text-base font-bold text-gray-900">Account</h3>
              <div className="border-t border-gray-100" />
              <div className="space-y-4">
                <div className="rounded-lg border border-red-100 bg-red-50 p-4 space-y-2">
                  <p className="text-sm font-semibold text-red-700">Delete Account</p>
                  <p className="text-xs text-red-500">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                  <button className="mt-1 px-4 py-2 text-xs font-medium text-red-600 border border-red-200 bg-white rounded-lg hover:bg-red-50 transition-colors">
                    Delete My Account
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Footer save button — hidden on account tab */}
          {activeTab !== 'account' && (
            <>
              <div className="border-t border-gray-100 mt-auto" />
              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-black bg-[#FCE32D] hover:bg-[#e6cc28] rounded-lg transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {saved ? 'Saved!' : 'Save Settings'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
