import { useEffect, useState } from "react";
import ReactGA from "react-ga4";
import {
  ChevronRight,
  CheckCircle2,
  Users,
  Sparkles,
  Loader2,
  Check,
  ShoppingCart,
  ShieldCheck,
  Lock,
  FileSpreadsheet,
  Zap,
  Link as LinkIcon,
  Download,
  ArrowLeft,
  Calendar
} from "lucide-react";

import { callGemini } from "../utils/callGemini";

const TemplateDetailPage = ({ id, onNavigate, onBuy }) => {
  const [template, setTemplate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [industry, setIndustry] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState("");

  useEffect(() => {
    const fetchTemplateDetails = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/templates`);
        if (res.ok) {
          const allTemplates = await res.json();
          const currentTemplate = allTemplates.find((t) => t._id === id);
          setTemplate(currentTemplate);

          if (currentTemplate) {
            ReactGA.event({
              category: "Engagement",
              action: "View Product Details",
              label: currentTemplate.title
            });
          }
        }
      } catch (error) {
        console.error("Failed to load details", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTemplateDetails();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="mt-6 text-slate-500 font-bold tracking-widest animate-pulse">LOADING DETAILS...</p>
      </div>
    );
  }

  if (!template) return <div className="text-center py-20">Template Not Found</div>;

  // 🔥 SMART IMAGE LOGIC (Cloudinary + Local)
  const imageUrl = template.image 
    ? (template.image.startsWith('http') ? template.image : `${import.meta.env.VITE_API_URL}/uploads/${template.image}`)
    : "https://via.placeholder.com/800x450?text=No+Preview+Available";

  const handleAiGeneration = async () => {
    if (!industry.trim()) return;
    setIsAiLoading(true);
    setAiResponse("");
    const prompt = `Template: "${template.title}" Description: "${template.description}" Industry: "${industry}". Give 3 quick bullet points on how to use it.`;
    const response = await callGemini(prompt);
    setAiResponse(response);
    setIsAiLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-24">
      {/* HEADER SECTION */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-[40]">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={() => onNavigate("templates")}
            className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition-all group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Templates
          </button>
          <div className="hidden md:flex items-center gap-3 text-sm text-slate-400 font-medium">
             <span className="hover:text-indigo-600 cursor-pointer" onClick={() => onNavigate("home")}>Home</span>
             <ChevronRight className="w-4 h-4" />
             <span className="text-slate-900 font-bold truncate max-w-[200px]">{template.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid lg:grid-cols-12 gap-10">
          
          {/* LEFT: CONTENT AREA */}
          <div className="lg:col-span-8 space-y-8">
            {/* Title & Badge */}
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-black uppercase tracking-widest border border-indigo-100">
                <Sparkles className="w-3.5 h-3.5" /> {template.category?.name || "Premium Template"}
              </span>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight tracking-tight">
                {template.title}
              </h1>
            </div>

            {/* Main Preview Image */}
            <div className="group relative bg-white p-2 rounded-[2.5rem] shadow-2xl shadow-indigo-100/50 border border-slate-100 overflow-hidden">
              <img 
                src={imageUrl} 
                alt={template.title} 
                className="w-full aspect-video object-cover rounded-[2rem] group-hover:scale-[1.01] transition-transform duration-700"
              />
              <div className="absolute top-6 left-6 flex gap-2">
                <div className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-xl shadow-lg flex items-center gap-2 text-xs font-black text-slate-900 uppercase">
                  {template.productType === 'google_sheet' ? <LinkIcon className="w-4 h-4 text-emerald-500" /> : <FileSpreadsheet className="w-4 h-4 text-indigo-500" />}
                  {template.productType}
                </div>
              </div>
            </div>

            {/* Features & Description */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 md:p-12 shadow-sm space-y-10">
              <section>
                <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                  <div className="w-2 h-8 bg-indigo-600 rounded-full"></div>
                  Description
                </h3>
                <p className="text-slate-600 text-lg leading-relaxed whitespace-pre-line">
                  {template.description}
                </p>
              </section>

              <div className="grid md:grid-cols-2 gap-8 pt-6 border-t border-slate-50">
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-indigo-600" /> Key Benefits
                  </h4>
                  <ul className="space-y-3">
                    {template.features?.split(',').map((f, i) => (
                      <li key={i} className="flex gap-2 text-slate-600 text-sm font-medium">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" /> {f}
                      </li>
                    )) || <li>✓ Ready to use & Customizable</li>}
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2">
                    <Users className="w-5 h-5 text-indigo-600" /> Best Suited For
                  </h4>
                  <p className="text-slate-500 text-sm leading-relaxed italic">
                    {template.whoShouldUse || "Designed for professionals looking to optimize their workflow."}
                  </p>
                </div>
              </div>
            </div>

            {/* AI GEN BOX */}
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-indigo-500/20 rounded-lg backdrop-blur-md">
                    <Zap className="w-6 h-6 text-indigo-400" />
                  </div>
                  <h3 className="text-2xl font-bold">Business Use-Case Generator</h3>
                </div>
                <p className="text-slate-400 mb-8 max-w-xl font-medium">Enter your industry and let AI explain how this {template.productType} can solve your specific problems.</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input 
                    type="text" 
                    value={industry}
                    onChange={(e)=>setIndustry(e.target.value)}
                    placeholder="e.g. E-commerce, Real Estate..." 
                    className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-slate-500 transition-all"
                  />
                  <button 
                    onClick={handleAiGeneration}
                    disabled={isAiLoading}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/20 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isAiLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Generate Now"}
                  </button>
                </div>
                {aiResponse && (
                  <div className="mt-8 p-6 bg-white/5 border border-white/10 rounded-2xl animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="text-indigo-300 font-bold text-sm mb-3 uppercase tracking-tighter">AI Recommended Usage:</div>
                    <div className="text-slate-300 whitespace-pre-line leading-relaxed italic font-medium">"{aiResponse}"</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: PRICING CARD */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-slate-200/50 border border-slate-200">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-1">One-time payment</p>
                    <h2 className="text-5xl font-black text-slate-900">₹{template.price}</h2>
                  </div>
                  <div className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-black italic shadow-sm">-70% OFF</div>
                </div>

                <div className="space-y-4 mb-8">
                  {[
                    {text: template.productType === 'google_sheet' ? "Instant Drive Link" : "Direct Excel Download", icon: <Check className="w-4 h-4 text-emerald-500" />},
                    {text: "Lifetime Free Updates", icon: <Check className="w-4 h-4 text-emerald-500" />},
                    {text: "Unlimited Re-use", icon: <Check className="w-4 h-4 text-emerald-500" />},
                    {text: "Secure Payment", icon: <ShieldCheck className="w-4 h-4 text-indigo-500" />}
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-slate-600 font-bold text-sm">
                      <div className="p-1 bg-slate-50 border border-slate-100 rounded-full">{item.icon}</div>
                      {item.text}
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => onBuy(template)}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-indigo-100 transition-all hover:-translate-y-1 active:scale-95 text-lg"
                >
                  <ShoppingCart className="w-6 h-6" /> GET ACCESS NOW
                </button>
                
                <p className="text-center text-slate-400 text-xs mt-6 flex items-center justify-center gap-2">
                  <Lock className="w-3.5 h-3.5" /> 100% Secure Transaction via Razorpay
                </p>
              </div>

              {/* Trust Badge */}
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 flex items-start gap-4">
                 <div className="p-3 bg-white rounded-xl shadow-sm text-indigo-600"><ShieldCheck className="w-6 h-6" /></div>
                 <div>
                   <h4 className="font-black text-indigo-900 text-sm">Satisfaction Guarantee</h4>
                   <p className="text-indigo-700/60 text-xs font-medium mt-1 leading-relaxed">If the file is corrupt or not as described, our support will resolve it within 24 hours.</p>
                 </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default TemplateDetailPage;