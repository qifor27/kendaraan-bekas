import { LayoutGrid, Bike, Wallet, History, type LucideIcon } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

/** Bottom navigation — mirrors the original app's top tabs. */
export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Dashboard", icon: LayoutGrid },
  { href: "/kendaraan", label: "Kendaraan", icon: Bike },
  { href: "/operasional", label: "Operasional", icon: Wallet },
  { href: "/riwayat", label: "Riwayat Jual", icon: History },
];
