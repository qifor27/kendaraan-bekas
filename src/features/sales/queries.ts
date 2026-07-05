import "server-only";

import { prisma } from "@/lib/prisma";
import { computeTotalModal } from "@/lib/vehicle";

export interface SaleItem {
  vehicleId: string;
  name: string;
  plateNumber: string | null;
  saleDate: Date;
  salePrice: number;
  totalModal: number;
  laba: number;
}

/** Sold vehicles, newest sale first, with gross profit computed. */
export async function getSales(): Promise<SaleItem[]> {
  const sales = await prisma.sale.findMany({
    orderBy: { saleDate: "desc" },
    include: { vehicle: { include: { additionalCosts: true } } },
  });

  return sales.map((sale) => {
    const totalModal = computeTotalModal(
      sale.vehicle.purchasePrice,
      sale.vehicle.additionalCosts,
    );
    return {
      vehicleId: sale.vehicleId,
      name: sale.vehicle.name,
      plateNumber: sale.vehicle.plateNumber,
      saleDate: sale.saleDate,
      salePrice: sale.salePrice,
      totalModal,
      laba: sale.salePrice - totalModal,
    };
  });
}
