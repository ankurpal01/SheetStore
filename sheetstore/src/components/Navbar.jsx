import { Menu, X, Sparkles, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

export default function Navbar({ onNavigate, currentPath }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", path: "home" },
    { label: "Templates", path: "templates" },
    { label: "Categories", path: "categories" },
    { label: "Free Tools", path: "tools", badge: "FREE" },
    { label: "About", path: "about" },
    { label: "Contact", path: "contact" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600;700&display=swap');

        .navbar-root {
          position: sticky;
          top: 0;
          z-index: 50;
          width: 100%;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .navbar-root.scrolled .navbar-inner {
          background: rgba(8, 8, 20, 0.92);
          backdrop-filter: blur(24px);
          box-shadow: 0 1px 0 rgba(255,255,255,0.06), 0 20px 60px rgba(0,0,0,0.4);
        }

        .navbar-inner {
          background: rgba(8, 8, 20, 0.85);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .navbar-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 72px;
        }

        .logo-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          background: none;
          border: none;
          cursor: pointer;
          outline: none;
          text-decoration: none;
        }

        .logo-mark {
          position: relative;
          width: 44px;
          height: 44px;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.12);
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.08), inset 0 1px 0 rgba(255,255,255,0.1);
          transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
          background: #0f0f1e;
        }

        .logo-mark::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.15));
          opacity: 0;
          transition: opacity 0.3s;
        }

        .logo-btn:hover .logo-mark {
          transform: rotate(-4deg) scale(1.08);
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.25), 0 8px 24px rgba(99,102,241,0.3);
        }

        .logo-btn:hover .logo-mark::before { opacity: 1; }

        .logo-mark img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .logo-text {
          font-family: 'Playfair Display', serif;
          font-size: 1.5rem;
          font-weight: 900;
          color: #fff;
          letter-spacing: -0.02em;
          line-height: 1;
          transition: color 0.3s;
        }

        .logo-text span {
          background: linear-gradient(135deg, #818cf8, #c084fc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .logo-btn:hover .logo-text { color: #e0e7ff; }

        .desktop-nav {
          display: none;
          align-items: center;
          gap: 4px;
        }

        @media (min-width: 768px) {
          .desktop-nav { display: flex; }
        }

        .nav-link {
          position: relative;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem;
          font-weight: 600;
          color: rgba(255,255,255,0.5);
          border-radius: 8px;
          transition: all 0.25s ease;
          letter-spacing: 0.01em;
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 4px;
          left: 50%;
          transform: translateX(-50%) scaleX(0);
          width: calc(100% - 28px);
          height: 1.5px;
          background: linear-gradient(90deg, #818cf8, #c084fc);
          border-radius: 2px;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .nav-link:hover {
          color: #fff;
          background: rgba(255,255,255,0.06);
        }

        .nav-link:hover::after,
        .nav-link.active::after {
          transform: translateX(-50%) scaleX(1);
        }

        .nav-link.active {
          color: #a5b4fc;
          background: rgba(99, 102, 241, 0.12);
        }

        .nav-badge {
          display: inline-flex;
          align-items: center;
          margin-left: 6px;
          font-size: 0.6rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          padding: 2px 6px;
          border-radius: 20px;
          background: linear-gradient(135deg, #10b981, #059669);
          color: #fff;
          vertical-align: middle;
          line-height: 1;
          box-shadow: 0 2px 8px rgba(16,185,129,0.4);
        }

        .nav-cta {
          display: none;
          align-items: center;
          gap: 8px;
          margin-left: 16px;
          padding: 10px 20px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: #fff;
          border: none;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem;
          font-weight: 700;
          cursor: pointer;
          letter-spacing: 0.01em;
          position: relative;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 4px 20px rgba(99, 102, 241, 0.35);
        }

        @media (min-width: 1024px) {
          .nav-cta { display: flex; }
        }

        .nav-cta::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #818cf8, #a78bfa);
          opacity: 0;
          transition: opacity 0.3s;
        }

        .nav-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(99, 102, 241, 0.5);
        }

        .nav-cta:hover::before { opacity: 1; }
        .nav-cta > * { position: relative; z-index: 1; }

        .nav-cta svg {
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .nav-cta:hover svg { transform: translateX(3px); }

        .mobile-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.7);
          cursor: pointer;
          transition: all 0.25s ease;
        }

        @media (min-width: 768px) {
          .mobile-toggle { display: none; }
        }

        .mobile-toggle:hover {
          background: rgba(99, 102, 241, 0.15);
          border-color: rgba(99, 102, 241, 0.3);
          color: #a5b4fc;
        }

        .mobile-menu {
          display: none;
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: rgba(8, 8, 20, 0.98);
          backdrop-filter: blur(24px);
          border-bottom: 1px solid rgba(255,255,255,0.07);
          padding: 12px 16px 20px;
          box-shadow: 0 24px 60px rgba(0,0,0,0.5);
          animation: slideDown 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .mobile-menu.open { display: block; }

        @media (min-width: 768px) {
          .mobile-menu { display: none !important; }
        }

        .mobile-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          text-align: left;
          padding: 13px 16px;
          border-radius: 10px;
          border: none;
          background: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9375rem;
          font-weight: 600;
          color: rgba(255,255,255,0.55);
          cursor: pointer;
          transition: all 0.2s ease;
          margin-bottom: 2px;
        }

        .mobile-link:hover, .mobile-link.active {
          background: rgba(99, 102, 241, 0.12);
          color: #a5b4fc;
        }

        .mobile-link.active {
          border-left: 2px solid #6366f1;
          padding-left: 14px;
        }

        .mobile-divider {
          height: 1px;
          background: rgba(255,255,255,0.06);
          margin: 12px 0;
        }

        .mobile-cta {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: #fff;
          border: none;
          border-radius: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9375rem;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4);
          transition: all 0.25s ease;
        }

        .mobile-cta:active { transform: scale(0.98); }
      `}</style>

      <div className={`navbar-root ${scrolled ? "scrolled" : ""}`}>
        <div className="navbar-inner">
          <div className="navbar-container">

            <button
              className="logo-btn"
              onClick={() => { onNavigate("home"); setIsMobileMenuOpen(false); }}
            >
              <div className="logo-mark">
                <img src="/logo.png" alt="SheetStore" />
              </div>
              <span className="logo-text">
                Sheet<span>Store</span>
              </span>
            </button>

            <nav className="desktop-nav">
              {navLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => onNavigate(link.path)}
                  className={`nav-link ${currentPath === link.path ? "active" : ""}`}
                >
                  {link.label}
                  {link.badge && <span className="nav-badge">{link.badge}</span>}
                </button>
              ))}

              <button className="nav-cta" onClick={() => onNavigate("templates")}>
                <Sparkles size={15} />
                Browse Templates
                <ArrowRight size={14} />
              </button>
            </nav>

            <button
              className="mobile-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        <div className={`mobile-menu ${isMobileMenuOpen ? "open" : ""}`}>
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => { onNavigate(link.path); setIsMobileMenuOpen(false); }}
              className={`mobile-link ${currentPath === link.path ? "active" : ""}`}
            >
              {link.label}
              {link.badge && <span className="nav-badge">{link.badge}</span>}
            </button>
          ))}

          <div className="mobile-divider" />

          <button
            className="mobile-cta"
            onClick={() => { onNavigate("templates"); setIsMobileMenuOpen(false); }}
          >
            <Sparkles size={16} />
            Browse Templates
          </button>
        </div>
      </div>
    </>
  );
}