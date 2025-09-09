import { useMemo, useState, useEffect } from "react";

export default function Filters({ flights = [], value, onChange }) {
  // value pritet: { sort, maxStops, maxPrice, carriers: Set<string> }
  const v = value || {};
  const [price, setPrice] = useState(v.maxPrice ?? 9999);

  // unik carrier codes nga lista aktuale
  const carriers = useMemo(() => {
    const set = new Set(flights.map(f => f.carrier).filter(Boolean));
    return Array.from(set).sort();
  }, [flights]);

  // sinkronizo sliderin kur vjen vlerë e re nga jashtë
  useEffect(() => { setPrice(v.maxPrice ?? 9999); }, [v.maxPrice]);

  // dergo ndryshimet me debounce të lehtë për çmimin
  useEffect(() => {
    const t = setTimeout(() => onChange({ ...v, maxPrice: Number(price) || 9999 }), 120);
    return () => clearTimeout(t);
  }, [price]); // eslint-disable-line

  function toggleCarrier(c){
    const next = new Set(v.carriers || []);
    next.has(c) ? next.delete(c) : next.add(c);
    onChange({ ...v, carriers: next });
  }

  function clearAll(){
    onChange({ sort: "priceAsc", maxStops: 2, maxPrice: 9999, carriers: new Set() });
  }

  return (
    <div className="infoCard" style={{display:"grid", gap:12}}>
      {/* Rreshti 1: sort & stops */}
      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:10}}>
        <div>
          <label className="label">Sort</label>
          <select
            className="input"
            value={v.sort || "priceAsc"}
            onChange={(e)=>onChange({ ...v, sort: e.target.value })}
          >
            <option value="priceAsc">Cheapest first</option>
            <option value="priceDesc">Most expensive</option>
            <option value="stopsAsc">Fewest stops</option>
          </select>
        </div>

        <div>
          <label className="label">Max stops</label>
          <select
            className="input"
            value={v.maxStops ?? 2}
            onChange={(e)=>onChange({ ...v, maxStops: Number(e.target.value) })}
          >
            <option value={0}>Non-stop</option>
            <option value={1}>≤ 1 stop</option>
            <option value={2}>≤ 2 stops</option>
          </select>
        </div>
      </div>

      {/* Rreshti 2: price */}
      <div>
        <label className="label">Max price: {Number(price).toFixed(0)} €</label>
        <input
          type="range" min="50" max="1000" step="10"
          className="input" value={price}
          onChange={(e)=>setPrice(e.target.value)}
        />
      </div>

      {/* Rreshti 3: carriers */}
      {carriers.length > 0 && (
        <div>
          <label className="label">Carriers</label>
          <div style={{display:"flex", flexWrap:"wrap", gap:8}}>
            {carriers.map(c => {
              const active = v.carriers?.has(c);
              return (
                <button
                  key={c}
                  type="button"
                  onClick={()=>toggleCarrier(c)}
                  className="badge-chip"
                  style={{
                    borderColor: active ? "var(--accent)" : "var(--border)",
                    background: active ? "rgba(34,211,238,.18)" : "rgba(255,255,255,.06)"
                  }}
                  aria-pressed={active}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div style={{display:"flex", justifyContent:"flex-end"}}>
        <button type="button" className="btn ghost" onClick={clearAll}>Clear filters</button>
      </div>
    </div>
  );
}