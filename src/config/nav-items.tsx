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
  const isParentActive = (children: Array<{ href?: string }>) =>
    children?.some((child) => child.href && isChildActive(child.href));

  const masterDataChildren: NavItem[] = [
    {
      name: "Products",
      href: "/main/masterdata/products",
      icon: <span>•</span>,
      active: isChildActive("/main/masterdata/products"),
      position: "top",
    },
    {
      name: "Bahan Baku",
      href: "/main/masterdata/raw-material",
      icon: <span>•</span>,
      active: isChildActive("/main/masterdata/raw-material"),
      position: "top",
    },
    {
      name: "Add-Ons",
      href: "/main/masterdata/add-ons",
      icon: <span>•</span>,
      active: isChildActive("/main/masterdata/add-ons"),
      position: "top",
    },
  ];

  const allTransactionsChildren: NavItem[] = [
    {
      name: "Purchase Items",
      href: "/main/alltransactions/purchase-items",
      icon: <span>•</span>,
      active: isChildActive("/main/alltransactions/purchase-items"),
      position: "top",
    },
    {
      name: "Catatan Produksi",
      href: "/main/alltransactions/catatan-produksi",
      icon: <span>•</span>,
      active: isChildActive("/main/alltransactions/catatan-produksi"),
      position: "top",
    },
    {
      name: "Inventori Bahan Baku",
      href: "/main/alltransactions/inventori-bahan-baku",
      icon: <span>•</span>,
      active: isChildActive("/main/alltransactions/inventori-bahan-baku"),
      position: "top",
    },
    {
      name: "Finished Goods Stock",
      href: "/main/alltransactions/finished-goods-stock",
      icon: <span>•</span>,
      active: isChildActive("/main/alltransactions/finished-goods-stock"),
      position: "top",
    },
    {
      name: "Stock Opname",
      href: "/main/alltransactions/stock-opname",
      icon: <span>•</span>,
      active: isChildActive("/main/alltransactions/stock-opname"),
      position: "top",
    },
  ];

  const salesChildren: NavItem[] = [
    {
      name: "Scanner",
      href: "/main/sales/scanner",
      icon: <span>•</span>,
      active: isChildActive("/main/sales/scanner"),
      position: "top",
    },
    {
      name: "Sales Management",
      href: "/main/sales/management",
      icon: <span>•</span>,
      active: isChildActive("/main/sales/management"),
      position: "top",
    },
    {
      name: "Sales Report",
      href: "/main/sales/report",
      icon: <span>•</span>,
      active: isChildActive("/main/sales/report"),
      position: "top",
    },
  ];

  const reportsChildren: NavItem[] = [
    {
      name: "Laporan Purchase",
      href: "/main/reports/laporan-purchase",
      icon: <span>•</span>,
      active: isChildActive("/main/reports/laporan-purchase"),
      position: "top",
    },
    {
      name: "Laporan Catatan Produksi",
      href: "/main/reports/laporan-catatan-produksi",
      icon: <span>•</span>,
      active: isChildActive("/main/reports/laporan-catatan-produksi"),
      position: "top",
    },
  ];

  const managementChildren: NavItem[] = [
    {
      name: "Users",
      href: "/main/management/users",
      icon: <span>•</span>,
      active: isChildActive("/main/management/users"),
      position: "top",
    },
    {
      name: "Roles",
      href: "/main/management/roles",
      icon: <span>•</span>,
      active: isChildActive("/main/management/roles"),
      position: "top",
    },
    {
      name: "Permissions",
      href: "/main/management/permissions",
      icon: <span>•</span>,
      active: isChildActive("/main/management/permissions"),
      position: "top",
    },
  ];

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
      active: isParentActive(masterDataChildren),
      children: masterDataChildren,
    },
    {
      name: "All Transactions",
      href: "/main/alltransactions",
      icon: <ArrowRightLeft size={20} />,
      active:
        pathname === "/main/alltransactions" ||
        isParentActive(allTransactionsChildren),
      position: "top",
      children: allTransactionsChildren,
    },
    {
      name: "Sales",
      href: "/main/sales",
      icon: <ChartLine size={20} />,
      active: pathname === "/main/sales" || isParentActive(salesChildren),
      position: "top",
      children: salesChildren,
    },
    {
      name: "Reports",
      href: "/main/reports",
      icon: <ChartBar size={20} />,
      active: pathname === "/main/reports" || isParentActive(reportsChildren),
      position: "top",
      children: reportsChildren,
    },
    {
      name: "User Management",
      href: "/main/management",
      icon: <UserCog size={20} />,
      active:
        pathname === "/main/management" || isParentActive(managementChildren),
      position: "top",
      children: managementChildren,
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
      href: "/auth/logout",
      icon: <LogOut size={20} />,
      active: false,
      position: "bottom",
    },
  ];
};
