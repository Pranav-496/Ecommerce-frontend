import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { clearTokens, getAccessToken } from "../utils/auth.js";

function Navbar() {
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const isLoggedIn = !!getAccessToken();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    clearTokens();
    navigate("/login");
  };

  const navLinks = isLoggedIn
    ? [
        { label: "Shop", to: "/" },
        { label: "Orders", to: "/orders" },
      ]
    : [
        { label: "Shop", to: "/" },
      ];

  const isActive = (path) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: "0 32px",
        height: "68px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: scrolled
          ? "rgba(10, 10, 15, 0.92)"
          : "rgba(10, 10, 15, 0.6)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: scrolled ? "1px solid rgba(42,42,58,0.9)" : "1px solid rgba(42,42,58,0.4)",
        transition: "all 0.3s ease",
      }}
    >
      {/* Logo */}
      <Link
        to="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          fontWeight: "800",
          fontSize: "22px",
          color: "#f0f0f8",
          letterSpacing: "-0.5px",
        }}
      >
        <span style={{
          width: "34px",
          height: "34px",
          borderRadius: "10px",
          background: "linear-gradient(135deg, #7c6bf5, #a78bfa)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "16px",
          boxShadow: "0 4px 15px rgba(124,107,245,0.4)",
        }}>🛍</span>
        Adolfin
      </Link>

      {/* Center Nav Links */}
      <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            style={{
              padding: "7px 18px",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "500",
              color: isActive(link.to) ? "#f0f0f8" : "#9898b8",
              background: isActive(link.to) ? "rgba(124,107,245,0.15)" : "transparent",
              border: isActive(link.to) ? "1px solid rgba(124,107,245,0.3)" : "1px solid transparent",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              if (!isActive(link.to)) {
                e.target.style.color = "#f0f0f8";
                e.target.style.background = "rgba(255,255,255,0.05)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive(link.to)) {
                e.target.style.color = "#9898b8";
                e.target.style.background = "transparent";
              }
            }}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Right Side */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {/* Cart */}
        <Link
          to="/cart"
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            gap: "7px",
            padding: "8px 16px",
            borderRadius: "10px",
            background: "rgba(124,107,245,0.1)",
            border: "1px solid rgba(124,107,245,0.25)",
            color: "#9b8cff",
            fontSize: "14px",
            fontWeight: "600",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(124,107,245,0.2)";
            e.currentTarget.style.borderColor = "rgba(124,107,245,0.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(124,107,245,0.1)";
            e.currentTarget.style.borderColor = "rgba(124,107,245,0.25)";
          }}
        >
          <span>🛒</span>
          <span>Cart</span>
          {cartCount > 0 && (
            <span style={{
              position: "absolute",
              top: "-6px",
              right: "-6px",
              background: "#7c6bf5",
              color: "#fff",
              borderRadius: "999px",
              width: "20px",
              height: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "11px",
              fontWeight: "700",
              boxShadow: "0 2px 8px rgba(124,107,245,0.5)",
              animation: "pulse-ring 2s ease infinite",
            }}>
              {cartCount}
            </span>
          )}
        </Link>

        {/* Auth */}
        {!isLoggedIn ? (
          <div style={{ display: "flex", gap: "8px" }}>
            <Link
              to="/login"
              style={{
                padding: "8px 16px",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: "500",
                color: "#9898b8",
                border: "1px solid rgba(42,42,58,0.8)",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.color = "#f0f0f8";
                e.target.style.borderColor = "#5a5a78";
              }}
              onMouseLeave={(e) => {
                e.target.style.color = "#9898b8";
                e.target.style.borderColor = "rgba(42,42,58,0.8)";
              }}
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="btn btn-primary"
              style={{ padding: "8px 18px", fontSize: "14px" }}
            >
              Sign Up
            </Link>
          </div>
        ) : (
          <button
            onClick={handleLogout}
            style={{
              padding: "8px 18px",
              borderRadius: "10px",
              fontSize: "14px",
              fontWeight: "500",
              color: "#f4566a",
              background: "rgba(244,86,106,0.1)",
              border: "1px solid rgba(244,86,106,0.25)",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "rgba(244,86,106,0.2)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "rgba(244,86,106,0.1)";
            }}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;