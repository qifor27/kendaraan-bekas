import "server-only";

import { prisma } from "@/lib/prisma";
import { computeTotalModal } from "@/lib/vehicle";

export type VehicleStatus = "OWNED" | "SOLD";

export interface VehicleAdditionalCost {
  id: string;
  label: string;
  amount: number;
}

export interface VehicleListItem {
  id: string;
  name: string;
  plateNumber: string | null;
  purchaseDate: Date;
  purchasePrice: number;
  status: VehicleStatus;
  additionalCosts: VehicleAdditionalCost[];
  additionalCostsTotal: number;
  totalModal: number;
  sale: { salePrice: number; saleDate: Date } | null;
}

/** All vehicles, newest first, with costs + computed modal (filtering is client-side). */
export async function getVehicles(): Promise<VehicleListItem[]> {
  const vehicles = await prisma.vehicle.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      additionalCosts: { orderBy: { createdAt: "asc" } },
      sale: true,
    },
  });

  return vehicles.map((vehicle) => {
    const additionalCostsTotal = vehicle.additionalCosts.reduce(
      (sum, cost) => sum + cost.amount,
      0,
    );

    return {
      id: vehicle.id,
      name: vehicle.name,
      plateNumber: vehicle.plateNumber,
      purchaseDate: vehicle.purchaseDate,
      purchasePrice: vehicle.purchasePrice,
      status: vehicle.status as VehicleStatus,
      additionalCosts: vehicle.additionalCosts.map((cost) => ({
        id: cost.id,
        label: cost.label,
        amount: cost.amount,
      })),
      additionalCostsTotal,
      totalModal: computeTotalModal(vehicle.purchasePrice, vehicle.additionalCosts),
      sale: vehicle.sale
        ? { salePrice: vehicle.sale.salePrice, saleDate: vehicle.sale.saleDate }
        : null,
    };
  });
}
