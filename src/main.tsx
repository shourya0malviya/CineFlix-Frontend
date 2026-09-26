import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { AppDataProvider } from "./context/AppDataContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AppDataProvider>
          <App />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "rgba(20,20,20,0.95)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(10px)",
                borderRadius: "10px",
                fontSize: "14px",
              },
              success: { iconTheme: { primary: "#E50914", secondary: "#fff" } },
            }}
          />
        </AppDataProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
