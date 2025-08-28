import { Outlet } from "react-router";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";

const Layout = () => {
  return (
    <>
      <Navbar></Navbar>
      <main className="min-h-[calc(100vh-218px)]">
        <Outlet></Outlet>
      </main>
      <Footer></Footer>
    </>
  );
};

export default Layout;
