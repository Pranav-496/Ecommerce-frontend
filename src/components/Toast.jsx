import { useState } from "react";

function Toast({ toasts }) {
  return (
    <div style={{
      position: "fixed",
      top: "88px",
      right: "24px",
      zIndex: 9999,
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      pointerEvents: "none",
    }}>
      {toasts.map((t) => (
        <div
          key={t.id}
          style={{
            padding: "14px 20px",
            borderRadius: "12px",
            background: t.type === "success"
              ? "rgba(34,211,165,0.15)"
              : t.type === "error"
              ? "rgba(244,86,106,0.15)"
              : "rgba(124,107,245,0.15)",
            border: `1px solid ${
              t.type === "success"
                ? "rgba(34,211,165,0.4)"
                : t.type === "error"
                ? "rgba(244,86,106,0.4)"
                : "rgba(124,107,245,0.4)"
            }`,
            color: t.type === "success"
              ? "#22d3a5"
              : t.type === "error"
              ? "#f4566a"
              : "#9b8cff",
            fontSize: "14px",
            fontWeight: "500",
            backdropFilter: "blur(12px)",
            animation: "toastIn 0.3s ease forwards",
            maxWidth: "320px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
            pointerEvents: "all",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <span style={{ fontSize: "18px" }}>
            {t.type === "success" ? "✓" : t.type === "error" ? "✕" : "ℹ"}
          </span>
          {t.message}
        </div>
      ))}
    </div>
  );
}

export default Toast;
