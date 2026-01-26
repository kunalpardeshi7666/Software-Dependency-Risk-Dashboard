// import Sidebar from "./Sidebar";
// import Navbar from "./Navbar";

// export default function MainLayout({ children }) {
//   return (
//     <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
//       <Sidebar />
//       <div className="flex-1 flex flex-col">
//         <Navbar />
//         <main className="p-6 overflow-auto">{children}</main>
//       </div>
//     </div>
//   );
// }
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function MainLayout() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
