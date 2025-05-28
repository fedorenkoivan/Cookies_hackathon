import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProfileContext } from "@/contexts/ProfileContext";
import { USERS_URL } from "@/constants/authConstants";
import { toast } from "react-toastify";
import "./ChangeInfo.scss";

const ChangeInfo = () => {
  const navigate = useNavigate();
  const { userData, fetchUserProfile } = useProfileContext();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  
  useEffect(() => {
    if (userData) {
      setFormData(prev => ({
        ...prev,
        name: userData.name || "",
        email: userData.email || "",
      }));
    }
  }, [userData]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const saveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast.error("Name and email cannot be empty");
      return;
    }
    
    if (!validateEmail(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    if (showPasswordFields) {
      if (!formData.currentPassword) {
        toast.error("Current password is required to change password");
        return;
      }
      
      if (formData.newPassword !== formData.confirmPassword) {
        toast.error("New passwords do not match");
        return;
      }
      
      if (formData.newPassword && formData.newPassword.length < 8) {
        toast.error("Password must be at least 8 characters long");
        return;
      }
    }
    
    try {
      setIsSubmitting(true);
      const accessToken = localStorage.getItem("accessToken");
      
      if (!accessToken) {
        toast.error("You must be logged in to update your profile");
        navigate("/log-in");
        return;
      }
      
      const requestBody: any = {
        name: formData.name,
        email: formData.email
      };
      
      if (showPasswordFields && formData.currentPassword && formData.newPassword) {
        requestBody.currentPassword = formData.currentPassword;
        requestBody.newPassword = formData.newPassword;
      }
      
      const response = await fetch(`${USERS_URL}/update-profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
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
      setIsSubmitting(false);
    }
  };
  
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  
  const cancelChanges = () => {
    navigate("/profile");
  };

  const togglePasswordFields = () => {
    setShowPasswordFields(!showPasswordFields);
    if (showPasswordFields) {
      setFormData(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      }));
    }
  };

  return (
    <div className="change-info">
      <div className="change-info__container">
        <h2 className="change-info__title">Edit Profile Information</h2>
        
        <form onSubmit={saveChanges} className="change-info__form">
          <div className="change-info__avatar">
            <div className="image">
              <img src="./src/assets/img1.png" alt="Avatar" />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="name">Username</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your username"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="form-group password-toggle">
            <button 
              type="button" 
              className="btn btn-toggle" 
              onClick={togglePasswordFields}
            >
              {showPasswordFields ? "Cancel Password Change" : "Change Password"}
            </button>
          </div>
          
          {showPasswordFields && (
            <div className="password-fields">
              <div className="form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder="Enter your current password"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Enter your new password"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your new password"
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
        </form>
      </div>
    </div>
  );
};

export default ChangeInfo;