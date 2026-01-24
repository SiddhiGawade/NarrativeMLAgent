import { useEffect, useRef } from "react";
import "../styles/MeetTheTeam.css";

const team = [
  {
    name: "Siddhi Gawade",
    role: "AI & System Design",
    desc: "Designed narrative detection pipeline and system architecture.",
    image: "/siddhi.jpeg"
  },
  {
    name: "Sejal Dhanve",
    role: "Frontend & UX",
    desc: "Built interactive UI and visual storytelling experience.",
    image: "/sejal.jpeg"
  },
  {
    name: "Kedar Sawant",
    role: "Data & Research",
    desc: "Market research, narrative validation, and evaluation.",
    image: "/kedar.jpeg"
  }
];

export default function MeetTheTeam() {
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
    <section className="team-section" id="team" ref={sectionRef}>
      <div className="team-container">

        <span className="team-tag reveal reveal-up">OUR PEOPLE</span>

        <h2 className="reveal reveal-up">
          Meet the Team
        </h2>

        <p className="team-subtitle reveal reveal-up delay-1">
          A small, focused team combining AI, market research, and design to
          decode how narratives move commodity markets.
        </p>

        <div className="team-grid">
          {team.map((member, index) => (
            <div
              className={`team-card reveal reveal-up delay-${index + 1}`}
              key={index}
            >
              <div className="team-image">
                <img src={member.image} alt={member.name} />
              </div>

              <h3>{member.name}</h3>
              <span className="team-role">{member.role}</span>
              <p>{member.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
