import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

// POST: Claim an invite code (authenticated, after sign-in)
export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = session.user.id as string
  const body = await request.json().catch(() => ({}))
  const code = body.code?.toUpperCase()

  if (!code) {
    return NextResponse.json({ error: "Invite code is required" }, { status: 400 })
  }

  // Check if user already claimed an invite
  const existingClaim = await prisma.inviteUse.findUnique({ where: { userId } })
  if (existingClaim) {
    return NextResponse.json({ error: "You have already used an invite code" }, { status: 409 })
  }

  // Validate the invite code
  const invite = await prisma.inviteCode.findUnique({
    where: { code },
    select: { id: true, creatorId: true, maxUses: true, useCount: true, expiresAt: true },
  })

  if (!invite) {
    return NextResponse.json({ error: "Invalid invite code" }, { status: 404 })
  }

  if (invite.useCount >= invite.maxUses) {
    return NextResponse.json({ error: "This invite code has reached its usage limit" }, { status: 400 })
  }

  if (new Date() > invite.expiresAt) {
    return NextResponse.json({ error: "This invite code has expired" }, { status: 400 })
  }

  // Don't allow inviting yourself
  if (invite.creatorId === userId) {
    return NextResponse.json({ error: "You cannot use your own invite code" }, { status: 400 })
  }

  // Process the claim in a transaction
  const proEnd = new Date()
  proEnd.setDate(proEnd.getDate() + 7) // 1-week Pro trial

  await prisma.$transaction([
    // Create InviteUse record
    prisma.inviteUse.create({
      data: { inviteId: invite.id, userId, rewardGiven: true },
    }),
    // Increment useCount on InviteCode
    prisma.inviteCode.update({
      where: { id: invite.id },
      data: { useCount: { increment: 1 } },
    }),
    // Give Pro trial to the invited user
    prisma.user.update({
      where: { id: userId },
      data: {
        isPro: true,
        subscriptionStatus: "invite_trial",
        subscriptionEnd: proEnd,
      },
    }),
    // Give Pro trial to the inviter (if not already Pro)
    prisma.user.updateMany({
      where: {
        id: invite.creatorId,
        isPro: false, // only if not already Pro
      },
      data: {
        isPro: true,
        subscriptionStatus: "invite_reward",
        subscriptionEnd: proEnd,
      },
    }),
    // Create notifications for both
    prisma.notification.create({
      data: {
        userId,
        type: "invite_claimed",
        message: "Welcome to VoidSay Pro! You've received a 1-week free trial through an invite.",
        priority: 2,
      },
    }),
    prisma.notification.create({
      data: {
        userId: invite.creatorId,
        type: "invite_reward",
        message: "Someone joined using your invite code! You've received a 1-week Pro trial as a reward.",
        priority: 2,
      },
    }),
  ])

  // Return updated session data
  return NextResponse.json({
    success: true,
    isPro: true,
    subscriptionEnd: proEnd.toISOString(),
  })
}
