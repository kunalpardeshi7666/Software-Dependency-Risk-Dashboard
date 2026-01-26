import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./app/routes";



function App() {
  return (
  
  
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
     
 
  );
}

export default App;
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import Sidebar from "./components/Sidebar";
// import Dashboard from "./pages/Dashboard";
// import Dependencies from "./pages/Dependencies";
// import Licenses from "./pages/Licenses";
// import Settings from "./pages/Settings";

// function App() {
//   return (
//     <BrowserRouter>
//       <div className="flex h-screen bg-gray-100">
//         <Sidebar />
//         <div className="flex-1 flex flex-col">
//           <Navbar />
//           <main className="p-6 overflow-auto">
//             <Routes>
//               <Route path="/" element={<Dashboard />} />
//               <Route path="/dependencies" element={<Dependencies />} />
//               <Route path="/licenses" element={<Licenses />} />
//               <Route path="/settings" element={<Settings />} />
//             </Routes>
//           </main>
//         </div>
//       </div>
//     </BrowserRouter>
//   );

// }
