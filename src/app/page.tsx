import { Suspense } from "react";

import { PageHeader } from "@/components/shared/page-header";
import { SectionHeader } from "@/components/shared/section-header";
import {
  DashboardStats,
  DashboardStatsSkeleton,
} from "@/features/dashboard/components/dashboard-stats";
import {
  ActiveVehicles,
  ActiveVehiclesSkeleton,
} from "@/features/dashboard/components/active-vehicles";

// Data is request-time (Prisma); do not statically prerender.
export const dynamic = "force-dynamic";

export default function DashboardPage() {
  return (
    <>
      <PageHeader title="Dashboard" />

      <Suspense fallback={<DashboardStatsSkeleton />}>
        <DashboardStats />
      </Suspense>

      <SectionHeader title="Kendaraan aktif" subtitle="Yang masih dimiliki" />
      <Suspense fallback={<ActiveVehiclesSkeleton />}>
        <ActiveVehicles />
      </Suspense>
    </>
  );
}
