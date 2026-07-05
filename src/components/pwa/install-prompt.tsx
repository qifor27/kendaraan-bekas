"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "kb-install-dismissed";

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(
    null,
  );

  useEffect(() => {
    if (localStorage.getItem(DISMISS_KEY)) return;

    const onPrompt = (event: Event) => {
      event.preventDefault();
      setDeferred(event as BeforeInstallPromptEvent);
    };
    const onInstalled = () => setDeferred(null);

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (!deferred) return null;

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, "1");
    setDeferred(null);
  }

  async function install() {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
  }

  return (
    <div
      className="fixed inset-x-0 z-40 mx-auto flex max-w-[430px] items-center gap-3 px-4"
      style={{ bottom: "calc(84px + env(safe-area-inset-bottom))" }}
    >
      <div className="flex flex-1 items-center gap-3 rounded-xl border bg-background p-3 shadow-[var(--shadow-elevated)]">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
          <Download className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">Pasang aplikasi</p>
          <p className="text-xs text-muted-foreground">
            Akses lebih cepat dari layar utama
          </p>
        </div>
        <Button size="sm" onClick={install}>
          Pasang
        </Button>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Tutup"
          className="flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}
