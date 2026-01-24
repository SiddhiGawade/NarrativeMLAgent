import { useState } from "react";
import "../styles/LiveScanCard.css";

export default function LiveScanCard({ onStartAnalysis }) {
  const [loading, setLoading] = useState(false);

  const handleStart = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      onStartAnalysis();
    }, 2000);
  };

  return (
    <div className="upload-card">

      <h3>Live Narrative Scan</h3>

      {/* Sources */}
      <div className="source-status">
        <span className="dot green"></span> Twitter (Live)
      </div>

      <div className="source-status">
        <span className="dot green"></span> Market News
      </div>

      <div className="scope">
        <label>Time Window</label>
        <select>
          <option>Last 1 Hour</option>
          <option>Last 24 Hours</option>
        </select>
      </div>

      <button onClick={handleStart} disabled={loading}>
        {loading ? "Scanning Live Data..." : "Start Live Scan"}
      </button>

      {loading && <div className="loader"></div>}
    </div>
  );
}
