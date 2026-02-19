import { useState } from "react";

const API_BASE = "http://127.0.0.1:8000";

// ─── Login Page ───────────────────────────────────────────────
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
      setError("Cannot connect to Django server. Is it running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8">
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-4">
            <span className="text-3xl">🔐</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Admin Login</h1>
          <p className="text-gray-400 text-sm mt-1">
            Sign in with your superuser account
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-300 text-red-600 text-sm rounded-lg px-4 py-3 mb-5">
            ⚠️ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition-all duration-200"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          Only Django superusers can access this panel.
        </p>
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────
function Dashboard({ username, onLogout }) {
  const [records, setRecords] = useState([]);
  const [addStatus, setAddStatus] = useState(null);
  const [loading, setLoading] = useState({ add: false, show: false });
  const [error, setError] = useState(null);

  const handleAdd = async () => {
    setLoading((l) => ({ ...l, add: true }));
    setAddStatus(null);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/add`, { credentials: "include" });
      const data = await res.json();
      setAddStatus(data);
    } catch {
      setError("Failed to connect to Django server.");
    } finally {
      setLoading((l) => ({ ...l, add: false }));
    }
  };

  const handleShow = async () => {
    setLoading((l) => ({ ...l, show: true }));
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/show`, { credentials: "include" });
      const data = await res.json();
      setRecords(data.records || []);
    } catch {
      setError("Failed to connect to Django server.");
    } finally {
      setLoading((l) => ({ ...l, show: false }));
    }
  };

  const handleLogout = async () => {
    await fetch(`${API_BASE}/logout`, { credentials: "include" });
    onLogout();
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-indigo-700">
              Django + MySQL + React
            </h1>
            <p className="text-gray-400 text-sm mt-0.5">
              Logged in as{" "}
              <span className="font-semibold text-indigo-500">{username}</span>
            </p>
          </div>
          <div className="flex gap-2">
            <a
              href="http://127.0.0.1:8000/admin"
              target="_blank"
              rel="noreferrer"
              className="bg-gray-800 hover:bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
            >
              🛠 Admin Panel
            </a>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-4">
            ⚠️ {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={handleAdd}
            disabled={loading.add}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-4 rounded-xl shadow transition-all duration-200 flex items-center justify-center gap-2"
          >
            {loading.add ? <span className="animate-spin">⏳</span> : "➕"}
            {loading.add ? "Adding..." : "Add Record (/add)"}
          </button>

          <button
            onClick={handleShow}
            disabled={loading.show}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold py-4 rounded-xl shadow transition-all duration-200 flex items-center justify-center gap-2"
          >
            {loading.show ? <span className="animate-spin">⏳</span> : "📋"}
            {loading.show ? "Loading..." : "Show Records (/show)"}
          </button>
        </div>

        {/* Add Status */}
        {addStatus && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-6">
            <h2 className="text-indigo-700 font-semibold mb-2">
              ✅ Record Added
            </h2>
            <p className="text-sm text-gray-600">
              <span className="font-medium">ID:</span> {addStatus.record?.id}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Text:</span>{" "}
              {addStatus.record?.text}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Created:</span>{" "}
              {new Date(addStatus.record?.created_at).toLocaleString()}
            </p>
          </div>
        )}

        {/* Records Table */}
        {records.length > 0 && (
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              📦 All Records ({records.length})
            </h2>
            <div className="overflow-hidden rounded-xl border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-gray-600 font-medium">
                      ID
                    </th>
                    <th className="px-4 py-3 text-left text-gray-600 font-medium">
                      Text
                    </th>
                    <th className="px-4 py-3 text-left text-gray-600 font-medium">
                      Created At
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record, idx) => (
                    <tr
                      key={record.id}
                      className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-4 py-3 text-indigo-600 font-mono font-medium">
                        #{record.id}
                      </td>
                      <td className="px-4 py-3 text-gray-700">{record.text}</td>
                      <td className="px-4 py-3 text-gray-400 text-xs">
                        {new Date(record.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty State */}
        {records.length === 0 && !error && (
          <div className="bg-white rounded-2xl shadow-md p-10 text-center text-gray-400">
            <p className="text-4xl mb-3">🗄️</p>
            <p>
              Click <strong>Add Record</strong> to insert data, then{" "}
              <strong>Show Records</strong> to view them.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── App Root ─────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);

  if (!user) {
    return <LoginPage onLogin={(username) => setUser(username)} />;
  }

  return <Dashboard username={user} onLogout={() => setUser(null)} />;
}
