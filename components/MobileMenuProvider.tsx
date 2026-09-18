"use client";

import { createContext, useContext, useState } from "react";

type MobileMenu = { open: boolean; setOpen: React.Dispatch<React.SetStateAction<boolean>> };

const MobileMenuContext = createContext<MobileMenu | null>(null);

export function MobileMenuProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return <MobileMenuContext.Provider value={{ open, setOpen }}>{children}</MobileMenuContext.Provider>;
}

export function useMobileMenu(): MobileMenu {
  const ctx = useContext(MobileMenuContext);
  if (!ctx) throw new Error("useMobileMenu must be used inside <MobileMenuProvider>");
  return ctx;
}
