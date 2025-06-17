import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { userLoginEvent } from "@/utils/userData";
import { storeTokenData } from "@/utils/authUtils";
import { useAppContext } from "@/contexts/AppContext";
import {
  USERS_URL,
  REQUIRED_TEXT,
  MIN_PASSWORD_LENGTH,
  ONLY_LATIN_LETTERS,
} from "@/constants/authConstants";

import "./SignUp.scss";

const validationSchema = Yup.object({
  username: Yup.string().required(REQUIRED_TEXT),
  email: Yup.string().email("Invalid email format").required(REQUIRED_TEXT),
  password: Yup.string()
    .min(
      MIN_PASSWORD_LENGTH,
      "Password is too short - should be 8 chars minimum.",
    )
    .matches(ONLY_LATIN_LETTERS, "Password can only contain Latin letters.")
    .required(REQUIRED_TEXT),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required(REQUIRED_TEXT),
});

const SignUp = () => {
  const navigate = useNavigate();

  const { fetchAllQuests } = useAppContext();

  const handleSubmit = async (
    values: { username: string; email: string; password: string },
    {
      setSubmitting,
      setStatus,
    }: FormikHelpers<{
      username: string;
      email: string;
      password: string;
      confirmPassword: string;
    }>,
  ) => {
    try {
      const response = await fetch(`${USERS_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: values.username,
          email: values.email,
          password: values.password,
        }),
      });

      const data = await response.json();

      if (data.status === "success" && data.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);

        storeTokenData(data.accessToken);

        window.dispatchEvent(new Event(userLoginEvent));
        await fetchAllQuests();
        navigate("/profile");
      } else {
        setStatus(data.message || "Error during signup");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      setStatus("Error connecting to the server. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card">
      <div className="banner">
        <p className="logo">🍪 Cookies</p>
        <h2 className="title">READY TO LAUNCH YOUR QUEST?</h2>
        <p className="subtitle">Fill out the form to get in touch</p>
      </div>

      <Formik
        initialValues={{
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, status, isSubmitting }) => (
          <Form onSubmit={handleSubmit} className="form">
            {[
              { name: "username", label: "1. Username" },
              { name: "email", label: "2. Your email" },
              { name: "password", label: "3. Your password", type: "password" },
              {
                name: "confirmPassword",
                label: "4. Confirm your password",
                type: "password",
              },
            ].map(({ name, label, type = "text" }) => (
              <div key={name} className="form-group">
                <label htmlFor={name}>{label} *</label>
                <Field type={type} id={name} name={name} className="input" />
                <ErrorMessage name={name} component="div" className="error" />
              </div>
            ))}

            {status && <div className="error">{status}</div>}

            <div className="btn-container">
              <Button
                type="submit"
                variant="contained"
                endIcon={<SendIcon />}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing Up..." : "Sign Up"}
              </Button>
            </div>
            <a className="account" onClick={() => navigate("/log-in")}>
              Already have an account?
            </a>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SignUp;
