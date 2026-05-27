import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "../../../lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { commentId, reason } = await req.json();

    if (!commentId || !reason) {
      return NextResponse.json({ error: "Missing commentId or reason" }, { status: 400 });
    }

    // 1. commentId 존재 여부 확인
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });
    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    // 2. 중복 신고 방지 체크
    const existingReport = await prisma.report.findFirst({
      where: {
        commentId,
        reporterId: session.user.id,
      },
    });
    if (existingReport) {
      return NextResponse.json({ error: "Already reported this comment" }, { status: 409 });
    }

    // 3. 신고 생성
    const report = await prisma.report.create({
      data: {
        id: crypto.randomUUID(),
        commentId,
        reporterId: session.user.id,
        reason,
      },
    });

    return NextResponse.json(report, { status: 201 });
  } catch (error: any) {
    if (error?.code === "P2002") {
      return NextResponse.json({ error: "Already reported this comment" }, { status: 409 });
    }
    console.error("Failed to submit report:", error);
    return NextResponse.json({ error: "Failed to submit report" }, { status: 500 });
  }
}
