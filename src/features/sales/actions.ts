"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import type { ActionResult } from "@/lib/action-result";
import { saleSchema, type SaleValues } from "./schema";

function revalidateSalesViews() {
  revalidatePath("/riwayat");
  revalidatePath("/kendaraan");
  revalidatePath("/");
}

export async function sellVehicle(
  vehicleId: string,
  values: SaleValues,
): Promise<ActionResult> {
  const parsed = saleSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0].message };
  }
  const data = parsed.data;

  try {
    await prisma.$transaction([
      prisma.sale.create({
        data: {
          vehicleId,
          salePrice: data.salePrice,
          saleDate: new Date(data.saleDate),
          notes: data.notes || null,
        },
      }),
      prisma.vehicle.update({
        where: { id: vehicleId },
        data: { status: "SOLD" },
      }),
    ]);
    revalidateSalesViews();
    return { success: true };
  } catch {
    return { success: false, message: "Gagal mencatat penjualan." };
  }
}

export async function cancelSale(vehicleId: string): Promise<ActionResult> {
  try {
    await prisma.$transaction([
      prisma.sale.deleteMany({ where: { vehicleId } }),
      prisma.vehicle.update({
        where: { id: vehicleId },
        data: { status: "OWNED" },
      }),
    ]);
    revalidateSalesViews();
    return { success: true };
  } catch {
    return { success: false, message: "Gagal membatalkan penjualan." };
  }
}
