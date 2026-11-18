import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import { AuthProvider } from "./context/AuthContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { ThemeProvider } from "./context/ThemeContext";

import "./index.css";

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
    <AuthProvider>
      <FavoritesProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </FavoritesProvider>
    </AuthProvider>
  </React.StrictMode>
);