import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Header from "./Header";
import Footer from "./Footer";
export default function Layout() {
  return (
     <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <Navbar />

        <main className="p-6 flex-1">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
}

