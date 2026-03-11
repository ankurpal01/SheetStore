import { useEffect } from "react";
import ReactGA from "react-ga4";
import { Target, ShieldCheck, Heart, Users, Download, Star, Database, Layout } from "lucide-react";
import aboutHero from "../assets/About_Page.png";

const AboutPage = () => {

  useEffect(() => {
    // Analytics: Track visit to About Page
    ReactGA.send({ hitType: "pageview", page: "/about", title: "About Us" });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-200 relative overflow-hidden">

      {/* Background blobs for premium feel */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-200/40 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-200/30 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">

        {/* ================= HERO SECTION ================= */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-indigo-600 font-bold text-xs uppercase tracking-widest mb-6 shadow-sm border border-slate-100">
            <Database className="w-3.5 h-3.5" /> Built by Data Professionals
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
            The Future of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500">
              Spreadsheet Systems
            </span>
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed font-medium">
            At SheetStore, we transform complex data into simple, actionable systems. No coding, no subscriptions—just professional tools for Excel and Google Sheets.
          </p>
        </div>

        {/* ================= IMAGE & STATS SECTION ================= */}
        <div className="relative mb-32 max-w-5xl mx-auto">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-emerald-500 rounded-3xl rotate-2 scale-[1.02] opacity-20 blur-lg"></div>

          <img
            src={aboutHero}
            alt="About SheetStore"
            className="relative rounded-3xl shadow-2xl border border-white/50 w-full object-cover h-[450px]"
          />
          {/* Floating Stats Bar */}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[95%] md:w-[80%] bg-white/90 backdrop-blur-md rounded-2xl shadow-[0_20px_50px_-10px_rgba(0,0,0,0.15)] border border-slate-100 p-8 flex justify-between items-center divide-x divide-slate-100">
            <div className="flex-1 text-center">
              <div className="flex justify-center mb-1"><Users className="w-5 h-5 text-indigo-500" /></div>
              <h4 className="text-3xl font-black text-slate-900 tracking-tighter">500+</h4>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Users</p>
            </div>
            <div className="flex-1 text-center px-2">
              <div className="flex justify-center mb-1"><Layout className="w-5 h-5 text-emerald-500" /></div>
              <h4 className="text-3xl font-black text-slate-900 tracking-tighter">50+</h4>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Premium Systems</p>
            </div>
            <div className="flex-1 text-center">
              <div className="flex justify-center mb-1"><Star className="w-5 h-5 text-amber-500 fill-amber-500" /></div>
              <h4 className="text-3xl font-black text-slate-900 tracking-tighter">4.9/5</h4>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg Rating</p>
            </div>
          </div>
        </div>

        {/* ================= CORE VALUES SECTION ================= */}
        <div className="mt-40">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Why Choose Our Sheets?</h2>
            <div className="w-20 h-1.5 bg-indigo-600 mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">

            {/* Card 1: Expertise */}
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
              <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-indigo-600 transition-all duration-500 shadow-sm">
                <Target className="w-8 h-8 text-indigo-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors">
                Expert Analysis
              </h3>
              <p className="text-slate-500 leading-relaxed font-medium">
                Every template is designed by a professional **Data Analyst**. We don't just build grids; we build analytical engines that solve real business problems.
              </p>
            </div>

            {/* Card 2: Hybrid Support */}
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-emerald-600 transition-all duration-500 shadow-sm">
                <ShieldCheck className="w-8 h-8 text-emerald-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-emerald-600 transition-colors">
                Hybrid Ready
              </h3>
              <p className="text-slate-500 leading-relaxed font-medium">
                Whether you prefer the power of **Excel** or the collaboration of **Google Sheets**, our hybrid models ensure you get the best of both worlds.
              </p>
            </div>

            {/* Card 3: One-Time Value */}
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group">
              <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-amber-500 transition-all duration-500 shadow-sm">
                <Heart className="w-8 h-8 text-amber-500 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-amber-600 transition-colors">
                Zero Monthly Fees
              </h3>
              <p className="text-slate-500 leading-relaxed font-medium">
                We hate subscriptions too. Buy your system once and own it for life. No hidden costs, just pure productivity at a one-time price.
              </p>
            </div>

          </div>
        </div>

        {/* ================= CALL TO ACTION ================= */}
        <div className="mt-32 p-10 md:p-16 rounded-[40px] bg-slate-900 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to automate your workflow?</h2>
            <p className="text-slate-400 mb-10 max-w-xl mx-auto text-lg font-medium">Join 500+ professionals who are saving time every day with SheetStore systems.</p>
            <button
              onClick={() => window.scrollTo(0, 0)}
              className="px-10 py-5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-black rounded-2xl hover:shadow-indigo-500/25 shadow-xl transition-all hover:-translate-y-1"
            >
              Browse All Templates
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutPage;