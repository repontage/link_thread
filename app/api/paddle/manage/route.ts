import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { PaddleSDK } from "@/lib/paddle-server";

export async function POST() {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { paddleCustomerId: true, isPro: true },
    });

    if (!user || !user.isPro) {
      return NextResponse.json({ error: "Pro subscription required" }, { status: 403 });
    }

    if (!process.env.PADDLE_API_KEY) {
      return NextResponse.json(
        { error: "Paddle is not configured" },
        { status: 503 },
      );
    }

    if (!user.paddleCustomerId) {
      return NextResponse.json(
        { error: "Paddle customer record not found" },
        { status: 400 },
      );
    }

    const paddle = new PaddleSDK();
    const portal = await paddle.createCustomerPortalSession(user.paddleCustomerId);

    return NextResponse.json({ url: portal.url });
  } catch (error) {
    console.error("[PADDLE_MANAGE_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
