"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CurrencyInput } from "@/components/shared/currency-input";
import { todayInputValue } from "@/lib/date";
import { createOperationalExpense } from "../actions";
import {
  operationalExpenseSchema,
  type OperationalExpenseValues,
} from "../schema";

function emptyValues(): OperationalExpenseValues {
  return { label: "", date: todayInputValue(), amount: 0 };
}

export function OperationalForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<OperationalExpenseValues>({
    resolver: zodResolver(operationalExpenseSchema),
    defaultValues: emptyValues(),
  });

  function onSubmit(values: OperationalExpenseValues) {
    startTransition(async () => {
      const result = await createOperationalExpense(values);
      if (result.success) {
        toast.success("Biaya ditambahkan");
        form.reset(emptyValues());
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  }

  const errors = form.formState.errors;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="op-label">
            Keterangan <span className="text-destructive">*</span>
          </Label>
          <Input
            id="op-label"
            placeholder="cth: Gaji karyawan"
            {...form.register("label")}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="op-date">
            Tanggal <span className="text-destructive">*</span>
          </Label>
          <Input id="op-date" type="date" {...form.register("date")} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="op-amount">
          Jumlah (Rp) <span className="text-destructive">*</span>
        </Label>
        <div className="flex gap-2">
          <Controller
            control={form.control}
            name="amount"
            render={({ field }) => (
              <CurrencyInput
                id="op-amount"
                className="flex-1"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
          <Button type="submit" disabled={isPending} className="shrink-0">
            <Plus /> {isPending ? "…" : "Tambah"}
          </Button>
        </div>
      </div>

      {errors.label || errors.amount ? (
        <p className="text-xs text-destructive">
          {errors.label?.message ?? errors.amount?.message}
        </p>
      ) : null}
    </form>
  );
}
