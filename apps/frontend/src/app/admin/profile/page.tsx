'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { api } from '@/lib/api';
import { AnimatedButton } from '@/components/ui/AnimatedButton';
import { FadeIn } from '@/components/animations/FadeIn';
import { motion } from 'framer-motion';

export default function AdminProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');

  useEffect(() => {
    // Check URL for tab parameter
    const params = new URLSearchParams(window.location.search);
    if (params.get('tab') === 'password') {
      setActiveTab('password');
    }
  }, []);
  
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: '',
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await api.profile.get();
      setProfileData({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        avatar: data.avatar || '',
      });
    } catch (error: any) {
      setError('خطا در بارگذاری اطلاعات پروفایل');
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const result = await api.profile.update({
        name: profileData.name,
        email: profileData.email,
        avatar: profileData.avatar,
      });

      // Update localStorage
      const user = localStorage.getItem('user');
      if (user) {
        const userData = JSON.parse(user);
        userData.name = result.name;
        userData.email = result.email;
        userData.avatar = result.avatar;
        localStorage.setItem('user', JSON.stringify(userData));
      }

      setSuccess('اطلاعات پروفایل با موفقیت به‌روزرسانی شد.');
      setTimeout(() => setSuccess(''), 5000);
    } catch (err: any) {
      setError(err.message || 'خطا در به‌روزرسانی اطلاعات پروفایل');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('رمز عبور جدید و تأیید آن مطابقت ندارند.');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('رمز عبور جدید باید حداقل 6 کاراکتر باشد.');
      return;
    }

    setChangingPassword(true);

    try {
      await api.profile.changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });

      setSuccess('رمز عبور با موفقیت تغییر کرد.');
      setPasswordData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setTimeout(() => setSuccess(''), 5000);
    } catch (err: any) {
      setError(err.message || 'خطا در تغییر رمز عبور');
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600">در حال بارگذاری...</p>
      </div>
    );
  }

  return (
    <div>
      <FadeIn>
        <h1 className="text-4xl font-bold text-primary mb-8">پروفایل و تنظیمات</h1>
      </FadeIn>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'profile'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-600 hover:text-primary'
          }`}
        >
          اطلاعات پروفایل
        </button>
        <button
          onClick={() => setActiveTab('password')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'password'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-600 hover:text-primary'
          }`}
        >
          تغییر رمز عبور
        </button>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700"
        >
          {error}
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700"
        >
          {success}
        </motion.div>
      )}

      {activeTab === 'profile' ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-gray-200 rounded-lg p-8 shadow-lg"
        >
          <h2 className="text-2xl font-bold text-primary mb-6">اطلاعات پروفایل</h2>
          
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-6">
              {profileData.avatar ? (
                <Image
                  src={profileData.avatar}
                  alt="Profile"
                  width={120}
                  height={120}
                  className="w-30 h-30 rounded-full object-cover border-4 border-primary"
                />
              ) : (
                <div className="w-30 h-30 rounded-full bg-primary flex items-center justify-center text-white font-bold text-4xl">
                  {profileData.name.charAt(0).toUpperCase() || 'A'}
                </div>
              )}
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  آدرس تصویر پروفایل
                </label>
                <input
                  type="text"
                  value={profileData.avatar}
                  onChange={(e) => setProfileData({ ...profileData, avatar: e.target.value })}
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نام <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="نام شما"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ایمیل
              </label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="email@example.com"
              />
            </div>

            {/* Phone (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                شماره موبایل
              </label>
              <input
                type="text"
                value={profileData.phone}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
              />
              <p className="text-sm text-gray-500 mt-1">شماره موبایل قابل تغییر نیست</p>
            </div>

            <div className="flex justify-end pt-4">
              <AnimatedButton
                type="submit"
                variant="primary"
                size="lg"
                disabled={saving}
              >
                {saving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
              </AnimatedButton>
            </div>
          </form>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-gray-200 rounded-lg p-8 shadow-lg"
        >
          <h2 className="text-2xl font-bold text-primary mb-6">تغییر رمز عبور</h2>
          
          <form onSubmit={handleChangePassword} className="space-y-6">
            {/* Old Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                رمز عبور فعلی <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={passwordData.oldPassword}
                onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="رمز عبور فعلی خود را وارد کنید"
              />
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                رمز عبور جدید <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                required
                minLength={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="رمز عبور جدید (حداقل 6 کاراکتر)"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                تأیید رمز عبور جدید <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                required
                minLength={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="رمز عبور جدید را دوباره وارد کنید"
              />
            </div>

            <div className="flex justify-end pt-4">
              <AnimatedButton
                type="submit"
                variant="primary"
                size="lg"
                disabled={changingPassword}
              >
                {changingPassword ? 'در حال تغییر...' : 'تغییر رمز عبور'}
              </AnimatedButton>
            </div>
          </form>
        </motion.div>
      )}
    </div>
  );
}

