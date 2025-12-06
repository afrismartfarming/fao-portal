import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
  console.log("Email:", email);
console.log("Password length:", password.length);
console.log("Password raw:", JSON.stringify(password));

    e.preventDefault();
    
    console.log("Submitting login with:", email, password);

console.log("VITE_API_URL:", import.meta.env.VITE_API_URL);

    const result = await login({ email, password });

    if (!result.success) {
      alert(result.message || "Invalid login");
      return;
    }

    navigate("/dashboard", { replace: true });
  }

  return (
    <div style={{ padding: 40 }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        <button style={styles.btn}>Login</button>
      </form>
    </div>
  );
}

const styles = {
  input: {
    display: "block",
    marginBottom: 12,
    padding: 10,
    width: "100%",
    borderRadius: 6,
    border: "1px solid #ddd",
  },
  btn: {
    padding: "10px 16px",
    background: "#007b55",
    color: "white",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
};

