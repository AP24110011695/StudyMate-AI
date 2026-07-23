import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import "./styles/global.css";

import { AuthProvider } from "./context/AuthContext";
import { PdfProvider } from "./context/PdfContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <PdfProvider>
          <App />
        </PdfProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);