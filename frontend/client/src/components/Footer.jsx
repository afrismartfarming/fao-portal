import React from "react";

export default function Footer() {
  return (
    <footer style={{ padding: "20px", background: "#003f5c", color: "white", marginTop: "40px" }}>
      <div>© {new Date().getFullYear()} Food and Agriculture Organization</div>
    </footer>
  );
}
