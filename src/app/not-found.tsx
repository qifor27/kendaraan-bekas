import Link from "next/link";
import { MapPinOff } from "lucide-react";

import { EmptyState } from "@/components/shared/empty-state";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="pt-12">
      <EmptyState
        icon={MapPinOff}
        title="Halaman tidak ditemukan"
        action={
          <Link href="/" className={buttonVariants()}>
            Kembali ke Dashboard
          </Link>
        }
      />
    </div>
  );
}
