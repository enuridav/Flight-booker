import { createContext, useContext, useState } from "react";

const Ctx = createContext(null);

export default function AppProvider({ children }) {
  const [search, setSearch] = useState({ from: "", to: "", date: "", pax: 1 });
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [bookingRef, setBookingRef] = useState(null);

  const value = { search, setSearch, selectedFlight, setSelectedFlight, bookingRef, setBookingRef };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}