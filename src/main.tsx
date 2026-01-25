import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import axios from "axios"; // <--- 1. Importujemy axios

// 2. Ustawiamy adres backendu (taki sam jak w orval.config.ts)
axios.defaults.baseURL = "https://localhost:7115";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
