import { useEffect, useRef } from "react";
import { Linkedin, Github } from "lucide-react";

const team = [
  {
    name: "Siddhi Gawade",
    role: "AI & System Design",
    desc: "Designed narrative detection pipeline and system architecture.",
    image: "/siddhi.jpeg",
    linkedin: "https://www.linkedin.com/in/siddhi-gawade/",
    github: "https://github.com/SiddhiGawade"
  },
  {
    name: "Sejal Dhanve",
    role: "Frontend & UX",
    desc: "Built interactive UI and visual storytelling experience.",
    image: "/sejal.jpeg",
    linkedin: "https://www.linkedin.com/in/sejal-dhanve-b01882310/",
    github: "https://github.com/sejaldhanve"
  },
  {
    name: "Kedar Sawant",
    role: "Data & Research",
    desc: "Market research, narrative validation, and evaluation.",
    image: "/kedar.jpeg",
    linkedin: "https://www.linkedin.com/in/kedar-sawant-891968340/",
    github: "https://github.com/sawantkedar0803-cloud"
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

  const revealClass = "opacity-0 translate-y-10 transition-all duration-800 ease-out will-change-[transform,opacity] [&.active]:opacity-100 [&.active]:translate-y-0";

  return (
    <section className="py-20 px-5 bg-white dark:bg-[#bde0fe] relative z-10" id="team" ref={sectionRef}>
      <div className="max-w-6xl mx-auto text-center">


        <h2 className={`text-[42px] mb-4 text-[#03045e] dark:text-#03045e font-bold reveal ${revealClass}`}>
          Meet the Team
        </h2>

        <p className={`max-w-2xl mx-auto mb-16 text-black text-base reveal ${revealClass} delay-150`}>
          A small, focused team combining AI, market research, and design to
          decode how narratives move commodity markets.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <div
              className={`bg-white dark:bg-[#111] rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.08)] dark:shadow-none hover:-translate-y-2 hover:shadow-[0_30px_70px_rgba(0,0,0,0.12)] transition-all duration-300 reveal ${revealClass}`}
              style={{ transitionDelay: `${(index + 1) * 150}ms` }}
              key={index}
            >
              <div className="w-[200px] h-[200px] mx-auto mb-5 rounded-full overflow-hidden border-4 border-transparent hover:border-[#fca311] transition-colors duration-300">
                <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
              </div>

              <h3 className="text-lg text-[#14213d] dark:text-white font-semibold mb-1.5">{member.name}</h3>
              <span className="block text-sm text-[#fca311] font-semibold mb-3.5">{member.role}</span>
              <p className="text-sm text-[#6b7280] dark:text-gray-400 leading-relaxed mb-6">{member.desc}</p>

              <div className="flex justify-center gap-4">
                  <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 rounded-full border border-[#14213d] dark:border-white text-[#14213d] dark:text-white hover:bg-[#14213d] hover:text-white dark:hover:bg-white dark:hover:text-black transition-all">
                      <Linkedin size={18} />
                  </a>
                  <a href={member.github} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-10 h-10 rounded-full border border-[#14213d] dark:border-white text-[#14213d] dark:text-white hover:bg-[#14213d] hover:text-white dark:hover:bg-white dark:hover:text-black transition-all">
                      <Github size={18} />
                  </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
