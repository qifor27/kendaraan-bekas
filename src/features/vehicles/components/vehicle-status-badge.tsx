import { Badge } from "@/components/ui/badge";
import type { VehicleStatus } from "../queries";

export function VehicleStatusBadge({ status }: { status: VehicleStatus }) {
  if (status === "SOLD") {
    return <Badge variant="success">Terjual</Badge>;
  }
  return <Badge variant="primary">Dimiliki</Badge>;
}
