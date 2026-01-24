import { useNavigate } from "react-router-dom";
import WhoWeAre from "../components/WhoWeAre";
import MeetTheTeam from "../components/MeetTheTeam";
import Footer from "../components/Footer";
import { MoveRight, Activity } from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();

  const onStartAnalysis = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#050510] relative text-[#14213d] dark:text-gray-100 overflow-x-hidden">
      
      {/* Video Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none after:content-[''] after:absolute after:inset-0 dark:after:bg-black/40 after:z-10">
        <video autoPlay loop muted playsInline className="w-full h-full object-cover">
          <source src="/bg_video.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Content Layer */}
      <div className="relative z-10">

        {/* Hero Section */}
        <div className="min-h-screen flex flex-col items-center justify-center px-5 relative">
          
          <div className="dark:bg-black/20 dark:backdrop-blur-md p-8 md:p-12 rounded-3xl dark:border dark:border-white/20 dark:shadow-2xl text-center max-w-2xl transition-transform duration-500">
            <div className="flex items-center justify-center gap-2 mb-6">
               <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#fca311]/20 border border-[#fca311]/30 text-[#fca311] text-xs font-semibold tracking-wider animate-pulse">
                 <span className="w-2 h-2 rounded-full bg-[#fca311] animate-ping"></span>
                 MARKET LIVE
               </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-xl tracking-tight">
              Decode The <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fca311] to-[#eb5e28]">Narrative</span>
            </h1>

            <p className="text-lg text-gray-200 mb-10 max-w-lg mx-auto leading-relaxed font-light">
              Detect emerging silver market stories before they impact price action. 
              Powered by autonomous AI agents.
            </p>

            <button 
              onClick={onStartAnalysis}
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-br from-[#fca311] to-[#eb5e28] text-black rounded-full font-bold text-lg shadow-[0_0_25px_rgba(252,163,17,0.45)] hover:shadow-[0_0_40px_rgba(252,163,17,0.6)] hover:scale-105 active:scale-95 transition-all duration-300"
            >
              Start Live Scan
              <MoveRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>

        <WhoWeAre />
        <MeetTheTeam />
        <Footer />
      </div>
    </div>
  );
}
