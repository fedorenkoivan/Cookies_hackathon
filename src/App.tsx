import "./App.scss";
import "@/index.scss";

import Home from "@components/Home/Home";
import Profile from "@components/Profile/Profile";
import QuestForm from "@components/Forms/QuestForm";
import SignUp from "@components/Login/SignUp";
import LogIn from "@components/Login/LogIn";
import RatingForm from "@components/Rating/RatingForm";
import ForgotPassword from "@components/Login/ForgotPassword";
import ResetPassword from "@components/Login/ResetPassword";
import QuestPage from "@components/Quest/QuestPage";
import SessionRenewalDialog from "@/modals/TokenRenewalModal";
import ProtectedRoutes from "./utils/ProtectedRoutes";

import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import QuestionPage from "./components/Quest/QuestionPage";
import { QuestProvider } from "./contexts/QuestProvider";
import MainLayout from "./components/Layouts/MainLayout";
import QuestLayout from "./components/Layouts/QuestLayout";

function App() {
  return (
    <>
      <QuestProvider>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            {/* <Route path="/quest-form" element={<QuestForm />} /> */}
            <Route path="/rating-form" element={<RatingForm />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/log-in" element={<LogIn />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route
              path="/reset-password/:resetToken"
              element={<ResetPassword />}
            />
            <Route path="/preview-quest/:id" element={<QuestPage />} />

            <Route element={<ProtectedRoutes />}>
              {/* <Route path="/profile" element={<Profile />} /> */}
              <Route path="/quest-form" element={<QuestForm />} />
              {/* <Route path="/rating-form" element={<RatingForm />} /> */}
            </Route>
          </Route>
          <Route element={<QuestLayout />}>
            <Route
              path="/complete-quest/:id/:question_id"
              element={<QuestionPage />}
            />
          </Route>
        </Routes>
      </QuestProvider>

      <SessionRenewalDialog />

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
