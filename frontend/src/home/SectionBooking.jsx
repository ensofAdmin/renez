// src/home/SectionBooking.jsx
import {useContext, useEffect, useRef} from "react"
import { useNavigate } from "react-router-dom"
import ReviewsContext from "../context/ReviewsProvider.jsx";

export default function SectionBooking() {

  const bgRef = useRef(null)
  const navigate = useNavigate()
  const {
        setShowRegister
  } = useContext(ReviewsContext);

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
    <section id="section4" className="section section-booking section-4">
      <div ref={bgRef} className="section-bg booking-bg" />

      <div className="booking-wrapper">
        {/* LEFT: Booking Card */}

        <div className="booking-card">
          <h2 className="booking-title">Ready for Your New Look?</h2>

          <p className="booking-subtitle">
            Book an appointment with Renez or create a profile to share your photo,
            review your experience, and join the community.
          </p>

          <div className="booking-buttons">
            <button
              className="booking-btn primary"
              onClick={() => navigate("/book")}
            >
              Make a Booking
            </button>

            <button
              className="booking-btn secondary"
              onClick={() => setShowRegister(true)}
            >
              Register & Create Profile
            </button>
          </div>
        </div>

      </div>
    </section>
  )
}
