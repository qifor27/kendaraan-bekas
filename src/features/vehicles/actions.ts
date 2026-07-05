"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import type { ActionResult } from "@/lib/action-result";
import { vehicleFormSchema, type VehicleFormValues } from "./schema";

function revalidateVehicleViews() {
  revalidatePath("/kendaraan");
  revalidatePath("/");
}

export async function createVehicle(
  values: VehicleFormValues,
): Promise<ActionResult> {
  const parsed = vehicleFormSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0].message };
  }
  const data = parsed.data;

  try {
    await prisma.vehicle.create({
      data: {
        name: data.name,
        plateNumber: data.plateNumber || null,
        purchaseDate: new Date(data.purchaseDate),
        purchasePrice: data.purchasePrice,
        additionalCosts: {
          create: data.additionalCosts.map((cost) => ({
            label: cost.label,
            amount: cost.amount,
          })),
        },
      },
    });
    revalidateVehicleViews();
    return { success: true };
  } catch {
    return { success: false, message: "Gagal menyimpan kendaraan." };
  }
}

export async function updateVehicle(
  id: string,
  values: VehicleFormValues,
): Promise<ActionResult> {
  const parsed = vehicleFormSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0].message };
  }
  const data = parsed.data;

  try {
    // Replace the additional-cost rows wholesale inside a transaction.
    await prisma.$transaction([
      prisma.additionalCost.deleteMany({ where: { vehicleId: id } }),
      prisma.vehicle.update({
        where: { id },
        data: {
          name: data.name,
          plateNumber: data.plateNumber || null,
          purchaseDate: new Date(data.purchaseDate),
          purchasePrice: data.purchasePrice,
          additionalCosts: {
            create: data.additionalCosts.map((cost) => ({
              label: cost.label,
              amount: cost.amount,
            })),
          },
        },
      }),
    ]);
    revalidateVehicleViews();
    return { success: true };
  } catch {
    return { success: false, message: "Gagal menyimpan perubahan." };
  }
}

export async function deleteVehicle(id: string): Promise<ActionResult> {
  try {
    await prisma.vehicle.delete({ where: { id } });
    revalidateVehicleViews();
    return { success: true };
  } catch {
    return { success: false, message: "Gagal menghapus kendaraan." };
  }
}
