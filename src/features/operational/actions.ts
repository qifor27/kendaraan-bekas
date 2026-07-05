"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import type { ActionResult } from "@/lib/action-result";
import {
  operationalExpenseSchema,
  type OperationalExpenseValues,
} from "./schema";

function revalidateOperationalViews() {
  revalidatePath("/operasional");
  revalidatePath("/");
}

export async function createOperationalExpense(
  values: OperationalExpenseValues,
): Promise<ActionResult> {
  const parsed = operationalExpenseSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0].message };
  }
  const data = parsed.data;

  try {
    await prisma.operationalExpense.create({
      data: {
        label: data.label,
        amount: data.amount,
        date: new Date(data.date),
      },
    });
    revalidateOperationalViews();
    return { success: true };
  } catch {
    return { success: false, message: "Gagal menyimpan biaya." };
  }
}

export async function deleteOperationalExpense(
  id: string,
): Promise<ActionResult> {
  try {
    await prisma.operationalExpense.delete({ where: { id } });
    revalidateOperationalViews();
    return { success: true };
  } catch {
    return { success: false, message: "Gagal menghapus biaya." };
  }
}
