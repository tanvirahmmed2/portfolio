"use client";
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/helper/ToastProvider.jsx';
import { useAuth } from '@/components/helper/ContextProvider.jsx';

export default function PanelAccessPage() {
  const { showToast } = useToast();
  const { user: currentUser } = useAuth();
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  
  
  const [actionLoading, setActionLoading] = useState({});
  
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/user?all=true');
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      } else {
        showToast('Failed to fetch user list', 'error');
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      showToast('Network error fetching users', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateUser = async (id, field, value) => {
    
    if (id === currentUser?.id && field === 'role' && value === 'user') {
      showToast('You cannot demote yourself from admin access!', 'warning');
      return;
    }

    try {
      setActionLoading((prev) => ({ ...prev, [`${id}-${field}`]: true }));
      const res = await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          [field]: value
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('User access settings updated successfully');
        setUsers((prev) =>
          prev.map((u) => (u.id === id ? { ...u, [field]: value } : u))
        );
      } else {
        showToast(data.error || 'Failed to update user access', 'error');
      }
    } catch (err) {
      console.error('Error updating user:', err);
      showToast('Network error updating user settings', 'error');
    } finally {
      setActionLoading((prev) => ({ ...prev, [`${id}-${field}`]: false }));
    }
  };

  const handleDeleteUser = async (id) => {
    if (id === currentUser?.id) {
      showToast('You cannot delete your own account!', 'warning');
      setDeleteConfirmId(null);
      return;
    }

    try {
      setDeleteLoading(true);
      const res = await fetch(`/api/user?id=${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (res.ok) {
        showToast('User account deleted successfully');
        setDeleteConfirmId(null);
        setUsers((prev) => prev.filter((u) => u.id !== id));
      } else {
        showToast(data.error || 'Failed to delete user', 'error');
      }
    } catch (err) {
      console.error('Error deleting user:', err);
      showToast('Network error deleting user account', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const nameMatch = u.name?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    const emailMatch = u.email?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    const matchesSearch = searchQuery === '' ? true : (nameMatch || emailMatch);
    
    const matchesRole = roleFilter === 'All' ? true : u.role === roleFilter;
    const matchesStatus =
      statusFilter === 'All'
        ? true
        : statusFilter === 'Verified'
        ? u.is_verified === true
        : u.is_verified === false;

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900">Access Control</h1>
        <p className="text-sm mt-1 text-slate-500">Verify new accounts, promote users, and manage administrative privileges.</p>
      </div>

      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border border-slate-200 bg-white p-4 rounded-2xl relative overflow-hidden shadow-xs">
        
        
        <div className="flex flex-col gap-1.5 text-slate-400">
          <label className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Search Users</label>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-200"
            />
            <svg className="w-4 h-4 absolute left-3 top-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Filter Role</label>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-200"
          >
            <option value="All">All Roles</option>
            <option value="admin" className="text-slate-900 bg-white">Administrators</option>
            <option value="user" className="text-slate-900 bg-white">Standard Users</option>
          </select>
        </div>

        
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Filter Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-200"
          >
            <option value="All">All Statuses</option>
            <option value="Verified" className="text-slate-900 bg-white">Verified Only</option>
            <option value="Unverified" className="text-slate-900 bg-white">Pending Approval</option>
          </select>
        </div>
      </div>

      
      {loading ? (
        <div className="border border-slate-200 bg-white rounded-2xl overflow-hidden divide-y divide-slate-100 animate-pulse shadow-xs">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex flex-col sm:flex-row items-center justify-between p-6 gap-4">
              <div className="flex items-center gap-3 w-1/3">
                <div className="w-9 h-9 bg-slate-200 rounded-full"></div>
                <div className="space-y-2 flex-1 mt-2">
                  <div className="h-3 bg-slate-200 rounded w-2/3"></div>
                  <div className="h-2.5 bg-slate-200 rounded w-1/2 mt-1"></div>
                </div>
              </div>
              <div className="h-6 bg-slate-200 rounded w-20"></div>
              <div className="h-6 bg-slate-200 rounded w-24"></div>
              <div className="h-6 bg-slate-200 rounded w-12"></div>
            </div>
          ))}
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-slate-200 bg-white text-slate-500 rounded-2xl shadow-xs">
          <svg className="w-12 h-12 mx-auto mb-3 text-slate-350" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="font-medium">No users match your criteria.</p>
        </div>
      ) : (
        <div className="border border-slate-200 bg-white rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-150 bg-slate-50/70 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                  <th className="py-4 px-6">User</th>
                  <th className="py-4 px-6">Joined Date</th>
                  <th className="py-4 px-6 text-center">Verification Status</th>
                  <th className="py-4 px-6 text-center">Administrative Access</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredUsers.map((user) => {
                  const isSelf = user.id === currentUser?.id;
                  const verifyLoading = actionLoading[`${user.id}-is_verified`];
                  const roleLoading = actionLoading[`${user.id}-role`];

                  return (
                    <tr key={user.id} className="transition-colors duration-150 hover:bg-slate-50/30 text-slate-700">
                      
                      
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold border border-slate-200 bg-slate-50 text-slate-700 uppercase">
                            {user.name ? user.name[0] : 'U'}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-bold text-slate-800 flex items-center gap-1.5 truncate">
                              {user.name || 'Anonymous User'}
                              {isSelf && (
                                <span className="inline-block px-1.5 py-0.5 text-[9px] font-black tracking-wide uppercase bg-violet-50 border border-violet-200 text-violet-650 rounded">
                                  You
                                </span>
                              )}
                            </span>
                            <span className="text-xs text-slate-450 truncate mt-0.5">{user.email}</span>
                          </div>
                        </div>
                      </td>

                      
                      <td className="py-4 px-6 text-xs font-medium text-slate-500">
                        {user.created_at 
                          ? new Date(user.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })
                          : 'N/A'
                        }
                      </td>

                      
                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => handleUpdateUser(user.id, 'is_verified', !user.is_verified)}
                          disabled={verifyLoading || isSelf}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold select-none border transition-all duration-200
                            ${user.is_verified
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100/70'
                              : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100/70'
                            }
                            ${isSelf ? 'opacity-80 cursor-not-allowed' : 'cursor-pointer'}
                          `}
                        >
                          {verifyLoading ? (
                            <div className="w-3.5 h-3.5 border-2 border-current/20 border-t-current rounded-full animate-spin"></div>
                          ) : user.is_verified ? (
                            <>
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                              </svg>
                              Verified
                            </>
                          ) : (
                            <>
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                              </svg>
                              Pending
                            </>
                          )}
                        </button>
                      </td>

                      
                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => handleUpdateUser(user.id, 'role', user.role === 'admin' ? 'user' : 'admin')}
                          disabled={roleLoading || isSelf}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold select-none border transition-all duration-200
                            ${user.role === 'admin'
                              ? 'bg-violet-50 text-violet-750 border-violet-200 hover:bg-violet-100/70'
                              : 'bg-slate-100 text-slate-650 border-slate-200 hover:bg-slate-200/80 hover:text-slate-800'
                            }
                            ${isSelf ? 'opacity-80 cursor-not-allowed' : 'cursor-pointer'}
                          `}
                        >
                          {roleLoading ? (
                            <div className="w-3.5 h-3.5 border-2 border-current/20 border-t-current rounded-full animate-spin"></div>
                          ) : user.role === 'admin' ? (
                            'Admin'
                          ) : (
                            'Promote to Admin'
                          )}
                        </button>
                      </td>

                      
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => setDeleteConfirmId(user.id)}
                          disabled={isSelf}
                          className={`p-2 rounded-lg transition-colors border
                            ${isSelf 
                              ? 'text-slate-350 border-slate-100 cursor-not-allowed bg-slate-50/50' 
                              : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50 border-slate-200 shadow-xs cursor-pointer'
                            }
                          `}
                          title="Delete User Account"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="border border-slate-200 bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl text-center">
            
            <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-600 mb-4 border border-rose-100">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            <h3 className="font-bold text-lg text-slate-900 mb-2">Delete User Account</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              Are you sure you want to delete this user? This will permanently remove their profile, comments, reviews, and all associated items from the database.
            </p>

            <div className="flex gap-3 justify-center">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors flex-1"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteUser(deleteConfirmId)}
                disabled={deleteLoading}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white disabled:opacity-50 flex items-center justify-center gap-2 flex-1"
              >
                {deleteLoading && (
                  <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                )}
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
