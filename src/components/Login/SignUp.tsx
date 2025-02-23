import axios from "axios";
import { useState, ChangeEvent, FormEvent } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import UserModel from "../../../server/src/models/userModel";
import "../../styles/RegistrationForm.scss"

const SignUp = () => {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState<UserModel>(
    new UserModel({ username: "", email: "", mobile: "", password: "" })
  );

  const [formErrors, setFormErrors] = useState<Partial<UserModel>>({});

  const validateForm = (): Partial<UserModel> => {
    const errors: Partial<UserModel> = {};

    if (!formValues.username) {
      errors.username = "Username is required";
    } else if (!/^[A-Za-z0-9_]{3,15}$/.test(formValues.username)) {
      errors.username =
        "Username should be 3-15 characters long and can only contain letters, numbers, and underscores.";
    }

    if (!formValues.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!formValues.mobile) {
      errors.mobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(formValues.mobile)) {
      errors.mobile = "Mobile number should be 10 digits";
    }

    if (!formValues.password) {
      errors.password = "Password is required";
    }

    return errors;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const errors = validateForm();
    setFormErrors(errors);

    if (Object.keys(errors).length !== 0) {
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/register-user",
        formValues
      );

      if (response.data.success) {
        toast.success(response.data.message || "Registration successful!");
        setFormValues({
          username: "",
          email: "",
          mobile: "",
          password: "",
        });
        setFormErrors({});
      } else {
        toast.error(response.data.message || "Registration failed!");
      }
    } catch (error: any) {
      console.error("Error during registration:", error);
      toast.error(
        error.response?.data?.message || "Something went wrong. Please try again later."
      );
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prevValues: any) => ({ ...prevValues, [name]: value }));
  };

  return (
    <div className="login-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            placeholder="Anakin Skywalker"
            name="username"
            value={formValues.username}
            onChange={handleInputChange}
          />
          {formErrors.username && <span className="error-message">{formErrors.username}</span>}
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="blendin@lll.kpi.ua"
            value={formValues.email}
            onChange={handleInputChange}
          />
          {formErrors.email && <span className="error-message">{formErrors.email}</span>}
        </div>
        <div className="form-group">
          <label>Mobile Number</label>
          <input
            type="tel"
            name="mobile"
            placeholder="077 777 1488"
            value={formValues.mobile}
            onChange={handleInputChange}
          />
          {formErrors.mobile && <span className="error-message">{formErrors.mobile}</span>}
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="lovemom"
            value={formValues.password}
            onChange={handleInputChange}
          />
          {formErrors.password && <span className="error-message">{formErrors.password}</span>}
        </div>
        <button type="submit" className="login-btn">
          Sign Up
        </button>
      </form>
      <p style={{ textAlign: "center" }}>
        Already have an account?{" "}
        <span className="toggle-link"
         style={{ color: "#007BFF", textDecoration: "underline", cursor: "pointer" }}
        onClick={() => navigate('/log-in')}>
          Log in
        </span>
      </p>
    </div>
  );
};

export default SignUp;
