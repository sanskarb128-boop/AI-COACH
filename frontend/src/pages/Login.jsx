import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./auth.css";



function Login() {
    console.log("AuthContext:", AuthContext);
    const auth = useContext(AuthContext);
    console.log("useContext result =", auth);
    const { login } = auth;

    const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
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

      alert("Login Successful");
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

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

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