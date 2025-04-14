import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import './SignUp.scss';

const validationSchema = Yup.object({
  username: Yup.string()
    .required("Please complete this required field."),
  email: Yup.string()
    .email("Invalid email format")
    .required("Please complete this required field."),
  password: Yup.string()
    .min(8, "Password is too short - should be 8 chars minimum.")
    .matches(/[a-zA-Z]/, "Password can only contain Latin letters.")
    .required("Please complete this required field."),
  confirmPassword: Yup.string()
     .oneOf([Yup.ref('password')], 'Passwords must match')
     .required("Please complete this required field."),
});

const SignUp = () => {
  const navigate = useNavigate();
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
        onSubmit={async (values, { setSubmitting, setStatus }) => {
          try {
            const response = await fetch('http://localhost:5000/users/signup', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ 
                name: values.username,
                email: values.email, 
                password: values.password,
                passwordConfirm: values.confirmPassword
              }),
            });
            
            const data = await response.json();
            
            if (data.status === 'success') {
              // Зберігаємо токен у localStorage
              localStorage.setItem('token', data.token);
              navigate("/profile");
            } else {
              setStatus(data.message || 'Помилка реєстрації');
            }
          } catch (error) {
            console.error('Error during signup:', error);
            setStatus('Помилка з\'єднання з сервером');
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ handleSubmit, status, isSubmitting }) => (
          <Form onSubmit={handleSubmit} className="form">
            {[
              { name: "username", label: "1. Username" },
              { name: "email", label: "2. Your email" },
              { name: "password", label: "3. Your password", type: "password" },
              { name: "confirmPassword", label: "4. Confirm your password", type: "password" },
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
            onClick={() => navigate('/log-in')}
            >Already have an account?</a>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SignUp;
