import { Outlet } from "react-router-dom";
import Navbar from "../Partial/Navbar";
import Footer from "../Partial/Footer";

const MainLayout = () => (
  <>
    <Navbar />
    <main>
      <Outlet />
    </main>
    <Footer />
  </>
);

export default MainLayout;
