import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

function CartPage() {
  const { cartItems, total, removeFromCart, updateQuantity } = useCart();
  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", paddingTop: "68px" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 24px" }}>

        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: "800", color: "var(--text-primary)", letterSpacing: "-0.5px" }}>
            Your Cart
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", marginTop: "4px" }}>
            {cartItems.length > 0 ? `${cartItems.length} item${cartItems.length > 1 ? "s" : ""} in your cart` : "Your cart is empty"}
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "80px 20px",
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-xl)",
            animation: "fadeIn 0.4s ease",
          }}>
            <div style={{ fontSize: "72px", marginBottom: "24px", opacity: 0.6 }}>🛒</div>
            <h2 style={{ fontSize: "20px", fontWeight: "700", color: "var(--text-primary)", marginBottom: "8px" }}>
              Nothing here yet
            </h2>
            <p style={{ color: "var(--text-secondary)", marginBottom: "28px", fontSize: "15px" }}>
              Add some products from our store to get started.
            </p>
            <Link to="/" className="btn btn-primary">
              Browse Products
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "24px", alignItems: "start" }}>

            {/* Items List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="animate-fadeUp"
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius)",
                    padding: "16px 20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    transition: "border-color 0.2s ease",
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "var(--border-light)"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
                >
                  {/* Image */}
                  <div style={{
                    width: "72px",
                    height: "72px",
                    borderRadius: "10px",
                    overflow: "hidden",
                    background: "var(--bg-secondary)",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "28px",
                  }}>
                    {item.product_image ? (
                      <img
                        src={`${BASEURL}${item.product_image}`}
                        alt={item.product_name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        onError={e => { e.target.style.display = "none"; }}
                      />
                    ) : "📦"}
                  </div>

                  {/* Name & Price */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{
                      fontWeight: "600",
                      fontSize: "15px",
                      color: "var(--text-primary)",
                      marginBottom: "4px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}>{item.product_name}</h3>
                    <p style={{ color: "var(--accent-bright)", fontWeight: "700", fontSize: "16px" }}>
                      ${parseFloat(item.product_price).toFixed(2)}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      style={{
                        width: "32px", height: "32px",
                        borderRadius: "8px",
                        border: "1px solid var(--border-light)",
                        background: "var(--bg-secondary)",
                        color: "var(--text-primary)",
                        fontSize: "16px",
                        cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={e => { e.target.style.borderColor = "var(--danger)"; e.target.style.color = "var(--danger)"; }}
                      onMouseLeave={e => { e.target.style.borderColor = "var(--border-light)"; e.target.style.color = "var(--text-primary)"; }}
                    >−</button>
                    <span style={{
                      minWidth: "32px",
                      textAlign: "center",
                      fontWeight: "700",
                      fontSize: "15px",
                      color: "var(--text-primary)",
                    }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      style={{
                        width: "32px", height: "32px",
                        borderRadius: "8px",
                        border: "1px solid var(--border-light)",
                        background: "var(--bg-secondary)",
                        color: "var(--text-primary)",
                        fontSize: "16px",
                        cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={e => { e.target.style.borderColor = "var(--success)"; e.target.style.color = "var(--success)"; }}
                      onMouseLeave={e => { e.target.style.borderColor = "var(--border-light)"; e.target.style.color = "var(--text-primary)"; }}
                    >+</button>
                  </div>

                  {/* Subtotal */}
                  <p style={{
                    minWidth: "80px",
                    textAlign: "right",
                    fontWeight: "700",
                    fontSize: "15px",
                    color: "var(--text-primary)",
                  }}>
                    ${(parseFloat(item.product_price) * item.quantity).toFixed(2)}
                  </p>

                  {/* Remove */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    style={{
                      width: "34px", height: "34px",
                      borderRadius: "8px",
                      border: "1px solid rgba(244,86,106,0.2)",
                      background: "rgba(244,86,106,0.08)",
                      color: "var(--danger)",
                      fontSize: "15px",
                      cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all 0.2s",
                      flexShrink: 0,
                    }}
                    onMouseEnter={e => { e.target.style.background = "rgba(244,86,106,0.2)"; }}
                    onMouseLeave={e => { e.target.style.background = "rgba(244,86,106,0.08)"; }}
                    title="Remove item"
                  >✕</button>
                </div>
              ))}
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
                  <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                    <span style={{ color: "var(--text-secondary)" }}>{item.product_name} × {item.quantity}</span>
                    <span style={{ color: "var(--text-primary)", fontWeight: "600" }}>
                      ${(parseFloat(item.product_price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: "1px solid var(--border)", paddingTop: "16px", marginBottom: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "15px", color: "var(--text-secondary)", fontWeight: "500" }}>Total</span>
                  <span style={{ fontSize: "22px", fontWeight: "800", color: "var(--accent-bright)" }}>
                    ${parseFloat(total).toFixed(2)}
                  </span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="btn btn-primary"
                style={{ width: "100%", padding: "14px", fontSize: "15px", borderRadius: "12px" }}
              >
                Proceed to Checkout →
              </Link>

              <Link
                to="/"
                style={{
                  display: "block",
                  textAlign: "center",
                  marginTop: "12px",
                  fontSize: "13px",
                  color: "var(--text-muted)",
                }}
                onMouseEnter={e => e.target.style.color = "var(--text-secondary)"}
                onMouseLeave={e => e.target.style.color = "var(--text-muted)"}
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartPage;