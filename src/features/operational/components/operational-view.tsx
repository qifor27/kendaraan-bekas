"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Wallet, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { EmptyState } from "@/components/shared/empty-state";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDateShort, formatRupiah } from "@/lib/format";
import { deleteOperationalExpense } from "../actions";
import type { OperationalExpenseItem } from "../queries";
import { OperationalForm } from "./operational-form";

function ExpenseRow({ expense }: { expense: OperationalExpenseItem }) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteOperationalExpense(expense.id);
      if (result.success) {
        toast.success("Biaya dihapus");
        setConfirmOpen(false);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <div className="flex items-center justify-between gap-3 py-3">
      <div className="min-w-0">
        <p className="truncate font-medium text-foreground">{expense.label}</p>
        <p className="text-xs text-muted-foreground">
          {formatDateShort(expense.date)}
        </p>
      </div>
      <div className="flex items-center gap-1">
        <span className="font-semibold text-warning">
          {formatRupiah(expense.amount)}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="size-9 text-muted-foreground hover:text-destructive"
          onClick={() => setConfirmOpen(true)}
          aria-label="Hapus biaya"
        >
          <Trash2 />
        </Button>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Hapus biaya?"
        description={`"${expense.label}" akan dihapus permanen.`}
        confirmLabel="Hapus"
        destructive
        loading={isPending}
        onConfirm={handleDelete}
      />
    </div>
  );
}

export function OperationalView({
  expenses,
}: {
  expenses: OperationalExpenseItem[];
}) {
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <>
      <PageHeader title="Biaya Operasional" />

      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Jumlah item" value={`${expenses.length} item`} />
        <StatCard
          label="Total biaya operasional"
          value={formatRupiah(total)}
          tone="warning"
          highlighted
        />
      </div>

      <Card className="mt-4 gap-0 py-0">
        <CardHeader className="border-b py-4">
          <CardTitle>Daftar biaya</CardTitle>
          <CardDescription>Gaji, sewa, listrik, dll</CardDescription>
        </CardHeader>

        <CardContent className="px-4">
          {expenses.length === 0 ? (
            <EmptyState icon={Wallet} title="Belum ada biaya operasional" />
          ) : (
            <div className="divide-y">
              {expenses.map((expense) => (
                <ExpenseRow key={expense.id} expense={expense} />
              ))}
            </div>
          )}
        </CardContent>

        <div className="border-t p-4">
          <OperationalForm />
        </div>
      </Card>
    </>
  );
}
