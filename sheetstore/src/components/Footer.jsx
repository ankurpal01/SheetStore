import { useState } from "react";
import { 
  FileSpreadsheet, 
  Twitter, 
  Linkedin, 
  Instagram, 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  HelpCircle, 
  CheckCircle2 
} from "lucide-react";

const Footer = ({ onNavigate }) => {
  const [email, setEmail] = useState("");
  const [showFakeToast, setShowFakeToast] = useState(false);

  const handleFakeSubmit = (e) => {
    e.preventDefault();
    if (!email) return;

    // Fake Success Notification dikhao
    setShowFakeToast(true);
    setEmail(""); // Input clear kar do

    // 3 second baad notification gayab kar do
    setTimeout(() => {
      setShowFakeToast(false);
    }, 3000);
  };

  return (
    <footer className="bg-slate-950 text-slate-300 relative overflow-hidden">
      
      {/* Decorative Top Border Gradient */}
      <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500"></div>

      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-900/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10 relative z-10">

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          
          {/* Brand Section */}
          <div className="md:col-span-4">
            <button 
              onClick={() => onNavigate("home")} 
              className="flex items-center gap-3 mb-6 group outline-none"
            >
              <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg group-hover:shadow-indigo-500/30 transition-shadow">
                <FileSpreadsheet className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-extrabold text-white tracking-tight">
                Sheet<span className="text-indigo-400">Store</span>
              </span>
            </button>

            <p className="text-slate-400 text-sm leading-relaxed max-w-sm mb-8">
              Premium, ready-to-use Excel and Google Sheets templates designed to save you hours of complex setup and data modeling.
            </p>

            {/* Newsletter Mini (Real UI + Fake Logic) */}
            <div className="space-y-3 relative">
              <p className="text-sm font-semibold text-white flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-400" /> Get free templates monthly
              </p>
              
              <form onSubmit={handleFakeSubmit} className="flex gap-2 max-w-xs">
                <div className="relative flex-1">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address" 
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2.5 px-4 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white placeholder-slate-500 transition-colors"
                    required
                  />
                </div>
                <button 
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2.5 rounded-lg transition-all active:scale-95 flex items-center justify-center"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* FAKE SUCCESS NOTIFICATION - Bounce Animation */}
              {showFakeToast && (
                <div className="absolute -top-12 left-0 right-0 bg-emerald-500 text-white text-[11px] font-bold py-2 px-3 rounded-lg flex items-center gap-2 shadow-lg animate-bounce transition-all z-50">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Awesome! You're on the list. 🚀</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 md:col-start-6">
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Explore</h4>
            <ul className="space-y-4">
              <li><button onClick={() => onNavigate("home")} className="text-slate-400 hover:text-indigo-400 transition-all text-sm">Home</button></li>
              <li><button onClick={() => onNavigate("templates")} className="text-slate-400 hover:text-indigo-400 transition-all text-sm">All Templates</button></li>
              <li><button onClick={() => onNavigate("categories")} className="text-slate-400 hover:text-indigo-400 transition-all text-sm">Categories</button></li>
            </ul>
          </div>

          {/* Policies */}
          <div className="md:col-span-2">
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Policies</h4>
            <ul className="space-y-4">
              <li><button onClick={() => onNavigate("privacy")} className="text-slate-400 hover:text-white transition-all text-sm">Privacy Policy</button></li>
              <li><button onClick={() => onNavigate("terms")} className="text-slate-400 hover:text-white transition-all text-sm">Terms of Service</button></li>
              <li><button onClick={() => onNavigate("refund")} className="text-slate-400 hover:text-white transition-all text-sm">Refund Policy</button></li>
              {/* 👇 YAHAN NAYA LINK ADD KIYA HAI 👇 */}
              <li><button onClick={() => onNavigate("shipping")} className="text-slate-400 hover:text-white transition-all text-sm">Shipping & Delivery</button></li>
            </ul>
          </div>

          {/* Support */}
          <div className="md:col-span-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Support</h4>
            <div className="space-y-4">
              <button 
                onClick={() => onNavigate("contact")} 
                className="w-full bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center gap-3 hover:border-indigo-500/50 transition-all group"
              >
                <div className="p-2 bg-indigo-500/10 rounded-lg group-hover:bg-indigo-500/20 transition-colors">
                  <HelpCircle className="w-5 h-5 text-indigo-400" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-slate-500 font-medium">Have questions?</p>
                  <p className="text-sm text-white font-bold">Contact Support</p>
                </div>
              </button>
              
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                Secure Payments by Razorpay
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-slate-600 font-medium">
            © {new Date().getFullYear()} <span className="text-slate-400">SheetStore</span>. Built for precision.
          </p>

          <div className="flex space-x-4">
            {[
              { icon: Twitter, href: "#", color: "hover:text-sky-400" },
              { icon: Linkedin, href: "#", color: "hover:text-blue-500" },
              { icon: Instagram, href: "https://www.instagram.com/sheetstore.in/", color: "hover:text-pink-500" }
            ].map((social, idx) => (
              <a 
                key={idx} 
                href={social.href} 
                target="_blank"
                rel="noopener noreferrer"
                className={`w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 ${social.color} hover:border-slate-700 transition-all group`}
              >
                <social.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;