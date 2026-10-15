'use client';

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react';

type AccordionContextValue = {
  openId: string | null;
  setOpenId: (id: string | null) => void;
};

const AccordionContext = createContext<AccordionContextValue | null>(null);
const PrefixContext = createContext('');

export function LegalAccordionProvider({ children }: { children: ReactNode }) {
  const [openId, setOpenIdState] = useState<string | null>(null);
  const setOpenId = useCallback((id: string | null) => setOpenIdState(id), []);
  return (
    <AccordionContext.Provider value={{ openId, setOpenId }}>
      {children}
    </AccordionContext.Provider>
  );
}

export function useLegalAccordion() {
  const context = useContext(AccordionContext);
  if (!context) throw new Error('LegalSection must be rendered inside LegalAccordionProvider.');
  return context;
}

export function LegalSectionGroup({
  prefix,
  children,
}: {
  prefix: string;
  children: ReactNode;
}) {
  return <PrefixContext.Provider value={prefix}>{children}</PrefixContext.Provider>;
}

export function useLegalSectionPrefix() {
  return useContext(PrefixContext);
}
