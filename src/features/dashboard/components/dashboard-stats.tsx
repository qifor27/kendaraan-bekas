import { StatCard } from "@/components/shared/stat-card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatRupiah } from "@/lib/format";
import { getDashboardStats } from "../queries";

export async function DashboardStats() {
  const stats = await getDashboardStats();
  const labaBersihTone = stats.labaBersih >= 0 ? "success" : "danger";

  return (
    <div className="grid grid-cols-2 gap-3">
      <StatCard
        label="Kendaraan dimiliki"
        value={`${stats.ownedCount} unit`}
        tone="primary"
      />
      <StatCard
        label="Modal kendaraan"
        value={formatRupiah(stats.modalKendaraan)}
        tone="primary"
      />
      <StatCard
        label="Biaya operasional"
        value={formatRupiah(stats.biayaOperasional)}
        tone="warning"
      />
      <StatCard
        label="Total modal keseluruhan"
        value={formatRupiah(stats.totalModalKeseluruhan)}
        tone="primary"
        highlighted
      />
      <StatCard
        label="Total terjual"
        value={`${stats.soldCount} unit`}
        tone="default"
      />
      {/* Laba bersih = laba kotor - biaya operasional. */}
      <StatCard
        label="Laba bersih"
        value={formatRupiah(stats.labaBersih)}
        tone={labaBersihTone}
      />
    </div>
  );
}

export function DashboardStatsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col gap-2 rounded-xl border bg-card px-4 py-4 shadow-[var(--shadow-card)]"
        >
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="h-7 w-20" />
        </div>
      ))}
    </div>
  );
}
