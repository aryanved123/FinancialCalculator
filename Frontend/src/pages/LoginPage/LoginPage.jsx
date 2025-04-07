import React, { useState } from "react";
import "./LoginPage.scss";
import Axios from "axios";
import config from '../../config';
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Initialize the navigate hook

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill out all fields.");
    } else {
      try {
        const response = await Axios.post(
            `${config.baseURL}/auth/admin/login`,
          { email, password }
        );

        if (response.data.token) {
          navigate("/home");
        } else {
          setError("Login failed. Please check your credentials.");
        }
      } catch (error) {
        console.error("An error occurred during Login:", error);
       setError("An error occurred: " + error.response.data.msg);
      }
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1 className="login-title">Login</h1>
        {error && <p className="error-message">{error}</p>}
        <div className="input-group">
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
        </div>
        <div className="input-group">
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </div>
        <div className="login-button-container">
          <button type="submit" className="login-button">
            Login
          </button>
        </div>

        <p className="signup">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
