'use client';

import { useState, useEffect, FormEvent } from 'react';
import { User, Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '@/lib/context/AuthContext';
import authService from '@/lib/services/authService';
import type { UpdateProfilePayload } from '@/lib/types';

export default function ProfilePage() {
  const { user, checkAuth } = useAuth();

  // ── Profile form ──────────────────────────────────────────────────────────
  const [profile, setProfile] = useState<UpdateProfilePayload>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    gender: undefined,
    date_of_birth: '',
  });
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    if (user) {
      setProfile({
        first_name: user.first_name ?? '',
        last_name: user.last_name ?? '',
        email: user.email ?? '',
        phone: user.phone ?? '',
        gender: user.gender ?? undefined,
        date_of_birth: user.date_of_birth ? user.date_of_birth.slice(0, 10) : '',
      });
    }
  }, [user]);

  async function handleProfileSubmit(e: FormEvent) {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await authService.updateProfile(profile);
      await checkAuth();
      toast.success('Profile updated successfully.');
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Failed to update profile.');
    } finally {
      setSavingProfile(false);
    }
  }

  // ── Password form ─────────────────────────────────────────────────────────
  const [passwords, setPasswords] = useState({
    current_password: '',
    password: '',
    password_confirmation: '',
  });
  const [showPw, setShowPw] = useState({ current: false, next: false, confirm: false });
  const [savingPassword, setSavingPassword] = useState(false);

  async function handlePasswordSubmit(e: FormEvent) {
    e.preventDefault();
    if (passwords.password !== passwords.password_confirmation) {
      toast.error('New passwords do not match.');
      return;
    }
    setSavingPassword(true);
    try {
      await authService.changePassword(passwords);
      setPasswords({ current_password: '', password: '', password_confirmation: '' });
      toast.success('Password changed successfully.');
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Failed to change password.');
    } finally {
      setSavingPassword(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-sm font-semibold text-gray-900">Profile</h2>
        <p className="text-xs text-gray-400 mt-0.5">Manage your personal information</p>
      </div>

      {/* Profile card */}
      <form onSubmit={handleProfileSubmit} className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#FCE32D] flex items-center justify-center shrink-0">
            {user?.avatar ? (
              <img src={user.avatar} alt="avatar" className="w-14 h-14 rounded-full object-cover" />
            ) : (
              <User className="w-6 h-6 text-black" />
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{user?.full_name || `${user?.first_name ?? ''} ${user?.last_name ?? ''}`.trim() || '—'}</p>
            <p className="text-xs text-gray-400">{user?.email}</p>
          </div>
        </div>

        <div className="border-t border-gray-100" />

        {/* Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {([
            { key: 'first_name', label: 'First Name', type: 'text' },
            { key: 'last_name',  label: 'Last Name',  type: 'text' },
            { key: 'email',      label: 'Email',      type: 'email' },
            { key: 'phone',      label: 'Phone',      type: 'tel' },
          ] as { key: keyof UpdateProfilePayload; label: string; type: string }[]).map(({ key, label, type }) => (
            <div key={key}>
              <label className="block text-xs text-gray-400 mb-1">{label}</label>
              <input
                type={type}
                value={(profile[key] as string) ?? ''}
                onChange={(e) => setProfile((p) => ({ ...p, [key]: e.target.value }))}
                placeholder={`Enter ${label.toLowerCase()}`}
                className="w-full px-3 py-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-gray-200 placeholder:text-gray-300"
              />
            </div>
          ))}

          {/* Gender */}
          <div>
            <label className="block text-xs text-gray-400 mb-1">Gender</label>
            <select
              value={profile.gender ?? ''}
              onChange={(e) => setProfile((p) => ({ ...p, gender: (e.target.value as UpdateProfilePayload['gender']) || undefined }))}
              className="w-full px-3 py-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-gray-200"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-xs text-gray-400 mb-1">Date of Birth</label>
            <input
              type="date"
              value={profile.date_of_birth ?? ''}
              onChange={(e) => setProfile((p) => ({ ...p, date_of_birth: e.target.value }))}
              className="w-full px-3 py-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-gray-200"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={savingProfile}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-black bg-[#FCE32D] rounded-lg hover:bg-[#e6cc28] transition-colors disabled:opacity-60"
          >
            {savingProfile && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            Save Changes
          </button>
        </div>
      </form>

      {/* Change password card */}
      <form onSubmit={handlePasswordSubmit} className="bg-white rounded-xl border border-gray-100 p-6 space-y-5">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Change Password</h3>
          <p className="text-xs text-gray-400 mt-0.5">Leave blank to keep your current password</p>
        </div>

        <div className="border-t border-gray-100" />

        <div className="space-y-4">
          {([
            { key: 'current_password', label: 'Current Password', vis: 'current' as const },
            { key: 'password',         label: 'New Password',     vis: 'next'    as const },
            { key: 'password_confirmation', label: 'Confirm New Password', vis: 'confirm' as const },
          ]).map(({ key, label, vis }) => (
            <div key={key}>
              <label className="block text-xs text-gray-400 mb-1">{label}</label>
              <div className="relative">
                <input
                  type={showPw[vis] ? 'text' : 'password'}
                  value={passwords[key as keyof typeof passwords]}
                  onChange={(e) => setPasswords((p) => ({ ...p, [key]: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full px-3 py-2.5 pr-10 text-sm text-gray-900 bg-gray-50 border border-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-gray-200 placeholder:text-gray-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => ({ ...s, [vis]: !s[vis] }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPw[vis] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={savingPassword || !passwords.current_password || !passwords.password}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-black bg-[#FCE32D] rounded-lg hover:bg-[#e6cc28] transition-colors disabled:opacity-60"
          >
            {savingPassword && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            Update Password
          </button>
        </div>
      </form>
    </div>
  );
}
