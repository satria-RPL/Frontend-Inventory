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
      href: "/main/masterdata/ingredient",
      icon: <span>•</span>,
      active: isChildActive("/main/masterdata/ingredient"),
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
      href: "/main/alltransactions/purchaseitems",
      icon: <span>•</span>,
      active: isChildActive("/main/alltransactions/purchaseitems"),
      position: "top",
    },
    {
      name: "Catatan Produksi",
      href: "/main/alltransactions/catatanproduksi",
      icon: <span>•</span>,
      active: isChildActive("/main/alltransactions/catatanproduksi"),
      position: "top",
    },
    {
      name: "Inventori Bahan Baku",
      href: "/main/alltransactions/inventorybahanbaku",
      icon: <span>•</span>,
      active: isChildActive("/main/alltransactions/inventorybahanbaku"),
      position: "top",
    },
    {
      name: "Finished Goods Stock",
      href: "/main/alltransactions/finishedgoodsstock",
      icon: <span>•</span>,
      active: isChildActive("/main/alltransactions/finishedgoodsstock"),
      position: "top",
    },
    {
      name: "Stock Opname",
      href: "/main/alltransactions/stockopname",
      icon: <span>•</span>,
      active: isChildActive("/main/alltransactions/stockopname"),
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
      active: pathname.startsWith("/main/reports"),
      position: "top",
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

