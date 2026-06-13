import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

function generateCode(): string {
  return crypto.randomBytes(4).toString("hex").toUpperCase() // 8-char code
}

// POST: Create a new invite code (authenticated)
export async function POST(request: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json().catch(() => ({}))
  const maxUses = body.maxUses ?? 10
  const expiresInDays = body.expiresInDays ?? 30

  const code = generateCode()
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + expiresInDays)

  const invite = await prisma.inviteCode.create({
    data: {
      code,
      creatorId: session.user.id as string,
      maxUses: Math.min(maxUses, 100), // cap at 100
      expiresAt,
    },
    select: {
      id: true,
      code: true,
      maxUses: true,
      useCount: true,
      createdAt: true,
      expiresAt: true,
    },
  })

  return NextResponse.json({ invite, link: `https://voidsay.com/invite/${invite.code}` })
}

// GET: List my invite codes or validate a specific code
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  const session = await auth()

  // Validate a specific code
  if (code) {
    const invite = await prisma.inviteCode.findUnique({
      where: { code: code.toUpperCase() },
      select: {
        code: true,
        maxUses: true,
        useCount: true,
        expiresAt: true,
        creator: { select: { username: true, name: true, image: true } },
      },
    })

    if (!invite) {
      return NextResponse.json({ valid: false, error: "Invalid invite code" }, { status: 404 })
    }

    if (invite.useCount >= invite.maxUses) {
      return NextResponse.json({ valid: false, error: "This invite code has reached its usage limit" })
    }

    if (new Date() > invite.expiresAt) {
      return NextResponse.json({ valid: false, error: "This invite code has expired" })
    }

    return NextResponse.json({
      valid: true,
      code: invite.code,
      useCount: invite.useCount,
      maxUses: invite.maxUses,
      expiresAt: invite.expiresAt,
      creator: invite.creator,
    })
  }

  // List my invite codes
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const invites = await prisma.inviteCode.findMany({
    where: { creatorId: session.user.id as string },
    select: {
      id: true,
      code: true,
      maxUses: true,
      useCount: true,
      createdAt: true,
      expiresAt: true,
    },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json({ invites })
}
