import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { userLoginEvent } from "@/utils/userData";
import './LogIn.scss';

const validationSchema = Yup.object({
  password: Yup.string()
    .min(8, "Password is too short - should be 8 chars minimum.")
    .matches(/[a-zA-Z]/, "Password can only contain Latin letters.")
    .required("Please complete this required field."),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required("Please complete this required field."),
});

const LogIn = () => {
  const navigate = useNavigate();
  return (
    <div className="card">
      <div className="banner">
        <p className="logo">🍪 Cookies</p>
        <h2 className="title">Reset password</h2>
        <p className="subtitle">Enter your new cool password</p>
      </div>

      <Formik
        initialValues={{ companyEmail: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting, setStatus }) => {
          try {
            const response = await fetch('http://localhost:5000/users/login', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                password: values.password
              }),
            });

            const data = await response.json();

            if (!response.ok) {
              setStatus(data.message || `Error: ${response.statusText}`);
              return;
            }

            if (data.status === 'success' && data.accessToken) {
              localStorage.setItem('accessToken', data.accessToken);
              window.dispatchEvent(new Event(userLoginEvent))
              navigate("/profile");
            } else {
              setStatus('Authentication error: Invalid server response');
            }
          } catch (error) {
            console.error('Error during login:', error);
            setStatus('Connection error: Could not reach the server');
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ handleSubmit, status, isSubmitting }) => (
          <Form onSubmit={handleSubmit} className="form">
            {[
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
                {isSubmitting ? 'Sending...' : 'Send'}
              </Button>
            </div>
            <a className="account"
              onClick={() => navigate('/sign-up')}
            >Don't have an account?</a>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default LogIn;
