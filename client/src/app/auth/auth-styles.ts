export const authStyles = `
  .auth-wrap { min-height: 100vh; display: grid; place-items: center; background: var(--tm-bg); position: relative; overflow: hidden; }
  .auth-bg-shapes { position: fixed; inset: 0; pointer-events: none; overflow: hidden; }
  .shape { position: absolute; border-radius: 50%; filter: blur(80px); }
  .s1 { width: 400px; height: 400px; background: rgba(17,17,17,0.08); top: -100px; left: -100px; }
  .s2 { width: 350px; height: 350px; background: rgba(17,17,17,0.05); bottom: -80px; right: -80px; }
  .s3 { width: 250px; height: 250px; background: rgba(99,102,241,0.06); top: 40%; right: 20%; }
  .auth-card {
    width: 380px; background: var(--tm-surface); border: 1px solid var(--glass-border);
    border-radius: 16px; padding: 2.5rem 2rem; position: relative; z-index: 1;
  }
  .auth-brand { display: flex; align-items: center; justify-content: center; gap: 0.5rem; font-size: 1.3rem; font-weight: 800; margin-bottom: 1.5rem; }
  .auth-brand svg { color: var(--tm-primary); }
  .auth-title { text-align: center; font-size: 1.4rem; font-weight: 700; margin: 0 0 0.25rem; }
  .auth-subtitle { text-align: center; color: var(--tm-muted); font-size: 0.9rem; margin: 0 0 1.5rem; }
  .input-group { margin-bottom: 0.25rem; }
  .input-group label { display: block; font-size: 0.78rem; font-weight: 600; color: var(--tm-muted); margin-bottom: 0.35rem; text-transform: uppercase; letter-spacing: 0.04em; }
  .input-group .tm-input { margin-bottom: 0.8rem; }
  .pw-wrap { position: relative; }
  .pw-toggle { position: absolute; right: 10px; top: 10px; background: none; border: none; color: var(--tm-muted); cursor: pointer; padding: 4px; border-radius: 6px; display: flex; }
  .pw-toggle:hover { background: var(--glass-hover); }
  .auth-btn { width: 100%; justify-content: center; padding: 0.75rem; margin-top: 0.5rem; }
  .btn-spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.5s linear infinite; display: inline-block; vertical-align: middle; margin-right: 0.3rem; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .auth-links { display: flex; justify-content: center; gap: 1rem; margin-top: 1.2rem; font-size: 0.85rem; }
  .auth-links.column { flex-direction: column; align-items: center; gap: 0.5rem; }
  .auth-error { margin-top: 1rem; padding: 0.6rem; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2); border-radius: 8px; color: #a33a32; font-size: 0.85rem; text-align: center; }
  .auth-success { margin-top: 1rem; padding: 0.6rem; background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.2); border-radius: 8px; color: #3f7a52; font-size: 0.85rem; text-align: center; }
`;
