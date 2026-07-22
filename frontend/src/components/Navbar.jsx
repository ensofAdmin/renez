// src/components/Navbar.jsx
import "../styles/navbar.css"
import {useSidebar} from "../ui/useSidebar.js";
import {useEffect} from "react";

export default function Navbar() {

    const isOpen = useSidebar(state => state.isOpen);
    const toggleSidebar = useSidebar(state => state.toggleSidebar);
    const closeSidebar = useSidebar(state => state.closeSidebar);

    useEffect(() => {
        closeSidebar();   // auto-close on page load
    }, []);

    return (
        <div className={`navbar-minimal ${isOpen ? "shifted" : ""}`}>
          <button className="hamburger" onClick={toggleSidebar}>
            ☰
          </button>
        </div>
    )
}
