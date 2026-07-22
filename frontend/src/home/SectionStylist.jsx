// src/home/SectionStylist.jsx
import { useEffect, useRef } from "react"

import renezPic from "../assets/images/Renez_profile_pic.png"

export default function SectionStylist() {
  const bgRef = useRef(null)

  // Parallax effect
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY * 0.3
      if (bgRef.current) {
        bgRef.current.style.transform = `translateY(${offset}px)`
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section id="section1" className="section section-stylist">
      <div
        ref={bgRef}
        className="section-bg"
        style={{ backgroundImage: `url(${renezPic})` }}
      />
      <div className="section-overlay" />

      <div className="stylist-content">
        <h1 className="stylist-title">Renez — Specialist in African Hair</h1>

        <p className="stylist-subtitle">
          Expert in Butterfly Braids, Twist, Locks, Crochet, and more.<br />
          Skilled across African, Arabic, Asian, and White hair textures.
        </p>

        <div className="stylist-buttons">
          <button
              className="stylist-btn primary"
              onClick={() => window.location.href = "/book"}
          >BOOK NOW</button>

          <button
              className="stylist-btn secondary"
              onClick={() => {
                const el = document.getElementById("section2")
                if (el) {
                  el.scrollIntoView({ behavior: "smooth" })
                }
              }}
          >VIEW GALLERY</button>
        </div>
      </div>
    </section>
  )
}
