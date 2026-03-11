import { ShoppingCart, Menu, FileSpreadsheet, Sparkles } from "lucide-react";
import { useState } from "react";

export default function Navbar({ onNavigate, currentPath }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // NAYA: 'Free Tools' ko is list me add kar diya hai
  const navLinks = [
    { label: "Home", path: "home" },
    { label: "Templates", path: "templates" },
    { label: "Categories", path: "categories" },
    { label: "Free Tools", path: "tools" }, // <-- Ye raha naya button
    { label: "About", path: "about" },
    { label: "Contact", path: "contact" },
  ];

  return (
    // GLASSMORPHISM NAVBAR HEADER
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          
          {/* ================= LOGO ================= */}
          <button 
            onClick={() => onNavigate("home")} 
            className="flex items-center gap-2.5 group outline-none"
          >
            <div className="p-2 bg-indigo-600 rounded-xl shadow-sm group-hover:scale-105 transition-transform group-hover:bg-indigo-700">
              <FileSpreadsheet className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight group-hover:text-indigo-700 transition-colors">
              SheetStore
            </span>
          </button>
          
          {/* ================= DESKTOP NAVIGATION ================= */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            <ul className="flex gap-6 lg:gap-8 text-sm font-bold text-slate-600">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <button
                    onClick={() => onNavigate(link.path)}
                    className={`relative py-2 transition-colors hover:text-indigo-600
                      ${currentPath === link.path ? "text-indigo-600" : ""}
                    `}
                  >
                    {/* Free tools ko thoda highlight karne ke liye ek chota sa tag */}
                    {link.path === "tools" && (
                       <span className="absolute -top-2 -right-3 text-[9px] bg-emerald-100 text-emerald-600 px-1.5 py-0.5 rounded-full font-extrabold uppercase tracking-wide">
                         Free
                       </span>
                    )}
                    {link.label}
                    {/* Active Link underline dot */}
                    {currentPath === link.path && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
                    )}
                  </button>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-4">
              {/* CTA Button in Navbar */}
              <button
                onClick={() => onNavigate("templates")}
                className="hidden lg:flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-indigo-600 hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <Sparkles className="w-4 h-4 text-indigo-300" />
                Browse Templates
              </button>

              {/* Cart Icon (Future Use) */}
              <button className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all relative">
                <ShoppingCart className="w-6 h-6" />
                {/* Cart badge example */}
                {/* <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">0</span> */}
              </button>
            </div>
          </nav>

          {/* ================= MOBILE MENU BUTTON ================= */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* ================= MOBILE MENU DROPDOWN ================= */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white/95 backdrop-blur-xl p-4 absolute w-full shadow-xl">
          <ul className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <li key={link.path}>
                <button
                  onClick={() => {
                    onNavigate(link.path);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg font-bold transition-colors flex items-center justify-between
                    ${currentPath === link.path ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50"}
                  `}
                >
                  {link.label}
                  {link.path === "tools" && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full font-extrabold uppercase tracking-wide">
                      Free
                    </span>
                  )}
                </button>
              </li>
            ))}
             <li>
                <button
                  onClick={() => {
                    onNavigate("templates");
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-3 rounded-lg font-bold mt-2 hover:bg-indigo-700"
                >
                  <Sparkles className="w-4 h-4" /> Browse Templates
                </button>
             </li>
          </ul>
        </div>
      )}
    </header>
  );
}