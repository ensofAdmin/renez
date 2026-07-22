// src/home/SectionBooking.jsx
import { useEffect, useRef } from "react";

import ReviewList from "../components/ReviewList.jsx";

export default function SectionReviews() {
  const bgRef = useRef(null)

  // Parallax background
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY * 0.2
      if (bgRef.current) {
        bgRef.current.style.transform = `translateY(${offset}px)`
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section id="section5" className="section section-review section-5">
      <div ref={bgRef} className="section-bg booking-bg" />

      <div className="booking-wrapper">
        {/* LEFT: Booking Card */}

        <ReviewList />

      </div>
    </section>
  )
}
