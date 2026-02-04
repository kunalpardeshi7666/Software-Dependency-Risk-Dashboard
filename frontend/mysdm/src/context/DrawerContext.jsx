import { createContext, useContext, useState } from "react";

const DrawerContext = createContext();

export function DrawerProvider({ children }) {
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen((v) => !v);
  const close = () => setOpen(false);
  const show = () => setOpen(true);

  return (
    <DrawerContext.Provider value={{ open, toggle, close, show }}>
      {children}
    </DrawerContext.Provider>
  );
}

export const useDrawer = () => useContext(DrawerContext);
// export function useDrawer() {
//   const ctx = useContext(DrawerContext);
//   if (!ctx) throw new Error("useDrawer must be used inside <DrawerProvider>");
//   return ctx;
// }