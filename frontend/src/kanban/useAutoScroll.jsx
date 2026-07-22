import { useEffect } from "react";

export default function useAutoScroll(isDragging) {
  useEffect(() => {
    if (!isDragging) return;

    const SCROLL_SPEED = 20;      // px per frame
    const EDGE_THRESHOLD = 120;   // px from edges

    function onMove(e) {
      const x = e.clientX;
      const y = e.clientY;

      const width = window.innerWidth;
      const height = window.innerHeight;

      // ⭐ Vertical auto-scroll
      if (y < EDGE_THRESHOLD) {
        window.scrollBy({ top: -SCROLL_SPEED, behavior: "smooth" });
      }
      if (y > height - EDGE_THRESHOLD) {
        window.scrollBy({ top: SCROLL_SPEED, behavior: "smooth" });
      }

      // ⭐ Horizontal auto-scroll
      if (x < EDGE_THRESHOLD) {
        window.scrollBy({ left: -SCROLL_SPEED, behavior: "smooth" });
      }
      if (x > width - EDGE_THRESHOLD) {
        window.scrollBy({ left: SCROLL_SPEED, behavior: "smooth" });
      }
    }

    window.addEventListener("mousemove", onMove);

    return () => {
      window.removeEventListener("mousemove", onMove);
    };
  }, [isDragging]);
}
