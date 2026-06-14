"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import SearchBar from "./SearchBar";
import UserNav from "./UserNav";

export default function Navbar() {
  const pathname = usePathname();

  if (pathname === "/") {
    return null;
  }

  return (
    <nav className="border-b border-white/10 bg-surface-black/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl tracking-tight text-primary flex-shrink-0">
          VoidSay
        </Link>
        <SearchBar />
        <UserNav />
      </div>
    </nav>
  );
}
