import React, { useState, useEffect  } from "react";
import "./UserLoginPage.scss"; // Import the SCSS file
import config from '../../config';
import Axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";

const UserLoginPage = () => {
    const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
 const navigate = useNavigate(); // Initialize the navigate hook

   useEffect(() => {
     if (localStorage.getItem("userToken")) {
       navigate("/home");
     }
   }, [navigate]);


  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

   else {
         try {
           const response = await Axios.post(
               `${config.baseURL}/auth/user/login`,
             { email, password }
           );
           if (response.data.token) {
               login(response.data.token, response.data.user);
             navigate("/home");
           } else {
             setError("Login failed. Please check your credentials.");
           }
         } catch (error) {
           console.error("An error occurred during Login:", error);
           setError("An error occurred: "+ error.response.data.msg);
         }
       }
  };

  return (
    <div className="user-login-container">
      <div className="user-login-form">
        <h2 className="login-title">User Login</h2>
        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email:</label>
            <input
              type="email"
              id="user_email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="input-group">
            <label>Password:</label>
            <input
              type="password"
              id="pwd"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="login-button-container">
            <button type="submit" className="login-button">
              Login
            </button>
          </div>
        </form>

        <p className="signup">
          Don't have an account? <a href="/userregistration">Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default UserLoginPage;
