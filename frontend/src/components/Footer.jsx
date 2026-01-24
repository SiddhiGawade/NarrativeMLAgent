import { Github, Linkedin, Twitter } from 'lucide-react';
import snaLogo from '../assets/SNA_Logo-removebg-preview.png';

export default function Footer() {
  return (
    <footer className="bg-black text-[#e5e5e5] pt-20 relative z-10">
      <div className="max-w-6xl mx-auto px-5 pb-16 grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr] gap-10 text-center md:text-left">

        {/* Brand */}
        <div className="footer-brand">
          <img src={snaLogo} alt="SNA Logo" className="h-28 w-auto object-contain mb-4 mx-auto md:mx-0" />
          <h3 className="text-xl text-white mb-3 font-bold">Silver Narrative Agent</h3>
          <p className="text-sm leading-relaxed text-[#bfbfbf]">
            An autonomous AI system designed to detect emerging silver market
            narratives before price movements occur.
          </p>
        </div>

        {/* Navigation */}
        <div className="footer-links">
          <h4 className="text-sm mb-3.5 text-[#fca311] tracking-wider font-semibold">EXPLORE</h4>
          <ul className="space-y-2.5">
            <li><a href="#who" className="text-sm text-[#e5e5e5] hover:text-[#fca311] transition-colors">Who We Are</a></li>
            <li><a href="#team" className="text-sm text-[#e5e5e5] hover:text-[#fca311] transition-colors">Meet the Team</a></li>
            <li><a href="/dashboard" className="text-sm text-[#e5e5e5] hover:text-[#fca311] transition-colors">Current Analysis</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-contact">
          <h4 className="text-sm mb-3.5 text-[#fca311] tracking-wider font-semibold">CONNECT</h4>
          <p className="text-sm mb-3">Email: <span className="text-[#fca311]">contact@silvernarrative.ai</span></p>
          <div className="flex gap-4 justify-center md:justify-start">
            <a href="#" className="text-[#e5e5e5] hover:text-[#fca311] transition-colors"><Linkedin size={18} /></a>
            <a href="#" className="text-[#e5e5e5] hover:text-[#fca311] transition-colors"><Github size={18} /></a>
            <a href="#" className="text-[#e5e5e5] hover:text-[#fca311] transition-colors"><Twitter size={18} /></a>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="text-center p-5 border-t border-[#222] text-xs text-gray-400">
        © 2026 Silver Narrative Agent · Built with AI & market research
      </div>
    </footer>
  );
}
