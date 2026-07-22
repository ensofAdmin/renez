import {useContext} from "react";
import { Link, useLocation } from "react-router-dom";

import { useSidebar } from "../ui/useSidebar";

import { useAuth } from "../auth/useAuth";
import LogoutButton from "./LogoutButton";
import {useEffect, useState} from "react";
import LoginModal from "../auth/LoginModal.jsx";
import RegistrationModal from "../auth/RegistrationModal";
import ReviewModal from "../components/ReviewModal.jsx";

import ReviewsContext from "../context/ReviewsProvider.jsx";

export default function Sidebar() {

    const location = useLocation();

    const isOpen = useSidebar(state => state.isOpen);
    const toggleSidebar = useSidebar(state => state.toggleSidebar);
    const closeSidebar = useSidebar(state => state.closeSidebar);

    const user = useAuth(s => s.user)

    const {
        rating, setRating,
        comment, setComment,
        openReviews, setOpenReviews,

        serviceId, setServiceId,
        services, setServices,

        setStylist,
        stylistId, setStylistId,
        stylists, setStylists,

        setAppointment,
        appointmentId, setAppointmentId,
        appointments, setAppointments,

        showRegister, setShowRegister
    } = useContext(ReviewsContext);

    const [showLogin, setShowLogin] = useState(false)


    const isHome = location.pathname === "/";
    const isHomeContent = location.pathname === "/home";

    const scrollToSection = (id) => {
    const el = document.getElementById(id)
        if (el) {
          el.scrollIntoView({ behavior: "smooth" })
          toggleSidebar()   // close sidebar after click
        }
    }

    useEffect(() => {
        closeSidebar();   // auto-close on page load
    }, []);

    return (
        <>
            {/* Sidebar */}
            <aside
                style={{
                    width: isOpen ? "260px" : "0",
                    // overflow: "hidden",
                    background: "#1e1e1e",
                    color: "white",
                    height: "100vh",
                    padding: isOpen ? "20px" : "0",
                    boxSizing: "border-box",
                    position: "fixed",
                    left: 0,
                    top: 0,
                    transition: "width 0.3s ease, padding 0.3s ease",
                    zIndex: 900,

                    overflowY: "auto",     /* enables vertical scrolling */
                    overflowX: "hidden",   /* prevents horizontal scroll */
                }}
            >
                {isOpen && (
                    <>
                        <h2 style={{ marginBottom: "30px" }}>Contents</h2>

                        <nav style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                            {
                                !["/", "/home"].includes(location.pathname) && <Link
                                    to="/" style={{ color: "white", textDecoration: "none" }}>
                                    Home
                                </Link>
                            }


                            {/* HOME SECTIONS */}

                            {
                                (isHome || isHomeContent) && (
                                    <>
                                        <Link
                                            className="sidebar-link"
                                            onClick={() => scrollToSection("section1")}
                                            style={{ color: "white", textDecoration: "none" }}
                                        >
                                          Stylist
                                        </Link>

                                        <Link
                                            className="sidebar-link"
                                            onClick={() => scrollToSection("section2")}
                                            style={{ color: "white", textDecoration: "none" }}
                                        >
                                          Gallery
                                        </Link>

                                        <Link
                                            className="sidebar-link"
                                            onClick={() => scrollToSection("section3")}
                                            style={{ color: "white", textDecoration: "none" }}
                                        >
                                          Contact
                                        </Link>

                                        <Link
                                            className="sidebar-link"
                                            onClick={() => scrollToSection("section4")}
                                            style={{ color: "white", textDecoration: "none" }}
                                        >
                                          Booking
                                        </Link>

                                        <Link
                                            className="sidebar-link"
                                            onClick={() => scrollToSection("section5")}
                                            style={{ color: "white", textDecoration: "none" }}
                                        >
                                          Reviews
                                        </Link>
                                    </>
                                )
                            }

                            {user ? (
                                <>
                                    {user.is_superuser && <Link
                                        to="/kanban" style={{ color: "white", textDecoration: "none" }}>
                                            Kanban Board
                                        </Link>
                                    }

                                    <Link to="/appointments" style={{ color: "white", textDecoration: "none" }}>
                                    Appointments
                                    </Link>

                                    <Link to="/book" style={{ color: "white", textDecoration: "none" }}>
                                    Book Appointment
                                    </Link>

                                    {
                                        user.is_superuser && <Link
                                            to="/superuser" style={{ color: "white", textDecoration: "none" }}>
                                            Superuser Panel
                                        </Link>
                                    }

                                    {/* ⭐ Logout button when logged in */}
                                    <LogoutButton />
                                </>
                            ) : (
                                <>
                                    {/* ⭐ Registration modal trigger */}
                                    <Link
                                        onClick={() => setShowRegister(true)}
                                        style={{ color: "white", textDecoration: "none" }}
                                    >
                                        Register
                                    </Link>

                                    {/* ⭐ Login button when logged out */}
                                    <Link
                                        onClick={() => setShowLogin(true)}
                                        style={{ color: "white", textDecoration: "none" }}
                                    >
                                        Login
                                    </Link>
                                </>
                            )}
                        </nav>
                    </>
                )}
            </aside>

            {/* Login Modal */}
            <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />

            {/* Registration Modal */}
            <RegistrationModal open={showRegister} onClose={() => setShowRegister(false)}/>

            {/* Reviews Modal */}
            <ReviewModal
                open={openReviews}
                rating={rating}
                setRating={setRating}
                comment={comment}
                setComment={setComment}

                serviceId={serviceId}
                setServiceId={setServiceId}
                services={services}
                setServices={setServices}

                stylistId={stylistId}
                setStylistId={setStylistId}
                setStylist={setStylist}
                stylists={stylists}
                setStylists={setStylists}

                appointmentId={appointmentId}
                setAppointmentId={setAppointmentId}
                setAppointment={setAppointment}
                appointments={appointments}
                setAppointments={setAppointments}

                onClose={() => setOpenReviews(false)}
            />
        </>
    )
}
