"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { SessionUser } from "@/lib/session/authSession";

const SessionUserContext = createContext<SessionUser | null>(null);

type SessionUserProviderProps = {
  user: SessionUser;
  children: ReactNode;
};

export function SessionUserProvider({
  user,
  children,
}: SessionUserProviderProps) {
  return (
    <SessionUserContext.Provider value={user}>
      {children}
    </SessionUserContext.Provider>
  );
}

export function useSessionUser() {
  return useContext(SessionUserContext);
}
