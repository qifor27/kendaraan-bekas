"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CurrencyInput } from "@/components/shared/currency-input";
import { formatRupiah } from "@/lib/format";
import { todayInputValue } from "@/lib/date";
import { cn } from "@/lib/utils";
import { sellVehicle } from "../actions";
import { saleSchema, type SaleValues } from "../schema";

interface SellDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle: { id: string; name: string; totalModal: number };
}

export function SellDialog({ open, onOpenChange, vehicle }: SellDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<SaleValues>({
    resolver: zodResolver(saleSchema),
    defaultValues: { salePrice: 0, saleDate: todayInputValue(), notes: "" },
  });

  const salePrice = useWatch({ control: form.control, name: "salePrice" }) || 0;
  const laba = salePrice - vehicle.totalModal;

  function handleOpenChange(next: boolean) {
    if (next) {
      form.reset({ salePrice: 0, saleDate: todayInputValue(), notes: "" });
    }
    onOpenChange(next);
  }

  function onSubmit(values: SaleValues) {
    startTransition(async () => {
      const result = await sellVehicle(vehicle.id, values);
      if (result.success) {
        toast.success("Penjualan dicatat");
        onOpenChange(false);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  }

  const errors = form.formState.errors;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Jual kendaraan</DialogTitle>
          <DialogDescription>{vehicle.name}</DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <div className="space-y-1.5">
            <Label htmlFor="salePrice">
              Harga jual (Rp) <span className="text-destructive">*</span>
            </Label>
            <Controller
              control={form.control}
              name="salePrice"
              render={({ field }) => (
                <CurrencyInput
                  id="salePrice"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.salePrice ? (
              <p className="text-xs text-destructive">
                {errors.salePrice.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="saleDate">
              Tanggal jual <span className="text-destructive">*</span>
            </Label>
            <Input id="saleDate" type="date" {...form.register("saleDate")} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notes">Catatan</Label>
            <Input
              id="notes"
              placeholder="opsional"
              {...form.register("notes")}
            />
          </div>

          <div className="space-y-2 rounded-xl bg-card p-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total modal</span>
              <span className="font-medium">
                {formatRupiah(vehicle.totalModal)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Harga jual</span>
              <span className="font-medium">{formatRupiah(salePrice)}</span>
            </div>
            <div className="flex justify-between border-t pt-2 text-base font-bold">
              <span>Laba kotor</span>
              <span className={cn(laba >= 0 ? "text-success" : "text-destructive")}>
                {formatRupiah(laba)}
              </span>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Menyimpan…" : "Jual"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
