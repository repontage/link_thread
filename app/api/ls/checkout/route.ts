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

    const userEmail = session.user.email;
    const userName = session.user.name;

    if (!userEmail) {
      return NextResponse.json(
        { error: "Account requires an email address" },
        { status: 400 }
      );
    }

    const ls = new LemonSqueezySDK();

    const { checkoutUrl } = await ls.createCheckout({
      userId,
      email: userEmail,
      name: userName || undefined,
    });

    return NextResponse.json({ checkoutUrl });
  } catch (error) {
    console.error("[LS_CHECKOUT_ERROR]", error);
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
