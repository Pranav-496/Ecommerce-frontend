import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { authFetch } from "../utils/auth";

const STATUS_STYLES = {
  Pending:   { bg: "rgba(245,158,11,0.12)",  border: "rgba(245,158,11,0.3)",  color: "#f59e0b" },
  Delivered: { bg: "rgba(34,211,165,0.12)",  border: "rgba(34,211,165,0.3)",  color: "#22d3a5" },
  Cancelled: { bg: "rgba(244,86,106,0.12)",  border: "rgba(244,86,106,0.3)",  color: "#f4566a" },
};

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES["Pending"];
  return (
    <span style={{
      padding: "4px 12px",
      borderRadius: "999px",
      fontSize: "12px",
      fontWeight: "700",
      letterSpacing: "0.04em",
      textTransform: "uppercase",
      background: s.bg,
      border: `1px solid ${s.border}`,
      color: s.color,
    }}>
      ● {status}
    </span>
  );
}

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState(null);

  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

  useEffect(() => {
    authFetch(`${BASEURL}/api/orders/`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load orders");
        return res.json();
      })
      .then((data) => {
        setOrders(data.results ?? data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", paddingTop: "68px" }}>
      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "40px 24px" }}>

        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: "800", color: "var(--text-primary)", letterSpacing: "-0.5px" }}>
            Order History
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", marginTop: "4px" }}>
            {!loading && !error && `${orders.length} order${orders.length !== 1 ? "s" : ""} placed`}
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: "100px", borderRadius: "var(--radius-lg)" }} />
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{
            textAlign: "center", padding: "80px 20px",
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-xl)",
          }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>⚠</div>
            <p style={{ color: "var(--danger)", fontWeight: "600" }}>{error}</p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && orders.length === 0 && (
          <div style={{
            textAlign: "center", padding: "80px 20px",
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-xl)",
            animation: "fadeIn 0.4s ease",
          }}>
            <div style={{ fontSize: "72px", marginBottom: "24px", opacity: 0.5 }}>📦</div>
            <h2 style={{ fontSize: "20px", fontWeight: "700", color: "var(--text-primary)", marginBottom: "8px" }}>
              No orders yet
            </h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "28px" }}>
              Start shopping to see your order history here.
            </p>
            <Link to="/" className="btn btn-primary">Browse Products</Link>
          </div>
        )}

        {/* Orders */}
        {!loading && !error && orders.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {orders.map((order, i) => (
              <div
                key={order.id}
                className="animate-fadeUp"
                style={{
                  animationDelay: `${i * 0.06}s`,
                  animationFillMode: "both",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-lg)",
                  overflow: "hidden",
                  transition: "border-color 0.2s ease",
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "var(--border-light)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
              >
                {/* Order Header — always visible */}
                <div
                  style={{
                    padding: "20px 24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    flexWrap: "wrap",
                    gap: "12px",
                  }}
                  onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div style={{
                      width: "44px", height: "44px",
                      borderRadius: "12px",
                      background: "var(--accent-dim)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "20px",
                    }}>📦</div>
                    <div>
                      <p style={{ fontWeight: "700", fontSize: "15px", color: "var(--text-primary)" }}>
                        Order #{order.id}
                      </p>
                      <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                        {formatDate(order.created_at)} · {order.payment_method}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <StatusBadge status={order.status} />
                    <span style={{ fontSize: "18px", fontWeight: "800", color: "var(--accent-bright)" }}>
                      ${parseFloat(order.total_amount).toFixed(2)}
                    </span>
                    <span style={{
                      color: "var(--text-muted)",
                      fontSize: "18px",
                      transition: "transform 0.2s",
                      transform: expanded === order.id ? "rotate(180deg)" : "rotate(0deg)",
                      display: "inline-block",
                    }}>⌄</span>
                  </div>
                </div>

                {/* Expanded Items */}
                {expanded === order.id && (
                  <div style={{
                    borderTop: "1px solid var(--border)",
                    padding: "20px 24px",
                    animation: "fadeIn 0.25s ease",
                  }}>
                    {/* Delivery Info */}
                    {(order.name || order.address || order.phone) && (
                      <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                        gap: "12px",
                        marginBottom: "20px",
                        padding: "16px",
                        background: "var(--bg-secondary)",
                        borderRadius: "10px",
                        border: "1px solid var(--border)",
                      }}>
                        {order.name && (
                          <div>
                            <p style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>Name</p>
                            <p style={{ fontSize: "14px", color: "var(--text-primary)", fontWeight: "500" }}>{order.name}</p>
                          </div>
                        )}
                        {order.phone && (
                          <div>
                            <p style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>Phone</p>
                            <p style={{ fontSize: "14px", color: "var(--text-primary)", fontWeight: "500" }}>{order.phone}</p>
                          </div>
                        )}
                        {order.address && (
                          <div>
                            <p style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>Address</p>
                            <p style={{ fontSize: "14px", color: "var(--text-primary)", fontWeight: "500" }}>{order.address}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Items */}
                    <p style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "12px" }}>
                      Items
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {order.items?.map((item) => (
                        <div key={item.id} style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "10px 14px",
                          background: "var(--bg-secondary)",
                          borderRadius: "8px",
                          border: "1px solid var(--border)",
                        }}>
                          <div>
                            <p style={{ fontWeight: "600", fontSize: "14px", color: "var(--text-primary)" }}>
                              {item.product_name}
                            </p>
                            <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                              Qty: {item.quantity} × ${parseFloat(item.price).toFixed(2)}
                            </p>
                          </div>
                          <span style={{ fontWeight: "700", fontSize: "15px", color: "var(--accent-bright)" }}>
                            ${(item.quantity * parseFloat(item.price)).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrdersPage;
