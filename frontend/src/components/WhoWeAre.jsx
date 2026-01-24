import { useEffect, useRef } from "react";

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

  // Common reveal classes
  const revealBase = "opacity-0 transition-all duration-800 ease-out will-change-[transform,opacity] [&.active]:opacity-100 [&.active]:translate-0";
  const revealLeft = `${revealBase} -translate-x-12 [&.active]:translate-x-0`;
  const revealRight = `${revealBase} translate-x-12 [&.active]:translate-x-0`;
  const revealUp = `${revealBase} translate-y-10 [&.active]:translate-y-0`;
  const revealFade = `${revealBase} scale-95 [&.active]:scale-100`;

  return (
    <section className="py-24 px-5 bg-white dark:bg-[#050510] text-[#14213d] dark:text-gray-100 relative z-10" id="who" ref={sectionRef}>
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-8">

        {/* LEFT COLUMN */}
        <div className={`text-center md:text-left reveal ${revealLeft}`}>
          <span className="text-xs tracking-[2px] text-[#fca311] font-semibold block mb-4">ABOUT US</span>

          <h2 className="text-4xl md:text-[42px] leading-[1.2] text-[#14213d] dark:text-white mb-8 font-bold">
            We Decode Market <br />
            Narratives Before <br />
            <span className="text-[#fca311]">Prices React.</span>
          </h2>

          <div className={`reveal ${revealFade} rounded-[18px] overflow-hidden w-[80%] mx-auto md:mx-0`}>
            <img src="/who_main_image.avif" alt="Market analysis" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className={`text-center md:text-left reveal ${revealRight}`}>
          <div className={`flex gap-4 justify-center md:justify-start mb-6 reveal ${revealFade}`}>
            <img src="/who_small_image2.jpg" alt="Market research" className="w-full rounded-[14px] object-cover" />
          </div>

          <p className={`text-[15px] leading-[1.7] text-gray-600 dark:text-gray-300 mb-8 text-justify reveal ${revealUp}`}>
            Silver Narrative Agent is an autonomous AI system designed to
            understand how conversations, sentiment, and emerging stories
            influence the silver market. By continuously scanning live data from
            Twitter and market news, we detect narrative shifts before they
            reflect in price movements.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className={`reveal ${revealUp} delay-150`}>
              <h3 className="text-[22px] text-[#14213d] dark:text-white mb-1 font-semibold">Real-Time</h3>
              <span className="text-[13px] text-gray-500 dark:text-gray-400">Narrative Detection</span>
            </div>
            <div className={`reveal ${revealUp} delay-300`}>
              <h3 className="text-[22px] text-[#14213d] dark:text-white mb-1 font-semibold">AI-Driven</h3>
              <span className="text-[13px] text-gray-500 dark:text-gray-400">Clustering Engine</span>
            </div>
            <div className={`reveal ${revealUp} delay-500`}>
              <h3 className="text-[22px] text-[#14213d] dark:text-white mb-1 font-semibold">Commodity</h3>
              <span className="text-[13px] text-gray-500 dark:text-gray-400">Focused Intelligence</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
