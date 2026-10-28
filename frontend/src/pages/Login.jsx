import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import "./auth.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import ThemeToggle from "../components/ThemeToggle";

function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event?.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const res = await axios.post(
        "https://ai-interview-coach-backend-iiyt.onrender.com/api/auth/login",
        { email, password }
      );
      login(res.data.user, res.data.token);
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || error.response?.data?.error || "Unable to log in. Please check your details and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-container">
      <div className="auth-theme-toggle"><ThemeToggle /></div>
      <section className="auth-card">
        <div className="auth-brand"><span className="auth-brand-mark">ai<span>.</span></span><span className="auth-brand-name">interview coach</span></div>
        <h1>Welcome back</h1>
        <p className="auth-subtitle">Pick up where you left off. Your next great interview starts with practice.</p>
        <form className="auth-form" onSubmit={handleLogin}>
          <input type="email" placeholder="Email address" aria-label="Email address" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <div className="password-wrapper">
            <input type={showPassword ? "text" : "password"} placeholder="Password" aria-label="Password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="button" className="password-toggle" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <FaEyeSlash /> : <FaEye />}</button>
          </div>
          <button className="auth-button" type="submit" disabled={loading}>{loading ? "Logging in…" : "Log in to your account"} <span aria-hidden="true">→</span></button>
        </form>
        <p className="auth-link">Don't have an account? <Link to="/signup">Create one</Link></p>
        <Link className="auth-back" to="/">← Back to interview coach</Link>
      </section>
    </main>
  );
}

export default Login;
