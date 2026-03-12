'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const useRouterInstance = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: 'Password updated successfully' });
      setNewPassword('');
      setConfirmPassword('');
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    useRouterInstance.push('/login');
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <div className="max-w-2xl mx-auto pt-10">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-bold uppercase tracking-widest">ACCOUNT SETTINGS</h1>
          <button 
            onClick={handleLogout}
            className="text-xs uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
          >
            LOGOUT
          </button>
        </div>

        <div className="bg-[#0D0D0D] border border-white/10 p-8 mb-8">
          <div className="mb-8">
            <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">Email</label>
            <p className="text-xl font-mono">{user?.email}</p>
          </div>

          <form onSubmit={handleUpdatePassword} className="space-y-6">
            <h2 className="text-xl font-bold uppercase tracking-widest mb-4">Change Password</h2>
            
            <div>
              <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full bg-black border border-white/10 px-4 py-3 text-white focus:border-white outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full bg-black border border-white/10 px-4 py-3 text-white focus:border-white outline-none transition-colors"
              />
            </div>

            {message && (
              <p className={`text-xs uppercase tracking-widest ${message.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                {message.text}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-white text-black font-bold uppercase tracking-widest px-8 py-3 hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              {loading ? 'UPDATING...' : 'UPDATE PASSWORD'}
            </button>
          </form>
        </div>

        <a href="/admin" className="text-xs uppercase tracking-widest text-gray-500 hover:text-white transition-colors">
          ← BACK TO ADMIN DASHBOARD
        </a>
      </div>
    </main>
  );
}
