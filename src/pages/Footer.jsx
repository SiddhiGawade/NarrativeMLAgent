import "../styles/Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Brand */}
        <div className="footer-brand">
          <h3>Silver Narrative Agent</h3>
          <p>
            An autonomous AI system designed to detect emerging silver market
            narratives before price movements occur.
          </p>
        </div>

        {/* Navigation */}
        <div className="footer-links">
          <h4>Explore</h4>
          <ul>
            <li><a href="#who">Who We Are</a></li>
            <li><a href="#what">What We Do</a></li>
            <li><a href="#how">How We Do It</a></li>
            <li><a href="#team">Meet the Team</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-contact">
          <h4>Connect</h4>
          <p>Email: <span>contact@silvernarrative.ai</span></p>
          <div className="footer-socials">
            <a href="#">LinkedIn</a>
            <a href="#">GitHub</a>
            <a href="#">Twitter</a>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        © 2026 Silver Narrative Agent · Built with AI & market research
      </div>
    </footer>
  );
}
