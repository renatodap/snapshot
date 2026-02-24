"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "Capture", icon: "+" },
  { href: "/snapshot", label: "Snapshot", icon: "◉" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-neutral-900/80 backdrop-blur-xl border-t border-neutral-800"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
      <div className="flex justify-around max-w-lg mx-auto">
        {tabs.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link key={tab.href} href={tab.href}
              className={`flex flex-col items-center py-3 px-6 text-xs transition-colors ${
                active ? "text-blue-400" : "text-neutral-500"
              }`}>
              <span className="text-lg mb-0.5">{tab.icon}</span>
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
