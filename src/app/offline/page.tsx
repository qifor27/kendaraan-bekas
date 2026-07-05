import { WifiOff } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";

export default function OfflinePage() {
  return (
    <div className="pt-16">
      <EmptyState
        icon={WifiOff}
        title="Anda sedang offline"
        description="Sambungkan internet untuk memuat data terbaru."
      />
    </div>
  );
}
