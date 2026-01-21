import type { ReactNode } from "react";

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-[calc(100vh-7rem-0.25rem)] overflow-hidden ">
      {children}
    </div>
  );
}
