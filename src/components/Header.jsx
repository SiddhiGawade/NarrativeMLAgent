import "../styles/header.css";

export default function Header() {
  return (
    <header className="header">
      <div className="header-container">
        
        {/* Logo / Name */}
        <div className="logo-wrapper">
          <img src="/sna_logo.png" alt="Silver Narrative Agent logo" />
        </div>

        {/* Navigation */}
        <nav className="nav">
          <a href="#who">Who We Are</a>
          <a href="#what">Our Team</a>
          {/* <a href="#how">How We Do It</a>
          <a href="#team">Meet the Team</a> */}
        </nav>

      </div>
    </header>
  );
}
