import { Outlet } from "react-router-dom";
import Footer from "../Partial/Footer";

const QuestLayout = () => (
  <>
    <main>
      <Outlet />
    </main>
    <Footer />
  </>
);

export default QuestLayout;
