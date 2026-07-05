import "server-only";

import { prisma } from "@/lib/prisma";

export interface OperationalExpenseItem {
  id: string;
  label: string;
  amount: number;
  date: Date;
}

/** All operational expenses, newest date first. */
export async function getOperationalExpenses(): Promise<OperationalExpenseItem[]> {
  const expenses = await prisma.operationalExpense.findMany({
    orderBy: { date: "desc" },
  });
  return expenses.map((expense) => ({
    id: expense.id,
    label: expense.label,
    amount: expense.amount,
    date: expense.date,
  }));
}
