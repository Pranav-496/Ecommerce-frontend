import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";

function ProductDetails() {
  const { id } = useParams();
  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    fetch(`${BASEURL}/api/products/${id}/`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch product details");
        return res.json();
      })
      .then((data) => { setProduct(data); setLoading(false); })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, [id, BASEURL]);

  const handleAddToCart = async () => {
    if (!localStorage.getItem("access_token")) {
      window.location.href = "/login";
      return;
    }
    await addToCart(product.id);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const inStock = product?.stock > 0;

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: "68px", background: "var(--bg-primary)" }}>
      <div className="spinner" />
    </div>
  );

  if (error) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: "68px", background: "var(--bg-primary)", color: "var(--danger)" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>⚠</div>
        <p>{error}</p>
      </div>
    </div>
  );

  if (!product) return null;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", paddingTop: "68px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 32px" }}>

        {/* Breadcrumb */}
        <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "32px", color: "var(--text-muted)", fontSize: "14px" }}>
          <Link to="/" style={{ color: "var(--text-muted)", transition: "color 0.2s" }}
            onMouseEnter={e => e.target.style.color = "var(--text-secondary)"}
            onMouseLeave={e => e.target.style.color = "var(--text-muted)"}
          >Home</Link>
          <span>›</span>
          {product.category?.name && (
            <>
              <span style={{ color: "var(--text-muted)" }}>{product.category.name}</span>
              <span>›</span>
            </>
          )}
          <span style={{ color: "var(--text-secondary)" }}>{product.name}</span>
        </div>

        {/* Main card */}
        <div className="animate-fadeUp" style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-xl)",
          overflow: "hidden",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "0",
        }}>
          {/* Image Side */}
          <div style={{
            background: "var(--bg-secondary)",
            minHeight: "480px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            position: "relative",
          }}>
            {product.image ? (
              <img
                src={`${BASEURL}${product.image}`}
                alt={product.name}
                style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }}
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
            ) : null}
            <div style={{
              display: product.image ? "none" : "flex",
              fontSize: "80px",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
            }}>📦</div>

            {/* Category overlay */}
            {product.category?.name && (
              <div style={{ position: "absolute", top: "20px", left: "20px" }}>
                <span className="badge badge-accent">{product.category.name}</span>
              </div>
            )}
          </div>

          {/* Info Side */}
          <div style={{ padding: "48px 44px", display: "flex", flexDirection: "column", justifyContent: "center", gap: "20px" }}>
            {/* Stock status */}
            <span className={`badge ${inStock ? "badge-success" : "badge-danger"}`} style={{ alignSelf: "flex-start" }}>
              {inStock ? `● In Stock — ${product.stock} remaining` : "● Out of Stock"}
            </span>

            <h1 style={{ fontSize: "30px", fontWeight: "800", color: "var(--text-primary)", letterSpacing: "-0.5px", lineHeight: "1.2" }}>
              {product.name}
            </h1>

            <p style={{ color: "var(--text-secondary)", fontSize: "15px", lineHeight: "1.7" }}>
              {product.description || "No description available for this product."}
            </p>

            {/* Price */}
            <div style={{
              padding: "16px 20px",
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              display: "inline-block",
            }}>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "4px", fontWeight: "500" }}>Price</p>
              <p style={{ fontSize: "32px", fontWeight: "800", color: "var(--accent-bright)", letterSpacing: "-1px" }}>
                ${parseFloat(product.price).toFixed(2)}
              </p>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={!inStock}
              style={{
                padding: "16px 28px",
                borderRadius: "12px",
                border: "none",
                fontSize: "16px",
                fontWeight: "700",
                cursor: inStock ? "pointer" : "not-allowed",
                transition: "all 0.2s ease",
                background: added
                  ? "var(--success)"
                  : inStock
                  ? "var(--accent)"
                  : "var(--bg-secondary)",
                color: inStock ? "#fff" : "var(--text-muted)",
                boxShadow: inStock && !added ? "0 6px 25px rgba(124,107,245,0.45)" : added ? "0 6px 25px rgba(34,211,165,0.35)" : "none",
                transform: "translateY(0)",
                opacity: inStock ? 1 : 0.5,
              }}
              onMouseEnter={(e) => {
                if (inStock && !added) {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 10px 30px rgba(124,107,245,0.55)";
                }
              }}
              onMouseLeave={(e) => {
                if (inStock && !added) {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 6px 25px rgba(124,107,245,0.45)";
                }
              }}
            >
              {added ? "✓ Added to Cart!" : inStock ? "🛒 Add to Cart" : "Out of Stock"}
            </button>

            <Link to="/" style={{ color: "var(--text-muted)", fontSize: "14px", display: "flex", alignItems: "center", gap: "6px" }}
              onMouseEnter={e => e.currentTarget.style.color = "var(--accent-bright)"}
              onMouseLeave={e => e.currentTarget.style.color = "var(--text-muted)"}
            >
              ← Back to Store
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;