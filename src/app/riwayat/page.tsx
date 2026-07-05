import { SalesView } from "@/features/sales/components/sales-view";
import { getSales } from "@/features/sales/queries";

export const dynamic = "force-dynamic";

export default async function RiwayatPage() {
  const sales = await getSales();
  return <SalesView sales={sales} />;
}
