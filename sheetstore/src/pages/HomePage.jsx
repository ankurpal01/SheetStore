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
  MousePointer2
} from "lucide-react";

import TemplateCard from "../components/TemplateCard";
import homeHero from "../assets/Home_Page.png";

const HomePage = ({ onNavigate, onBuy }) => {
  const [featuredTemplates, setFeaturedTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLatestTemplates = async () => {
      try {
       
        const res = await fetch(`${import.meta.env.VITE_API_URL}/templates`);
        
        if (res.ok) {
          const data = await res.json();
          const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setFeaturedTemplates(sorted.slice(0, 3));
        }
      } catch (error) {
        console.error("Error fetching homepage templates:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestTemplates();
  }, []);

  return (
    <div className="flex flex-col min-h-screen font-sans selection:bg-indigo-200">

      {/* ================= HERO SECTION ================= */}
      <section className="relative pt-32 pb-40 overflow-hidden bg-white">

        {/* EXCEL GRID BACKGROUND PATTERN */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)`,
          backgroundSize: '30px 30px'
        }}></div>

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/90"></div>

        {/* Animated Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl z-10">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-20 right-1/4 w-96 h-96 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-20">
          {/* Floating Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 font-bold text-xs uppercase tracking-widest mb-6 border border-indigo-100">
            <Sparkles className="w-3.5 h-3.5" /> Trusted by 500+ Professionals
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tight leading-[1.1]">
            Master Your Data with <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500">
              Premium Spreadsheet Systems
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
            Download professionally designed dashboards, trackers, and business templates 
            ready for <span className="text-slate-900 font-bold">Microsoft Excel</span> and
            <span className="text-emerald-600 font-bold"> Google Sheets</span> that work instantly.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-5">
            <button
              onClick={() => onNavigate("templates")}
              className="group relative px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-[0_4px_20px_-5px_rgba(79,70,229,0.5)] hover:bg-indigo-700 hover:shadow-[0_8px_30px_-5px_rgba(79,70,229,0.6)] transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-3 overflow-hidden"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
              <FileSpreadsheet className="w-5 h-5" />
              <span>Explore Templates</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => onNavigate("categories")}
              className="px-8 py-4 bg-white text-slate-800 font-bold rounded-xl border-2 border-slate-200 shadow-sm hover:shadow-md hover:bg-slate-50 hover:border-indigo-200 hover:text-indigo-700 hover:-translate-y-1 transition-all duration-300"
            >
              View Categories
            </button>
          </div>

          {/* Trust Badges */}
          <div className="mt-16 pt-8 border-t border-slate-100 flex items-center justify-center gap-x-8 gap-y-4 flex-wrap text-sm font-bold text-slate-500 uppercase tracking-tight">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" /> Instant Access
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> Secure Payment
            </div>
            <div className="flex items-center gap-2">
              <MousePointer2 className="w-4 h-4 text-indigo-500" /> Easy to Use
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-500" /> Lifetime Access
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURED TEMPLATES ================= */}
      <section className="py-24 bg-slate-50 relative z-10 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-6 border-b border-slate-200/60 pb-8">
            <div>
              <div className="text-indigo-600 font-extrabold text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-500" /> Best Sellers
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
                Featured Templates
              </h2>
            </div>

            <button
              onClick={() => onNavigate("templates")}
              className="group flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-700 transition-all bg-white border border-slate-200 shadow-sm px-6 py-3 rounded-xl hover:shadow-md hover:border-indigo-200"
            >
              View All Collection <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {isLoading ? (
            <div className="flex flex-col justify-center items-center py-20">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mb-4">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
              </div>
              <p className="text-slate-500 font-medium animate-pulse">Loading amazing templates...</p>
            </div>
          ) : featuredTemplates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredTemplates.map((template) => (
                <div key={template._id} className="h-full">
                  <TemplateCard
                    template={template}
                    onNavigate={onNavigate}
                    onBuy={onBuy}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-slate-100">
                <FileSpreadsheet className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-slate-900">
                No templates published yet
              </h3>
              <p className="text-slate-500 max-w-md mx-auto mb-6">We're working on adding some premium spreadsheets. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* ================= BENEFITS SECTION ================= */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-1/3 w-[600px] h-[600px] bg-emerald-600/20 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-extrabold mb-6 text-white tracking-tight leading-tight">
              Stop building from scratch. <br className="hidden sm:block" /> Start with a <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">proven template.</span>
            </h2>
            <p className="text-slate-300 text-lg mb-10 leading-relaxed">
              We've spent hundreds of hours designing dashboards and writing complex formulas so you don't have to. Just download, plug in your data, and get instant results.
            </p>

            <div className="space-y-8">
              <div className="flex gap-5 group">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center shrink-0 border border-indigo-500/30 group-hover:bg-indigo-500/20 transition-colors">
                  <Clock className="w-7 h-7 text-indigo-400" />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2">Save 100+ Hours</h4>
                  <p className="text-slate-400">
                    Skip the tedious formatting and formula troubleshooting. Download a fully functional tracker today and get your weekend back.
                  </p>
                </div>
              </div>

              <div className="flex gap-5 group">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/30 group-hover:bg-emerald-500/20 transition-colors">
                  <LayoutDashboard className="w-7 h-7 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2">Professional Dashboards</h4>
                  <p className="text-slate-400">
                    Impress your team and clients with stunning, automated visual reports that make complex data easy to understand instantly.
                  </p>
                </div>
              </div>

              <div className="flex gap-5 group">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center shrink-0 border border-amber-500/30 group-hover:bg-amber-500/20 transition-colors">
                  <CheckCircle2 className="w-7 h-7 text-amber-400" />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-2">Works in Excel & Google Sheets</h4>
                  <p className="text-slate-400">
                    Whether you prefer the desktop power of Excel or the cloud collaboration of Google Sheets, our templates work flawlessly out of the box.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <button
              onClick={() => onNavigate("templates")}
              className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-emerald-500 hover:from-indigo-400 hover:to-emerald-400 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/25 transition-all transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-slate-900">
                Browse Templates
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-emerald-500 rounded-3xl rotate-3 scale-105 opacity-25 blur-2xl animate-pulse pointer-events-none"></div>
            <img
              src={homeHero}
              alt="Ready-made Excel dashboard and Google Sheets tracker template displaying automated business data"
              className="relative rounded-3xl shadow-2xl border-2 border-white/10 w-full object-cover aspect-[4/3]"
            />
          </div>
        </div>
      </section>

      {/* ================= CALL TO ACTION ================= */}
      <section className="py-24 bg-indigo-600 relative overflow-hidden text-center px-4">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '30px 30px'
        }}></div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-extrabold mb-8 tracking-tight text-white leading-tight">
            Stop wasting time on spreadsheets. <br /> Start growing your business.
          </h2>

          <button
            onClick={() => onNavigate("templates")}
            className="group relative inline-flex items-center gap-3 px-12 py-5 bg-white text-indigo-700 font-extrabold text-xl rounded-2xl hover:bg-indigo-50 hover:scale-105 hover:shadow-[0_10px_40px_-10px_rgba(255,255,255,0.5)] transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10">Explore All Templates</span>
            <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-indigo-100/50 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
          </button>
          <p className="text-indigo-200 mt-6 font-medium flex items-center justify-center gap-2">
            <ShieldCheck className="w-5 h-5" /> One-time payment. Lifetime access. No hidden fees.
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;