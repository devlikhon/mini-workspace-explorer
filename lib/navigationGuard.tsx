"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
} from "react";

/** Returns true if it's safe to navigate away right now. */
type GuardFn = () => boolean;

interface GuardContextValue {
  /** The active editor (if any) registers/clears its own guard here. */
  setGuard: (fn: GuardFn | null) => void;
  /** Every navigation action (sidebar click, breadcrumb click, opening
   *  another file, closing the editor) routes through this so an unsaved
   *  file gets a chance to block/confirm before we actually move. */
  requestNavigation: (proceed: () => void) => void;
}

const NavigationGuardContext = createContext<GuardContextValue | null>(null);

export const NavigationGuardProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const guardRef = useRef<GuardFn | null>(null);

  const setGuard = useCallback((fn: GuardFn | null) => {
    guardRef.current = fn;
  }, []);

  const requestNavigation = useCallback((proceed: () => void) => {
    if (guardRef.current && !guardRef.current()) return;
    proceed();
  }, []);

  const value = useMemo<GuardContextValue>(
    () => ({ setGuard, requestNavigation }),
    [setGuard, requestNavigation],
  );
  return (
    <NavigationGuardContext.Provider value={value}>
      {children}
    </NavigationGuardContext.Provider>
  );
};

export const useNavigationGuard = (): GuardContextValue => {
  const ctx = useContext(NavigationGuardContext);
  if (!ctx)
    throw new Error(
      "useNavigationGuard must be used within NavigationGuardProvider",
    );
  return ctx;
};
