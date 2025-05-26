import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import { Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { userLoginEvent } from "@/utils/userData";
import { storeTokenData } from "@/utils/authUtils";
import { toast } from "react-toastify";
import './LogIn.scss';

const validationSchema = Yup.object({
  password: Yup.string()
    .min(8, "Password is too short - should be 8 chars minimum.")
    .matches(/[a-zA-Z]/, "Password can only contain Latin letters.")
    .required("Please complete this required field."),
  passwordConfirm: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required("Please complete this required field."),
});

const ResetPassword = () => {
  const navigate = useNavigate();
  const { resetToken } = useParams();
  const [tokenValid, setTokenValid] = useState(true);

  useEffect(() => {
    if (!resetToken) {
      setTokenValid(false);
      toast.error("Invalid reset token");
      setTimeout(() => navigate('/forgot-password'), 2000);
    }
  }, [resetToken, navigate]);

  if (!tokenValid) {
    return <div className="card">Redirecting to password reset page...</div>;
  }

  return (
    <div className="card">
      <div className="banner">
        <p className="logo">🍪 Cookies</p>
        <h2 className="title">Reset your password</h2>
        <p className="subtitle">Please enter your new password</p>
      </div>

      <Formik
        initialValues={{ password: "", passwordConfirm: "" }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting, setStatus }) => {
          try {
            const response = await fetch(`http://localhost:5000/users/reset-password/${resetToken}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                password: values.password,
                passwordConfirm: values.passwordConfirm
              }),
            });

            const data = await response.json();

            if (!response.ok) {
              setStatus(data.message || `Error: ${response.statusText}`);
              return;
            }
            if (data.status === 'success' && data.accessToken) {
              try {
                if (data.accessToken.split('.').length !== 3) {
                  throw new Error('Invalid token format');
                }

                localStorage.setItem('accessToken', data.accessToken);
                storeTokenData(data.accessToken);
                window.dispatchEvent(new Event(userLoginEvent));
                toast.success("Password successfully reset!");
                navigate("/profile");
              } catch (tokenError) {
                console.error('Token validation error:', tokenError);
                setStatus('Error: Received invalid authentication token');
              }
            } else {
              setStatus('Error: Invalid server response');
            }

          } catch (error) {
            console.error('Error during password reset:', error);
            setStatus('Connection error: Could not reach the server');
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ handleSubmit, status, isSubmitting }) => (
          <Form onSubmit={handleSubmit} className="form">
            {[
              { name: "password", label: "New Password", type: "password" },
              { name: "passwordConfirm", label: "Confirm New Password", type: "password" },
            ].map(({ name, label, type }) => (
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
                {isSubmitting ? 'Reseting password...' : 'Reset Password'}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ResetPassword;