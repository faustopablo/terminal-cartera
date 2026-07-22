"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

type Currency = "ARS" | "USD";
type AssetType = "Acción" | "CEDEAR" | "Bono" | "Cripto" | "Fondo" | "Otro";

type Asset = {
  id: string;
  symbol: string;
  name: string;
  type: AssetType;
  quantity: number;
  currency: Currency;
  buyPrice: number;
  price: number;
  previousClose: number;
  status?: "ok" | "error";
};

const initialAssets: Asset[] = [
  { id: "1", symbol: "GGAL.BA", name: "Grupo Financiero Galicia", type: "Acción", quantity: 120, currency: "ARS", buyPrice: 6250, price: 6840, previousClose: 6715 },
  { id: "2", symbol: "AL30.BA", name: "Bono República Argentina", type: "Bono", quantity: 350, currency: "ARS", buyPrice: 672, price: 708, previousClose: 701 },
  { id: "3", symbol: "AAPL.BA", name: "Apple CEDEAR", type: "CEDEAR", quantity: 45, currency: "ARS", buyPrice: 15180, price: 16420, previousClose: 16110 },
  { id: "4", symbol: "BTC-USD", name: "Bitcoin", type: "Cripto", quantity: 0.08, currency: "USD", buyPrice: 84200, price: 118640, previousClose: 116920 },
];

const money = (value: number, currency: Currency) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency, maximumFractionDigits: currency === "ARS" ? 0 : 2 }).format(value);

