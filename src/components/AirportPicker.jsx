// src/components/AirportPicker.jsx
import { useMemo, useState } from "react";
import { AIRPORTS } from "../data/airports.js";
import { countryFlag } from "../utils/flags.js";

export default function AirportPicker({
  label = "Airport",
  value = "",
  onChange = () => {},
  icon = "🛫",
  placeholder = "e.g., Berlin or BER",
}) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return AIRPORTS;
    return AIRPORTS.filter(a =>
      a.code.toLowerCase().includes(s) ||
      a.city.toLowerCase().includes(s) ||
      a.country.toLowerCase().includes(s)
    );
  }, [q]);

  function pick(code) {
    onChange(code);
    setQ("");
    setOpen(false);
  }

  return (
    <div className="ap-wrap">
      <label className="label">{label}</label>
      <div className="ap-field field">
        <input
          className="input ap-input"
          value={value}
          onChange={(e) => onChange(e.target.value.toUpperCase().slice(0,3))}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          aria-label={label}
        />
        <span className="icon" aria-hidden>{icon}</span>
      </div>

      <input
        className="input mt12"
        placeholder="Search city / code…"
        value={q}
        onChange={(e)=>setQ(e.target.value)}
        onFocus={()=>setOpen(true)}
      />

      {open && (
        <div className="ap-dropdown" onMouseLeave={() => setOpen(false)}>
          {list.length === 0 ? (
            <div className="ap-item" style={{opacity:.7, cursor:"default"}}>
              No matches
            </div>
          ) : (
            list.map(a => (
              <button key={a.code} type="button" className="ap-item" onClick={()=>pick(a.code)}>
                <div className="ap-code">{a.code}</div>
                <div className="ap-city">
                  <span className="ap-flag">{countryFlag(a.country)}</span>
                  {a.city}
                </div>
                <div className="ap-country">{a.country}</div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}