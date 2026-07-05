"use client";

import { useEffect } from "react";
import { TriangleAlert } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="pt-12">
      <EmptyState
        icon={TriangleAlert}
        title="Terjadi kesalahan"
        description="Gagal memuat data. Periksa koneksi lalu coba lagi."
        action={<Button onClick={reset}>Coba lagi</Button>}
      />
    </div>
  );
}