const percent = (value: number) => `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;

export default function Home() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [saveState, setSaveState] = useState<"loading" | "saved" | "saving" | "error">("loading");
  const [form, setForm] = useState({ symbol: "", name: "", type: "Acción" as AssetType, quantity: 1, currency: "ARS" as Currency, buyPrice: 0 });

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setAuthLoading(false);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) { setAssets([]); setHydrated(false); return; }
    const load = async () => {
      setSaveState("loading");
      const { data, error } = await supabase.from("assets").select("*").order("created_at", { ascending: true });
      if (error) { setSaveState("error"); setHydrated(true); return; }
      if (data.length) {
        setAssets(data.map((row) => ({ id: row.id, symbol: row.symbol, name: row.name, type: row.type as AssetType, quantity: Number(row.quantity), currency: row.currency as Currency, buyPrice: Number(row.buy_price), price: Number(row.price), previousClose: Number(row.previous_close), status: row.status as Asset["status"] })));
      } else {
        const legacy = localStorage.getItem("terminal-cartera-assets");
        let recovered: Asset[] = [];
        if (legacy) { try { recovered = JSON.parse(legacy); } catch { recovered = []; } }
        setAssets(recovered);
      }
      setSaveState("saved");
      setHydrated(true);
    };
    load();
  }, [user]);

  useEffect(() => {
    if (!hydrated || !user) return;
    localStorage.setItem("terminal-cartera-assets", JSON.stringify(assets));
    setSaveState("saving");
    const timer = window.setTimeout(async () => {
      try {
        const rows = assets.map((asset) => ({ id: asset.id, user_id: user.id, symbol: asset.symbol, name: asset.name, type: asset.type, quantity: asset.quantity, currency: asset.currency, buy_price: asset.buyPrice, price: asset.price, previous_close: asset.previousClose, status: asset.status ?? null }));
        if (rows.length) {
          const { error } = await supabase.from("assets").upsert(rows);
          if (error) throw error;
        }
        const { data: existing, error: readError } = await supabase.from("assets").select("id");
        if (readError) throw readError;
        const currentIds = new Set(assets.map((asset) => asset.id));
        const removed = existing.filter((row) => !currentIds.has(row.id)).map((row) => row.id);
        if (removed.length) {
          const { error } = await supabase.from("assets").delete().in("id", removed);
          if (error) throw error;
        }
        setSaveState("saved");
      } catch { setSaveState("error"); }
    }, 500);
    return () => window.clearTimeout(timer);
  }, [assets, hydrated, user]);

  const submitAuth = async (event: React.FormEvent) => {
    event.preventDefault();
    setAuthLoading(true);
    setAuthMessage("");
    const result = authMode === "login"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin } });
    if (result.error) setAuthMessage(result.error.message === "Invalid login credentials" ? "Email o contraseña incorrectos." : result.error.message);
    else if (authMode === "register" && !result.data.session) setAuthMessage("Revisá tu email y confirmá la cuenta antes de ingresar.");
    setAuthLoading(false);
  };

  const refresh = useCallback(async () => {
    if (!assets.length) return;
    setLoading(true);
    try {
      const symbols = assets.map((asset) => asset.symbol).join(",");
      const response = await fetch(`/api/quotes?symbols=${encodeURIComponent(symbols)}`);
      const data: { quotes?: Record<string, { price: number; previousClose: number; name?: string; error?: boolean }> } = await response.json();
      setAssets((current) => current.map((asset) => {
        const quote = data.quotes?.[asset.symbol.toUpperCase()];
        if (!quote || quote.error) return { ...asset, status: "error" };
        return { ...asset, price: quote.price, previousClose: quote.previousClose, name: asset.name || quote.name || asset.symbol, status: "ok" };
      }));
      setLastUpdate(new Date());
    } finally {
      setLoading(false);
    }
  }, [assets]);

  useEffect(() => {
    if (!hydrated) return;
    const timer = window.setInterval(refresh, 15 * 60 * 1000);
    return () => window.clearInterval(timer);
  }, [hydrated, refresh]);

  const totals = useMemo(() => {
    return assets.reduce((acc, asset) => {
      const value = asset.quantity * asset.price;
      const cost = asset.quantity * asset.buyPrice;
      acc[asset.currency].value += value;
      acc[asset.currency].cost += cost;
      acc[asset.currency].daily += asset.quantity * (asset.price - asset.previousClose);
      return acc;
    }, { ARS: { value: 0, cost: 0, daily: 0 }, USD: { value: 0, cost: 0, daily: 0 } });
  }, [assets]);

  const updateAsset = (id: string, patch: Partial<Asset>) => setAssets((current) => current.map((asset) => asset.id === id ? { ...asset, ...patch } : asset));

  const addAsset = (event: React.FormEvent) => {
    event.preventDefault();
    const symbol = form.symbol.trim().toUpperCase();
    if (!symbol) return;
    setAssets((current) => [...current, { id: crypto.randomUUID(), ...form, symbol, name: form.name.trim() || symbol, price: form.buyPrice, previousClose: form.buyPrice }]);
    setForm({ symbol: "", name: "", type: "Acción", quantity: 1, currency: "ARS", buyPrice: 0 });
    setShowForm(false);
  };

  if (authLoading && !user) return <main className="auth-shell"><div className="auth-loading"><span className="pulse" /> CONECTANDO CON TU CARTERA</div></main>;

  if (!user) return (
    <main className="auth-shell">
      <section className="auth-card">
        <div className="auth-brand"><div className="brand-mark">TC</div><div><span>TERMINAL CARTERA</span><small>ACCESO PRIVADO</small></div></div>
        <div className="auth-copy"><span className="eyebrow">CARTERA SINCRONIZADA</span><h1>{authMode === "login" ? "Ingresá a tu terminal" : "Creá tu acceso privado"}</h1><p>Tus posiciones se guardan en Supabase y quedan disponibles desde todos tus dispositivos.</p></div>
        <form className="auth-form" onSubmit={submitAuth}>
          <label>Email<input type="email" autoComplete="email" required placeholder="tu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
          <label>Contraseña<input type="password" autoComplete={authMode === "login" ? "current-password" : "new-password"} required minLength={6} placeholder="Mínimo 6 caracteres" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
          {authMessage && <p className="auth-message">{authMessage}</p>}
          <button className="button primary auth-submit" disabled={authLoading}>{authLoading ? "Procesando…" : authMode === "login" ? "Ingresar" : "Crear cuenta"}</button>
        </form>
        <button className="auth-switch" onClick={() => { setAuthMode(authMode === "login" ? "register" : "login"); setAuthMessage(""); }}>{authMode === "login" ? "¿Primera vez? Crear mi cuenta" : "Ya tengo una cuenta · Ingresar"}</button>
        <div className="auth-security"><span>●</span> CONEXIÓN SEGURA · DATOS PRIVADOS POR USUARIO</div>
      </section>
    </main>
  );

  return (
    <main className="terminal-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">TC</div>
          <div><h1>Terminal Cartera</h1><p>Mercado argentino · Datos con demora</p></div>
        </div>
        <div className="market-status"><span className="pulse" /> MERCADO {new Date().getDay() > 0 && new Date().getDay() < 6 ? "ACTIVO" : "CERRADO"}</div>
        <div className="header-actions">
          <span className={`save-state ${saveState}`}>{saveState === "loading" ? "Cargando cartera…" : saveState === "saving" ? "Guardando…" : saveState === "saved" ? "● Cartera guardada" : "⚠ Sin conexión al guardado"}</span>
          <span className="last-update">{lastUpdate ? `Cotizaciones ${lastUpdate.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}` : "Cotizaciones de muestra"}</span>
          <button className="button secondary" onClick={refresh} disabled={loading}>{loading ? "Actualizando…" : "↻ Actualizar"}</button>
          <button className="button primary" onClick={() => setShowForm(true)}>＋ Agregar activo</button>
          <button className="account-button" title={user.email} onClick={() => supabase.auth.signOut()}>{user.email?.slice(0, 2).toUpperCase()} <span>Salir</span></button>
        </div>
      </header>

      <section className="summary-grid" aria-label="Resumen de cartera">
        {(["ARS", "USD"] as Currency[]).map((currency) => {
          const total = totals[currency];
          const change = total.cost ? ((total.value - total.cost) / total.cost) * 100 : 0;
          return (
            <article className="summary-card" key={currency}>
              <div className="card-top"><span>VALOR TOTAL · {currency}</span><span className="currency-tag">{currency === "ARS" ? "$" : "US$"}</span></div>
              <strong>{money(total.value, currency)}</strong>
              <div className="card-metrics">
                <span><small>HOY</small><b className={total.daily >= 0 ? "positive" : "negative"}>{money(total.daily, currency)}</b></span>
                <span><small>DESDE COMPRA</small><b className={change >= 0 ? "positive" : "negative"}>{percent(change)}</b></span>
                <span><small>ACTIVOS</small><b>{assets.filter((a) => a.currency === currency).length}</b></span>
              </div>
            </article>
          );
        })}
      </section>

      <section className="portfolio-panel">
        <div className="panel-title">
          <div><span className="eyebrow">POSICIONES</span><h2>Mi cartera</h2></div>
          <p>Hacé clic en cantidad o moneda para editarlas.</p>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Activo</th><th>Tipo</th><th>Cantidad</th><th>Moneda</th><th>Precio compra</th><th>Último</th><th>Var. diaria</th><th>Desde compra</th><th>Posición</th><th /></tr></thead>
            <tbody>
              {assets.map((asset) => {
                const daily = asset.previousClose ? ((asset.price - asset.previousClose) / asset.previousClose) * 100 : 0;
                const sinceBuy = asset.buyPrice ? ((asset.price - asset.buyPrice) / asset.buyPrice) * 100 : 0;
                return (
                  <tr key={asset.id}>
                    <td><div className="asset-cell"><span className="asset-avatar">{asset.symbol.slice(0, 2)}</span><span><b>{asset.symbol}</b><small>{asset.name}</small></span>{asset.status === "error" && <i title="No se pudo actualizar">!</i>}</div></td>
                    <td><span className="type-tag">{asset.type}</span></td>
                    <td><input aria-label={`Cantidad de ${asset.symbol}`} className="inline-input" type="number" step="any" value={asset.quantity} onFocus={() => setEditing(asset.id)} onBlur={() => setEditing(null)} onChange={(e) => updateAsset(asset.id, { quantity: Number(e.target.value) })} /></td>
                    <td><select aria-label={`Moneda de ${asset.symbol}`} className="inline-select" value={asset.currency} onChange={(e) => updateAsset(asset.id, { currency: e.target.value as Currency })}><option>ARS</option><option>USD</option></select></td>
                    <td>{editing === asset.id ? <input aria-label={`Precio de compra de ${asset.symbol}`} className="inline-input price" type="number" step="any" value={asset.buyPrice} onChange={(e) => updateAsset(asset.id, { buyPrice: Number(e.target.value) })} /> : money(asset.buyPrice, asset.currency)}</td>
                    <td><b>{money(asset.price, asset.currency)}</b></td>
                    <td><span className={`change ${daily >= 0 ? "positive" : "negative"}`}>{percent(daily)}</span></td>
                    <td><span className={`change ${sinceBuy >= 0 ? "positive" : "negative"}`}>{percent(sinceBuy)}</span></td>
                    <td><b>{money(asset.quantity * asset.price, asset.currency)}</b></td>
                    <td><button className="icon-button" aria-label={`Eliminar ${asset.symbol}`} onClick={() => setAssets((current) => current.filter((item) => item.id !== asset.id))}>×</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {!assets.length && <div className="empty">No hay posiciones. Agregá tu primer activo para comenzar.</div>}
        </div>
      </section>

      <footer><span>FUENTE · YAHOO FINANCE</span><span>Actualización manual o automática cada 15 minutos</span><span>GUARDADO SEGURO · SUPABASE</span></footer>

      {showForm && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setShowForm(false)}>
          <form className="modal" onSubmit={addAsset} onMouseDown={(e) => e.stopPropagation()}>
            <div className="modal-head"><div><span className="eyebrow">NUEVA POSICIÓN</span><h2>Agregar activo</h2></div><button type="button" className="icon-button" onClick={() => setShowForm(false)}>×</button></div>
            <label>Símbolo de cotización<input autoFocus required placeholder="Ej: GGAL.BA, AL30.BA, BTC-USD" value={form.symbol} onChange={(e) => setForm({ ...form, symbol: e.target.value })} /></label>
            <label>Nombre (opcional)<input placeholder="Ej: Grupo Financiero Galicia" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
            <div className="form-row">
              <label>Tipo<select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as AssetType })}>{["Acción", "CEDEAR", "Bono", "Cripto", "Fondo", "Otro"].map((type) => <option key={type}>{type}</option>)}</select></label>
              <label>Moneda<select value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value as Currency })}><option>ARS</option><option>USD</option></select></label>
            </div>
            <div className="form-row">
              <label>Cantidad<input type="number" min="0" step="any" required value={form.quantity} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} /></label>
              <label>Precio de compra<input type="number" min="0" step="any" required value={form.buyPrice} onChange={(e) => setForm({ ...form, buyPrice: Number(e.target.value) })} /></label>
            </div>
            <p className="form-help">Para activos argentinos, normalmente se usa el sufijo <b>.BA</b>. La cotización inicial se completa al actualizar.</p>
            <div className="modal-actions"><button type="button" className="button secondary" onClick={() => setShowForm(false)}>Cancelar</button><button className="button primary">Agregar posición</button></div>
          </form>
        </div>
      )}
    </main>
  );
}
