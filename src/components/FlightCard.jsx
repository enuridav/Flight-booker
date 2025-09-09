export default function FlightCard({ data, onSelect }) {
    if (!data) return null;
    const stopsLabel = data.stops === 0 ? "Non-stop" : `${data.stops} stop${data.stops>1?"s":""}`;
  
    return (
      <div className="infoCard" style={{display:"grid",gridTemplateColumns:"1fr auto",gap:12,alignItems:"center"}}>
        <div style={{display:"grid",gridTemplateColumns:"120px 1fr 120px",gap:12,alignItems:"center"}}>
          <div style={{fontWeight:800,letterSpacing:.2}}>
            {data.carrier} {data.flightNo}
          </div>
          <div style={{opacity:.9}}>{data.time}</div>
          <div className="badge-chip">{stopsLabel}</div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{fontWeight:900,fontSize:18}}>{Number(data.price).toFixed(0)} €</div>
          <button className="btn" onClick={onSelect}>Select</button>
        </div>
      </div>
    );
  }