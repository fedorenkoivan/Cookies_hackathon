import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import './LogIn.scss';

const validationSchema = Yup.object({
  companyEmail: Yup.string()
    .email("Invalid email format")
    .required("Please complete this required field."),
  password: Yup.string()
    .min(8, "Password is too short - should be 8 chars minimum.")
    .matches(/[a-zA-Z]/, "Password can only contain Latin letters.")
    .required("Please complete this required field."),
});

const LogIn = () => {
  const navigate = useNavigate();
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
            const response = await fetch('http://localhost:5000/users/login', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ 
                email: values.companyEmail, 
                password: values.password 
              }),
            });
            
            const data = await response.json();
            
            if (data.status === 'success') {
              // Зберігаємо токен у localStorage
              localStorage.setItem('token', data.token);
              navigate("/profile");
            } else {
              setStatus(data.message || 'Помилка авторизації');
            }
          } catch (error) {
            console.error('Error during login:', error);
            setStatus('Помилка конекту з сервером');
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
