import { useState, useEffect } from "react";

const BASE = "http://localhost:3000";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Playfair+Display:wght@700&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: #f5f4f0;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 1rem;
  }

  .app {
    width: 100%;
    max-width: 520px;
  }

  .hero {
    display: flex;
    align-items: baseline;
    gap: 10px;
    margin-bottom: 2rem;
  }

  .hero h1 {
    font-family: 'Playfair Display', serif;
    font-size: 32px;
    font-weight: 700;
    color: #1a1a1a;
  }

  .hero-tag {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    color: #888;
    border: 1px solid #ddd;
    padding: 3px 9px;
    border-radius: 20px;
  }

  .tabs {
    display: flex;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    width: fit-content;
    margin-bottom: 1.5rem;
    overflow: hidden;
    background: #fff;
  }

  .tab {
    padding: 8px 20px;
    font-size: 13px;
    font-weight: 400;
    cursor: pointer;
    border: none;
    background: transparent;
    color: #888;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.15s;
  }

  .tab.active {
    background: #1a1a1a;
    color: #fff;
    font-weight: 500;
  }

  .card {
    background: #fff;
    border: 1px solid #e8e8e8;
    border-radius: 16px;
    padding: 1.5rem;
  }

  .field {
    margin-bottom: 1rem;
  }

  .field label {
    display: block;
    font-size: 11px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #aaa;
    margin-bottom: 6px;
  }

  .field input, .field select {
    width: 100%;
    border: 1px solid #e8e8e8;
    border-radius: 8px;
    padding: 10px 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    color: #1a1a1a;
    background: #fafafa;
    outline: none;
    transition: border-color 0.15s;
  }

  .field input:focus, .field select:focus {
    border-color: #aaa;
    background: #fff;
  }

  .field input.amount-input {
    font-family: 'DM Mono', monospace;
    font-size: 24px;
    font-weight: 500;
  }

  .row {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: end;
    gap: 10px;
    margin-bottom: 1rem;
  }

  .swap-btn {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 1px solid #e0e0e0;
    background: #f5f4f0;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 2px;
    font-size: 16px;
    color: #888;
    transition: transform 0.25s, background 0.15s;
    flex-shrink: 0;
  }

  .swap-btn:hover {
    background: #ebebeb;
    transform: rotate(180deg);
  }

  .convert-btn {
    width: 100%;
    padding: 12px;
    background: #1a1a1a;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: opacity 0.15s;
    margin-top: 0.25rem;
  }

  .convert-btn:hover { opacity: 0.85; }
  .convert-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  .result-box {
    margin-top: 1.25rem;
    padding: 1.25rem;
    background: #f9f8f5;
    border-radius: 10px;
    border-left: 3px solid #1a1a1a;
  }

  .result-big {
    font-family: 'Playfair Display', serif;
    font-size: 30px;
    color: #1a1a1a;
    margin-bottom: 4px;
  }

  .result-rate {
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    color: #aaa;
    margin-bottom: 12px;
  }

  .result-actions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .result-actions button {
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    padding: 5px 14px;
    border: 1px solid #e0e0e0;
    border-radius: 20px;
    background: transparent;
    cursor: pointer;
    color: #666;
    transition: all 0.15s;
  }

  .result-actions button:hover {
    background: #f0f0f0;
    color: #1a1a1a;
  }

  .error-box {
    margin-top: 0.75rem;
    font-size: 13px;
    color: #c0392b;
    background: #fdf0ee;
    padding: 8px 12px;
    border-radius: 8px;
  }

  .section-hdr {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
  }

  .section-hdr h2 {
    font-family: 'Playfair Display', serif;
    font-size: 20px;
    font-weight: 700;
    color: #1a1a1a;
  }

  .section-hdr span {
    font-size: 12px;
    color: #aaa;
  }

  .hist-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .hist-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 14px;
    background: #fff;
    border: 1px solid #e8e8e8;
    border-radius: 10px;
    transition: border-color 0.15s;
  }

  .hist-item:hover { border-color: #ccc; }

  .hist-left { display: flex; flex-direction: column; gap: 2px; }

  .hist-main {
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    font-weight: 500;
    color: #1a1a1a;
  }

  .hist-sub {
    font-size: 11px;
    color: #aaa;
  }

  .hist-right {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .tag {
    font-size: 11px;
    font-family: 'DM Mono', monospace;
    background: #f0f0f0;
    color: #888;
    padding: 2px 8px;
    border-radius: 10px;
  }

  .del-btn {
    font-size: 15px;
    color: #ccc;
    cursor: pointer;
    background: none;
    border: none;
    padding: 0 4px;
    line-height: 1;
    transition: color 0.15s;
    font-family: 'DM Sans', sans-serif;
  }

  .del-btn:hover { color: #e74c3c; }

  .fav-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 14px;
    background: #fff;
    border: 1px solid #e8e8e8;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.15s;
  }

  .fav-item:hover {
    border-color: #ccc;
    background: #fafafa;
  }

  .fav-badge {
    font-size: 11px;
    background: #fef9e7;
    color: #b8860b;
    padding: 2px 10px;
    border-radius: 10px;
    font-weight: 500;
  }

  .empty {
    text-align: center;
    padding: 2.5rem 1rem;
    color: #aaa;
    font-size: 14px;
  }

  .spinner {
    display: inline-block;
    width: 13px;
    height: 13px;
    border: 2px solid rgba(255,255,255,0.4);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    vertical-align: middle;
    margin-right: 6px;
  }

  @keyframes spin { to { transform: rotate(360deg); } }
`;

export default function App() {
  const [tab, setTab] = useState("convert");
  const [currencies, setCurrencies] = useState([]);
  const [amount, setAmount] = useState("100");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [histLoading, setHistLoading] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");

  useEffect(() => {
    fetch("https://api.frankfurter.dev/v1/currencies")
      .then((r) => r.json())
      .then((data) => {
        const preferred = ["USD", "EUR", "GBP", "JPY", "CHF", "SEK", "NOK", "DKK", "CAD", "AUD"];
        const list = Object.entries(data).map(([code, name]) => ({ code, name }));
        list.sort((a, b) => {
          const ai = preferred.indexOf(a.code), bi = preferred.indexOf(b.code);
          if (ai !== -1 && bi !== -1) return ai - bi;
          if (ai !== -1) return -1;
          if (bi !== -1) return 1;
          return a.code.localeCompare(b.code);
        });
        setCurrencies(list);
      })
      .catch(() => {
        setCurrencies([
          { code: "USD", name: "US Dollar" },
          { code: "EUR", name: "Euro" },
          { code: "GBP", name: "British Pound" },
          { code: "JPY", name: "Japanese Yen" },
        ]);
      });
  }, []);

  useEffect(() => {
    if (tab === "history") loadHistory();
    if (tab === "favorites") loadFavorites();
  }, [tab]);

  async function doConvert() {
    setError("");
    setResult(null);
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) { setError("Please enter a positive amount."); return; }
    if (from === to) { setError("Please choose two different currencies."); return; }

    setLoading(true);
    try {
      let res;
      try {
        const r = await fetch(`${BASE}/api/conversions/convert`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: amt, from, to }),
        });
        if (!r.ok) throw new Error();
        res = await r.json();
      } catch {
        const r = await fetch(`https://api.frankfurter.dev/v1/latest?amount=${amt}&from=${from}&to=${to}`);
        const data = await r.json();
        res = { from, to, amount: amt, result: data.rates[to] };
      }
      setResult(res);
    } catch {
      setError("Conversion failed. Check your connection and try again.");
    }
    setLoading(false);
  }

  async function loadHistory() {
    setHistLoading(true);
    try {
      const r = await fetch(`${BASE}/api/conversions`);
      if (!r.ok) throw new Error();
      const data = await r.json();
      setHistory(data.slice().reverse());
    } catch {
      setHistory(null);
    }
    setHistLoading(false);
  }

  async function deleteConversion(id) {
    try {
      await fetch(`${BASE}/api/conversions/${id}`, { method: "DELETE" });
      setHistory((prev) => prev.filter((c) => c._id !== id));
    } catch {
      alert("Could not delete — check the backend.");
    }
  }

  async function loadFavorites() {
    setFavLoading(true);
    try {
      const r = await fetch(`${BASE}/api/favorites`);
      if (!r.ok) throw new Error();
      const data = await r.json();
      setFavorites(data.slice().reverse());
    } catch {
      setFavorites(null);
    }
    setFavLoading(false);
  }

  async function deleteFavorite(id) {
    try {
      await fetch(`${BASE}/api/favorites/${id}`, { method: "DELETE" });
      setFavorites((prev) => prev.filter((f) => f._id !== id));
    } catch {
      alert("Could not delete — check the backend.");
    }
  }

  async function saveFavorite() {
    if (!result) return;
    try {
      await fetch(`${BASE}/api/favorites`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result),
      });
      setSavedMsg("Saved!");
      setTimeout(() => setSavedMsg(""), 2000);
    } catch {
      alert("Could not save — backend needed.");
    }
  }

  function swapCurrencies() {
    setFrom(to);
    setTo(from);
    setResult(null);
  }

  function useFavorite(fav) {
    setFrom(fav.from);
    setTo(fav.to);
    setAmount(String(fav.amount));
    setTab("convert");
    setResult(null);
  }

  return (
    <>
      <style>{STYLES}</style>
      <div className="app">
        <div className="hero">
          <h1>FX Convert</h1>
          <span className="hero-tag">live rates</span>
        </div>

        <div className="tabs">
          {["convert", "history", "favorites"].map((t) => (
            <button key={t} className={`tab${tab === t ? " active" : ""}`} onClick={() => setTab(t)}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {tab === "convert" && (
          <div className="card">
            <div className="row">
              <div className="field">
                <label>Amount</label>
                <input
                  className="amount-input"
                  type="number"
                  value={amount}
                  min="0.01"
                  step="any"
                  onChange={(e) => setAmount(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && doConvert()}
                />
              </div>
              <button className="swap-btn" onClick={swapCurrencies} title="Swap currencies">⇄</button>
              <div className="field">
                <label>From</label>
                <select value={from} onChange={(e) => { setFrom(e.target.value); setResult(null); }}>
                  {currencies.map((c) => (
                    <option key={c.code} value={c.code}>{c.code} — {c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="field">
              <label>To</label>
              <select value={to} onChange={(e) => { setTo(e.target.value); setResult(null); }}>
                {currencies.map((c) => (
                  <option key={c.code} value={c.code}>{c.code} — {c.name}</option>
                ))}
              </select>
            </div>

            <button className="convert-btn" onClick={doConvert} disabled={loading}>
              {loading && <span className="spinner" />}
              {loading ? "Converting..." : "Convert"}
            </button>

            {error && <div className="error-box">{error}</div>}

            {result && (
              <div className="result-box">
                <p className="result-big">
                  {result.result.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {result.to}
                </p>
                <p className="result-rate">
                  1 {result.from} = {(result.result / result.amount).toFixed(6)} {result.to}
                </p>
                <div className="result-actions">
                  <button onClick={saveFavorite}>★ {savedMsg || "Save as favorite"}</button>
                  <button onClick={() => setTab("history")}>↗ View history</button>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === "history" && (
          <>
            <div className="section-hdr">
              <h2>History</h2>
              <span>{Array.isArray(history) ? `${history.length} conversions` : ""}</span>
            </div>
            <div className="hist-list">
              {histLoading && <div className="empty">Loading...</div>}
              {!histLoading && history === null && (
                <div className="empty">Could not load — is the backend running on port 3000?</div>
              )}
              {!histLoading && Array.isArray(history) && history.length === 0 && (
                <div className="empty">No conversions yet.</div>
              )}
              {Array.isArray(history) && history.map((c) => (
                <div className="hist-item" key={c._id}>
                  <div className="hist-left">
                    <span className="hist-main">
                      {c.amount.toLocaleString()} {c.from} → {c.result.toFixed(2)} {c.to}
                    </span>
                    <span className="hist-sub">
                      1 {c.from} = {(c.result / c.amount).toFixed(4)} {c.to}
                    </span>
                  </div>
                  <div className="hist-right">
                    <span className="tag">{c.from}/{c.to}</span>
                    <button className="del-btn" onClick={() => deleteConversion(c._id)} title="Delete">✕</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "favorites" && (
          <>
            <div className="section-hdr">
              <h2>Favorites</h2>
              <span>{Array.isArray(favorites) ? `${favorites.length} saved` : ""}</span>
            </div>
            <div className="hist-list">
              {favLoading && <div className="empty">Loading...</div>}
              {!favLoading && favorites === null && (
                <div className="empty">Could not load — is the backend running on port 3000?</div>
              )}
              {!favLoading && Array.isArray(favorites) && favorites.length === 0 && (
                <div className="empty">No favorites saved yet.</div>
              )}
              {Array.isArray(favorites) && favorites.map((f) => (
                <div className="fav-item" key={f._id} onClick={() => useFavorite(f)}>
                  <div className="hist-left">
                    <span className="hist-main">
                      {f.amount.toLocaleString()} {f.from} → {f.result.toFixed(2)} {f.to}
                    </span>
                    <span className="hist-sub">Click to use this conversion</span>
                  </div>
                  <div className="hist-right">
                    <span className="fav-badge">★ saved</span>
                    <button
                      className="del-btn"
                      onClick={(e) => { e.stopPropagation(); deleteFavorite(f._id); }}
                      title="Remove favorite"
                    >✕</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
