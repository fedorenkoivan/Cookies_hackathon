import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import {
  REQUIRED_TEXT,
  USERS_URL,
  MIN_PASSWORD_LENGTH,
  ONLY_LATIN_LETTERS,
} from "@/constants/authConstants";
import { useProfileContext } from "@/contexts/ProfileContext";
import { toast } from "react-toastify";

import "./ChangeInfo.scss";

type FormValues = {
  name: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  showPasswordFields: boolean;
};

const validationSchema = Yup.object({
  name: Yup.string().required(REQUIRED_TEXT),
  email: Yup.string().email("Invalid email format").required(REQUIRED_TEXT),
  currentPassword: Yup.string().when("showPasswordFields", {
    is: true,
    then: (schema) =>
      schema
        .required("Current password is required to change password")
        .min(MIN_PASSWORD_LENGTH, "Password must be at least 8 characters long")
        .matches(ONLY_LATIN_LETTERS, "Password can only contain Latin letters"),
    otherwise: (schema) => schema,
  }),
  newPassword: Yup.string().when("showPasswordFields", {
    is: true,
    then: (schema) =>
      schema
        .min(8, "Password must be at least 8 characters long")
        .matches(ONLY_LATIN_LETTERS, "Password can only contain Latin letters"),
    otherwise: (schema) => schema,
  }),
  confirmPassword: Yup.string().when("showPasswordFields", {
    is: true,
    then: (schema) =>
      schema.oneOf([Yup.ref("newPassword")], "Passwords must match"),
    otherwise: (schema) => schema,
  }),
});

const ChangeInfo = () => {
  const navigate = useNavigate();
  const { userData, fetchUserProfile } = useProfileContext();
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [initialValues, setInitialValues] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    showPasswordFields: false,
  });

  useEffect(() => {
    if (userData) {
      setInitialValues((prev) => ({
        ...prev,
        name: userData.name || "",
        email: userData.email || "",
      }));
    }
  }, [userData]);

  const togglePasswordFields = (
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void
  ) => {
    const newValue = !showPasswordFields;
    setShowPasswordFields(newValue);
    setFieldValue("showPasswordFields", newValue);

    if (!newValue) {
      setFieldValue("currentPassword", "");
      setFieldValue("newPassword", "");
      setFieldValue("confirmPassword", "");
    }
  };

  const saveChanges = async (
    values: FormValues,
    { setSubmitting }: FormikHelpers<FormValues>
  ) => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        toast.error("You must be logged in to update your profile");
        navigate("/log-in");
        return;
      }

      type RequestBody = {
        name: string;
        email: string;
        currentPassword?: string;
        newPassword?: string;
      };

      const requestBody: RequestBody = {
        name: values.name,
        email: values.email,
      };

      if (showPasswordFields && values.currentPassword && values.newPassword) {
        requestBody.currentPassword = values.currentPassword;
        requestBody.newPassword = values.newPassword;
      }

      const response = await fetch(`${USERS_URL}/change-info`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (data.status === "success") {
        await fetchUserProfile();
        toast.success("Profile updated successfully!");
        navigate("/profile");
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An error occurred while updating your profile");
    } finally {
      setSubmitting(false);
    }
  };

  const cancelChanges = () => {
    navigate("/profile");
  };

  return (
    <div className="change-info">
      <div className="change-info__container">
        <h2 className="change-info__title">Edit profile information</h2>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={saveChanges}
          enableReinitialize={true}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form className="change-info__form">
              <div className="change-info__avatar">
                <div className="image">
                  <img src="./src/assets/img1.png" alt="Avatar" />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="name">Username</label>
                <Field
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your username"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="error-message"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <Field
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="error-message"
                />
              </div>

              <div className="form-group password-toggle">
                <button
                  type="button"
                  className="btn btn-toggle"
                  onClick={() => togglePasswordFields(setFieldValue)}
                >
                  {showPasswordFields
                    ? "Cancel Password Change"
                    : "Change Password"}
                </button>
              </div>

              {showPasswordFields && (
                <div className="password-fields">
                  <div className="form-group">
                    <label htmlFor="currentPassword">Current Password</label>
                    <Field
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      placeholder="Enter your current password"
                    />
                    <ErrorMessage
                      name="currentPassword"
                      component="div"
                      className="error-message"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="newPassword">New Password</label>
                    <Field
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      placeholder="Enter your new password"
                    />
                    <ErrorMessage
                      name="newPassword"
                      component="div"
                      className="error-message"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmPassword">
                      Confirm New Password
                    </label>
                    <Field
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      placeholder="Confirm your new password"
                    />
                    <ErrorMessage
                      name="confirmPassword"
                      component="div"
                      className="error-message"
                    />
                  </div>
                </div>
              )}

              <div className="change-info__actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={cancelChanges}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ChangeInfo;
