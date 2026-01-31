import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import { BrowserRouter } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { ProjectProvider } from "./context/ProjectProvider";
import { DrawerProvider } from "./context/DrawerContext";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AriaLiveRegion from "./compoents/aria/AriaLiveRegion";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ProjectProvider>
          <DrawerProvider>
            <AriaLiveRegion />
            <App />
            <ToastContainer position="top-right" role="alert" />
          </DrawerProvider>
        </ProjectProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
