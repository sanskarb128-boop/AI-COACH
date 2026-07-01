import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./auth.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async () => {
    try {
      await axios.post(
    "https://ai-interview-coach-backend-iiyt.onrender.com/api/auth/signup",
    {
        name,
        email,
        password
    }
)

      alert("Signup Successful!");

      navigate("/login");
    }catch (error) {
    console.log(error);

    alert(
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Something went wrong"
    );
}
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        <h1 className="auth-title">
          Create Account
        </h1>

        <div className="auth-form">

          <input
            placeholder="Name"
            onChange={(e) =>
              setName(e.target.value)
            }
          />

          <input
            placeholder="Email"
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <div className="password-wrapper">
  <input
    type={showPassword ? "text" : "password"}
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
  />

  <span
    className="password-toggle"
    onClick={() => setShowPassword(!showPassword)}
  >
    {showPassword ? <FaEyeSlash /> : <FaEye />}
  </span>
</div>

          <button
            className="auth-button"
            onClick={handleSignup}
          >
            Signup
          </button>

        </div>

        <p className="auth-link">
          Already have an account?{" "}
          <Link to="/login">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Signup;