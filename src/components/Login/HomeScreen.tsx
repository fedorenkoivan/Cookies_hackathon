import { useEffect, useState } from "react";
import axios from "axios";

const UserHomeScreen = () => {
  const [userData, setUserData] = useState<{ username?: string; email?: string } | null>(null);

  const fetchUserDetails = async () => {
    try {
      const token = sessionStorage.getItem("authToken");

      if (!token) {
        console.log("User is not logged in");
        return;
      }

      const response = await axios.get("http://localhost:3000/api/auth/get-userDetails", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setUserData(response.data.user);
        sessionStorage.setItem("userData", JSON.stringify({ isLoggedIn: true, userData: response.data.user }));
      } else {
        console.log(response.data.message || "Failed to fetch user details");
      }
    } catch (err) {
      console.error("Error fetching user details:", err);
    }
  };

  useEffect(() => {
    const storedUserData = sessionStorage.getItem("userData");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData).userData);
    } else {
      fetchUserDetails();
    }
  }, []);

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>Welcome to User Home Screen</h2>
      <div style={{ textAlign: "center" }}>
        <h2> 
          Name: {userData?.username || "Loading..."} <br /> 
          Email: {userData?.email || "Loading..."} 
        </h2>
      </div>
    </div>
  );
}

export default UserHomeScreen;
