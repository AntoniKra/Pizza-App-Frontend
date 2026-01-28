import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import axios from "axios"; // <--- 1. Importujemy axios
import { AuthProvider } from "./context/AuthContext";

const apiUrl = import.meta.env.VITE_API_URL;

axios.defaults.baseURL = apiUrl;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
