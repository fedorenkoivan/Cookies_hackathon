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
import ChangeInfo from "./components/Profile/ChangeInfo";

import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import QuestionPage from "./components/Quest/QuestionPage";
import { QuestProvider } from "./contexts/QuestProvider";
import { ProfileProvider } from "./contexts/ProfileProvider";
import MainLayout from "./components/Layouts/MainLayout";
import QuestLayout from "./components/Layouts/QuestLayout";
import PublicProfile from "./components/Profile/PublicProfile";

function App() {
  return (
    <>
      <QuestProvider>
      <ProfileProvider>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/public-profile/:userId" element={<PublicProfile />} />
            <Route path="/rating-form" element={<RatingForm />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/log-in" element={<LogIn />} />
            <Route path="profile/change-info" element={<ChangeInfo />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route
              path="/reset-password/:resetToken"
              element={<ResetPassword />}
            />
            <Route path="/preview-quest/:questId" element={<QuestPage />} />

            <Route element={<ProtectedRoutes />}>
              <Route path="/quest-form" element={<QuestForm />} />
            </Route>
          </Route>
          <Route element={<QuestLayout />}>
            <Route
              path="/complete-quest/:questId"
              element={<QuestionPage />}
            />
          </Route>
        </Routes>
      </ProfileProvider>
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
