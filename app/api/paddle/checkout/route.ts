import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST() {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // If Paddle is not configured, return error
    if (!process.env.PADDLE_CLIENT_TOKEN || !process.env.PADDLE_PRICE_ID) {
      return NextResponse.json(
        { error: "Paddle is not configured. Please set PADDLE_CLIENT_TOKEN and PADDLE_PRICE_ID environment variables." },
        { status: 503 },
      );
    }

    // Return Paddle client token and price ID so the frontend can open the overlay
    return NextResponse.json({
      clientToken: process.env.PADDLE_CLIENT_TOKEN,
      priceId: process.env.PADDLE_PRICE_ID,
      isMock: false,
    });
  } catch (error) {
    console.error("[PADDLE_CHECKOUT_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
