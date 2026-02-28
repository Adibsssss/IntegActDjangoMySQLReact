import { useState } from "react";

const API_BASE = "http://127.0.0.1:8000";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Syne:wght@400;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --black: #0a0a0a;
    --surface: #111111;
    --surface2: #181818;
    --border: #2a2a2a;
    --border-bright: #3d3d3d;
    --amber: #e8a030;
    --amber-dim: #a06b18;
    --amber-glow: rgba(232,160,48,0.12);
    --green: #4ade80;
    --red: #f87171;
    --text: #e8e2d8;
    --text-muted: #6b6560;
    --text-dim: #9e9690;
    --mono: 'Space Mono', monospace;
    --sans: 'Syne', sans-serif;
  }

  body {
    background: var(--black);
    color: var(--text);
    font-family: var(--mono);
    min-height: 100vh;
  }

  /* Scanline overlay */
  body::before {
    content: '';
    position: fixed;
    inset: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(0,0,0,0.04) 2px,
      rgba(0,0,0,0.04) 4px
    );
    pointer-events: none;
    z-index: 9999;
  }

  /* ── LOGIN ── */
  .login-wrap {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
  }

  .login-bg {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 60% 50% at 50% 60%, rgba(232,160,48,0.07) 0%, transparent 70%),
      linear-gradient(180deg, #0a0a0a 0%, #0e0d0b 100%);
  }

  .login-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(232,160,48,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(232,160,48,0.04) 1px, transparent 1px);
    background-size: 40px 40px;
    mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 80%);
  }

  .login-card {
    position: relative;
    z-index: 1;
    width: 420px;
    background: var(--surface);
    border: 1px solid var(--border-bright);
    padding: 0;
    overflow: hidden;
  }

  .login-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--amber), transparent);
  }

  .login-header {
    padding: 32px 36px 28px;
    border-bottom: 1px solid var(--border);
  }

  .login-eyebrow {
    font-family: var(--mono);
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--amber);
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .login-eyebrow::before {
    content: '';
    display: inline-block;
    width: 16px;
    height: 1px;
    background: var(--amber);
  }

  .login-title {
    font-family: var(--sans);
    font-size: 26px;
    font-weight: 800;
    color: var(--text);
    line-height: 1.1;
    letter-spacing: -0.02em;
  }

  .login-body {
    padding: 28px 36px 36px;
  }

  .field {
    margin-bottom: 16px;
  }

  .field-label {
    display: block;
    font-size: 10px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 8px;
  }

  .field-input {
    width: 100%;
    background: var(--black);
    border: 1px solid var(--border);
    color: var(--text);
    font-family: var(--mono);
    font-size: 14px;
    padding: 12px 14px;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
  }

  .field-input:focus {
    border-color: var(--amber);
    box-shadow: 0 0 0 3px var(--amber-glow);
  }

  .field-input::placeholder { color: var(--text-muted); }

  .btn-primary {
    width: 100%;
    background: var(--amber);
    color: var(--black);
    font-family: var(--mono);
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 14px;
    border: none;
    cursor: pointer;
    margin-top: 8px;
    transition: background 0.15s, transform 0.1s;
    position: relative;
    overflow: hidden;
  }

  .btn-primary:hover { background: #f0ab38; }
  .btn-primary:active { transform: translateY(1px); }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

  .alert {
    padding: 10px 14px;
    font-size: 12px;
    margin-bottom: 16px;
    border-left: 3px solid;
    display: flex;
    align-items: flex-start;
    gap: 8px;
  }

  .alert-error {
    background: rgba(248,113,113,0.07);
    border-color: var(--red);
    color: var(--red);
  }

  .alert-success {
    background: rgba(74,222,128,0.07);
    border-color: var(--green);
    color: var(--green);
  }

  /* ── DASHBOARD ── */
  .dash-wrap {
    min-height: 100vh;
    background:
      radial-gradient(ellipse 80% 40% at 50% 0%, rgba(232,160,48,0.04) 0%, transparent 60%),
      var(--black);
  }

  .topbar {
    border-bottom: 1px solid var(--border);
    background: var(--surface);
    padding: 0 40px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .topbar-left {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .topbar-logo {
    font-family: var(--sans);
    font-size: 15px;
    font-weight: 800;
    letter-spacing: -0.01em;
    color: var(--text);
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .logo-dot {
    width: 8px;
    height: 8px;
    background: var(--amber);
    border-radius: 50%;
    box-shadow: 0 0 8px var(--amber);
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; box-shadow: 0 0 8px var(--amber); }
    50% { opacity: 0.6; box-shadow: 0 0 4px var(--amber); }
  }

  .topbar-sep {
    width: 1px;
    height: 20px;
    background: var(--border);
  }

  .topbar-user {
    font-size: 11px;
    color: var(--text-muted);
    letter-spacing: 0.05em;
  }

  .topbar-user span {
    color: var(--amber);
    font-weight: 700;
  }

  .btn-ghost {
    background: transparent;
    border: 1px solid var(--border-bright);
    color: var(--text-dim);
    font-family: var(--mono);
    font-size: 11px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 7px 16px;
    cursor: pointer;
    transition: border-color 0.15s, color 0.15s;
  }

  .btn-ghost:hover {
    border-color: var(--red);
    color: var(--red);
  }

  .main-content {
    max-width: 860px;
    margin: 0 auto;
    padding: 40px 40px;
  }

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
  }

  .section-title {
    font-family: var(--sans);
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text-muted);
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .section-title::before {
    content: '';
    display: inline-block;
    width: 3px;
    height: 14px;
    background: var(--amber);
  }

  .action-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 24px;
  }

  .btn-action {
    background: var(--surface);
    border: 1px solid var(--border);
    color: var(--text);
    font-family: var(--mono);
    font-size: 12px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 18px 24px;
    cursor: pointer;
    text-align: left;
    transition: border-color 0.15s, background 0.15s;
    display: flex;
    align-items: center;
    gap: 14px;
    position: relative;
    overflow: hidden;
  }

  .btn-action::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--amber-glow);
    opacity: 0;
    transition: opacity 0.2s;
  }

  .btn-action:hover { border-color: var(--amber); }
  .btn-action:hover::before { opacity: 1; }
  .btn-action:active { transform: translateY(1px); }

  .btn-action .btn-icon {
    width: 32px;
    height: 32px;
    border: 1px solid var(--border-bright);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    flex-shrink: 0;
    transition: border-color 0.15s;
  }

  .btn-action:hover .btn-icon { border-color: var(--amber); }

  .btn-action .btn-text { display: flex; flex-direction: column; gap: 2px; }
  .btn-action .btn-label { font-weight: 700; font-size: 12px; color: var(--text); }
  .btn-action .btn-sub { font-size: 10px; color: var(--text-muted); letter-spacing: 0.05em; text-transform: none; font-weight: 400; }

  .table-panel {
    background: var(--surface);
    border: 1px solid var(--border);
    overflow: hidden;
  }

  .table-panel-header {
    padding: 16px 20px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .table-panel-title {
    font-size: 11px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  .record-count {
    background: var(--amber-glow);
    border: 1px solid var(--amber-dim);
    color: var(--amber);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.1em;
    padding: 3px 10px;
  }

  .data-table {
    width: 100%;
    border-collapse: collapse;
  }

  .data-table th {
    font-size: 9px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--text-muted);
    padding: 12px 20px;
    text-align: left;
    border-bottom: 1px solid var(--border);
    font-weight: 400;
  }

  .data-table td {
    padding: 14px 20px;
    font-size: 13px;
    border-bottom: 1px solid var(--border);
    vertical-align: middle;
  }

  .data-table tr:last-child td { border-bottom: none; }

  .data-table tr:hover td { background: rgba(232,160,48,0.03); }

  .td-id {
    color: var(--amber);
    font-weight: 700;
    font-size: 12px;
    white-space: nowrap;
  }

  .td-text { color: var(--text); }

  .td-date {
    color: var(--text-muted);
    font-size: 11px;
    white-space: nowrap;
  }

  .btn-del {
    background: transparent;
    border: 1px solid var(--border);
    color: var(--text-muted);
    font-family: var(--mono);
    font-size: 10px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 5px 12px;
    cursor: pointer;
    transition: border-color 0.15s, color 0.15s, background 0.15s;
  }

  .btn-del:hover {
    border-color: var(--red);
    color: var(--red);
    background: rgba(248,113,113,0.07);
  }

  .empty-state {
    padding: 60px 20px;
    text-align: center;
    color: var(--text-muted);
  }

  .empty-state .empty-icon {
    font-size: 28px;
    margin-bottom: 12px;
    opacity: 0.4;
  }

  .empty-state p {
    font-size: 12px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .feedback-bar {
    margin-bottom: 16px;
  }

  .blink {
    animation: blink 1s step-end infinite;
  }
  @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
`;

// ─────────────────────────────────────────────
// LOGIN PAGE
// ─────────────────────────────────────────────
function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.status === "success") {
        onLogin(username);
      } else {
        setError(data.message);
      }
    } catch {
      setError("Cannot connect to Django server.");
    }

    setLoading(false);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="login-wrap">
        <div className="login-bg" />
        <div className="login-grid" />
        <div className="login-card">
          <div className="login-header">
            <div className="login-eyebrow">System Access</div>
            <div className="login-title">
              Admin
              <br />
              Console
            </div>
          </div>
          <div className="login-body">
            {error && (
              <div className="alert alert-error">
                <span>✗</span> {error}
              </div>
            )}
            <form onSubmit={handleLogin}>
              <div className="field">
                <label className="field-label">Identifier</label>
                <input
                  type="text"
                  className="field-input"
                  placeholder="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="field">
                <label className="field-label">Passphrase</label>
                <input
                  type="password"
                  className="field-input"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Authenticating_" : "Authenticate →"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────
function Dashboard({ username, onLogout }) {
  const [records, setRecords] = useState([]);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState({ add: false, show: false });

  const handleAdd = async () => {
    setLoading({ ...loading, add: true });
    setError(null);
    setMessage(null);
    try {
      const res = await fetch(`${API_BASE}/add`, { credentials: "include" });
      const data = await res.json();
      if (data.status === "success") setMessage("Record committed to store.");
      else setError(data.message);
    } catch {
      setError("Cannot connect to server.");
    }
    setLoading({ ...loading, add: false });
  };

  const handleShow = async () => {
    setLoading({ ...loading, show: true });
    setError(null);
    setMessage(null);
    try {
      const res = await fetch(`${API_BASE}/show`, { credentials: "include" });
      const data = await res.json();
      if (data.status === "success") setRecords(data.records);
      else setError(data.message);
    } catch {
      setError("Cannot connect to server.");
    }
    setLoading({ ...loading, show: false });
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Delete record #${id}?`)) return;
    try {
      const res = await fetch(`${API_BASE}/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.status === "success") {
        setRecords(records.filter((r) => r.id !== id));
        setMessage(data.message);
      } else setError(data.message);
    } catch {
      setError("Delete failed.");
    }
  };

  const handleLogout = async () => {
    await fetch(`${API_BASE}/logout`, { credentials: "include" });
    onLogout();
  };

  return (
    <>
      <style>{styles}</style>
      <div className="dash-wrap">
        {/* TOPBAR */}
        <div className="topbar">
          <div className="topbar-left">
            <div className="topbar-logo">
              <div className="logo-dot" />
              CTRL/PANEL
            </div>
            <div className="topbar-sep" />
            <div className="topbar-user">
              session: <span>{username}</span>
            </div>
          </div>
          <button className="btn-ghost" onClick={handleLogout}>
            End Session
          </button>
        </div>

        {/* MAIN */}
        <div className="main-content">
          {/* FEEDBACK */}
          {(message || error) && (
            <div className="feedback-bar">
              {message && (
                <div className="alert alert-success">
                  <span>✓</span> {message}
                </div>
              )}
              {error && (
                <div className="alert alert-error">
                  <span>✗</span> {error}
                </div>
              )}
            </div>
          )}

          {/* ACTIONS */}
          <div className="section-header">
            <div className="section-title">Operations</div>
          </div>

          <div className="action-row">
            <button
              className="btn-action"
              onClick={handleAdd}
              disabled={loading.add}
            >
              <div className="btn-icon">+</div>
              <div className="btn-text">
                <span className="btn-label">
                  {loading.add ? "Writing..." : "Add Record"}
                </span>
                <span className="btn-sub">Insert new entry into datastore</span>
              </div>
            </button>
            <button
              className="btn-action"
              onClick={handleShow}
              disabled={loading.show}
            >
              <div className="btn-icon">⊞</div>
              <div className="btn-text">
                <span className="btn-label">
                  {loading.show ? "Fetching..." : "Show Records"}
                </span>
                <span className="btn-sub">Retrieve all stored entries</span>
              </div>
            </button>
          </div>

          {/* TABLE */}
          <div className="section-header">
            <div className="section-title">Datastore</div>
          </div>

          <div className="table-panel">
            <div className="table-panel-header">
              <span className="table-panel-title">Records</span>
              <span className="record-count">{records.length} entries</span>
            </div>

            {records.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">▭</div>
                <p>
                  No data loaded<span className="blink">_</span>
                </p>
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Content</th>
                    <th>Timestamp</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => (
                    <tr key={record.id}>
                      <td className="td-id">#{record.id}</td>
                      <td className="td-text">{record.text}</td>
                      <td className="td-date">
                        {new Date(record.created_at).toLocaleString()}
                      </td>
                      <td>
                        <button
                          className="btn-del"
                          onClick={() => handleDelete(record.id)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────
// ROOT APP
// ─────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);

  if (!user) return <LoginPage onLogin={setUser} />;
  return <Dashboard username={user} onLogout={() => setUser(null)} />;
}
