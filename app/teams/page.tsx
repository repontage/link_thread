'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Users, Plus, Shield, Crown, UserPlus, UserMinus } from 'lucide-react';

interface Team {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  ownerId: string;
  createdAt: string;
  owner: { id: string; name: string | null; username: string | null; image: string | null };
  members: {
    id: string;
    role: string;
    joinedAt: string;
    user: { id: string; name: string | null; username: string | null; image: string | null; isPro: boolean };
  }[];
  _count?: { members: number };
}

export default function TeamsPage() {
  const { data: session, status } = useSession();
  const [teams, setTeams] = useState<Team[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [inviteUsername, setInviteUsername] = useState('');
  const [manageError, setManageError] = useState('');

  const fetchTeams = useCallback(async () => {
    try {
      const res = await fetch('/api/team');
      const data = await res.json();
      if (data.success) {
        setTeams(data.data);
      }
    } catch (_err) {
      console.error('Failed to fetch teams', _err);
    }
  }, []);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchTeams();
    }
  }, [status, fetchTeams]);

  const handleCreate = async () => {
    if (!formName.trim() || !formSlug.trim()) {
      setError('Name and slug are required');
      return;
    }

    // Auto-generate slug from name
    const slug = formSlug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');

    setCreating(true);
    setError('');

    try {
      const res = await fetch('/api/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formName.trim(), slug, description: formDescription.trim() || null }),
      });
      const data = await res.json();
      if (data.success) {
        setFormName('');
        setFormSlug('');
        setFormDescription('');
        setShowCreate(false);
        await fetchTeams();
      } else {
        setError(data.error || 'Failed to create team');
      }
    } catch (_err) {
      setError('Failed to create team');
    } finally {
      setCreating(false);
    }
  };

  const handleInviteMember = async (teamId: string) => {
    if (!inviteUsername.trim()) {
      setManageError('Username is required');
      return;
    }

    try {
      // First find the user by username
      const res = await fetch('/api/team', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId, action: 'add_member', memberId: inviteUsername.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setInviteUsername('');
        setManageError('');
        await fetchTeams();
        // Refresh selected team
        const teamRes = await fetch(`/api/team?slug=${encodeURIComponent(selectedTeam?.slug || '')}`);
        const teamData = await teamRes.json();
        if (teamData.success) setSelectedTeam(teamData.data);
      } else {
        setManageError(data.error || 'Failed to add member');
      }
    } catch (_err) {
      setManageError('Failed to add member');
    }
  };

  const handleRemoveMember = async (teamId: string, memberId: string) => {
    try {
      const res = await fetch('/api/team', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId, action: 'remove_member', memberId }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchTeams();
        // Refresh selected team
        const teamRes = await fetch(`/api/team?slug=${encodeURIComponent(selectedTeam?.slug || '')}`);
        const teamData = await teamRes.json();
        if (teamData.success) setSelectedTeam(teamData.data);
      } else {
        setManageError(data.error || 'Failed to remove member');
      }
    } catch (_err) {
      setManageError('Failed to remove member');
    }
  };

  const isPro = (session?.user as any)?.isPro;

  if (status === 'loading') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-zinc-200 dark:bg-zinc-700 rounded w-1/4" />
        </div>
      </div>
    );
  }

  if (status !== 'authenticated') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <Users className="h-12 w-12 text-zinc-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">Sign in to view teams</h1>
        <p className="text-zinc-500 mb-6">Create or join teams to collaborate.</p>
        <Link href="/" className="text-blue-600 hover:underline">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link href="/" className="text-sm text-blue-600 hover:underline mb-1 inline-block">← Home</Link>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Teams</h1>
        </div>
        {isPro && (
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Create Team
          </button>
        )}
      </div>

      {!isPro && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
          <p className="text-amber-800 dark:text-amber-200 text-sm">
            <Shield className="h-4 w-4 inline mr-1" />
            Team creation is available for <Link href="/pro" className="font-semibold underline">Pro subscribers</Link> only.
          </p>
        </div>
      )}

      {showCreate && isPro && (
        <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-6 mb-6">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Create a New Team</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Team Name</label>
              <input
                type="text"
                placeholder="My Awesome Team"
                value={formName}
                onChange={(e) => {
                  setFormName(e.target.value);
                  setFormSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-'));
                }}
                className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Slug</label>
              <input
                type="text"
                placeholder="my-awesome-team"
                value={formSlug}
                onChange={(e) => setFormSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Description (optional)</label>
              <input
                type="text"
                placeholder="What's this team about?"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-sm"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex gap-2">
              <button
                onClick={handleCreate}
                disabled={creating}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {creating ? 'Creating...' : 'Create Team'}
              </button>
              <button
                onClick={() => setShowCreate(false)}
                className="px-4 py-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-lg text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Teams List */}
      {teams.length === 0 ? (
        <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700 p-8 text-center">
          <Users className="h-10 w-10 text-zinc-300 mx-auto mb-3" />
          <p className="text-zinc-500">No teams yet. {isPro ? 'Create your first team!' : 'Join a team or upgrade to Pro to create one.'}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {teams.map((team) => (
            <div key={team.id} className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg text-zinc-900 dark:text-zinc-100">{team.name}</h3>
                    <p className="text-sm text-zinc-500 font-mono">@{team.slug}</p>
                    {team.description && (
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">{team.description}</p>
                    )}
                    <div className="flex items-center gap-4 mt-3 text-xs text-zinc-500">
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        {team.members?.length || team._count?.members || 0} members
                      </span>
                      <span>
                        Owner: {team.owner.name || team.owner.username || 'Unknown'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedTeam(selectedTeam?.id === team.id ? null : team)}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {selectedTeam?.id === team.id ? 'Close' : 'Manage'}
                  </button>
                </div>

                {selectedTeam?.id === team.id && (
                  <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-700">
                    <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3">Members</h4>
                    <div className="space-y-2 mb-4">
                      {team.members?.map((member) => (
                        <div key={member.id} className="flex items-center justify-between py-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-600 flex items-center justify-center overflow-hidden">
                              {member.user.image ? (
                                <img src={member.user.image} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <Users className="h-4 w-4 text-zinc-400" />
                              )}
                            </div>
                            <div>
                              <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                {member.user.name || member.user.username || 'Unknown'}
                              </span>
                              <div className="flex items-center gap-1">
                                {member.role === 'OWNER' && (
                                  <span className="text-xs text-amber-600 flex items-center gap-0.5">
                                    <Crown className="h-3 w-3" /> Owner
                                  </span>
                                )}
                                {member.role === 'ADMIN' && (
                                  <span className="text-xs text-blue-600 flex items-center gap-0.5">
                                    <Shield className="h-3 w-3" /> Admin
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          {member.role !== 'OWNER' && (session?.user as any)?.id === team.ownerId && (
                            <button
                              onClick={() => handleRemoveMember(team.id, member.user.id)}
                              className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1"
                            >
                              <UserMinus className="h-3 w-3" /> Remove
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Invite member */}
                    {(session?.user as any)?.id === team.ownerId && (
                      <div>
                        <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-2">Add Member</h4>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Username or user ID"
                            value={inviteUsername}
                            onChange={(e) => setInviteUsername(e.target.value)}
                            className="flex-1 px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-sm"
                          />
                          <button
                            onClick={() => handleInviteMember(team.id)}
                            className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-1"
                          >
                            <UserPlus className="h-4 w-4" /> Add
                          </button>
                        </div>
                        {manageError && <p className="text-red-500 text-sm mt-2">{manageError}</p>}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
