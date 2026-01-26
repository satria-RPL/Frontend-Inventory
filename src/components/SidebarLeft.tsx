"use client";

import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { ChefHat } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import { useNavItems } from "@/config/nav-items";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/types/nav";
import { usePersistentBoolean } from "@/lib/hooks/usePersistentBoolean";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type SidebarLeftProps = {
  role?: string;
};

/* ===============================
   SUB MENU (COLLAPSIBLE GROUP)
================================ */
function SideNavGroup({
  item,
  isSidebarExpanded,
  openGroup,
  onToggleGroup,
}: {
  item: NavItem;
  isSidebarExpanded: boolean;
  openGroup: string | null;
  onToggleGroup: (groupKey: string) => void;
}) {
  const isActive = item.children?.some((c) => c.active);
  const groupKey = item.name;
  const open = openGroup === groupKey;
  const iconClass = "shrink-0 text-[14px] [&_svg]:h-4 [&_svg]:w-4";

  return (
    <div>
      {/* PARENT */}
      <button
        type="button"
        onClick={() => onToggleGroup(groupKey)}
        className={cn(
          "w-full flex items-center justify-between rounded-md px-3 py-1.5 text-[13px] transition-colors",
          isActive || open
            ? "bg-orange-50 text-orange-500"
            : "hover:bg-orange-50 hover:text-orange-500"
        )}
      >
        <div className="flex items-center gap-2">
          <span className={iconClass}>{item.icon}</span>
          {isSidebarExpanded && <span>{item.name}</span>}
        </div>

        {isSidebarExpanded && (
          <ChevronDown
            size={14}
            className={cn(
              "transition-transform duration-200",
              open && "rotate-180"
            )}
          />
        )}
      </button>

      {/* CHILD */}
      {open && isSidebarExpanded && (
        <div className="ml-6 mt-1 space-y-1 border-l-2 border-gray-400 pl-3 transition-all duration-200">
          {item.children?.map((child) => (
            <Link
              key={child.href}
              href={child.href!}
              className={cn(
                "flex items-center gap-2 rounded-md px-2 py-1 text-[13px]",
                child.active
                  ? "text-orange-500 font-medium"
                  : "text-gray-600 hover:text-orange-500"
              )}
            >
              <span
                className={cn(
                  "shrink-0 text-[14px] [&_svg]:h-3.5 [&_svg]:w-3.5",
                  child.active ? "text-orange-500" : "text-gray-400"
                )}
              >
                {child.icon}
              </span>
              {child.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

/* ===============================
   SINGLE NAV ITEM
================================ */
type SideNavItemProps = NavItem & { isSidebarExpanded: boolean };

function SideNavItem({
  name,
  icon,
  href,
  active,
  isSidebarExpanded,
}: SideNavItemProps) {
  //
  const baseClasses =
    "relative flex items-center whitespace-nowrap rounded-md text-[13px] duration-100";
  const activeClasses = "bg-orange-50 text-orange-500";
  const inactiveClasses = "hover:bg-orange-50 hover:text-orange-500";
  const iconClass = "shrink-0 text-[14px] [&_svg]:h-4 [&_svg]:w-4";

  return isSidebarExpanded ? (
    <Link
      href={href!}
      className={cn(baseClasses, active ? activeClasses : inactiveClasses)}
    >
      <div className="flex items-center gap-2 px-3 py-2">
        <span className={iconClass}>{icon}</span>
        <span>{name}</span>
      </div>
    </Link>
  ) : (
    <TooltipProvider delayDuration={70}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={href!}
            className={cn(
              baseClasses,
              active ? activeClasses : inactiveClasses
            )}
          >
            <div className="flex justify-center px-3 py-2">
              <span className={iconClass}>{icon}</span>
            </div>
          </Link>
        </TooltipTrigger>
        <TooltipContent
          side="right"
          sideOffset={20}
          className="px-2 py-2 text-xs bg-neutral-900 text-neutral-100 rounded-md shadow"
        >
          {name}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

/* ===============================
   MAIN SIDEBAR
================================ */
export default function SidebarLeft({ role }: SidebarLeftProps) {
  const navItems = useNavItems();

  const { value: isSidebarExpanded, toggle } = usePersistentBoolean(
    "sidebarExpanded",
    true
  );

  // update css variable width
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--sidebar-width",
      isSidebarExpanded ? "13rem" : "5rem"
    );
  }, [isSidebarExpanded]);

  const normalizedRole = (role ?? "").toLowerCase();
  const isChef = normalizedRole.includes("chef");

  const kitchenNavItem = useMemo<NavItem>(
    () => ({
      name: "Kitchen",
      href: "/main/kitchen",
      icon: <ChefHat width={20} height={20} />,
      active: false,
      position: "top",
    }),
    []
  );

  const filteredItems = useMemo(() => {
    if (!isChef) return navItems;

    const allowedBottom = navItems.filter(
      (item) =>
        item.href?.startsWith("/main/help") ||
        item.href?.startsWith("/main/settings")
    );

    return [kitchenNavItem, ...allowedBottom];
  }, [isChef, navItems, kitchenNavItem]);

  const topItems = filteredItems.filter((i) => i.position === "top");
  const bottomItems = filteredItems.filter((i) => i.position === "bottom");
  const pathname = usePathname();
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  useEffect(() => {
    setOpenGroup(null);
  }, [pathname]);

  const handleToggleGroup = (groupKey: string) => {
    setOpenGroup((current) => (current === groupKey ? null : groupKey));
  };

  return (
    <aside
      className={cn(
        "fixed top-22 bottom-0 left-0 z-20 border-r-2 bg-(--background) border-gray-200 px-3 py-3 transition-all duration-300",
        isSidebarExpanded ? "w-55" : "w-20"
      )}
    >
      {/* TOGGLE */}
      <button
        type="button"
        onClick={toggle}
        className="absolute top-16 -right-3 flex h-6 w-6 items-center justify-center rounded-full border-2 border-gray-200 bg-white shadow-md hover:shadow-lg"
      >
        {isSidebarExpanded ? (
          <ChevronLeft size={20} />
        ) : (
          <ChevronRight size={20} />
        )}
      </button>

      <div className="flex h-full flex-col justify-between">
        {/* TOP */}
        <div className="mt-3 space-y-4">
          {topItems.map((item) =>
            item.children ? (
              <SideNavGroup
                key={item.name}
                item={item}
                isSidebarExpanded={isSidebarExpanded}
                openGroup={openGroup}
                onToggleGroup={handleToggleGroup}
              />
            ) : (
              <SideNavItem
                key={item.name}
                {...item}
                isSidebarExpanded={isSidebarExpanded}
              />
            )
          )}
        </div>

        {/* BOTTOM */}
        <div className="mb-3 space-y-4">
          {bottomItems.map((item) => (
            <SideNavItem
              key={item.name}
              {...item}
              isSidebarExpanded={isSidebarExpanded}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}
