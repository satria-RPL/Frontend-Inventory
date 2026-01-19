"use client";

import { usePathname } from "next/navigation";
import {
  Home,
  Database,
  ArrowRightLeft,
  ChartLine,
  ChartBar,
  UserCog,
  Clock,
  Settings,
  LogOut
} from "lucide-react";
import type { NavItem } from "@/types/nav";

export const useNavItems = (): NavItem[] => {
  const pathname = usePathname();

  const isChildActive = (href: string) => pathname === href;
  const isParentActive = (children: any[]) =>
    children?.some((c) => isChildActive(c.href));

  return [
    {
      name: "Dashboard",
      href: "/main/dashboard",
      icon: <Home size={20} />,
      active: pathname === "/main/dashboard",
      position: "top",
    },
    {
      name: "Master Data",
      icon: <Database size={20} />,
      position: "top",
      active: isParentActive([
        { href: "/main/masterdata/products" },
        { href: "/main/masterdata/raw-material" },
      ]),
      children: [
        {
          name: "Products",
          href: "/main/masterdata/products",
          icon: <span className="text-orange-500">•</span>,
          active: isChildActive("/main/masterdata/products"),
          position: "top",
        },
        {
          name: "Bahan Baku",
          href: "/main/masterdata/raw-material",
          icon: <span className="text-gray-300">•</span>,
          active: isChildActive("/main/masterdata/raw-material"),
          position: "top",
        },
      ],
    },
    {
      name: "All Transactions",
      href: "/main/alltransactions",
      icon: <ArrowRightLeft size={20} />,
      active: pathname === "/main/alltransactions",
      position: "top",
      children: [
        {
          name: "Purchase Items",
          href: "/main/alltransactions/purchase-items",
          icon: <span className="text-orange-500">•</span>,
          active: isChildActive("/main/alltransactions/purchase-items"),
          position: "top",
        },
        {
          name: "Catatan Produksi",
          href: "/main/alltransactions/catatan-produksi",
          icon: <span className="text-gray-300">•</span>,
          active: isChildActive("/main/alltransactions/catatan-produksi"),
          position: "top",
        },
        {
          name: "Inventori Bahan Baku",
          href: "/main/alltransactions/inventori-bahan-baku",
          icon: <span className="text-gray-300">•</span>,
          active: isChildActive("/main/alltransactions/inventori-bahan-baku"),
          position: "top",
        },
        {
          name: "Finished Goods Stock",
          href: "/main/alltransactions/finished-goods-stock",
          icon: <span className="text-gray-300">•</span>,
          active: isChildActive("/main/alltransactions/finished-goods-stock"),
          position: "top",
        },
        {
          name: "Stock Opname",
          href: "/main/alltransactions/stock-opname",
          icon: <span className="text-gray-300">•</span>,
          active: isChildActive("/main/alltransactions/stock-opname"),
          position: "top",
        },
      ],
    },
    {
      name: "Sales",
      href: "/main/sales",
      icon: <ChartLine size={20} />,
      active: pathname === "/main/sales",
      position: "top",
      children: [
        {
          name: "Scanner",
          href: "/main/sales/scanner",
          icon: <span className="text-orange-500">•</span>,
          active: isChildActive("/main/sales/scanner"),
          position: "top",
        },
        {
          name: "Sales Management",
          href: "/main/sales/management",
          icon: <span className="text-gray-300">•</span>,
          active: isChildActive("/main/sales/management"),
          position: "top",
        },
        {
          name: "Sales Report",
          href: "/main/sales/report",
          icon: <span className="text-gray-300">•</span>,
          active: isChildActive("/main/sales/report"),
          position: "top",
        },
      ],
    },
    {
      name: "Reports",
      href: "/main/reports",
      icon: <ChartBar size={20} />,
      active: pathname === "/main/reports",
      position: "top",
      children: [
        {
          name: "Laporan Purchase",
          href: "/main/reports/laporan-purchase",
          icon: <span className="text-orange-500">•</span>,
          active: isChildActive("/main/reports/laporan-purchase"),
          position: "top",
        },
        {
          name: "Laporan Catatan Produksi",
          href: "/main/reports/laporan-catatan-produksi",
          icon: <span className="text-gray-300">•</span>,
          active: isChildActive("/main/reports/laporan-catatan-produksi"),
          position: "top",
        },
      ],
    },
    {
      name: "User Management",
      href: "/main/management",
      icon: <UserCog size={20} />,
      active: pathname === "/main/management",
      position: "top",
      children: [
        {
          name: "Users",
          href: "/main/management/users",
          icon: <span className="text-orange-500">•</span>,
          active: isChildActive("/main/management/users"),
          position: "top",
        },
        {
          name: "Roles",
          href: "/main/management/roles",
          icon: <span className="text-gray-300">•</span>,
          active: isChildActive("/main/management/roles"),
          position: "top",
        },
        {
          name: "Permissions",
          href: "/main/management/permissions",
          icon: <span className="text-gray-300">•</span>,
          active: isChildActive("/main/management/permissions"),
          position: "top",
        },
      ],
    },
    {
      name: "Activity Log",
      href: "/main/activitylog",
      icon: <Clock size={20} />,
      active: pathname === "/main/activitylog",
      position: "top",
    },
    {
      name: "Settings",
      href: "/main/settings",
      icon: <Settings size={20} />,
      active: pathname === "/main/settings",
      position: "top",
    },
    {
      name: "Logout",
      href: "/public/shift/closingshift",
      icon: <LogOut size={20} />,
      active: false,
      position: "bottom",
    },
  ];
};
