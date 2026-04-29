import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Clock, MessageSquare, Link as LinkIcon, User } from "lucide-react";
import prisma from "../../lib/prisma";
import ProfileEditForm from "@/components/ProfileEditForm";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const userId = (session.user as any).id;

  if (!userId) {
    redirect("/");
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!dbUser) {
    redirect("/");
  }

  const comments = await prisma.comment.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  const displayImage = dbUser.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${dbUser.id}`;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 p-8 mb-8 text-center sm:text-left flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <img
          src={displayImage}
          alt={dbUser.name || "User Avatar"}
          width={96}
          height={96}
          className="rounded-full border-4 border-white shadow-md shrink-0 w-24 h-24 object-cover"
        />
        <div className="flex-1 w-full">
          <h1 className="text-2xl font-bold text-zinc-900 mb-1">{dbUser.name || "Anonymous User"}</h1>
          <p className="text-zinc-500 mb-2">
            {dbUser.username ? `@${dbUser.username}` : dbUser.email}
          </p>
          {dbUser.bio && (
            <p className="text-zinc-700 mt-2 max-w-xl">{dbUser.bio}</p>
          )}
          
          <ProfileEditForm user={dbUser} />
        </div>
      </div>

      <h2 className="text-xl font-bold text-zinc-900 mb-6 flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-blue-600" />
        내 활동 내역
        <span className="text-sm font-normal text-zinc-500 bg-zinc-100 px-2.5 py-0.5 rounded-full ml-2">
          {comments.length}
        </span>
      </h2>

      {comments.length === 0 ? (
        <div className="bg-zinc-50 rounded-xl border border-zinc-100 p-12 text-center">
          <MessageSquare className="h-12 w-12 text-zinc-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-zinc-900 mb-2">아직 작성한 댓글이 없습니다</h3>
          <p className="text-zinc-500">
            홈에서 새로운 URL을 검색하고 대화에 참여해보세요.
          </p>
          <Link href="/" className="inline-block mt-6 px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
            홈으로 가기
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-white rounded-xl border border-zinc-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 text-sm text-blue-600 mb-3 truncate">
                <LinkIcon className="h-4 w-4 shrink-0" />
                <span className="truncate">{(comment as any).url || `Unknown URL (Thread ID: ${comment.threadId})`}</span>
              </div>
              <p className="text-zinc-700 whitespace-pre-wrap leading-relaxed mb-4">
                {comment.content}
              </p>
              <div className="flex items-center text-xs text-zinc-500 gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                <span>{new Date(comment.createdAt).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
