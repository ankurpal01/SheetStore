import { useState, useEffect } from "react";
import {
  ArrowRight,
  Clock,
  LayoutDashboard,
  CheckCircle2,
  Loader2,
  Sparkles,
  ShieldCheck,
  Zap,
  FileSpreadsheet,
  MousePointer2,
  Star,
  TrendingUp,
  Award
} from "lucide-react";

import TemplateCard from "../components/TemplateCard";
import homeHero from "../assets/Home_Page.png";

const HomePage = ({ onNavigate, onBuy }) => {
  const [featuredTemplates, setFeaturedTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLatestTemplates = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/templates`);
        
        if (!res.ok) throw new Error('Failed to fetch');
        
        const data = await res.json();
        const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setFeaturedTemplates(sorted.slice(0, 3));
      } catch (error) {
        console.error("Error:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestTemplates();
  }, []);

  return (
    <div className="flex flex-col min-h-screen font-sans selection:bg-indigo-200 overflow-x-hidden">

      {/* ================= HERO SECTION ================= */}
      <section className="relative pt-32 pb-48 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">

        {/* Animated Grid Background */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{
          backgroundImage: `linear-gradient(to right, #4f46e5 1px, transparent 1px), linear-gradient(to bottom, #4f46e5 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}></div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white pointer-events-none"></div>

        {/* Floating Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-indigo-400/30 rounded-full mix-blend-multiply filter blur-[100px] animate-blob"></div>
          <div className="absolute top-40 right-1/4 w-[400px] h-[400px] bg-emerald-400/30 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-20 left-1/2 w-[450px] h-[450px] bg-violet-400/30 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-20">
          
          {/* Premium Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500/10 to-emerald-500/10 backdrop-blur-sm border border-indigo-200/50 text-indigo-700 font-bold text-xs uppercase tracking-widest mb-8 shadow-lg hover:scale-105 transition-transform cursor-default">
            <Award className="w-4 h-4 text-amber-500" /> 
            <span className="bg-gradient-to-r from-indigo-600 to-emerald-600 bg-clip-text text-transparent">
              Trusted by 500+ Professionals
            </span>
          </div>

          {/* Main Heading with Gradient Animation */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 mb-8 tracking-tight leading-[1.05] animate-fade-in">
            Master Your Data with <br className="hidden md:block" />
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500 animate-gradient bg-[length:200%_auto]">
                Premium Spreadsheet Systems
              </span>
              <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-emerald-500 rounded-full blur-sm"></span>
            </span>
          </h1>

          <p className="text-lg md:text-2xl text-slate-600 mb-14 max-w-3xl mx-auto leading-relaxed font-medium">
            Download professionally designed dashboards, trackers, and business templates 
            ready for <span className="text-slate-900 font-bold relative inline-block px-1">
              Microsoft Excel
              <span className="absolute bottom-0 left-0 w-full h-2 bg-indigo-200/50 -z-10 rounded"></span>
            </span> and
            <span className="text-emerald-600 font-bold relative inline-block px-1 ml-1">
              Google Sheets
              <span className="absolute bottom-0 left-0 w-full h-2 bg-emerald-200/50 -z-10 rounded"></span>
            </span> that work instantly.
          </p>

          {/* CTA Buttons with Enhanced Effects */}
          <div className="flex flex-col sm:flex-row justify-center gap-5 mb-16">
            <button
              onClick={() => onNavigate("templates")}
              className="group relative px-10 py-5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-lg rounded-2xl shadow-[0_20px_50px_-12px_rgba(79,70,229,0.5)] hover:shadow-[0_25px_60px_-12px_rgba(79,70,229,0.7)] transition-all duration-300 hover:-translate-y-1 hover:scale-105 flex items-center justify-center gap-3 overflow-hidden"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
              <FileSpreadsheet className="w-6 h-6 relative z-10" />
              <span className="relative z-10">Explore Templates</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform relative z-10" />
            </button>

            <button
              onClick={() => onNavigate("categories")}
              className="group px-10 py-5 bg-white text-slate-800 font-bold text-lg rounded-2xl border-2 border-slate-200 shadow-lg hover:shadow-2xl hover:bg-slate-50 hover:border-indigo-300 hover:text-indigo-700 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3"
            >
              <LayoutDashboard className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              View Categories
            </button>
          </div>

          {/* Trust Badges - Enhanced */}
          <div className="mt-20 pt-10 border-t border-slate-200/60 flex items-center justify-center gap-x-12 gap-y-6 flex-wrap">
            {[
              { icon: Zap, text: "Instant Access", color: "amber" },
              { icon: ShieldCheck, text: "Secure Payment", color: "emerald" },
              { icon: MousePointer2, text: "Easy to Use", color: "indigo" },
              { icon: CheckCircle2, text: "Lifetime Access", color: "blue" }
            ].map((item, i) => (
              <div key={i} className="group flex items-center gap-3 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm hover:shadow-md hover:scale-105 transition-all cursor-default">
                <div className={`w-8 h-8 rounded-full bg-${item.color}-50 flex items-center justify-center`}>
                  <item.icon className={`w-4 h-4 text-${item.color}-600`} />
                </div>
                <span className="text-sm font-bold text-slate-700 uppercase tracking-tight">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FEATURED TEMPLATES ================= */}
      <section className="py-32 bg-gradient-to-b from-white via-slate-50/50 to-white relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-16 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/10 to-violet-500/10 border border-indigo-200/50 text-indigo-700 font-bold text-xs uppercase tracking-wider mb-4">
                <Sparkles className="w-4 h-4" /> Best Sellers
              </div>
              <h2 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight relative inline-block">
                Featured Templates
                <span className="absolute -bottom-3 left-0 w-1/3 h-1.5 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"></span>
              </h2>
            </div>

            <button
              onClick={() => onNavigate("templates")}
              className="group flex items-center gap-3 text-indigo-600 font-bold hover:text-indigo-700 transition-all bg-white border-2 border-slate-200 shadow-lg px-8 py-4 rounded-2xl hover:shadow-xl hover:border-indigo-300 hover:-translate-y-1"
            >
              View All Collection 
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>

          {isLoading ? (
            <div className="flex flex-col justify-center items-center py-32">
              <div className="relative w-20 h-20 mb-6">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-2xl animate-pulse opacity-30"></div>
                <div className="relative w-20 h-20 bg-white rounded-2xl shadow-xl border-2 border-slate-100 flex items-center justify-center">
                  <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
                </div>
              </div>
              <p className="text-slate-600 font-semibold text-lg">Loading amazing templates...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20 bg-red-50 rounded-3xl border-2 border-red-100">
              <p className="text-red-600 font-semibold text-lg mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : featuredTemplates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {featuredTemplates.map((template, index) => (
                <div 
                  key={template._id} 
                  className="h-full animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <TemplateCard
                    template={template}
                    onNavigate={onNavigate}
                    onBuy={onBuy}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-32 bg-gradient-to-br from-slate-50 to-white rounded-3xl border-2 border-slate-200 shadow-xl">
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg border border-indigo-100">
                <FileSpreadsheet className="w-12 h-12 text-indigo-400" />
              </div>
              <h3 className="text-3xl font-black mb-3 text-slate-900">
                No templates published yet
              </h3>
              <p className="text-slate-500 text-lg max-w-md mx-auto">
                We're working on adding premium spreadsheets. Check back soon!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ================= BENEFITS SECTION ================= */}
      <section className="py-32 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/40 rounded-full blur-[150px] animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-600/40 rounded-full blur-[120px] animate-pulse animation-delay-2000"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid lg:grid-cols-2 gap-20 items-center">
          
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold text-xs uppercase tracking-wider mb-6">
              <Star className="w-4 h-4 text-amber-400" /> Why Choose Us
            </div>

            <h2 className="text-5xl lg:text-6xl font-black mb-8 text-white tracking-tight leading-tight">
              Stop building from scratch. <br /> 
              Start with a <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-emerald-400">proven template.</span>
            </h2>
            
            <p className="text-slate-300 text-xl mb-12 leading-relaxed">
              We've spent hundreds of hours designing dashboards and writing complex formulas so you don't have to. Just download, plug in your data, and get instant results.
            </p>

            <div className="space-y-8">
              {[
                {
                  icon: Clock,
                  color: "indigo",
                  title: "Save 100+ Hours",
                  desc: "Skip the tedious formatting and formula troubleshooting. Download a fully functional tracker today and get your weekend back."
                },
                {
                  icon: LayoutDashboard,
                  color: "emerald",
                  title: "Professional Dashboards",
                  desc: "Impress your team and clients with stunning, automated visual reports that make complex data easy to understand instantly."
                },
                {
                  icon: CheckCircle2,
                  color: "violet",
                  title: "Works in Excel & Google Sheets",
                  desc: "Whether you prefer the desktop power of Excel or the cloud collaboration of Google Sheets, our templates work flawlessly."
                }
              ].map((item, i) => (
                <div key={i} className="group flex gap-6 p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-x-2">
                  <div className={`w-16 h-16 rounded-2xl bg-${item.color}-500/20 flex items-center justify-center shrink-0 border border-${item.color}-500/30 group-hover:scale-110 transition-transform`}>
                    <item.icon className={`w-8 h-8 text-${item.color}-400`} />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold mb-3">{item.title}</h4>
                    <p className="text-slate-400 text-lg leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12">
              <button
                onClick={() => onNavigate("templates")}
                className="group px-10 py-5 bg-gradient-to-r from-indigo-500 via-violet-500 to-emerald-500 hover:from-indigo-400 hover:via-violet-400 hover:to-emerald-400 text-white font-bold text-lg rounded-2xl shadow-2xl shadow-indigo-500/30 transition-all transform hover:-translate-y-1 hover:scale-105 flex items-center gap-3"
              >
                Browse All Templates
                <TrendingUp className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative lg:scale-110">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 via-violet-500 to-emerald-500 rounded-3xl rotate-6 scale-105 opacity-30 blur-3xl animate-pulse"></div>
            <div className="relative group">
              <img
                src={homeHero}
                alt="Premium Excel & Google Sheets Templates"
                className="relative rounded-3xl shadow-2xl border-4 border-white/20 w-full object-cover aspect-[4/3] group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/20 to-emerald-600/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CTA SECTION ================= */}
      <section className="py-32 bg-gradient-to-br from-indigo-600 via-violet-600 to-indigo-700 relative overflow-hidden text-center px-4">
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `linear-gradient(to right, #ffffff 2px, transparent 2px), linear-gradient(to bottom, #ffffff 2px, transparent 2px)`,
          backgroundSize: '50px 50px'
        }}></div>

        {/* Animated Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/20 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/30 rounded-full blur-[100px] animate-pulse animation-delay-2000"></div>

        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/30 text-white font-bold text-sm uppercase tracking-wider mb-8">
            <Sparkles className="w-4 h-4" /> Limited Time Offer
          </div>

          <h2 className="text-5xl md:text-7xl font-black mb-10 tracking-tight text-white leading-tight">
            Stop wasting time on spreadsheets. <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-white">
              Start growing your business.
            </span>
          </h2>

          <button
            onClick={() => onNavigate("templates")}
            className="group relative inline-flex items-center gap-4 px-14 py-6 bg-white text-indigo-700 font-black text-2xl rounded-2xl hover:bg-indigo-50 hover:scale-110 shadow-[0_20px_60px_-10px_rgba(255,255,255,0.4)] hover:shadow-[0_25px_80px_-10px_rgba(255,255,255,0.6)] transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10">Explore All Templates</span>
            <ArrowRight className="w-7 h-7 relative z-10 group-hover:translate-x-2 transition-transform" />
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-indigo-100/50 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
          </button>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-8 text-white/90">
            <div className="flex items-center gap-2 font-semibold">
              <ShieldCheck className="w-6 h-6" /> Secure Payment
            </div>
            <div className="flex items-center gap-2 font-semibold">
              <CheckCircle2 className="w-6 h-6" /> Lifetime Access
            </div>
            <div className="flex items-center gap-2 font-semibold">
              <Star className="w-6 h-6" /> No Hidden Fees
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-gradient {
          animation: gradient 8s ease infinite;
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out both;
        }
      `}</style>
    </div>
  );
};

export default HomePage;