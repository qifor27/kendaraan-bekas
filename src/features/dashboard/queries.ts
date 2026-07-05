import "server-only";

import { prisma } from "@/lib/prisma";
import { computeTotalModal } from "@/lib/vehicle";

export interface DashboardStats {
  ownedCount: number;
  soldCount: number;
  modalKendaraan: number;
  biayaOperasional: number;
  totalModalKeseluruhan: number;
  labaKotor: number;
  labaBersih: number;
}

export interface ActiveVehicle {
  id: string;
  name: string;
  plateNumber: string | null;
  purchaseDate: Date;
  totalModal: number;
}

/** Aggregated metrics for the six dashboard stat cards. */
export async function getDashboardStats(): Promise<DashboardStats> {
  const [
    ownedCount,
    soldCount,
    operationalSum,
    ownedPurchaseSum,
    ownedCostsSum,
    saleSum,
    soldPurchaseSum,
    soldCostsSum,
  ] = await Promise.all([
    prisma.vehicle.count({ where: { status: "OWNED" } }),
    prisma.vehicle.count({ where: { status: "SOLD" } }),
    prisma.operationalExpense.aggregate({ _sum: { amount: true } }),
    prisma.vehicle.aggregate({
      where: { status: "OWNED" },
      _sum: { purchasePrice: true },
    }),
    prisma.additionalCost.aggregate({
      where: { vehicle: { status: "OWNED" } },
      _sum: { amount: true },
    }),
    prisma.sale.aggregate({ _sum: { salePrice: true } }),
    prisma.vehicle.aggregate({
      where: { status: "SOLD" },
      _sum: { purchasePrice: true },
    }),
    prisma.additionalCost.aggregate({
      where: { vehicle: { status: "SOLD" } },
      _sum: { amount: true },
    }),
  ]);

  const modalKendaraan =
    (ownedPurchaseSum._sum.purchasePrice ?? 0) + (ownedCostsSum._sum.amount ?? 0);
  const biayaOperasional = operationalSum._sum.amount ?? 0;
  const soldModal =
    (soldPurchaseSum._sum.purchasePrice ?? 0) + (soldCostsSum._sum.amount ?? 0);
  const labaKotor = (saleSum._sum.salePrice ?? 0) - soldModal;

  return {
    ownedCount,
    soldCount,
    modalKendaraan,
    biayaOperasional,
    totalModalKeseluruhan: modalKendaraan + biayaOperasional,
    labaKotor,
    // Laba bersih = laba kotor dikurangi seluruh biaya operasional periode berjalan.
    labaBersih: labaKotor - biayaOperasional,
  };
}

/** Vehicles still owned, newest first, with total modal computed. */
export async function getActiveVehicles(): Promise<ActiveVehicle[]> {
  const vehicles = await prisma.vehicle.findMany({
    where: { status: "OWNED" },
    orderBy: { createdAt: "desc" },
    include: { additionalCosts: { select: { amount: true } } },
  });

  return vehicles.map((vehicle) => ({
    id: vehicle.id,
    name: vehicle.name,
    plateNumber: vehicle.plateNumber,
    purchaseDate: vehicle.purchaseDate,
    totalModal: computeTotalModal(vehicle.purchasePrice, vehicle.additionalCosts),
  }));
}
