'use client';

import { useEffect, useState } from 'react';
import { Shield, Users, Flag, Ban, CheckCircle, XCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';

type Stats = {
  totalUsers: number;
  totalComments: number;
  totalReports: number;
};

type User = {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  isBanned: boolean;
  _count: {
    comments: number;
    Report: number;
  };
};

type Report = {
  id: string;
  commentId: string;
  reporterId: string;
  reason: string;
  status: string;
  createdAt: string;
  reporter: { id: string; name: string | null; email: string | null };
  comment: { id: string; content: string; author: string };
};

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<'users' | 'reports'>('users');
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role === 'ADMIN') {
      fetchData();
    } else if (status !== 'loading' && session?.user?.role !== 'ADMIN') {
      setLoading(false);
    }
  }, [status, session]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, reportsRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/users'),
        fetch('/api/admin/reports'),
      ]);
      if (statsRes.ok) setStats(await statsRes.json());
      if (usersRes.ok) setUsers(await usersRes.json());
      if (reportsRes.ok) setReports(await reportsRes.json());
    } catch (error) {
      console.error('Failed to fetch admin data', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (userId: string, data: { isBanned?: boolean; role?: string }) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...data }),
      });
      if (res.ok) {
        setUsers(users.map(u => (u.id === userId ? { ...u, ...data } : u)));
      }
    } catch (error) {
      console.error('Failed to update user', error);
    }
  };

  const updateReportStatus = async (reportId: string, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/reports', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId, status: newStatus }),
      });
      if (res.ok) {
        setReports(reports.map(r => (r.id === reportId ? { ...r, status: newStatus } : r)));
      }
    } catch (error) {
      console.error('Failed to update report status', error);
    }
  };

  if (status === 'loading' || loading) {
    return <div className="p-8 text-center">Loading dashboard...</div>;
  }

  if (session?.user?.role !== 'ADMIN') {
    return (
      <div className="p-8 text-center text-red-500 flex flex-col items-center">
        <Shield className="w-12 h-12 mb-4" />
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p>You must be an admin to view this page.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <div className="flex items-center mb-8">
        <Shield className="w-8 h-8 mr-3 text-indigo-600" />
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center">
            <Users className="w-10 h-10 text-blue-500 mr-4" />
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wider">Total Users</p>
              <p className="text-3xl font-bold">{stats.totalUsers}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center">
            <svg className="w-10 h-10 text-green-500 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wider">Total Comments</p>
              <p className="text-3xl font-bold">{stats.totalComments}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center">
            <Flag className="w-10 h-10 text-red-500 mr-4" />
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wider">Total Reports</p>
              <p className="text-3xl font-bold">{stats.totalReports}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex-1 py-4 px-6 text-center font-medium ${
              activeTab === 'users' ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            Manage Users
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`flex-1 py-4 px-6 text-center font-medium ${
              activeTab === 'reports' ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            Review Reports
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'users' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 px-4 font-semibold text-gray-600">User</th>
                    <th className="py-3 px-4 font-semibold text-gray-600">Email</th>
                    <th className="py-3 px-4 font-semibold text-gray-600">Stats</th>
                    <th className="py-3 px-4 font-semibold text-gray-600">Role</th>
                    <th className="py-3 px-4 font-semibold text-gray-600">Status</th>
                    <th className="py-3 px-4 font-semibold text-gray-600 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{user.name || 'Anonymous'}</td>
                      <td className="py-3 px-4 text-gray-500">{user.email || 'N/A'}</td>
                      <td className="py-3 px-4 text-sm text-gray-500">
                        {user._count.comments} cmts
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={user.role}
                          onChange={(e) => updateUser(user.id, { role: e.target.value })}
                          className="border rounded p-1 text-sm bg-white"
                        >
                          <option value="USER">USER</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      </td>
                      <td className="py-3 px-4">
                        {user.isBanned ? (
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
                            Banned
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => updateUser(user.id, { isBanned: !user.isBanned })}
                          className={`inline-flex items-center p-2 rounded ${
                            user.isBanned ? 'text-green-600 hover:bg-green-50' : 'text-red-600 hover:bg-red-50'
                          }`}
                          title={user.isBanned ? 'Unban User' : 'Ban User'}
                        >
                          {user.isBanned ? <CheckCircle className="w-5 h-5" /> : <Ban className="w-5 h-5" />}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-gray-500">No users found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-4">
              {reports.map(report => (
                <div key={report.id} className="border rounded-lg p-4 flex flex-col md:flex-row md:items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        report.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        report.status === 'RESOLVED' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {report.status}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(report.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="mb-2">
                      <p className="text-sm font-semibold">Reason: {report.reason}</p>
                      <p className="text-sm text-gray-500">Reported by: {report.reporter?.name || 'Unknown'}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded border text-sm">
                      <p className="font-medium mb-1">Comment content:</p>
                      <p className="text-gray-700">{report.comment?.content}</p>
                    </div>
                  </div>
                  
                  <div className="flex md:flex-col gap-2 min-w-[120px]">
                    {report.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => updateReportStatus(report.id, 'RESOLVED')}
                          className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                        >
                          Resolve
                        </button>
                        <button
                          onClick={() => updateReportStatus(report.id, 'DISMISSED')}
                          className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                          Dismiss
                        </button>
                      </>
                    )}
                    {report.status !== 'PENDING' && (
                      <button
                        onClick={() => updateReportStatus(report.id, 'PENDING')}
                        className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Reopen
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {reports.length === 0 && (
                <div className="py-8 text-center text-gray-500">No reports found.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
