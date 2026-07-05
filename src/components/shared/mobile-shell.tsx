import type { ReactNode } from "react";

import { BottomNav } from "@/components/shared/bottom-nav";

/**
 * Phone-shaped app frame. Centers a max 430px column on desktop and fills the
 * viewport on phones. All pages render inside <main>, above the fixed BottomNav.
 */
export function MobileShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-background shadow-[var(--shadow-elevated)]">
      <main
        className="flex-1 px-4 pt-5"
        style={{
          paddingBottom: "calc(76px + env(safe-area-inset-bottom))",
        }}
      >
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
