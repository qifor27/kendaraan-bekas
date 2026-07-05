import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Uses the same runtime connection the app uses (DATABASE_URL via pg adapter).
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
const prisma = new PrismaClient({ adapter });

async function main() {
  // Idempotent: clear then reseed.
  await prisma.sale.deleteMany();
  await prisma.additionalCost.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.operationalExpense.deleteMany();

  await prisma.vehicle.create({
    data: {
      name: "Honda Beat 2020",
      plateNumber: "BA 1234 XY",
      purchaseDate: new Date("2026-05-01"),
      purchasePrice: 12_000_000,
      status: "OWNED",
      additionalCosts: {
        create: [
          { label: "Servis mesin", amount: 500_000 },
          { label: "Ban baru", amount: 350_000 },
        ],
      },
    },
  });

  await prisma.vehicle.create({
    data: {
      name: "Yamaha NMAX 2019",
      plateNumber: "BA 5678 ZZ",
      purchaseDate: new Date("2026-05-20"),
      purchasePrice: 18_000_000,
      status: "OWNED",
      additionalCosts: { create: [{ label: "Ganti aki", amount: 400_000 }] },
    },
  });

  const vario = await prisma.vehicle.create({
    data: {
      name: "Honda Vario 2018",
      plateNumber: "BA 4321 AB",
      purchaseDate: new Date("2026-04-10"),
      purchasePrice: 10_000_000,
      status: "SOLD",
      additionalCosts: { create: [{ label: "Poles body", amount: 300_000 }] },
    },
  });

  await prisma.sale.create({
    data: {
      vehicleId: vario.id,
      salePrice: 13_500_000,
      saleDate: new Date("2026-06-15"),
    },
  });

  await prisma.operationalExpense.createMany({
    data: [
      { label: "Sewa lapak", amount: 1_000_000, date: new Date("2026-06-01") },
      { label: "Listrik", amount: 200_000, date: new Date("2026-06-05") },
    ],
  });

  console.log("Seed complete: 2 owned, 1 sold, 2 operational expenses.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
