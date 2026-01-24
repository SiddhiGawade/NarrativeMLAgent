import "../styles/home.css";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import WhoWeAre from "../pages/WhoWeAre";
import MeetTheTeam from "./MeetTheTeam";
import Footer from "./Footer";

export default function Home() {
  const navigate = useNavigate();

  const onStartAnalysis = () => {
    navigate("/dashboard");
  };

  return (
    <div className="home-container">
      {/* Particle background image */}
      <div className="video-background">
        <video autoPlay loop muted playsInline>
          <source src="/bg_video.mp4" type="video/mp4" />
        </video>
      </div>

      {/* All actual content */}
      <div className="content-layer">
        <div className="sticky-header">
          <Header />
        </div>

        {/* Navbar */}
        <nav className="navbar">
          <span className="live-indicator">● Market Live</span>
        </nav>

        {/* Hero */}
        <div className="hero">
          <div className="hero-content">
            <div className="scan-panel">
              <button className="start-btn" onClick={onStartAnalysis}>
                Start Live Scan
              </button>
            </div>
          </div>
        </div>

        <WhoWeAre />
        <MeetTheTeam />
        <Footer />
      </div>
    </div>
  );
}
