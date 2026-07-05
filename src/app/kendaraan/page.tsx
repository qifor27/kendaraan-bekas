import { VehiclesView } from "@/features/vehicles/components/vehicles-view";
import { getVehicles } from "@/features/vehicles/queries";

export const dynamic = "force-dynamic";

export default async function KendaraanPage() {
  const vehicles = await getVehicles();
  return <VehiclesView vehicles={vehicles} />;
}
