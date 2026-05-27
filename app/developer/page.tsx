import { auth } from "@/auth";
import { redirect } from "next/navigation";
import DeveloperPortal from "@/components/DeveloperPortal";

export const metadata = {
  title: "Developer Portal - VoidSay",
  description: "Manage your webhook subscriptions and integrate VoidSay APIs.",
};

export default async function DeveloperPage() {
  const session = await auth();

  // Protect the route: must be logged in to manage webhooks
  if (!session?.user) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-zinc-50/30">
      <DeveloperPortal />
    </div>
  );
}
