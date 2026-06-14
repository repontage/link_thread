import { notFound } from "next/navigation";
import Link from "next/link";
import { Clock, MessageSquare, Link as LinkIcon, Users, UserPlus } from "lucide-react";
import prisma from "@/lib/prisma";
import LocalizedDate from "@/components/LocalizedDate";
import { auth } from "@/auth";
import FollowButtonClient from "./FollowButtonClient";

export default async function UserProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;

  const dbUser = await prisma.user.findFirst({
    where: { username },
  });

  if (!dbUser) {
    // Try by username or id fallback
    const byId = await prisma.user.findUnique({ where: { id: username } });
    if (!byId) {
      notFound();
    }
    return <UserProfileContent user={byId} />;
  }

  return <UserProfileContent user={dbUser} />;
}

async function UserProfileContent({ user: dbUser }: { user: any }) {
  const session = await auth();
  const currentUserId = (session?.user as any)?.id;
  const isOwnProfile = currentUserId === dbUser.id;

  // Check if current user is following this profile
  let isFollowing = false;
  if (currentUserId && !isOwnProfile) {
    const follow = await prisma.follow.findUnique({
      where: { followerId_followingId: { followerId: currentUserId, followingId: dbUser.id } },
    });
    isFollowing = !!follow;
  }

  const comments = await prisma.comment.findMany({
    where: { userId: dbUser.id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  const [followersCount, followingCount] = await Promise.all([
    prisma.follow.count({ where: { followingId: dbUser.id } }),
    prisma.follow.count({ where: { followerId: dbUser.id } }),
  ]);

  const displayImage = dbUser.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${dbUser.id}`;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="relative bg-white dark:bg-zinc-800 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-700 overflow-hidden mb-8">
        <div 
          className="h-32 w-full bg-blue-600"
          style={{ 
            backgroundImage: dbUser.profileBackground ? `url(${dbUser.profileBackground})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="p-8 pt-0 -mt-12 flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          <img
            src={displayImage}
            alt={dbUser.name || "User Avatar"}
            width={96}
            height={96}
            className="rounded-full border-4 border-white dark:border-zinc-800 shadow-md shrink-0 w-24 h-24 object-cover"
          />
          <div className="flex-1 w-full pt-14">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                  {dbUser.name || "Anonymous User"}
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400 mb-2">
                  @{dbUser.username || dbUser.id.slice(0, 8)}
                </p>
                {dbUser.bio && (
                  <p className="text-zinc-700 dark:text-zinc-300 mt-2 max-w-xl">{dbUser.bio}</p>
                )}
                {dbUser.isPro && (
                  <span className="inline-flex items-center gap-1 mt-1 text-xs font-semibold text-[#0066cc] bg-[#0066cc]/10 dark:bg-[#0066cc]/20 px-2 py-0.5 rounded-full">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Pro
                  </span>
                )}
              </div>
              {!isOwnProfile && (
                <FollowButtonClient userId={dbUser.id} initialFollowing={isFollowing} />
              )}
            </div>

            <div className="flex items-center gap-4 mt-3 text-sm text-zinc-600 dark:text-zinc-400">
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <strong>{followersCount}</strong> followers
              </span>
              <span className="flex items-center gap-1">
                <UserPlus className="h-4 w-4" />
                <strong>{followingCount}</strong> following
              </span>
            </div>

            {isOwnProfile && (
              <Link href="/profile" className="inline-block mt-3 text-sm text-blue-600 hover:underline">
                Edit Profile
              </Link>
            )}
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-blue-600" />
        Recent Activity
        <span className="text-sm font-normal text-zinc-500 bg-zinc-100 dark:bg-zinc-700 px-2.5 py-0.5 rounded-full ml-2">
          {comments.length}
        </span>
      </h2>

      {comments.length === 0 ? (
        <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700 p-12 text-center">
          <MessageSquare className="h-12 w-12 text-zinc-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-2">No comments yet</h3>
          <p className="text-zinc-500">
            This user hasn&apos;t posted any comments yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 text-sm text-blue-600 mb-3 truncate">
                <LinkIcon className="h-4 w-4 shrink-0" />
                <span className="truncate">{(comment as any).url || `Unknown URL (Thread ID: ${comment.threadId})`}</span>
              </div>
              <p className="text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed mb-4">
                {comment.content}
              </p>
              <div className="flex items-center text-xs text-zinc-500 gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                <LocalizedDate date={comment.createdAt} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
