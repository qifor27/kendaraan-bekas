"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Tag } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { formatDateShort, formatRupiah } from "@/lib/format";
import { SellDialog } from "@/features/sales/components/sell-dialog";
import { deleteVehicle } from "../actions";
import type { VehicleListItem } from "../queries";
import { VehicleStatusBadge } from "./vehicle-status-badge";
import { VehicleFormDialog } from "./vehicle-form-dialog";

export function VehicleCard({ vehicle }: { vehicle: VehicleListItem }) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [sellOpen, setSellOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const isOwned = vehicle.status === "OWNED";

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteVehicle(vehicle.id);
      if (result.success) {
        toast.success("Kendaraan dihapus");
        setConfirmOpen(false);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <Card className="gap-0 py-0">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate font-semibold text-foreground">
              {vehicle.name}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {vehicle.plateNumber ?? "Tanpa plat"} ·{" "}
              {formatDateShort(vehicle.purchaseDate)}
            </p>
          </div>
          <VehicleStatusBadge status={vehicle.status} />
        </div>

        <div className="mt-3 flex items-end justify-between border-t pt-3">
          <div>
            <p className="text-[11px] text-muted-foreground">Total modal</p>
            <p className="text-lg font-bold text-primary">
              {formatRupiah(vehicle.totalModal)}
            </p>
          </div>
          <div className="flex items-center gap-1">
            {isOwned ? (
              <Button size="sm" onClick={() => setSellOpen(true)}>
                <Tag /> Jual
              </Button>
            ) : null}
            <Button
              variant="ghost"
              size="icon"
              className="size-9 text-muted-foreground"
              onClick={() => setEditOpen(true)}
              aria-label="Edit kendaraan"
            >
              <Pencil />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-9 text-muted-foreground hover:text-destructive"
              onClick={() => setConfirmOpen(true)}
              aria-label="Hapus kendaraan"
            >
              <Trash2 />
            </Button>
          </div>
        </div>
      </CardContent>

      <VehicleFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        vehicle={vehicle}
      />
      <SellDialog open={sellOpen} onOpenChange={setSellOpen} vehicle={vehicle} />
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Hapus kendaraan?"
        description={`"${vehicle.name}" dan semua biaya tambahannya akan dihapus permanen.`}
        confirmLabel="Hapus"
        destructive
        loading={isPending}
        onConfirm={handleDelete}
      />
    </Card>
  );
}
