import { useState, useEffect, useRef } from "react";
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

import { FaCamera, FaTimes } from "react-icons/fa";

import "./ChangeInfo.scss";

type FormValues = {
  name: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  showPasswordFields: boolean;
  profileImage?: File | string;
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [initialValues, setInitialValues] = useState<FormValues>({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    showPasswordFields: false,
    profileImage: "",
  });

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: any) => void
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.match("image.*")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    setFieldValue("profileImage", file);

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (setFieldValue: (field: string, value: any) => void) => {
    setFieldValue("profileImage", "");
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    if (userData) {
      setInitialValues((prev) => ({
        ...prev,
        name: userData.name || "",
        email: userData.email || "",
      }));

      if (userData.profileImage) {
        setImagePreview(userData.profileImage);
      }
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

      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);

      if (values.profileImage instanceof File) {
        formData.append("profileImage", values.profileImage);
      }

      if (showPasswordFields && values.currentPassword && values.newPassword) {
        formData.append("currentPassword", values.currentPassword);
        formData.append("newPassword", values.newPassword);
      }

      const response = await fetch(`${USERS_URL}/change-info`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
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
                  <img
                    src={
                      imagePreview ||
                      userData?.profileImage ||
                      "./src/assets/img1.png"
                    }
                    alt="Avatar"
                  />
                  <div className="image-controls">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => handleImageChange(e, setFieldValue)}
                    />
                    <button
                      type="button"
                      className="avatar-btn upload-btn"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <FaCamera />
                    </button>
                    {imagePreview && (
                      <button
                        type="button"
                        className="avatar-btn remove-btn"
                        onClick={() => removeImage(setFieldValue)}
                      >
                        <FaTimes />
                      </button>
                    )}
                  </div>
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
