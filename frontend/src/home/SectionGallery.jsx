// src/home/SectionGallery.jsx
import { useEffect, useRef, useState } from "react"

import medium_conrows from "../assets/images/medium-conrows.jpeg"
import twist_out from "../assets/images/twist-out.jpeg"
import buttery_braids from "../assets/images/buttery-braids.jpeg"
import half_conrows_half_crochet from "../assets/images/half-conrows-half-crochet.jpeg"
import stich_lines_1 from "../assets/images/stich_lines_1.jpeg"
import stich_lines_2 from "../assets/images/stich_lines_2.jpeg"

export default function SectionGallery() {
  const bgRef = useRef(null)
  const touchStartX = useRef(null)
  const touchEndX = useRef(null)

  const [index, setIndex] = useState(0)

  const photos = [
    { src: medium_conrows, label: "Medium Conrows" },
    { src: twist_out, label: "Twist Out" },
    { src: stich_lines_2, label: "Stich Lines" },
    { src: buttery_braids, label: "Buttery Braids" },
    { src: half_conrows_half_crochet, label: "Crochet" },
    { src: stich_lines_1, label: "Stich Lines" }
  ]

  // Parallax background
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY * 0.25
      if (bgRef.current) {
        bgRef.current.style.transform = `translateY(${offset}px)`
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // AUTO-SLIDE every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(prev => (prev + 1) % photos.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [photos.length])

  // Manual Carousel navigation
  const next = () => setIndex((index + 1) % photos.length)
  const prev = () => setIndex((index - 1 + photos.length) % photos.length)

  // TOUCH HANDLERS
  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].screenX
  }

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].screenX
    handleSwipe()
  }

  const handleSwipe = () => {
    const distance = touchStartX.current - touchEndX.current

    if (Math.abs(distance) < 50) return // ignore tiny swipes

    if (distance > 50) next()      // swipe left → next
    if (distance < -50) prev()     // swipe right → prev
  }

  return (
    <section id="section2" className="section section-gallery">
      <div ref={bgRef} className="section-bg" />

      <div
          className="carousel-container"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
      >
        <button className="carousel-btn left" onClick={prev}>‹</button>

        <div className="carousel-slide">
          <img
            src={photos[index].src}
            alt={photos[index].label}
            className="carousel-image"
            loading="lazy"
          />

          <div className="vertical-label">
            {photos[index].label.split("").map((char, i) => (
              <span key={i}>{char}</span>
            ))}
          </div>
        </div>

        <button className="carousel-btn right" onClick={next}>›</button>
      </div>
    </section>
  )
}
