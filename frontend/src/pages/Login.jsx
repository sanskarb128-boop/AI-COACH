
import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./auth.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";


function Login() {
    console.log("AuthContext:", AuthContext);
    const auth = useContext(AuthContext);
    console.log("useContext result =", auth);
    const { login } = auth;

    const navigate = useNavigate();

  const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        "https://ai-interview-coach-backend-iiyt.onrender.com/api/auth/login",
        {
          email,
          password,
        }
      );

      login(
        res.data.user,
        res.data.token
        );
      navigate("/");

    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
  <div className="auth-container">
    <div className="auth-card">
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <div className="input-group">

  <div className="password-wrapper">
    <input
      type={showPassword ? "text" : "password"}
      placeholder="Enter your password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      onKeyDown={(e) => {
          if (e.key === "Enter") {handleLogin();}
      }}
    />

    <span
      className="password-toggle"
      onClick={() => setShowPassword(!showPassword)}
    >
      {showPassword ? <FaEyeSlash /> : <FaEye />}
    </span>
  </div>
</div>

      <button onClick={handleLogin}>
        Login
      </button>

      <p>
        Don't have an account?
        <Link to="/signup"> Signup</Link>
      </p>
    </div>
  </div>
);
}

export default Login;