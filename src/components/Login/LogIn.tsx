import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface LoginErrors {
  email?: string;
  password?: string;
}

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<LoginErrors>({});
  const navigate = useNavigate();

  const validateForm = (): LoginErrors => {
    const errors: LoginErrors = {};

    if (!email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!password) {
      errors.password = "Password is required";
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/api/auth/login", {
        email,
        password,
      });

      if (response.data.success) {
        toast.success("Login successful!");
        const token = response.data.token;
        sessionStorage.setItem("authToken", token);
        window.dispatchEvent(new Event("userLoggedIn"));
        navigate("/profile");
        fetchUserDetails();
      } else {
        toast.error(response.data.message || "Login failed");
      }
    } catch (error: any) {
      console.error("Error during login:", error);
      toast.error(error.response?.data?.message || "Something went wrong. Please try again later.");
    }
  };

  const fetchUserDetails = async () => {
    try {
      const token = sessionStorage.getItem("authToken");
      if (!token) return;

      const response = await axios.get("http://localhost:3000/api/auth/get-userDetails", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        console.log(response.data.user);
      } else {
        console.log(response.data.message || "Failed to fetch user details");
      }
    } catch (err: any) {
      console.error("Error fetching user details:", err);
      console.log(err.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>
        <button type="submit" className="login-btn">
          Login
        </button>
      </form>

      <p style={{ textAlign: "center" }}>
        Don't have an account?{" "}
        <Link to="/sign-up" className="toggle-link" style={{ color: "#007BFF", textDecoration: "underline" }}>
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default Login;
