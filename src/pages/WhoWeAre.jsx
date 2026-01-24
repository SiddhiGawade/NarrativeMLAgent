import { useEffect, useRef } from "react";
import "../styles/WhoWeAre.css";

export default function WhoWeAre() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const elements = sectionRef.current.querySelectorAll(".reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      { threshold: 0.2 }
    );

    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="who-section" id="who" ref={sectionRef}>
      <div className="who-grid">

        {/* LEFT COLUMN */}
        <div className="who-left reveal reveal-left">
          <span className="who-tag">ABOUT US</span>

          <h2>
            We Decode Market <br />
            Narratives Before <br />
            <span>Prices React.</span>
          </h2>

          <div className="who-main-image reveal reveal-fade">
            <img src="/who_main_image.avif" alt="Market analysis" />
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="who-right reveal reveal-right">
          <div className="who-top-images reveal reveal-fade">
            <img src="/who_small_image2.jpg" alt="Market research" />
          </div>

          <p className="who-description reveal reveal-up">
            Silver Narrative Agent is an autonomous AI system designed to
            understand how conversations, sentiment, and emerging stories
            influence the silver market. By continuously scanning live data from
            Twitter and market news, we detect narrative shifts before they
            reflect in price movements.
          </p>

          <div className="who-stats">
            <div className="reveal reveal-up delay-1">
              <h3>Real-Time</h3>
              <span>Narrative Detection</span>
            </div>
            <div className="reveal reveal-up delay-2">
              <h3>AI-Driven</h3>
              <span>Clustering Engine</span>
            </div>
            <div className="reveal reveal-up delay-3">
              <h3>Commodity</h3>
              <span>Focused Intelligence</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
