import { Link } from "react-router-dom";

function ProductCard({ product }) {
  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
  const imageUrl = product.image
    ? `${BASEURL}${product.image}`
    : null;
  const inStock = product.stock > 0;

  return (
    <Link to={`/product/${product.id}`} style={{ textDecoration: "none" }}>
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
          cursor: "pointer",
          transition: "all 0.3s ease",
          position: "relative",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "rgba(124,107,245,0.4)";
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(124,107,245,0.15)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--border)";
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        {/* Image */}
        <div style={{ position: "relative", overflow: "hidden", height: "220px", background: "var(--bg-secondary)" }}>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "transform 0.4s ease",
              }}
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
          ) : null}
          {/* Fallback */}
          <div style={{
            display: imageUrl ? "none" : "flex",
            width: "100%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "48px",
          }}>
            📦
          </div>

          {/* Stock badge overlay */}
          <div style={{ position: "absolute", top: "12px", right: "12px" }}>
            <span className={`badge ${inStock ? "badge-success" : "badge-danger"}`}>
              {inStock ? `● ${product.stock} left` : "● Out of Stock"}
            </span>
          </div>

          {/* Category badge */}
          {product.category?.name && (
            <div style={{ position: "absolute", top: "12px", left: "12px" }}>
              <span className="badge badge-accent">{product.category.name}</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ padding: "16px 18px 18px" }}>
          <h2 style={{
            fontSize: "15px",
            fontWeight: "600",
            color: "var(--text-primary)",
            marginBottom: "6px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
            {product.name}
          </h2>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <p style={{
              fontSize: "18px",
              fontWeight: "700",
              color: "var(--accent-bright)",
            }}>
              ${parseFloat(product.price).toFixed(2)}
            </p>
            <span style={{
              fontSize: "12px",
              color: "var(--text-muted)",
            }}>
              View details →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
