"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { UserRole } from "@/config/access";

export interface SessionUser {
  name: string;
  email: string;
  role: UserRole;
  /** The hotel (or later: supplier) this account belongs to. */
  organisation?: string;
}

const SessionUserContext = createContext<SessionUser | null>(null);

/** The signed-in user (from the session), for client components. */
export function SessionUserProvider({ user, children }: { user: SessionUser; children: ReactNode }) {
  return <SessionUserContext.Provider value={user}>{children}</SessionUserContext.Provider>;
}

export function useSessionUser(): SessionUser {
  const user = useContext(SessionUserContext);
  if (!user) throw new Error("useSessionUser must be used inside the dashboard layout");
  return user;
}
