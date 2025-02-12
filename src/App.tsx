import "./App.scss";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import Profile from "./components/Profile";
import QuestForm from "./components/QuestForm";
import QuestionsForm from "./components/QuestionsForm";
import SignUp from "./components/SignUp";
import LogIn from "./components/LogIn";
import UserHomeScreen from "./components/HomeScreen";
import Footer from "./components/Footer";
import RatingForm from "./components/RatingForm";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/quest-form/1" element={<QuestForm />} />
        <Route path="/quest-form/2" element={<QuestionsForm />} />
        <Route path="/rating-form" element={<RatingForm />} />
        <Route path="/sign-up" element={<SignUp/>} />
        <Route path="/log-in" element={<LogIn/>} />
        <Route path="/log-in" element={<LogIn />} />
        <Route path="/home-screen" element={<UserHomeScreen/>} />
        <Route path="/sign-up" element={<SignUp />} />
      </Routes>
      <Footer />

      <ToastContainer 
        position="top-center" 
        autoClose={3000} 
        hideProgressBar={false} 
        newestOnTop={true} 
        closeOnClick 
        pauseOnHover 
        theme="colored" 
      />
    </>
  );
}

export default App;
