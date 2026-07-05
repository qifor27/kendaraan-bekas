import { OperationalView } from "@/features/operational/components/operational-view";
import { getOperationalExpenses } from "@/features/operational/queries";

export const dynamic = "force-dynamic";

export default async function OperasionalPage() {
  const expenses = await getOperationalExpenses();
  return <OperationalView expenses={expenses} />;
}
