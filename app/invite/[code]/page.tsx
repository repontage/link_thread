import { PrismaClient } from "@prisma/client"
import { SignInButton } from "@/components/SignInButton"
import Link from "next/link"

const prisma = new PrismaClient()

export default async function InvitePage({ params }: { params: { code: string } }) {
  const code = params.code?.toUpperCase()

  if (!code || code.length < 4) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#1a1a2e] to-[#16213e] p-4">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-4">🔗</div>
          <h1 className="text-2xl font-bold text-white mb-2">Invalid Invite Code</h1>
          <p className="text-gray-400 mb-6">This invite link appears to be broken. Please check the URL and try again.</p>
          <Link href="/" className="inline-block px-6 py-3 bg-[#0066cc] text-white rounded-lg hover:bg-[#0055aa] transition-colors">
            Go to VoidSay
          </Link>
        </div>
      </div>
    )
  }

  const invite = await prisma.inviteCode.findUnique({
    where: { code },
    select: {
      code: true,
      maxUses: true,
      useCount: true,
      expiresAt: true,
      creator: { select: { username: true, name: true, image: true } },
    },
  })

  const isExpired = invite ? new Date() > invite.expiresAt : false
  const isFull = invite ? invite.useCount >= invite.maxUses : false
  const isValid = !!invite && !isExpired && !isFull

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#1a1a2e] to-[#16213e] p-4">
      <div className="max-w-md w-full text-center">
        {/* Header */}
        <div className="text-5xl mb-4">{isValid ? "🎁" : "🔗"}</div>

        {!invite ? (
          <>
            <h1 className="text-2xl font-bold text-white mb-2">Invite Not Found</h1>
            <p className="text-gray-400 mb-6">
              This invite code doesn&apos;t exist. It may have been deleted or never created.
            </p>
          </>
        ) : isExpired ? (
          <>
            <h1 className="text-2xl font-bold text-white mb-2">Invite Expired</h1>
            <p className="text-gray-400 mb-6">
              This invite code expired on {invite.expiresAt.toLocaleDateString()}. Ask your friend for a new one!
            </p>
          </>
        ) : isFull ? (
          <>
            <h1 className="text-2xl font-bold text-white mb-2">Invite Full</h1>
            <p className="text-gray-400 mb-6">
              This invite code has reached its limit ({invite.useCount}/{invite.maxUses} uses).
            </p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-white mb-2">
              You&apos;ve been invited to VoidSay!
            </h1>

            {/* Creator info */}
            {invite.creator && (
              <div className="flex items-center justify-center gap-2 mb-4">
                {invite.creator.image && (
                  <img
                    src={invite.creator.image}
                    alt={invite.creator.name || invite.creator.username || ""}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <span className="text-gray-300">
                  Invited by <strong>{invite.creator.name || invite.creator.username}</strong>
                </span>
              </div>
            )}

            {/* Reward description */}
            <div className="bg-white/5 rounded-xl p-5 mb-6 text-left border border-white/10">
              <h2 className="text-white font-semibold mb-3 text-center text-lg">🎉 Welcome Bonus</h2>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex gap-2">
                  <span className="text-green-400 shrink-0">✓</span>
                  <span><strong>7-day Pro trial</strong> — ad-free experience, advanced analytics</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-400 shrink-0">✓</span>
                  <span>Your inviter also gets a <strong>1-week Pro extension</strong></span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-400 shrink-0">✓</span>
                  <span>Join a community of curious minds discussing the web</span>
                </li>
              </ul>
            </div>

            {/* Usage info */}
            <p className="text-gray-500 text-sm mb-4">
              {invite.maxUses - invite.useCount} spot{invite.maxUses - invite.useCount > 1 ? "s" : ""} remaining · Expires {invite.expiresAt.toLocaleDateString()}
            </p>

            {/* CTA */}
            <SignInButton inviteCode={code} />
          </>
        )}

        {!isValid && (
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-[#0066cc] text-white rounded-lg hover:bg-[#0055aa] transition-colors"
          >
            Go to VoidSay
          </Link>
        )}

        {/* Branding */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <p className="text-gray-500 text-sm">
            <Link href="/" className="text-gray-400 hover:text-white transition-colors">
              VoidSay
            </Link>
            {" · "}Universal Link Commenting Platform
          </p>
        </div>
      </div>
    </div>
  )
}
