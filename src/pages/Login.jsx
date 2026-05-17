import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock } from "lucide-react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "admin" && password === "12345") {
      navigate("/dashboard");
    } else {
      alert("Username atau password salah");
    }
  };

  return (
    <div className="center-page">
      <form className="login-box" onSubmit={handleLogin}>
        <div>
          <h1>Login</h1>
          <p className="subtitle">Access your HeelWatch Pro dashboard.</p>
        </div>

        <div className="input-group">
          <User size={18} />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="input-group">
          <Lock size={18} />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="btn-primary">
          Masuk
        </button>

        <p className="hint">Username: admin | Password: 12345</p>
      </form>
    </div>
  );
}
