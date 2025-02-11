import "./App.scss";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import Profile from "./components/Profile";
import QuestForm from "./components/QuestForm";
import QuestionsForm from "./components/QuestionsForm";
import SignUp from "./components/SignUp";
import LogIn from "./components/LogIn";
import Footer from "./components/Footer";
import RatingForm from "./components/RatingForm";
import { Routes, Route } from "react-router-dom";

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
      </Routes>
      <Footer />
    </>
  );
}

export default App;
