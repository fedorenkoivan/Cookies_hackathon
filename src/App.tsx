import "./App.scss";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import Profile from "./components/Profile";
import QuestForm from "./components/QuestForm";
import QuestionsForm from "./components/QuestionsForm";
import Footer from "./components/Footer";
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
      </Routes>
      <Footer />
    </>
  );
}

export default App;
