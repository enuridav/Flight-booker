// src/pages/Results.jsx
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import { amadeusSearch } from "../utils/amadeus.js";
import Filters from "../components/Filters.jsx";
import FlightCard from "../components/FlightCard.jsx";
import Loader from "../components/Loader.jsx";

export default function Results(){
  const { search, setSearch, setSelectedFlight } = useApp();
  const loc = useLocation();
  const nav = useNavigate();

  // ===== Merge: URL params + Context =====
  const params = new URLSearchParams(loc.search);
  const criteria = {
    from: search.from || params.get("from") || "",
    to:   search.to   || params.get("to")   || "",
    date: search.date || params.get("date") || "",
    pax:  Number(search.pax || params.get("pax") || 1),
  };

  // Sinkronizo context me URL (1 herë)
  useEffect(() => {
    setSearch(s => ({
      from: criteria.from || s.from || "",
      to: criteria.to || s.to || "",
      date: criteria.date || s.date || "",
      pax: criteria.pax || s.pax || 1,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ===== Data state =====
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ===== Filters UI state =====
  const [filters, setFilters] = useState({
    sort: "priceAsc",
    maxStops: 2,
    maxPrice: 9999,
    carriers: new Set(),
  });

  // Fetch nga Amadeus
  useEffect(() => {
    let ignore = false;
    async function load(){
      if (!criteria.from || !criteria.to || !criteria.date) return;
      setLoading(true); setError("");
      try{
        const res = await amadeusSearch({
          from: criteria.from,
          to: criteria.to,
          date: criteria.date,
          pax: criteria.pax,
          max: 25,
        });
        if (!ignore) setFlights(res);
      }catch(e){
        if (!ignore) setError(e.message || "Failed to load flights");
      }finally{
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => { ignore = true; };
  }, [criteria.from, criteria.to, criteria.date, criteria.pax]);

  // Apply filters + sorting
  const filtered = useMemo(() => {
    let list = flights
      .filter(f => f.stops <= (filters.maxStops ?? 2))
      .filter(f => Number(f.price) <= (filters.maxPrice ?? 9999));

    if (filters.carriers && filters.carriers.size > 0) {
      list = list.filter(f => filters.carriers.has(f.carrier));
    }

    switch (filters.sort) {
      case "priceDesc": return [...list].sort((a,b)=>b.price - a.price);
      case "stopsAsc":  return [...list].sort((a,b)=>a.stops - b.stops || a.price - b.price);
      default:          return [...list].sort((a,b)=>a.price - b.price);
    }
  }, [flights, filters]);

  function selectFlight(f){
    setSelectedFlight(f);
    nav("/booking");
  }

  return (
    <div className="shell">
      <header className="topbar" style={{marginBottom:16}}>
        <div className="brand">
          <span>🛩️</span>
          <strong>Results</strong>
          <span className="badge-chip">{criteria.from || "—"} → {criteria.to || "—"}</span>
          <span className="badge-chip">{criteria.date || "—"}</span>
          <span className="badge-chip">{criteria.pax} pax</span>
        </div>
      </header>

      {error && (
        <div className="infoCard" style={{borderColor:"#fca5a5", background:"rgba(239,68,68,.12)", marginBottom:14}}>
          <strong>Couldn’t load flights.</strong>
          <div className="muted">{error}</div>
        </div>
      )}

      {loading && <Loader rows={6} height={74} />}

      {!loading && !error && (
        <>
          <Filters flights={flights} value={filters} onChange={setFilters} />

          {filtered.length === 0 ? (
            <div className="infoCard" style={{textAlign:"center", padding:28, marginTop:12}}>
              <h3 style={{marginBottom:6}}>No flights match your filters</h3>
              <p className="muted" style={{marginBottom:12}}>
                Try relaxing the price or stops filter.
              </p>
              <button
                className="btn ghost"
                onClick={() => setFilters({ sort:"priceAsc", maxStops:2, maxPrice:9999, carriers:new Set() })}
              >
                Reset filters
              </button>
            </div>
          ) : (
            <ul style={{display:"grid", gap:12, listStyle:"none", padding:0, marginTop:12}}>
              {filtered.map(f => (
                <li key={f.id}>
                  <FlightCard data={f} onSelect={() => selectFlight(f)} />
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}