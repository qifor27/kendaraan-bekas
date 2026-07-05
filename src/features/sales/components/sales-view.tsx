"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { History, RotateCcw } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDateShort, formatRupiah } from "@/lib/format";
import { fitTextSizeClass } from "@/lib/fit-text";
import { cn } from "@/lib/utils";
import { cancelSale } from "../actions";
import type { SaleItem } from "../queries";

// Font size shrinks in steps as the value string gets longer, so amounts
// stay on one line inside the tight 3-column grid instead of overflowing.
const VALUE_SIZE_TIERS: ReadonlyArray<readonly [number, string]> = [
  [9, "text-sm"],
  [12, "text-xs"],
];
const VALUE_SIZE_FALLBACK = "text-[11px]";

function SaleCard({ sale }: { sale: SaleItem }) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleCancel() {
    startTransition(async () => {
      const result = await cancelSale(sale.vehicleId);
      if (result.success) {
        toast.success("Penjualan dibatalkan");
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
              {sale.name}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {sale.plateNumber ?? "Tanpa plat"} ·{" "}
              {formatDateShort(sale.saleDate)}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="size-9 text-muted-foreground hover:text-destructive"
            onClick={() => setConfirmOpen(true)}
            aria-label="Batalkan penjualan"
          >
            <RotateCcw />
          </Button>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2 border-t pt-3 text-center">
          <div className="min-w-0">
            <p className="text-[11px] text-muted-foreground">Modal</p>
            <p
              className={cn(
                "whitespace-nowrap font-semibold",
                fitTextSizeClass(
                  formatRupiah(sale.totalModal),
                  VALUE_SIZE_TIERS,
                  VALUE_SIZE_FALLBACK,
                ),
              )}
            >
              {formatRupiah(sale.totalModal)}
            </p>
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-muted-foreground">Harga jual</p>
            <p
              className={cn(
                "whitespace-nowrap font-semibold",
                fitTextSizeClass(
                  formatRupiah(sale.salePrice),
                  VALUE_SIZE_TIERS,
                  VALUE_SIZE_FALLBACK,
                ),
              )}
            >
              {formatRupiah(sale.salePrice)}
            </p>
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-muted-foreground">Laba</p>
            <p
              className={cn(
                "whitespace-nowrap font-bold",
                fitTextSizeClass(
                  formatRupiah(sale.laba),
                  VALUE_SIZE_TIERS,
                  VALUE_SIZE_FALLBACK,
                ),
                sale.laba >= 0 ? "text-success" : "text-destructive",
              )}
            >
              {formatRupiah(sale.laba)}
            </p>
          </div>
        </div>
      </CardContent>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Batalkan penjualan?"
        description={`"${sale.name}" akan kembali ke daftar kendaraan dimiliki.`}
        confirmLabel="Batalkan"
        destructive
        loading={isPending}
        onConfirm={handleCancel}
      />
    </Card>
  );
}

export function SalesView({ sales }: { sales: SaleItem[] }) {
  return (
    <>
      <PageHeader title="Riwayat penjualan" />

      {sales.length === 0 ? (
        <Card>
          <EmptyState
            icon={History}
            title="Belum ada kendaraan yang terjual"
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {sales.map((sale) => (
            <SaleCard key={sale.vehicleId} sale={sale} />
          ))}
        </div>
      )}
    </>
  );
}
