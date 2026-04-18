import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
  const BASE = import.meta.env.VITE_DJANGO_BASE_URL;
  const [form, setForm] = useState({ username: "", email: "", password: "", password2: "" });
  const [msg, setMsg] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    if (form.password !== form.password2) {
      setIsError(true);
      setMsg("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/api/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setIsError(false);
        setMsg("Account created! Redirecting to login...");
        setTimeout(() => nav("/login"), 1200);
      } else {
        setIsError(true);
        const firstError = data.username?.[0] || data.password?.[0] || data.email?.[0] || JSON.stringify(data);
        setMsg(firstError);
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
            Join Adolfin
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "16px", maxWidth: "280px", lineHeight: "1.6" }}>
            Create your free account and start exploring our premium collection today.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%", maxWidth: "300px" }}>
          {["🎁 Exclusive member deals", "📦 Track all your orders", "⚡ Fast & secure checkout"].map((f) => (
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
        <div style={{ width: "100%", maxWidth: "400px" }} className="animate-fadeUp">
          <h2 style={{ fontSize: "26px", fontWeight: "800", color: "var(--text-primary)", marginBottom: "8px", letterSpacing: "-0.5px" }}>
            Create an account
          </h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "32px", fontSize: "14px" }}>
            Fill in the details below to get started
          </p>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div className="input-group">
              <label className="input-label" htmlFor="signup-username">Username</label>
              <input
                id="signup-username"
                name="username"
                className="input"
                value={form.username}
                onChange={handleChange}
                placeholder="choose a username"
                required
                autoFocus
              />
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="signup-email">Email (optional)</label>
              <input
                id="signup-email"
                name="email"
                type="email"
                className="input"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
              />
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="signup-password">Password</label>
              <input
                id="signup-password"
                name="password"
                type="password"
                className="input"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="signup-password2">Confirm Password</label>
              <input
                id="signup-password2"
                name="password2"
                type="password"
                className="input"
                value={form.password2}
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
              {loading ? "Creating account..." : "Create Account →"}
            </button>
          </form>

          <p style={{ marginTop: "24px", textAlign: "center", fontSize: "14px", color: "var(--text-muted)" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "var(--accent-bright)", fontWeight: "600" }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
