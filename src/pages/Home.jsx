import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";
import SearchForm from "../components/SearchForm.jsx";

export default function Home(){
  const { search, setSearch } = useApp();
  const nav = useNavigate();
  const today = new Date().toISOString().slice(0,10);

  function submit(e){
    e.preventDefault();
    if(!search.from || !search.to || !search.date){
      alert("Please fill in From, To and Date.");
      return;
    }
    if(search.from === search.to){
      alert("Departure and destination airports must be different.");
      return;
    }
    nav("/results");
  }

  return (
    <>
      <div className="orb o1"></div>
      <div className="orb o2"></div>

      <div className="shell">
        <section className="hero">
          <div className="heroCard wide">
            <div className="brand" style={{marginBottom:12}}>
              <span>🛫</span><span>Flight Booker</span>
              <span className="badge-chip">v1.0</span>
            </div>

            <h1 className="heroTitle">
              Fly smarter, travel in <span className="gradientText">effortless style</span>.
            </h1>

            <p className="heroSub">
              Plan, search and book in seconds. Lightning-fast UI, graceful validation,
              and a premium, glassy look built for explorers like you.
            </p>

            <div className="heroHighlights">
              <span className="pill">⚡ Instant results</span>
              <span className="pill">🧭 Autocomplete + flags</span>
              <span className="pill">🧳 One-tap booking flow</span>
              <span className="pill">🔒 Privacy on-device</span>
            </div>

            {/* Search form poshtë */}
            <div style={{ marginTop: 28 }}>
              <SearchForm
                value={search}
                onChange={setSearch}
                onSubmit={submit}
                minDate={today}
                tip="Tip: Try BER → MUC"
              />
            </div>

            {/* ===== Extra content below the form ===== */}
            <section className="mt20">
              {/* Popular routes */}
              <div className="infoCard" style={{padding:18}}>
                <h4 style={{marginBottom:10}}>Popular routes</h4>
                <div className="chips">
                  {[
                    { from:"BER", to:"MUC", label:"Berlin → Munich" },
                    { from:"FRA", to:"HAM", label:"Frankfurt → Hamburg" },
                    { from:"BER", to:"FCO", label:"Berlin → Rome" },
                  ].map(r => (
                    <button
                      key={r.label}
                      type="button"
                      className="pill clickable"
                      onClick={()=>{
                        const date = search.date || new Date().toISOString().slice(0,10);
                        setSearch(s=>({ ...s, from:r.from, to:r.to, date }));
                        nav(`/results?from=${r.from}&to=${r.to}&date=${date}&pax=${search.pax||1}`);
                      }}
                      title="Fill & search"
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Why choose us */}
              <div className="infoGrid mt16">
                <div className="infoCard statCard">
                  <div className="statIcon">⚡</div>
                  <div className="statTitle">Fast & smooth</div>
                  <div className="muted">Results load in milliseconds with a clean, focused UI.</div>
                </div>
                <div className="infoCard statCard">
                  <div className="statIcon">🧭</div>
                  <div className="statTitle">Smart search</div>
                  <div className="muted">Autocomplete by city/code with filters for stops & price.</div>
                </div>
                <div className="infoCard statCard">
                  <div className="statIcon">🔒</div>
                  <div className="statTitle">Privacy-first</div>
                  <div className="muted">On-device state; no personal data stored.</div>
                </div>
              </div>
            </section>
          </div>
        </section>
      </div>
    </>
  );
}