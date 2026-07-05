"use client";

import { useMemo, useState } from "react";
import { Bike, ChevronDown, Plus, Search } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { VehicleListItem, VehicleStatus } from "../queries";
import { VehicleCard } from "./vehicle-card";
import { VehicleFormDialog } from "./vehicle-form-dialog";

type StatusFilter = "ALL" | VehicleStatus;

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "ALL", label: "Semua status" },
  { value: "OWNED", label: "Dimiliki" },
  { value: "SOLD", label: "Terjual" },
];

export function VehiclesView({ vehicles }: { vehicles: VehicleListItem[] }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("ALL");
  const [addOpen, setAddOpen] = useState(false);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return vehicles.filter((vehicle) => {
      const matchesStatus = status === "ALL" || vehicle.status === status;
      const matchesSearch =
        !query ||
        vehicle.name.toLowerCase().includes(query) ||
        (vehicle.plateNumber ?? "").toLowerCase().includes(query);
      return matchesStatus && matchesSearch;
    });
  }, [vehicles, search, status]);

  return (
    <>
      <PageHeader
        title="Kendaraan"
        action={
          <Button size="sm" onClick={() => setAddOpen(true)}>
            <Plus /> Tambah
          </Button>
        }
      />

      <div className="mb-4 flex gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Cari nama atau plat nomor"
            className="pl-9"
            aria-label="Cari kendaraan"
          />
        </div>
        <div className="relative">
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as StatusFilter)}
            aria-label="Filter status"
            className={cn(
              "h-11 appearance-none rounded-lg border border-input bg-background pl-3 pr-9 text-sm font-medium text-foreground shadow-[var(--shadow-card)]",
              "focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
            )}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <EmptyState icon={Bike} title="Tidak ada kendaraan ditemukan" />
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      )}

      <VehicleFormDialog open={addOpen} onOpenChange={setAddOpen} />
    </>
  );
}
