import "./App.scss";
import Navbar from "./components/Partial/Navbar";
import Home from "./components/Home/Home";
import Profile from "./components/Profile/Profile";
import QuestForm from "./components/Forms/QuestForm";
import QuestionsForm from "./components/Forms/QuestionForm";
import SignUp from "./components/Login/SignUp";
import LogIn from "./components/Login/LogIn";
import Footer from "./components/Partial/Footer";
import RatingForm from "./components/Rating/RatingForm";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/quest-form/1" element={<QuestForm />} />
        <Route path="/quest-form/2" element={<QuestionsForm />} />
        <Route path="/rating-form" element={<RatingForm />} />
        <Route path="/sign-up" element={<SignUp/>} />
        <Route path="/log-in" element={<LogIn/>} />
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
