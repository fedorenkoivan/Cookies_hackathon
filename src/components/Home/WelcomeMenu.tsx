import "./WelcomeMenu.scss";
import { useNavigate } from "react-router-dom";
import { setAuthStatus } from "@/utils/userData";
import { useEffect } from "react";

const WelcomeMenu = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="menu__bg">
      <div className="menu">
        <h2>Welcome!</h2>
        <p>
          Log in or sign up to create your own quests, leave comments, compete
          with others and more.
        </p>
        <button onClick={() => navigate("/log-in")} className="login-button">Log in</button>
        <button onClick={() => navigate("/sign-up")} className="signup-button">Sign up</button>
        <button onClick={() => setAuthStatus(true)} className="guest-button">Continue as a guest</button>
      </div>
    </div>
  );
};

export default WelcomeMenu;