import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";


const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const app = (
  <AuthProvider>
    <App />
  </AuthProvider>
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      {googleClientId ? (
        <GoogleOAuthProvider clientId={googleClientId}>{app}</GoogleOAuthProvider>
      ) : (
        app
      )}
    </BrowserRouter>
  </React.StrictMode>,
);
