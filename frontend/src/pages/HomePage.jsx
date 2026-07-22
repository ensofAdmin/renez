// src/pages/HomePage.jsx

import { useEffect } from "react";
import { useSidebar } from "../ui/useSidebar";

import SectionStylist from "../home/SectionStylist";
import SectionGallery from "../home/SectionGallery";
import SectionContact from "../home/SectionContact";
import SectionBooking from "../home/SectionBooking";
import SectionReviews from "../home/SectionReviews.jsx";

import "../styles/home.css"

export function HomePage() {

    const closeSidebar = useSidebar(state => state.closeSidebar);

    useEffect(() => {
        closeSidebar();   // auto-close on page load
    }, []);

    return (
    <div className="home-container">
        <SectionStylist />
        <div className="section-divider"></div>
        <SectionGallery />
        <div className="section-divider"></div>
        <SectionContact />
        <div className="section-divider"></div>
        <SectionBooking />
        <div className="section-divider"></div>
        <SectionReviews />
        <div className="section-divider"></div>
    </div>
    )
}
