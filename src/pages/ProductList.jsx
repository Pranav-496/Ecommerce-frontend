import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard.jsx";

function SkeletonCard() {
  return (
    <div style={{
      background: "var(--bg-card)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius-lg)",
      overflow: "hidden",
    }}>
      <div className="skeleton" style={{ height: "220px" }} />
      <div style={{ padding: "16px 18px 18px", display: "flex", flexDirection: "column", gap: "10px" }}>
        <div className="skeleton" style={{ height: "16px", borderRadius: "6px", width: "70%" }} />
        <div className="skeleton" style={{ height: "14px", borderRadius: "6px", width: "40%" }} />
      </div>
    </div>
  );
}

function ProductList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nextUrl, setNextUrl] = useState(null);
  const [prevUrl, setPrevUrl] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [activeCategory, setActiveCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

  const fetchProducts = (url) => {
    setLoading(true);
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then((data) => {
        setProducts(data.results ?? data);
        setNextUrl(data.next ?? null);
        setPrevUrl(data.previous ?? null);
        setTotalCount(data.count ?? (data.results ?? data).length);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts(`${BASEURL}/api/products/`);
    fetch(`${BASEURL}/api/categories/`)
      .then((r) => r.json())
      .then((data) => setCategories(data.results ?? data))
      .catch(() => {});
  }, []);

  const handleCategoryFilter = (catSlug) => {
    setActiveCategory(catSlug);
    if (catSlug === "all") {
      fetchProducts(`${BASEURL}/api/products/`);
    } else {
      fetchProducts(`${BASEURL}/api/products/?category=${catSlug}`);
    }
    setCurrentPage(1);
  };

  const handleNext = () => {
    if (nextUrl) {
      fetchProducts(nextUrl);
      setCurrentPage((p) => p + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    if (prevUrl) {
      fetchProducts(prevUrl);
      setCurrentPage((p) => p - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", paddingTop: "68px" }}>

      {/* Hero Banner */}
      <div style={{
        padding: "56px 40px 48px",
        textAlign: "center",
        background: "linear-gradient(180deg, rgba(124,107,245,0.08) 0%, transparent 100%)",
        borderBottom: "1px solid var(--border)",
      }}>
        <div className="animate-fadeUp">
          <div style={{
            display: "inline-block",
            padding: "5px 16px",
            borderRadius: "999px",
            background: "var(--accent-dim)",
            border: "1px solid rgba(124,107,245,0.3)",
            color: "var(--accent-bright)",
            fontSize: "13px",
            fontWeight: "600",
            marginBottom: "16px",
            letterSpacing: "0.04em",
          }}>
            ✦ NEW ARRIVALS
          </div>
          <h1 style={{
            fontSize: "clamp(32px, 5vw, 52px)",
            fontWeight: "800",
            color: "var(--text-primary)",
            letterSpacing: "-1.5px",
            lineHeight: "1.1",
            marginBottom: "14px",
          }}>
            Discover Premium<br />
            <span style={{
              background: "linear-gradient(90deg, #7c6bf5, #a78bfa, #c4b5fd)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              Products
            </span>
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "16px", maxWidth: "480px", margin: "0 auto" }}>
            {totalCount > 0 ? `${totalCount} curated items across all categories` : "Browse our curated collection"}
          </p>
        </div>
      </div>

      {/* Category Filter */}
      {categories.length > 0 && (
        <div style={{
          padding: "24px 40px 0",
          display: "flex",
          gap: "8px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}>
          {[{ name: "All", slug: "all" }, ...categories].map((cat) => (
            <button
              key={cat.slug}
              onClick={() => handleCategoryFilter(cat.slug)}
              style={{
                padding: "8px 20px",
                borderRadius: "999px",
                border: "1px solid",
                borderColor: activeCategory === cat.slug ? "rgba(124,107,245,0.5)" : "var(--border)",
                background: activeCategory === cat.slug ? "var(--accent-dim)" : "transparent",
                color: activeCategory === cat.slug ? "var(--accent-bright)" : "var(--text-secondary)",
                fontSize: "13px",
                fontWeight: "500",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                if (activeCategory !== cat.slug) {
                  e.target.style.borderColor = "var(--border-light)";
                  e.target.style.color = "var(--text-primary)";
                }
              }}
              onMouseLeave={(e) => {
                if (activeCategory !== cat.slug) {
                  e.target.style.borderColor = "var(--border)";
                  e.target.style.color = "var(--text-secondary)";
                }
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {/* Product Grid */}
      <div style={{ padding: "32px 40px 60px", maxWidth: "1400px", margin: "0 auto" }}>
        {error ? (
          <div style={{
            textAlign: "center",
            padding: "80px 20px",
            color: "var(--danger)",
          }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>⚠</div>
            <p style={{ fontSize: "16px" }}>Failed to load products: {error}</p>
          </div>
        ) : loading ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "24px",
          }}>
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px", color: "var(--text-secondary)" }}>
            <div style={{ fontSize: "56px", marginBottom: "16px" }}>🛍</div>
            <p style={{ fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>No products found</p>
            <p style={{ fontSize: "14px" }}>Try a different category.</p>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "24px",
          }}>
            {products.map((product, i) => (
              <div
                key={product.id}
                className="animate-fadeUp"
                style={{ animationDelay: `${i * 0.05}s`, animationFillMode: "both" }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {(prevUrl || nextUrl) && (
          <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "16px",
            marginTop: "48px",
          }}>
            <button
              onClick={handlePrev}
              disabled={!prevUrl}
              className="btn btn-ghost"
              style={{ opacity: prevUrl ? 1 : 0.4, cursor: prevUrl ? "pointer" : "not-allowed" }}
            >
              ← Previous
            </button>
            <span style={{
              padding: "8px 20px",
              borderRadius: "8px",
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              fontSize: "14px",
              color: "var(--text-secondary)",
            }}>
              Page {currentPage}
            </span>
            <button
              onClick={handleNext}
              disabled={!nextUrl}
              className="btn btn-ghost"
              style={{ opacity: nextUrl ? 1 : 0.4, cursor: nextUrl ? "pointer" : "not-allowed" }}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductList;