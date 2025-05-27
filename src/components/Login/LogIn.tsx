import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { userLoginEvent } from "@/utils/userData";
import { storeTokenData } from "@/utils/authUtils";
import { useQuestContext } from "@/contexts/QuestContext";
import { USERS_URL, REQUIRED_TEXT } from "@/constants/authConstants";
import "./LogIn.scss";

// react e18n 
const validationSchema = Yup.object({
  companyEmail: Yup.string()
    .email("Invalid email format")
    .required(REQUIRED_TEXT),
  password: Yup.string()
    .min(8, "Password is too short - should be 8 chars minimum.")
    .matches(/[a-zA-Z]/, "Password can only contain Latin letters.")
    .required(REQUIRED_TEXT),
});

const LogIn = () => {
  const navigate = useNavigate();
  const { fetchAllQuests } = useQuestContext();
  return (
    <div className="card">
      <div className="banner">
        <p className="logo">🍪 Cookies</p>
        <h2 className="title">Welcome back!</h2>
        <p className="subtitle">Fill out the form to log in</p>
      </div>

      <Formik
        initialValues={{ companyEmail: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting, setStatus }) => {
          try {
            const response = await fetch(`${USERS_URL}/login`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify({
                email: values.companyEmail,
                password: values.password,
              }),
            });

            const data = await response.json();

            if (!response.ok) {
              setStatus(data.message || `Error: ${response.statusText}`);
              return;
            }

            if (data.status === "success" && data.accessToken) {
              localStorage.setItem("accessToken", data.accessToken);

              storeTokenData(data.accessToken);

              window.dispatchEvent(new Event(userLoginEvent));
              await fetchAllQuests();
              navigate("/profile");
            } else {
              setStatus("Authentication error: Invalid server response");
            }
          } catch (error) {
            console.error("Error during login:", error);
            setStatus("Connection error: Could not reach the server");
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ handleSubmit, status, isSubmitting }) => (
          <Form onSubmit={handleSubmit} className="form">
            {[
              { name: "companyEmail", label: "1. Company email" },
              { name: "password", label: "2. Your password", type: "password" },
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
                {isSubmitting ? "Logging In..." : "Log In"}
              </Button>
            </div>
            <a className="account" onClick={() => navigate("/sign-up")}>
              Don't have an account?
            </a>
            <a className="account" onClick={() => navigate("/forgot-password")}>
              Forgot password?
            </a>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default LogIn;
