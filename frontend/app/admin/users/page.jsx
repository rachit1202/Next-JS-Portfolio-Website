'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import {
  Users,
  UserPlus,
  Key,
  Shield,
  Trash2,
  Edit2,
  X,
  Loader2,
  Search,
  CheckCircle2,
  AlertCircle,
  Mail,
  UserCheck,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import { api } from '@/lib/api';

export default function AdminUsersPage() {
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  // Change Password state (Self)
  const [pwdCurrent, setPwdCurrent] = useState('');
  const [pwdNew, setPwdNew] = useState('');
  const [pwdConfirm, setPwdConfirm] = useState('');
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdSuccess, setPwdSuccess] = useState(null);
  const [pwdError, setPwdError] = useState(null);
  const [showPwdCurrent, setShowPwdCurrent] = useState(false);
  const [showPwdNew, setShowPwdNew] = useState(false);
  const [showPwdConfirm, setShowPwdConfirm] = useState(false);
  const [showDrawerPwd, setShowDrawerPwd] = useState(false);

  // Create / Edit User Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    role: 'admin'
  });
  const [submitting, setSubmitting] = useState(false);
  const [drawerError, setDrawerError] = useState(null);

  // Admin Direct Reset Password Modal state
  const [resetModalUser, setResetModalUser] = useState(null);
  const [adminNewPassword, setAdminNewPassword] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMsg, setResetMsg] = useState(null);
  const [showAdminNewPwd, setShowAdminNewPwd] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('rachit_admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    loadData();
  }, [router]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [meRes, usersRes] = await Promise.all([
        api.getMe().catch(() => ({ success: true, user: { name: 'Rachit Aggarwal', email: 'rachitaggarwal1202@gmail.com', username: 'admin', role: 'admin' } })),
        api.getUsers().catch(() => ({ success: true, data: [] }))
      ]);

      if (meRes.user) {
        if (meRes.user.role === 'editor') {
          router.push('/admin/dashboard');
          return;
        }
        setCurrentUser(meRes.user);
      }
      if (usersRes.data) setUsers(usersRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Self Password Change Handler
  const handleSelfPasswordChange = async (e) => {
    e.preventDefault();
    setPwdSuccess(null);
    setPwdError(null);

    if (pwdNew !== pwdConfirm) {
      setPwdError('New passwords do not match.');
      return;
    }
    if (pwdNew.length < 6) {
      setPwdError('New password must be at least 6 characters.');
      return;
    }

    setPwdLoading(true);
    try {
      const res = await api.changePassword({
        currentPassword: pwdCurrent,
        newPassword: pwdNew
      });
      if (res.success) {
        setPwdSuccess('✅ Password updated successfully! Your new password is now active.');
        setPwdCurrent('');
        setPwdNew('');
        setPwdConfirm('');
        setTimeout(() => setPwdSuccess(null), 15000);
      } else {
        setPwdError(res.message || 'Failed to change password');
      }
    } catch (err) {
      setPwdError(err.message || 'Failed to update password');
    } finally {
      setPwdLoading(false);
    }
  };

  // Open Create User Drawer
  const openCreateDrawer = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      username: '',
      email: '',
      password: '',
      role: 'admin'
    });
    setDrawerError(null);
    setDrawerOpen(true);
  };

  // Open Edit User Drawer
  const openEditDrawer = (u) => {
    setEditingUser(u);
    setFormData({
      name: u.name || '',
      username: u.username || '',
      email: u.email || '',
      password: '',
      role: u.role || 'editor'
    });
    setDrawerError(null);
    setDrawerOpen(true);
  };

  // Save User (Create or Update)
  const handleSaveUser = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setDrawerError(null);

    try {
      if (editingUser) {
        await api.updateUser(editingUser._id, {
          name: formData.name,
          username: formData.username,
          email: formData.email,
          role: formData.role
        });
      } else {
        if (!formData.password || formData.password.length < 6) {
          throw new Error('Initial password must be at least 6 characters.');
        }
        await api.createUser(formData);
      }
      setDrawerOpen(false);
      loadData();
    } catch (err) {
      setDrawerError(err.message || 'Error saving user details.');
    } finally {
      setSubmitting(false);
    }
  };

  // Admin Direct Password Reset
  const handleDirectPasswordReset = async (e) => {
    e.preventDefault();
    if (!adminNewPassword || adminNewPassword.length < 6) {
      setResetMsg({ ok: false, text: 'Password must be at least 6 characters.' });
      return;
    }

    setResetLoading(true);
    setResetMsg(null);
    try {
      const res = await api.resetUserPassword(resetModalUser._id, adminNewPassword);
      if (res.success) {
        setResetMsg({ ok: true, text: `Password reset successfully for ${resetModalUser.name || resetModalUser.username}!` });
        setTimeout(() => {
          setResetModalUser(null);
          setAdminNewPassword('');
          setResetMsg(null);
        }, 2000);
      } else {
        setResetMsg({ ok: false, text: res.message || 'Error resetting password' });
      }
    } catch (err) {
      setResetMsg({ ok: false, text: err.message || 'Error resetting password' });
    } finally {
      setResetLoading(false);
    }
  };

  // Delete User
  const handleDeleteUser = async (u) => {
    if (currentUser && (u._id === currentUser.id || u.username === currentUser.username)) {
      alert('You cannot delete your own active administrator account.');
      return;
    }

    if (!confirm(`Are you sure you want to delete user account "${u.name || u.username}"?`)) return;

    try {
      await api.deleteUser(u._id);
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to delete user.');
    }
  };

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    const q = searchTerm.toLowerCase().trim();
    const matchRole = roleFilter === 'All' || u.role === roleFilter;
    const matchSearch =
      !q ||
      u.name?.toLowerCase().includes(q) ||
      u.username?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.role?.toLowerCase().includes(q);
    return matchRole && matchSearch;
  });

  return (
    <div className="flex min-h-screen bg-[#07080f] text-slate-100">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-8 space-y-6 overflow-y-auto w-full">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Users className="w-6 h-6 text-purple-400" /> Users &amp; Team Management
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Manage team administrators, view emails, update credentials, and reset account passwords
            </p>
          </div>
          <button
            onClick={openCreateDrawer}
            className="btn-primary px-4 py-2.5 text-xs flex items-center gap-2 cursor-pointer shrink-0"
          >
            <UserPlus className="w-4 h-4" /> Add New User
          </button>
        </div>

        {/* 2-Column Split: Active Profile & Change Password */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Card 1: My Profile Info */}
          <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-400" /> Active Session
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold">
                Logged In
              </span>
            </div>

            <div className="flex items-center gap-4 pt-1">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white text-xl font-bold border-2 border-purple-500/40 shadow-lg shadow-purple-500/25">
                {(currentUser?.name || currentUser?.username || 'A')[0].toUpperCase()}
              </div>
              <div className="space-y-1 overflow-hidden">
                <h3 className="text-base font-bold text-white truncate">{currentUser?.name || 'Rachit Aggarwal'}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30 font-bold uppercase">
                    {currentUser?.role || 'admin'}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">@{currentUser?.username || 'admin'}</span>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>Email Address:</span>
                <strong className="text-cyan-400 font-mono break-all">{currentUser?.email || 'aggarwalrachit1202@gmail.com'}</strong>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Access Level:</span>
                <span className="text-slate-200 font-medium">Full Super-Administrator</span>
              </div>
            </div>
          </div>

          {/* Card 2: Change My Password */}
          <div className="lg:col-span-2 glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Key className="w-4 h-4 text-purple-400" /> Update My Password
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Change your active administrator login password securely
              </p>
            </div>

            {pwdSuccess && (
              <div className="flex items-center justify-between gap-2 p-3.5 rounded-2xl bg-emerald-500/20 border-2 border-emerald-500/50 text-emerald-200 text-xs shadow-lg shadow-emerald-950/40">
                <div className="flex items-center gap-2.5 font-semibold">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>{pwdSuccess}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setPwdSuccess(null)}
                  className="p-1 rounded-lg text-emerald-400 hover:text-white hover:bg-emerald-500/30 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {pwdError && (
              <div className="flex items-center justify-between gap-2 p-3.5 rounded-2xl bg-rose-500/20 border-2 border-rose-500/50 text-rose-200 text-xs shadow-lg shadow-rose-950/40">
                <div className="flex items-center gap-2.5 font-semibold">
                  <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  <span>{pwdError}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setPwdError(null)}
                  className="p-1 rounded-lg text-rose-400 hover:text-white hover:bg-rose-500/30 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <form onSubmit={handleSelfPasswordChange} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Current Password</label>
                  <div className="relative">
                    <input
                      type={showPwdCurrent ? 'text' : 'password'}
                      required
                      value={pwdCurrent}
                      onChange={(e) => setPwdCurrent(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-3.5 pr-8 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-purple-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwdCurrent(!showPwdCurrent)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                      title={showPwdCurrent ? 'Hide password' : 'Show password'}
                    >
                      {showPwdCurrent ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">New Password (Min 6)</label>
                  <div className="relative">
                    <input
                      type={showPwdNew ? 'text' : 'password'}
                      required
                      value={pwdNew}
                      onChange={(e) => setPwdNew(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-3.5 pr-8 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-purple-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwdNew(!showPwdNew)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                      title={showPwdNew ? 'Hide password' : 'Show password'}
                    >
                      {showPwdNew ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showPwdConfirm ? 'text' : 'password'}
                      required
                      value={pwdConfirm}
                      onChange={(e) => setPwdConfirm(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-3.5 pr-8 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-purple-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwdConfirm(!showPwdConfirm)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                      title={showPwdConfirm ? 'Hide password' : 'Show password'}
                    >
                      {showPwdConfirm ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={pwdLoading}
                  className={`px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50 ${
                    pwdSuccess
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30'
                      : 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30'
                  }`}
                >
                  {pwdLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
                    </>
                  ) : pwdSuccess ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" /> Password Updated!
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" /> Save New Password
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* Search & Role Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 glass-card p-3 rounded-2xl border border-slate-800">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search users by name, username, email, or role..."
              className="w-full pl-10 pr-9 py-2 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-400 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {['All', 'admin', 'editor'].map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer capitalize ${
                  roleFilter === r
                    ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {r === 'admin' ? 'Administrators' : r === 'editor' ? 'Editors' : 'All Roles'}
              </button>
            ))}
          </div>
        </div>

        {/* All Users Table */}
        <div className="glass-card rounded-3xl overflow-hidden border border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-4">User Account ({filteredUsers.length})</th>
                  <th className="p-4">Email Address</th>
                  <th className="p-4">Role &amp; Permissions</th>
                  <th className="p-4">Created Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500 text-xs">
                      No user accounts found matching &ldquo;{searchTerm}&rdquo;
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u._id || u.username} className="hover:bg-slate-900/50 transition-colors">
                      <td className="p-4 font-semibold text-white">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-300 font-bold shrink-0">
                            {(u.name || u.username || 'U')[0].toUpperCase()}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-white flex items-center gap-2">
                              {u.name || u.username}
                              {currentUser && (u._id === currentUser.id || u.username === currentUser.username) && (
                                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.2 rounded font-mono">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-slate-400 font-mono">@{u.username}</div>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 font-mono text-cyan-400">
                        <a href={`mailto:${u.email}`} className="hover:underline flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          {u.email}
                        </a>
                      </td>

                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${
                          u.role === 'admin'
                            ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                            : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                        }`}>
                          <Shield className="w-2.5 h-2.5 inline mr-1" />
                          {u.role || 'admin'}
                        </span>
                      </td>

                      <td className="p-4 font-mono text-slate-400 text-[11px]">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' }) : 'Initial Seed'}
                      </td>

                      <td className="p-4 text-right space-x-2">
                        {/* Direct Reset Password */}
                        <button
                          onClick={() => {
                            setResetModalUser(u);
                            setAdminNewPassword('');
                            setResetMsg(null);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-xs font-medium text-amber-400 border border-amber-500/20 cursor-pointer transition-colors"
                          title="Reset Password directly"
                        >
                          <Key className="w-3 h-3 inline mr-1" /> Reset Pwd
                        </button>

                        {/* Edit User Details */}
                        <button
                          onClick={() => openEditDrawer(u)}
                          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-medium text-slate-200 border border-slate-800 cursor-pointer transition-colors"
                        >
                          <Edit2 className="w-3 h-3 inline mr-1" /> Edit
                        </button>

                        {/* Delete User */}
                        {(!currentUser || (u._id !== currentUser.id && u.username !== currentUser.username)) && (
                          <button
                            onClick={() => handleDeleteUser(u)}
                            className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-xs font-medium text-rose-400 border border-rose-500/20 cursor-pointer transition-colors"
                          >
                            <Trash2 className="w-3 h-3 inline mr-1" /> Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* SLIDE-OUT DRAWER: Create / Edit User */}
        {drawerOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <div
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
              onClick={() => setDrawerOpen(false)}
            />

            <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
              <div className="w-screen max-w-md bg-[#0b0d19] border-l border-slate-800 p-6 flex flex-col justify-between shadow-2xl overflow-y-auto">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <UserPlus className="w-5 h-5 text-purple-400" />
                      {editingUser ? 'Edit User Details' : 'Create New User Account'}
                    </h2>
                    <button
                      onClick={() => setDrawerOpen(false)}
                      className="p-1 rounded-lg text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {drawerError && (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs mb-4">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{drawerError}</span>
                    </div>
                  )}

                  <form onSubmit={handleSaveUser} id="user-form" className="space-y-4 text-xs">
                    <div>
                      <label className="block text-slate-300 mb-1 font-semibold">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-400"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-1 font-semibold">Username *</label>
                      <input
                        type="text"
                        required
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        placeholder="johndoe"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-purple-400"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 mb-1 font-semibold">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-purple-400"
                      />
                    </div>

                    {!editingUser && (
                      <div>
                        <label className="block text-slate-300 mb-1 font-semibold">Initial Password * (Min 6)</label>
                        <div className="relative">
                          <input
                            type={showDrawerPwd ? 'text' : 'password'}
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder="••••••••"
                            className="w-full pl-3.5 pr-8 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-purple-400"
                          />
                          <button
                            type="button"
                            onClick={() => setShowDrawerPwd(!showDrawerPwd)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                            title={showDrawerPwd ? 'Hide password' : 'Show password'}
                          >
                            {showDrawerPwd ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-slate-300 mb-1 font-semibold">Role &amp; Permissions</label>
                      <select
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white cursor-pointer focus:outline-none focus:border-purple-400"
                      >
                        <option value="admin">Administrator (Full Access)</option>
                        <option value="editor">Editor (Content Management)</option>
                      </select>
                    </div>
                  </form>
                </div>

                <div className="border-t border-slate-800 pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setDrawerOpen(false)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-300 border border-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    form="user-form"
                    disabled={submitting}
                    className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    {editingUser ? 'Save Changes' : 'Create User'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: Direct Reset Password */}
        {resetModalUser && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm transition-opacity"
              onClick={() => setResetModalUser(null)}
            />

            <div className="relative w-full max-w-md bg-[#0b0d19] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Key className="w-5 h-5 text-amber-400" /> Reset User Password
                </h3>
                <button
                  onClick={() => setResetModalUser(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs space-y-1">
                <div className="text-slate-400">Target User: <strong className="text-white">{resetModalUser.name || resetModalUser.username}</strong></div>
                <div className="text-slate-400">Email: <span className="text-cyan-400 font-mono">{resetModalUser.email}</span></div>
              </div>

              {resetMsg && (
                <div className={`p-3 rounded-xl text-xs flex items-center gap-2 border ${
                  resetMsg.ok
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                    : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                }`}>
                  {resetMsg.ok ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                  <span>{resetMsg.text}</span>
                </div>
              )}

              <form onSubmit={handleDirectPasswordReset} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">Enter New Password (Min 6 Characters)</label>
                  <div className="relative">
                    <input
                      type={showAdminNewPwd ? 'text' : 'password'}
                      required
                      value={adminNewPassword}
                      onChange={(e) => setAdminNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full pl-3.5 pr-8 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-amber-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAdminNewPwd(!showAdminNewPwd)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showAdminNewPwd ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setResetModalUser(null)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-300 border border-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-xs font-bold text-slate-950 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {resetLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Lock className="w-3.5 h-3.5" />}
                    Confirm Reset
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
