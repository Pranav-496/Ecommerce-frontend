import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../utils/auth";
import { useCart } from "../context/CartContext";
import Toast from "../components/Toast";

let toastId = 0;

function CheckoutPage() {
  const [form, setForm] = useState({ name: "", address: "", phone: "", payment_method: "COD" });
  const [toasts, setToasts] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const nav = useNavigate();
  const { cartItems, total, clearCart } = useCart();
  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

  const addToast = (message, type = "info") => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await authFetch(`${BASEURL}/api/orders/create/`, {
        method: "POST",
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        clearCart();
        addToast("Order placed successfully! 🎉", "success");
        setTimeout(() => nav("/orders"), 1500);
      } else {
        addToast(data.error || "Order failed. Please try again.", "error");
      }
    } catch {
      addToast("Network error. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", paddingTop: "68px" }}>
      <Toast toasts={toasts} />

      <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: "800", color: "var(--text-primary)", letterSpacing: "-0.5px" }}>
            Checkout
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", marginTop: "4px" }}>
            Complete your order details below
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "24px", alignItems: "start" }}>

          {/* Form */}
          <div style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-xl)",
            padding: "32px",
          }}>
            <h2 style={{ fontWeight: "700", fontSize: "17px", color: "var(--text-primary)", marginBottom: "24px" }}>
              Delivery Details
            </h2>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div className="input-group">
                <label className="input-label" htmlFor="checkout-name">Full Name</label>
                <input
                  id="checkout-name"
                  name="name"
                  className="input"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="input-group">
                <label className="input-label" htmlFor="checkout-address">Delivery Address</label>
                <textarea
                  id="checkout-address"
                  name="address"
                  className="input"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="123 Main Street, City, State"
                  required
                  rows={3}
                  style={{ resize: "vertical" }}
                />
              </div>

              <div className="input-group">
                <label className="input-label" htmlFor="checkout-phone">Phone Number</label>
                <input
                  id="checkout-phone"
                  name="phone"
                  className="input"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="10-digit phone number"
                  required
                />
              </div>

              <div className="input-group">
                <label className="input-label" htmlFor="checkout-payment">Payment Method</label>
                <select
                  id="checkout-payment"
                  name="payment_method"
                  className="input"
                  value={form.payment_method}
                  onChange={handleChange}
                >
                  <option value="COD">💵 Cash on Delivery</option>
                  <option value="ONLINE">💳 Online Payment</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn btn-success"
                style={{ padding: "16px", fontSize: "16px", borderRadius: "12px", marginTop: "8px", opacity: submitting ? 0.7 : 1 }}
              >
                {submitting ? "Placing Order..." : "✓ Place Order"}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            padding: "24px",
            position: "sticky",
            top: "88px",
          }}>
            <h2 style={{ fontWeight: "700", fontSize: "17px", color: "var(--text-primary)", marginBottom: "20px" }}>
              Order Summary
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
              {cartItems.map((item) => (
                <div key={item.id} style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "13px",
                  padding: "8px 0",
                  borderBottom: "1px solid var(--border)",
                }}>
                  <div>
                    <p style={{ color: "var(--text-primary)", fontWeight: "500" }}>{item.product_name}</p>
                    <p style={{ color: "var(--text-muted)" }}>Qty: {item.quantity}</p>
                  </div>
                  <span style={{ color: "var(--accent-bright)", fontWeight: "700", flexShrink: 0 }}>
                    ${(parseFloat(item.product_price) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "8px" }}>
              <span style={{ color: "var(--text-secondary)", fontWeight: "600", fontSize: "15px" }}>Total</span>
              <span style={{ fontSize: "24px", fontWeight: "800", color: "var(--accent-bright)" }}>
                ${parseFloat(total).toFixed(2)}
              </span>
            </div>

            <div style={{
              marginTop: "16px",
              padding: "12px",
              background: "rgba(34,211,165,0.08)",
              border: "1px solid rgba(34,211,165,0.2)",
              borderRadius: "8px",
              fontSize: "12px",
              color: "var(--success)",
            }}>
              🔒 Secure checkout. Your information is safe.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
