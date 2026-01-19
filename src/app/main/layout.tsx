import type { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import SideNav from "@/components/SidebarLeft";
import { getSessionUser } from "@/lib/session/authSession";

export default async function MainLayout({
  children,
}: {
  children: ReactNode;
}) {
  const sessionUser = await getSessionUser();

  const isChef = sessionUser.role.toLowerCase().includes("chef");

  return (
    <div className="min-h-screen relative">
      <Navbar userName={sessionUser.name} role={sessionUser.role} />

      {/* Sidebar */}
      {!isChef && <SideNav role={sessionUser.role} />}

      {/* Main Content */}
      <main
        className={`pt-28 p-1 ${isChef ? "px-8" : "pr-20"} bg-gray-50 transition-all duration-30`}
        style={isChef ? undefined : { marginLeft: "calc(var(--sidebar-width) + 1rem)" }}
      >
        <div className="w-full bg-gray-50">{children}</div>
      </main>
    </div>
  );
}
