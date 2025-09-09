import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";

function formatPrice(n){ return `${Number(n||0).toFixed(0)} €`; }
function bookingRefGen(){
  // p.sh. "BK-7F3Q9C"
  const abc = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "BK-";
  for (let i=0;i<6;i++) s += abc[Math.floor(Math.random()*abc.length)];
  return s;
}

export default function Booking(){
  const { selectedFlight, search, setBookingRef } = useApp();
  const nav = useNavigate();

  useEffect(()=>{
    if(!selectedFlight) nav("/results");
  }, [selectedFlight, nav]);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    document: "",
    accept: false,
  });
  const [error, setError] = useState("");

  const tripMeta = useMemo(()=>{
    if(!selectedFlight) return null;
    const { carrier, flightNo, time, stops, price } = selectedFlight;
    const route = `${search?.from || "—"} → ${search?.to || "—"}`;
    const date = search?.date || "—";
    return { carrier, flightNo, time, stops, price, route, date };
  }, [selectedFlight, search]);

  function onSubmit(e){
    e.preventDefault();
    setError("");
    // Validim bazik
    if(!form.firstName.trim() || !form.lastName.trim() || !form.email.trim()){
      setError("Please fill in first name, last name and email.");
      return;
    }
    if(!/\S+@\S+\.\S+/.test(form.email)){
      setError("Please enter a valid email address.");
      return;
    }
    if(!form.accept){
      setError("Please accept the terms to continue.");
      return;
    }
    const ref = bookingRefGen();
    setBookingRef(ref);
    nav("/confirmation");
  }

  if(!selectedFlight) return null;

  const stopsLabel = selectedFlight.stops === 0 ? "Non-stop" : `${selectedFlight.stops} stop${selectedFlight.stops>1?"s":""}`;

  return (
    <div className="shell" style={{display:"grid", gap:16}}>
      <header className="topbar">
        <div className="brand">
          <span>🧾</span><strong>Booking</strong>
          <span className="badge-chip">{tripMeta?.route}</span>
          <span className="badge-chip">{tripMeta?.date}</span>
          <span className="badge-chip">{stopsLabel}</span>
        </div>
      </header>

      {/* Summary card */}
      <section className="infoCard" style={{display:"grid", gap:8, alignItems:"center"}}>
        <div style={{display:"grid", gridTemplateColumns:"1fr auto", alignItems:"center"}}>
          <div style={{display:"grid", gridTemplateColumns:"160px 1fr 140px", gap:12}}>
            <div style={{fontWeight:800}}>{tripMeta?.carrier} {tripMeta?.flightNo}</div>
            <div style={{opacity:.9}}>{tripMeta?.time}</div>
            <div className="badge-chip">{stopsLabel}</div>
          </div>
          <div style={{fontWeight:900, fontSize:18}}>{formatPrice(tripMeta?.price)}</div>
        </div>
        <div className="muted" style={{fontSize:13}}>
          {search?.pax || 1} passenger(s) · Base fare shown • Test/demo booking (no real ticket issued)
        </div>
      </section>

      {/* Passenger form */}
      <section className="infoCard" style={{padding:18}}>
        <h3 style={{marginBottom:8}}>Passenger details</h3>
        {error && (
          <div className="infoCard" style={{margin:"10px 0", background:"rgba(239,68,68,.12)", borderColor:"#fca5a5", padding:12}}>
            <strong>Oops.</strong> <span className="muted" style={{marginLeft:6}}>{error}</span>
          </div>
        )}

        <form onSubmit={onSubmit} noValidate style={{display:"grid", gap:12}}>
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12}}>
            <div className="field">
              <label className="label" htmlFor="firstName">First name</label>
              <input id="firstName" className="input" value={form.firstName}
                     onChange={(e)=>setForm(f=>({...f, firstName:e.target.value}))} placeholder="e.g., Enurida" />
            </div>
            <div className="field">
              <label className="label" htmlFor="lastName">Last name</label>
              <input id="lastName" className="input" value={form.lastName}
                     onChange={(e)=>setForm(f=>({...f, lastName:e.target.value}))} placeholder="e.g., Veliu" />
            </div>
          </div>

          <div className="field">
            <label className="label" htmlFor="email">Email</label>
            <input id="email" type="email" className="input" value={form.email}
                   onChange={(e)=>setForm(f=>({...f, email:e.target.value}))} placeholder="you@example.com" />
          </div>

          <div className="field">
            <label className="label" htmlFor="document">Passport / ID (optional)</label>
            <input id="document" className="input" value={form.document}
                   onChange={(e)=>setForm(f=>({...f, document:e.target.value}))} placeholder="e.g., AB1234567" />
          </div>

          <label style={{display:"flex", alignItems:"center", gap:8, fontSize:14}}>
            <input type="checkbox" checked={form.accept}
                   onChange={(e)=>setForm(f=>({...f, accept:e.target.checked}))} />
            I accept that this is a demo booking and no real ticket will be issued.
          </label>

          <div style={{display:"flex", justifyContent:"flex-end", gap:10, marginTop:6}}>
            <button type="button" className="btn ghost" onClick={()=>nav("/results")}>Back to results</button>
            <button className="btn" type="submit">Confirm & continue →</button>
          </div>
        </form>
      </section>
    </div>
  );
}