import { Outlet } from "react-router-dom";
import ProgressBar from "../Partial/ProgressBar";
import Footer from "../Partial/Footer";

const QuestLayout = () => (
  <>
    <ProgressBar />
    <main>
      <Outlet />
    </main>
    <Footer />
  </>
);

export default QuestLayout;
