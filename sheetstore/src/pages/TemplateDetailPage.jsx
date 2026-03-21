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
  ArrowLeft
} from "lucide-react";

import { callGemini } from "../utils/callGemini";

const TemplateDetailPage = ({ id, onNavigate, onBuy }) => {
  const [template, setTemplate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [industry, setIndustry] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState("");

  useEffect(() => {
    const fetchTemplateDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/templates`);
        if (!res.ok) throw new Error('Failed to fetch templates');
        
        const allTemplates = await res.json();
        const currentTemplate = allTemplates.find((t) => t._id === id);
        
        if (!currentTemplate) throw new Error('Template not found');
        setTemplate(currentTemplate);
      } catch (error) {
        console.error("Failed to load details", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTemplateDetails();
  }, [id]);

  const handleAiGeneration = async () => {
    if (!industry.trim()) return;
    
    setIsAiLoading(true);
    setAiResponse("");
    
    try {
      const prompt = `Template: ${template.title}. Industry: ${industry}. Give 3 practical use cases in brief points.`;
      const response = await callGemini(prompt);
      setAiResponse(response);
    } catch (err) {
      setAiResponse("Failed to generate use cases. Please try again.");
    } finally {
      setIsAiLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <h2 className="text-xl font-bold text-slate-900">{error || "Template not found"}</h2>
        <button 
          onClick={() => onNavigate("templates")} 
          className="text-indigo-600 font-bold underline hover:text-indigo-700 transition-colors"
        >
          Go Back to Templates
        </button>
      </div>
    );
  }

  // Safe image URL
  const imageUrl = template.image 
    ? (template.image.startsWith('http') ? template.image : `${import.meta.env.VITE_API_URL}/uploads/${template.image}`)
    : "/placeholder-template.png";

  // Safe features array handling
  const featuresArray = Array.isArray(template.features) 
    ? template.features.filter(f => f && f.trim() !== "")
    : (typeof template.features === 'string' 
        ? template.features.split(',').map(f => f.trim()).filter(f => f !== "") 
        : []);

  return (
    <div className="min-h-screen bg-slate-50/50 pb-24">
      <div className="max-w-7xl mx-auto px-4 pt-10">
        
        {/* BACK BUTTON */}
        <button 
          onClick={() => onNavigate("templates")} 
          className="flex items-center gap-2 mb-6 text-slate-500 font-bold hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Templates
        </button>

        <div className="grid lg:grid-cols-12 gap-10">
          {/* LEFT CONTENT */}
          <div className="lg:col-span-8 space-y-8">
            <div className="space-y-4">
              <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-black uppercase border border-indigo-100 italic">
                {template.category?.name || "Premium"}
              </span>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
                {template.title}
              </h1>
            </div>

            {/* PREVIEW IMAGE */}
            <div className="bg-white p-2 rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden">
              <img 
                src={imageUrl} 
                alt={template.title} 
                className="w-full aspect-video object-cover rounded-[1.8rem]"
                onError={(e) => e.target.src = '/placeholder-template.png'}
              />
            </div>

            {/* DESCRIPTION BOX */}
            <div className="bg-white rounded-[2rem] border border-slate-100 p-8 md:p-10 shadow-sm space-y-8">
              <section>
                <h3 className="text-2xl font-black text-slate-900 mb-4 italic underline decoration-indigo-500 underline-offset-8">
                  Description
                </h3>
                <p className="text-slate-600 text-lg leading-relaxed whitespace-pre-line">
                  {template.description || "Professional template designed for maximum productivity."}
                </p>
              </section>

              {/* FEATURES GRID */}
              <div className="grid md:grid-cols-2 gap-8 pt-8 border-t border-slate-50">
                <div className="space-y-4">
                  <h4 className="font-black text-slate-900 uppercase tracking-tighter flex items-center gap-2 italic">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Key Features
                  </h4>
                  <ul className="space-y-2">
                    {featuresArray.length > 0 ? (
                      featuresArray.map((feature, i) => (
                        <li key={i} className="flex gap-2 text-slate-600 text-sm font-medium">
                          <Check className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" /> 
                          {feature}
                        </li>
                      ))
                    ) : (
                      <li className="text-slate-400 text-sm">Ready to use & fully customizable</li>
                    )}
                  </ul>
                </div>
                <div className="space-y-4">
                  <h4 className="font-black text-slate-900 uppercase tracking-tighter flex items-center gap-2 italic">
                    <Users className="w-5 h-5 text-indigo-500" /> Best For
                  </h4>
                  <p className="text-slate-500 text-sm leading-relaxed font-medium">
                    {template.whoShouldUse || "Designed for high-performance business workflows and productivity enhancement."}
                  </p>
                </div>
              </div>
            </div>

            {/* AI SECTION */}
            <div className="bg-slate-900 rounded-[2rem] p-8 md:p-10 text-white shadow-2xl relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-indigo-400" /> Industry Use-Case Generator
                </h3>
                <p className="text-slate-400 text-sm mb-4">
                  See how this template can be applied in your industry
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input 
                    type="text" 
                    value={industry} 
                    onChange={(e) => setIndustry(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !isAiLoading && handleAiGeneration()}
                    placeholder="Enter Industry (e.g. Real Estate, E-commerce)" 
                    className="flex-1 bg-white/10 border border-white/20 rounded-xl px-5 py-3 text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 transition-colors"
                    disabled={isAiLoading}
                  />
                  <button 
                    onClick={handleAiGeneration} 
                    disabled={isAiLoading || !industry.trim()}
                    className="bg-indigo-600 px-6 py-3 rounded-xl font-bold hover:bg-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {isAiLoading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" /> Generating...
                      </span>
                    ) : "Generate Use Cases"}
                  </button>
                </div>
                {aiResponse && (
                  <div className="mt-6 p-6 bg-white/5 rounded-xl border border-white/10 text-slate-200 leading-relaxed">
                    <div className="whitespace-pre-line">{aiResponse}</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT CHECKOUT CARD */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 bg-white rounded-[2rem] p-8 shadow-2xl border border-slate-200">
              <div className="mb-6">
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-1">
                  One-time payment
                </p>
                <h2 className="text-5xl font-black text-slate-900 italic">
                  ₹{template.price}
                </h2>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-slate-600 font-bold text-sm">
                  <div className="p-1 bg-emerald-50 rounded-full">
                    <Check className="w-4 h-4 text-emerald-600" />
                  </div>
                  Instant {template.productType === 'google_sheet' ? "Link" : "Download"} Access
                </div>
                <div className="flex items-center gap-3 text-slate-600 font-bold text-sm">
                  <div className="p-1 bg-emerald-50 rounded-full">
                    <Check className="w-4 h-4 text-emerald-600" />
                  </div>
                  Lifetime Free Updates
                </div>
                <div className="flex items-center gap-3 text-slate-600 font-bold text-sm">
                  <div className="p-1 bg-emerald-50 rounded-full">
                    <Check className="w-4 h-4 text-emerald-600" />
                  </div>
                  24/7 Support Available
                </div>
              </div>

              <button 
                onClick={() => onBuy(template)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 shadow-xl transition-all hover:-translate-y-1 active:scale-95 text-lg"
              >
                <ShoppingCart className="w-6 h-6" /> GET ACCESS NOW
              </button>
              
              <div className="text-center text-slate-400 text-[10px] mt-6 font-bold flex items-center justify-center gap-2 uppercase tracking-tighter">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> 
                100% Secure Transaction via Razorpay
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateDetailPage;