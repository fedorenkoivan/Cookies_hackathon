import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { toast } from "react-toastify";
import './LogIn.scss';

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email format")
    .required("Please complete this required field."),
});

const ForgotPassword = () => {
  const navigate = useNavigate();
  
  return (
    <div className="card">
      <div className="banner">
        <p className="logo">🍪 Cookies</p>
        <h2 className="title">Forgot password?</h2>
        <p className="subtitle">Don't worry, we'll settle that up in a minute!</p>
      </div>

      <Formik
        initialValues={{ email: "" }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting, setStatus, resetForm }) => {
          try {
            const response = await fetch('http://localhost:5000/users/forgot-password', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ 
                email: values.email
              }),
            });
            
            const data = await response.json();
            
            if (!response.ok) {
              setStatus(data.message || `Error: ${response.statusText}`);
              return;
            }
            
            toast.success("Password reset link sent to your email!");
            resetForm();
            
            setTimeout(() => {
              navigate("/log-in");
            }, 3000);
            
          } catch (error) {
            console.error('Error during password reset request:', error);
            setStatus('Connection error: Could not reach the server');
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ handleSubmit, status, isSubmitting }) => (
          <Form onSubmit={handleSubmit} className="form">
            <div className="form-group">
              <label htmlFor="email">Your email *</label>
              <Field 
                type="email" 
                id="email" 
                name="email" 
                className="input"
                placeholder="Enter the email you used to register" 
              />
              <ErrorMessage name="email" component="div" className="error" />
            </div>

            {status && <div className="error">{status}</div>}

            <div className="btn-container">
              <Button 
                type="submit" 
                variant="contained" 
                endIcon={<SendIcon />}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </div>
            <div className="links">
              <a className="account" onClick={() => navigate('/log-in')}>
                Remember your password? Log In
              </a>
              <br />
              <a className="account" onClick={() => navigate('/sign-up')}>
                Don't have an account? Sign up
              </a>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ForgotPassword;