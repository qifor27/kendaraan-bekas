import { Bike } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDateShort, formatRupiah } from "@/lib/format";
import { getActiveVehicles, type ActiveVehicle } from "../queries";

function ActiveVehicleItem({ vehicle }: { vehicle: ActiveVehicle }) {
  return (
    <Card className="py-0">
      <CardContent className="flex items-center justify-between gap-3 py-3.5">
        <div className="min-w-0">
          <p className="truncate font-semibold text-foreground">
            {vehicle.name}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {vehicle.plateNumber ?? "Tanpa plat"} ·{" "}
            {formatDateShort(vehicle.purchaseDate)}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-[11px] text-muted-foreground">Total modal</p>
          <p className="font-bold text-primary">
            {formatRupiah(vehicle.totalModal)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export async function ActiveVehicles() {
  const vehicles = await getActiveVehicles();

  if (vehicles.length === 0) {
    return (
      <Card>
        <EmptyState icon={Bike} title="Belum ada kendaraan aktif" />
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {vehicles.map((vehicle) => (
        <ActiveVehicleItem key={vehicle.id} vehicle={vehicle} />
      ))}
    </div>
  );
}

export function ActiveVehiclesSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 2 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between rounded-xl border bg-card px-4 py-4 shadow-[var(--shadow-card)]"
        >
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}
