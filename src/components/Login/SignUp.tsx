import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import "../../styles/SignUp.scss";

const validationSchema = Yup.object({
  firstName: Yup.string().required("Please complete this required field."),
  lastName: Yup.string().required("Please complete this required field."),
  companyEmail: Yup.string()
    .email("Invalid email format")
    .required("Please complete this required field."),
  role: Yup.string().required("Please complete this required field."),
  company: Yup.string().required("Please complete this required field."),
  companyType: Yup.array().min(1, "Please select at least one option."),
});

const SignUp = () => {
  const navigate = useNavigate();

  return (
    <div className="card">
      <div className="card-content">
        <div className="banner">
          <p className="logo">🍪 Cookies</p>
          <h2 className="title">READY TO LAUNCH YOUR QUEST?</h2>
          <p className="subtitle">Fill out the form to get in touch</p>
        </div>
      </div>

      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
          companyEmail: "",
          role: "",
          company: "",
          companyType: [],
          password: "",
          confirmPassword: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          console.log(values);
          navigate("/profile");
        }}
      >
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit} className="form">
            {[
              { name: "firstName", label: "1. First name" },
              { name: "lastName", label: "2. Last name" },
              { name: "companyEmail", label: "3. Company email" },
              { name: "role", label: "6. Role" },
              { name: "company", label: "7. Company" },
            ].map(({ name, label }) => (
              <div key={name} className="form-group">
                <label htmlFor={name}>{label} *</label>
                <Field type="text" id={name} name={name} className="input" />
                <ErrorMessage name={name} component="div" className="error" />
              </div>
            ))}
            <div className="btn-container">
              <Button type="submit" variant="contained" endIcon={<SendIcon />}>
                Send
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SignUp;
