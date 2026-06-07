import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { LemonSqueezySDK } from "@/lib/ls-server";

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    if (!userId) {
      return NextResponse.json({ error: "User ID not found" }, { status: 400 });
    }

    // Prevent double subscription — if already Pro, reject with 409 Conflict
    const isAlreadyPro =
      (session.user as any).isPro === true ||
      (session.user as any).subscriptionStatus === "active";
    if (isAlreadyPro) {
      return NextResponse.json(
        { error: "Already subscribed. Manage your subscription at /pro/manage." },
        { status: 409 }
      );
    }

    const userEmail = session.user.email;
    const userName = session.user.name;

    if (!userEmail) {
      return NextResponse.json(
        { error: "Account requires an email address" },
        { status: 400 }
      );
    }

    const ls = new LemonSqueezySDK();

    const baseUrl =
      process.env.AUTH_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "https://voidsay.com";

    const successUrl = `${baseUrl}/pro/success`;

    const checkout = await ls.createCheckout({
      userId,
      email: userEmail,
      name: userName || undefined,
      successUrl,
    });

    return NextResponse.json({
      url: checkout.url,
    });
  } catch (error) {
    console.error("[LS_CHECKOUT_ERROR]", error);
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
