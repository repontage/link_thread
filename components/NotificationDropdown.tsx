'use client';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Bell } from 'lucide-react';

export default function NotificationDropdown() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const userId = session?.user?.id;

  useEffect(() => {
    if (!userId) return;
    fetch(`/api/notifications?userId=${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setNotifications(data.notifications);
      });
  }, [userId]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = async () => {
    setIsOpen(!isOpen);
    if (!isOpen && unreadCount > 0 && userId) {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    }
  };

  if (!userId) return null;

  return (
    <div className="relative">
      <button onClick={markAsRead} className="relative p-2 text-zinc-600 hover:bg-zinc-100 rounded-full transition-colors">
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        )}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white border border-zinc-200 rounded-xl shadow-lg p-2 z-50">
          <h3 className="text-sm font-bold text-zinc-800 px-3 py-2 border-b border-zinc-100 mb-1">Notifications</h3>
          {notifications.length === 0 ? (
            <div className="px-3 py-4 text-xs text-zinc-500 text-center">No new notifications</div>
          ) : (
            <div className="max-h-64 overflow-y-auto">
              {notifications.map(n => (
                <div key={n.id} className="px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 rounded-lg cursor-pointer transition-colors border-b border-zinc-50 last:border-0">
                  {n.message}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
