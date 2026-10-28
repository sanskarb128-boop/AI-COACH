import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import "./auth.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import ThemeToggle from "../components/ThemeToggle";

function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (event) => {
    event?.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      await axios.post(
        "https://ai-interview-coach-backend-iiyt.onrender.com/api/auth/signup",
        { name, email, password }
      );
      alert("Account created successfully. Please log in.");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || error.response?.data?.error || "Unable to create your account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-container">
      <div className="auth-theme-toggle"><ThemeToggle /></div>
      <section className="auth-card">
        <div className="auth-brand"><span className="auth-brand-mark">ai<span>.</span></span><span className="auth-brand-name">interview coach</span></div>
        <h1>Create your account</h1>
        <p className="auth-subtitle">Make space to practice, improve, and feel more confident before the real thing.</p>
        <form className="auth-form" onSubmit={handleSignup}>
          <input type="text" placeholder="Full name" aria-label="Full name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} required />
          <input type="email" placeholder="Email address" aria-label="Email address" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <div className="password-wrapper">
            <input type={showPassword ? "text" : "password"} placeholder="Create a password" aria-label="Create a password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
            <button type="button" className="password-toggle" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <FaEyeSlash /> : <FaEye />}</button>
          </div>
          <button className="auth-button" type="submit" disabled={loading}>{loading ? "Creating account…" : "Create account"} <span aria-hidden="true">→</span></button>
        </form>
        <p className="auth-link">Already have an account? <Link to="/login">Log in</Link></p>
        <Link className="auth-back" to="/">← Back to interview coach</Link>
      </section>
    </main>
  );
}

export default Signup;
