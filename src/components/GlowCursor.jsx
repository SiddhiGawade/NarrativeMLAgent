import { useEffect, useRef } from "react";
import "../styles/glowCursor.css";

export default function CursorGlow() {
  const glowRef = useRef(null);

  useEffect(() => {
    const glow = glowRef.current;

    const moveGlow = (e) => {
      glow.style.left = `${e.clientX}px`;
      glow.style.top = `${e.clientY}px`;
      glow.style.opacity = "1";
    };

    const hideGlow = () => {
      glow.style.opacity = "0";
    };

    window.addEventListener("mousemove", moveGlow);
    window.addEventListener("mouseleave", hideGlow);

    return () => {
      window.removeEventListener("mousemove", moveGlow);
      window.removeEventListener("mouseleave", hideGlow);
    };
  }, []);

  return <div ref={glowRef} className="cursor-glow"></div>;
}
