import { z } from "zod";

export const additionalCostSchema = z.object({
  label: z.string().trim().min(1, "Keterangan biaya wajib diisi"),
  amount: z.number().int("Nominal tidak valid").min(0, "Nominal tidak valid"),
});

export const vehicleFormSchema = z.object({
  name: z.string().trim().min(1, "Nama kendaraan wajib diisi").max(100),
  plateNumber: z.string().trim().max(20).optional().or(z.literal("")),
  purchaseDate: z.string().min(1, "Tanggal beli wajib diisi"),
  purchasePrice: z
    .number({ message: "Harga beli wajib diisi" })
    .int()
    .min(0, "Harga beli tidak valid"),
  additionalCosts: z.array(additionalCostSchema),
});

export type VehicleFormValues = z.infer<typeof vehicleFormSchema>;
export type AdditionalCostValues = z.infer<typeof additionalCostSchema>;
