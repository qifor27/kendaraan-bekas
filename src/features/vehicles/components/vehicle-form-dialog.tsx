"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, useWatch, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CurrencyInput } from "@/components/shared/currency-input";
import { formatRupiah } from "@/lib/format";
import { todayInputValue, toDateInputValue } from "@/lib/date";
import { cn } from "@/lib/utils";
import { createVehicle, updateVehicle } from "../actions";
import { vehicleFormSchema, type VehicleFormValues } from "../schema";
import type { VehicleListItem } from "../queries";

interface VehicleFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Provided => edit mode; omitted => create mode. */
  vehicle?: VehicleListItem;
}

function buildDefaults(vehicle?: VehicleListItem): VehicleFormValues {
  if (!vehicle) {
    return {
      name: "",
      plateNumber: "",
      purchaseDate: todayInputValue(),
      purchasePrice: 0,
      additionalCosts: [],
    };
  }
  return {
    name: vehicle.name,
    plateNumber: vehicle.plateNumber ?? "",
    purchaseDate: toDateInputValue(vehicle.purchaseDate),
    purchasePrice: vehicle.purchasePrice,
    additionalCosts: vehicle.additionalCosts.map((cost) => ({
      label: cost.label,
      amount: cost.amount,
    })),
  };
}

export function VehicleFormDialog({
  open,
  onOpenChange,
  vehicle,
}: VehicleFormDialogProps) {
  const isEdit = Boolean(vehicle);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: buildDefaults(vehicle),
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "additionalCosts",
  });

  const purchasePrice =
    useWatch({ control: form.control, name: "purchasePrice" }) || 0;
  const additionalCosts =
    useWatch({ control: form.control, name: "additionalCosts" }) ?? [];
  const additionalTotal = additionalCosts.reduce(
    (sum, cost) => sum + (cost.amount || 0),
    0,
  );
  const totalModal = purchasePrice + additionalTotal;

  function handleOpenChange(next: boolean) {
    // Reset to a clean slate whenever the dialog closes/reopens.
    if (next) form.reset(buildDefaults(vehicle));
    onOpenChange(next);
  }

  function onSubmit(values: VehicleFormValues) {
    startTransition(async () => {
      const result = vehicle
        ? await updateVehicle(vehicle.id, values)
        : await createVehicle(values);

      if (result.success) {
        toast.success(isEdit ? "Perubahan disimpan" : "Kendaraan ditambahkan");
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
          <DialogTitle>
            {isEdit ? "Edit kendaraan" : "Tambah kendaraan"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          {/* Nama kendaraan */}
          <div className="space-y-1.5">
            <Label htmlFor="name">
              Nama kendaraan <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="cth: Honda Beat 2020"
              {...form.register("name")}
            />
            {errors.name ? (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            ) : null}
          </div>

          {/* Plat nomor + Tanggal beli */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="plateNumber">Plat nomor</Label>
              <Input
                id="plateNumber"
                placeholder="cth: BA 1234"
                {...form.register("plateNumber")}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="purchaseDate">
                Tanggal beli <span className="text-destructive">*</span>
              </Label>
              <Input
                id="purchaseDate"
                type="date"
                {...form.register("purchaseDate")}
              />
            </div>
          </div>

          {/* Harga beli */}
          <div className="space-y-1.5">
            <Label htmlFor="purchasePrice">
              Harga beli (Rp) <span className="text-destructive">*</span>
            </Label>
            <Controller
              control={form.control}
              name="purchasePrice"
              render={({ field }) => (
                <CurrencyInput
                  id="purchasePrice"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.purchasePrice ? (
              <p className="text-xs text-destructive">
                {errors.purchasePrice.message}
              </p>
            ) : null}
          </div>

          {/* Biaya tambahan */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Biaya tambahan</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ label: "", amount: 0 })}
              >
                <Plus /> Tambah biaya
              </Button>
            </div>

            {fields.map((field, index) => (
              <div key={field.id} className="flex items-start gap-2">
                <div className="flex-1 space-y-1">
                  <Input
                    placeholder="Keterangan"
                    className="h-10"
                    {...form.register(`additionalCosts.${index}.label`)}
                  />
                  {errors.additionalCosts?.[index]?.label ? (
                    <p className="text-xs text-destructive">
                      {errors.additionalCosts[index]?.label?.message}
                    </p>
                  ) : null}
                </div>
                <Controller
                  control={form.control}
                  name={`additionalCosts.${index}.amount`}
                  render={({ field: amountField }) => (
                    <CurrencyInput
                      className="h-10 w-28"
                      value={amountField.value}
                      onChange={amountField.onChange}
                    />
                  )}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-10 shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={() => remove(index)}
                  aria-label="Hapus biaya"
                >
                  <Trash2 />
                </Button>
              </div>
            ))}
          </div>

          {/* Ringkasan modal */}
          <div className="space-y-2 rounded-xl bg-card p-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Harga beli</span>
              <span className="font-medium">{formatRupiah(purchasePrice)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total biaya tambahan</span>
              <span className="font-medium">{formatRupiah(additionalTotal)}</span>
            </div>
            <div
              className={cn(
                "flex justify-between border-t pt-2 text-base font-bold",
              )}
            >
              <span>Total modal</span>
              <span className="text-primary">{formatRupiah(totalModal)}</span>
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
              {isPending ? "Menyimpan…" : "Simpan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
