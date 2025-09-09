// src/components/SearchForm.jsx
import AirportPicker from "./AirportPicker.jsx";

export default function SearchForm({ value, onChange, onSubmit, minDate, tip }) {
  const v = value || {};

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="formGrid">
        {/* From */}
        <div>
          <AirportPicker
            label="From"
            value={v.from}
            onChange={(code) => onChange({ ...v, from: code })}
            icon="🛫"
            placeholder="e.g., Berlin or BER"
          />
        </div>

        {/* Swap button space (mund të shtosh button këtu nëse do) */}
        <div className="swapWrap" />

        {/* To */}
        <div>
          <AirportPicker
            label="To"
            value={v.to}
            onChange={(code) => onChange({ ...v, to: code })}
            icon="🧭"
            placeholder="e.g., Munich or MUC"
          />
        </div>

        {/* Date */}
        <div>
          <label className="label" htmlFor="date">Date</label>
          <div className="field">
            <input
              id="date"
              type="date"
              min={minDate}
              className="input"
              value={v.date || ""}
              onChange={(e) => onChange({ ...v, date: e.target.value })}
            />
            <span className="icon" aria-hidden>📅</span>
          </div>
        </div>

        {/* Passengers */}
        <div>
          <label className="label" htmlFor="pax">Passengers</label>
          <div className="field">
            <select
              id="pax"
              className="input"
              value={v.pax ?? 1}
              onChange={(e) => onChange({ ...v, pax: Number(e.target.value) })}
            >
              {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
            <span className="icon" aria-hidden>👤</span>
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="centerRow mt16">
        {tip && <div style={{ color: "var(--muted)", fontSize: 13 }}>{tip}</div>}
        <button className="btn" type="submit">
          Search flights <span>→</span>
        </button>
      </div>
    </form>
  );
}