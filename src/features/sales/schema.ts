import { z } from "zod";

export const saleSchema = z.object({
  salePrice: z
    .number({ message: "Harga jual wajib diisi" })
    .int()
    .min(1, "Harga jual harus lebih dari 0"),
  saleDate: z.string().min(1, "Tanggal jual wajib diisi"),
  notes: z.string().trim().max(200).optional().or(z.literal("")),
});

export type SaleValues = z.infer<typeof saleSchema>;
