import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { saveTokens } from "../utils/auth";

function Login() {
  const BASE = import.meta.env.VITE_DJANGO_BASE_URL;
  const [form, setForm] = useState({ username: "", password: "" });
  const [msg, setMsg] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/api/token/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        saveTokens(data);
        setIsError(false);
        setMsg("Login successful! Redirecting...");
        setTimeout(() => nav("/"), 800);
      } else {
        setIsError(true);
        setMsg(data.detail || "Invalid credentials. Please try again.");
      }
    } catch {
      setIsError(true);
      setMsg("Connection failed. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      background: "var(--bg-primary)",
    }}>
      {/* Left — Brand Panel */}
      <div style={{
        background: "linear-gradient(135deg, rgba(124,107,245,0.15) 0%, rgba(167,139,250,0.08) 50%, rgba(10,10,15,0) 100%)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px",
        gap: "32px",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: "72px", height: "72px",
            borderRadius: "20px",
            background: "linear-gradient(135deg, #7c6bf5, #a78bfa)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "32px",
            margin: "0 auto 24px",
            boxShadow: "0 8px 32px rgba(124,107,245,0.4)",
          }}>🛍</div>
          <h1 style={{ fontSize: "36px", fontWeight: "800", color: "var(--text-primary)", letterSpacing: "-1px", marginBottom: "12px" }}>
            Adolfin
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "16px", maxWidth: "280px", lineHeight: "1.6" }}>
            Your premium shopping destination. Curated products, seamless experience.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%", maxWidth: "300px" }}>
          {["🔒 Secure & Encrypted", "⚡ Fast Delivery", "✓ 100% Authentic Products"].map((f) => (
            <div key={f} style={{
              display: "flex", alignItems: "center", gap: "12px",
              padding: "12px 16px",
              background: "rgba(124,107,245,0.08)",
              border: "1px solid rgba(124,107,245,0.15)",
              borderRadius: "10px",
              fontSize: "14px",
              color: "var(--text-secondary)",
            }}>{f}</div>
          ))}
        </div>
      </div>

      {/* Right — Form */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 40px",
      }}>
        <div style={{ width: "100%", maxWidth: "380px" }} className="animate-fadeUp">
          <h2 style={{ fontSize: "26px", fontWeight: "800", color: "var(--text-primary)", marginBottom: "8px", letterSpacing: "-0.5px" }}>
            Welcome back
          </h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "32px", fontSize: "14px" }}>
            Sign in to your account to continue shopping
          </p>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div className="input-group">
              <label className="input-label" htmlFor="login-username">Username</label>
              <input
                id="login-username"
                name="username"
                className="input"
                value={form.username}
                onChange={handleChange}
                placeholder="your username"
                required
                autoFocus
              />
            </div>
            <div className="input-group">
              <label className="input-label" htmlFor="login-password">Password</label>
              <input
                id="login-password"
                name="password"
                type="password"
                className="input"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>

            {msg && (
              <div style={{
                padding: "12px 14px",
                borderRadius: "8px",
                fontSize: "13px",
                fontWeight: "500",
                background: isError ? "rgba(244,86,106,0.1)" : "rgba(34,211,165,0.1)",
                border: `1px solid ${isError ? "rgba(244,86,106,0.3)" : "rgba(34,211,165,0.3)"}`,
                color: isError ? "var(--danger)" : "var(--success)",
              }}>
                {msg}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ padding: "14px", fontSize: "15px", borderRadius: "12px", marginTop: "4px", opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p style={{ marginTop: "24px", textAlign: "center", fontSize: "14px", color: "var(--text-muted)" }}>
            Don't have an account?{" "}
            <Link to="/signup" style={{ color: "var(--accent-bright)", fontWeight: "600" }}>
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
