import type { ReactNode } from "react";

export type NavPosition = "top" | "bottom";

export type NavItem = {
  name: string;
  href?: string; // parent boleh tidak punya href
  icon: ReactNode;
  active?: boolean;
  position: NavPosition;
  children?: NavItem[];
};

