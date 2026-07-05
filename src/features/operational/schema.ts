import { z } from "zod";

export const operationalExpenseSchema = z.object({
  label: z.string().trim().min(1, "Keterangan wajib diisi").max(100),
  date: z.string().min(1, "Tanggal wajib diisi"),
  amount: z
    .number({ message: "Jumlah wajib diisi" })
    .int()
    .min(1, "Jumlah harus lebih dari 0"),
});

export type OperationalExpenseValues = z.infer<typeof operationalExpenseSchema>;
