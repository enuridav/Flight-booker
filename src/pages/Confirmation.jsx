import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";

export default function Confirmation(){
  const { bookingRef, selectedFlight, search } = useApp();
  const nav = useNavigate();

  useEffect(()=>{
    if(!bookingRef || !selectedFlight) nav("/");
  }, [bookingRef, selectedFlight, nav]);

  if(!bookingRef || !selectedFlight) return null;

  const stopsLabel = selectedFlight.stops === 0 ? "Non-stop" : `${selectedFlight.stops} stop${selectedFlight.stops>1?"s":""}`;

  return (
    <div className="shell" style={{display:"grid", gap:16}}>
      <header className="topbar">
        <div className="brand">
          <span>🎉</span><strong>Booking confirmed</strong>
          <span className="badge-chip">Ref: {bookingRef}</span>
        </div>
      </header>

      <section className="infoCard" style={{padding:22, display:"grid", gap:10}}>
        <h2 style={{marginBottom:4}}>Thank you! Your flight is reserved.</h2>
        <div className="muted">Save this reference for your records.</div>

        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginTop:8}}>
          <div className="infoCard" style={{padding:14}}>
            <h4 style={{marginBottom:6}}>Itinerary</h4>
            <div style={{display:"grid", gridTemplateColumns:"1fr auto", gap:8, alignItems:"center"}}>
              <div style={{fontWeight:800}}>{selectedFlight.carrier} {selectedFlight.flightNo}</div>
              <div className="badge-chip">{stopsLabel}</div>
            </div>
            <div className="muted" style={{marginTop:6}}>
              {search?.from || "—"} → {search?.to || "—"} · {search?.date || "—"} · {selectedFlight.time}
            </div>
          </div>

          <div className="infoCard" style={{padding:14}}>
            <h4 style={{marginBottom:6}}>Payment</h4>
            <div style={{fontWeight:900, fontSize:18}}>
              {Number(selectedFlight.price).toFixed(0)} €
            </div>
            <div className="muted" style={{fontSize:13, marginTop:6}}>
              This is a demo app — no real charge was made.
            </div>
          </div>
        </div>

        <div style={{display:"flex", justifyContent:"flex-end", gap:10, marginTop:10}}>
          <button className="btn ghost" onClick={()=>nav("/results")}>Back to results</button>
          <button className="btn" onClick={()=>nav("/")}>Back to Home</button>
        </div>
      </section>
    </div>
  );
}