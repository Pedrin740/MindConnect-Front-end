import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { useTheme } from "../context/ThemeContext";

function MainLayout() {
  const { theme } = useTheme();

  const backgroundTheme = {
    claro: "bg-white",
    intermediario: "bg-slate-100",
    escuro: "bg-slate-950",
  }[theme];

  return (
    <div
      className={`flex min-h-screen flex-col transition-colors duration-300 ${backgroundTheme}`}
    >
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;