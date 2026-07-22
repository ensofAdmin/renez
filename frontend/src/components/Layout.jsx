// src/layout/Layout.jsx
import { Outlet, useLocation } from "react-router-dom"

import Sidebar from "../components/Sidebar"
import Navbar from "../components/Navbar"

import { useSidebar } from "../ui/useSidebar";

import "../styles/Layout.css"

export default function Layout() {

    const isOpen = useSidebar(state => state.isOpen);
    const toggleSidebar = useSidebar(state => state.toggleSidebar);

  // const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  // const toggleSidebar = () => setIsOpen(prev => !prev)

  const hideUI = location.pathname === "/login"
  const isHome = location.pathname === "/";
  const isHomeContent = location.pathname === "/home";

  return (
    <div className="layout">
      {!hideUI && <Navbar toggleSidebar={toggleSidebar} isOpen={isOpen} />}
      {!hideUI && <Sidebar />}
      <main
          className={`main 
          ${isOpen ? "shifted" : ""}
          ${(!isHome || !isHomeContent) ? "with-padding" : ""}`}
      >
        <Outlet />
      </main>
    </div>
  )
}
