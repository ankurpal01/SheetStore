import { Menu, X, Sparkles } from "lucide-react";
import { useState } from "react";

export default function Navbar({ onNavigate, currentPath }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Home", path: "home" },
    { label: "Templates", path: "templates" },
    { label: "Categories", path: "categories" },
    { label: "Free Tools", path: "tools" },
    { label: "About", path: "about" },
    { label: "Contact", path: "contact" },
  ];

  return (
    // ✨ PREMIUM GLASSMORPHISM HEADER
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-2xl supports-[backdrop-filter]:bg-white/60 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          
          {/* ================= 1. CUSTOM PNG LOGO ================= */}
          <button 
            onClick={() => {
              onNavigate("home");
              setIsMobileMenuOpen(false);
            }} 
            className="flex items-center gap-3 group outline-none"
          >
            {/* Yahan aapki PNG image aayegi (public folder se) */}
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm border border-slate-100 bg-white flex items-center justify-center group-hover:shadow-md group-hover:scale-105 transition-all duration-300">
              <img 
                src="/logo.png" // Apni image ka naam yahan check kar lena (jaise logo.png)
                alt="SheetStore Logo" 
                className="w-7 h-7 object-contain"
              />
            </div>
            <span className="text-2xl font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors duration-300">
              SheetStore
            </span>
          </button>
          
          {/* ================= 2. DESKTOP NAVIGATION (MODERN PILLS) ================= */}
          <nav className="hidden md:flex items-center gap-2 lg:gap-4">
            <ul className="flex items-center gap-1 lg:gap-2">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <button
                    onClick={() => onNavigate(link.path)}
                    className={`relative px-4 py-2 rounded-full text-sm font-bold transition-all duration-300
                      ${currentPath === link.path 
                        ? "bg-indigo-50 text-indigo-700 shadow-sm" 
                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                      }
                    `}
                  >
                    {link.label}
                    
                    {/* Free tools highlight badge */}
                    {link.path === "tools" && (
                       <span className="absolute -top-1 -right-2 text-[9px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-black uppercase tracking-widest shadow-sm">
                         Free
                       </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>

            {/* CTA Button (Gradient Hover) */}
            <div className="flex items-center ml-4 pl-4 border-l border-slate-200">
              <button
                onClick={() => onNavigate("templates")}
                className="hidden lg:flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-600 shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
              >
                <Sparkles className="w-4 h-4 text-indigo-300" />
                Browse Templates
              </button>
            </div>
          </nav>

          {/* ================= 3. MOBILE MENU BUTTON (WITH ANIMATION) ================= */}
          <button
            className="md:hidden p-2.5 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors active:scale-95"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {/* Jab menu khulega toh X dikhega, warna Hamburger menu */}
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* ================= 4. MOBILE MENU DROPDOWN (SMOOTH & CLEAN) ================= */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white/95 backdrop-blur-2xl absolute w-full shadow-2xl rounded-b-3xl pb-4 animate-in slide-in-from-top-2 duration-200">
          <div className="px-4 pt-4 pb-2 space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => {
                  onNavigate(link.path);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-3.5 rounded-xl font-bold transition-all duration-200 flex items-center justify-between
                  ${currentPath === link.path 
                    ? "bg-indigo-50 text-indigo-700 shadow-sm" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }
                `}
              >
                {link.label}
                {link.path === "tools" && (
                  <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full font-black uppercase tracking-widest">
                    Free
                  </span>
                )}
              </button>
            ))}
            
            <div className="pt-4 mt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  onNavigate("templates");
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-indigo-600 text-white px-4 py-4 rounded-xl font-black shadow-md transition-colors"
              >
                <Sparkles className="w-5 h-5 text-indigo-300" /> Browse Templates
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}