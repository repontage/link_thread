import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import Image from 'next/image';
import { User as UserIcon } from 'lucide-react';
import Link from 'next/link';

export default async function UserProfilePage({ params }: { params: { id: string } }) {
  const { id } = params;

  // Fetch user data
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    notFound();
  }

  // Fetch comments (threads and replies) created by the user
  const comments = await prisma.comment.findMany({
    where: { userId: id },
    orderBy: { createdAt: 'desc' },
    include: {
      reactions: true, // we might want to display reactions, though we have a separate component usually
    },
  });

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 pb-24">
      {/* Profile Header */}
      <div className="flex items-center gap-6 mb-8 p-6 bg-white rounded-xl shadow-sm border border-zinc-100">
        <div className="h-20 w-20 md:h-24 md:w-24 rounded-full bg-gradient-to-tr from-blue-100 to-blue-50 flex items-center justify-center border-2 border-blue-200 overflow-hidden shrink-0">
          {user.image ? (
            <Image src={user.image} alt={user.name || 'User'} width={96} height={96} className="object-cover w-full h-full" />
          ) : (
            <UserIcon className="h-10 w-10 text-blue-600" />
          )}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">{user.name || 'Anonymous User'}</h1>
          <p className="text-zinc-500 mt-1">{user.email}</p>
          <div className="flex gap-4 mt-3 text-sm text-zinc-600">
            <div className="flex flex-col">
              <span className="font-semibold text-zinc-900">{comments.length}</span>
              <span className="text-xs">Posts & Replies</span>
            </div>
            {/* Can add more stats here in the future */}
          </div>
        </div>
      </div>

      {/* User's Posts/Comments Feed */}
      <div>
        <h2 className="text-lg font-bold text-zinc-900 mb-4 px-2 border-b border-zinc-100 pb-2">Recent Activity</h2>
        {comments.length === 0 ? (
          <div className="text-center py-12 bg-zinc-50 rounded-xl border border-zinc-100">
            <p className="text-zinc-500">No activity yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="p-5 bg-white rounded-xl shadow-sm border border-zinc-100 hover:border-blue-100 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs text-zinc-500">
                    {new Date(comment.createdAt).toLocaleString()}
                  </div>
                  {comment.url && (
                    <Link href={`/?url=${encodeURIComponent(comment.url)}`} className="text-xs text-blue-600 hover:underline">
                      Go to Thread &rarr;
                    </Link>
                  )}
                </div>
                <p className="text-zinc-800 text-sm whitespace-pre-wrap">{comment.content}</p>
                {comment.imageUrls && (
                  <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
                    {comment.imageUrls.split(',').map((imgUrl, idx) => (
                      <div key={idx} className="h-20 w-20 shrink-0 rounded-md bg-zinc-100 border border-zinc-200 overflow-hidden">
                        <img src={imgUrl.trim()} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
