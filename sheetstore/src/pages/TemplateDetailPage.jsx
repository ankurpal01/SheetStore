import { useState, useEffect } from "react";
import ReactGA from "react-ga4"; // Analytics Import
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
  Download
} from "lucide-react";

import TemplateCard from "../components/TemplateCard";
import { callGemini } from "../utils/callGemini";

const TemplateDetailPage = ({ id, onNavigate, onBuy }) => {
  const [template, setTemplate] = useState(null);
  const [relatedTemplates, setRelatedTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [industry, setIndustry] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState("");

  useEffect(() => {
    const fetchTemplateDetails = async () => {
      try {
        // 👇 YAHAN CHANGE KIYA HAI 👇
        const res = await fetch(`${import.meta.env.VITE_API_URL}/templates`);
        
        if (res.ok) {
          const allTemplates = await res.json();
          const currentTemplate = allTemplates.find((t) => t._id === id);
          setTemplate(currentTemplate);

          if (currentTemplate) {
            const currentCatId = currentTemplate.category?._id || currentTemplate.category;
            const related = allTemplates.filter(
              (t) => (t.category?._id || t.category) === currentCatId && t._id !== id
            ).slice(0, 3);
            setRelatedTemplates(related);

            // NAYA: Track Product View
            ReactGA.event({
              category: "Engagement",
              action: "View Product Details",
              label: currentTemplate.title
            });
          }
        }
      } catch (error) {
        console.error("Failed to load template details", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplateDetails();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
        <p className="text-xl text-slate-500 font-semibold animate-pulse">Loading Template Details...</p>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center bg-white p-10 rounded-3xl border shadow-sm">
          <FileSpreadsheet className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4 text-slate-900">Template not found</h2>
          <button
            onClick={() => onNavigate("templates")}
            className="text-indigo-600 hover:text-indigo-800 font-bold transition-colors"
          >
            &larr; Return to all templates
          </button>
        </div>
      </div>
    );
  }

  // NAYA: Track AI Usage
  const handleAiGeneration = async () => {
    if (!industry.trim()) return;
    
    ReactGA.event({
      category: "Engagement",
      action: "Use AI Use-Case Generator",
      label: `Template: ${template.title} | Industry: ${industry}`
    });

    setIsAiLoading(true);
    setAiResponse("");
    const prompt = `You are a business systems consultant. Template: "${template.title}" Description: "${template.description}" User industry: "${industry}" Give exactly 3 practical bullet points explaining usage.`;
    const response = await callGemini(prompt);
    setAiResponse(response);
    setIsAiLoading(false);
  };

  // NAYA: Track Main Purchase Click
  const handleBuyNow = () => {
    ReactGA.event({
      category: "Conversion",
      action: "Click Buy Now From Detail Page",
      label: template.title
    });
    onBuy(template);
  };

  // 👇 YAHAN CHANGE KIYA HAI 👇
  const imageUrl = template.image ? `${import.meta.env.VITE_API_URL}/uploads/${template.image}` : "";
  const categoryName = template.category?.name || "Uncategorized";

  const isSheet = template.productType === 'google_sheet';
  
  const featuresList = template.features && template.features.length > 0 
    ? template.features 
    : ["Ready to use spreadsheet", "Fully editable"];

  const whoShouldUseList = template.whoShouldUse && template.whoShouldUse.length > 0 
    ? template.whoShouldUse 
    : ["Professionals", "Business Owners", "Students"];

  const includedList = [
    isSheet ? "Google Sheet Link" : "Excel File (.xlsx)",
    isSheet ? "Instant Drive Access" : "Instant Download",
    "Lifetime Access",
    "No hidden subscriptions"
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 selection:bg-indigo-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-8">

        {/* BREADCRUMB */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-8 font-medium">
          <button onClick={() => onNavigate("home")} className="hover:text-indigo-600 transition-colors">Home</button>
          <ChevronRight className="w-4 h-4 text-slate-300" />
          <button onClick={() => onNavigate("templates")} className="hover:text-indigo-600 transition-colors">Templates</button>
          <ChevronRight className="w-4 h-4 text-slate-300" />
          <span className="text-slate-800 font-bold line-clamp-1">{template.title}</span>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* LEFT SIDE */}
          <div className="lg:col-span-8 space-y-10">
            <div>
               <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-indigo-50 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-4 border border-indigo-100">
                  {isSheet ? <LinkIcon className="w-3.5 h-3.5" /> : <FileSpreadsheet className="w-3.5 h-3.5" />}
                  {categoryName}
               </div>
               <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
                  {template.title}
               </h1>
            </div>

            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 p-2">
              <img src={imageUrl} alt={template.title} className="w-full aspect-video object-cover rounded-2xl" />
            </div>

            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100">
              <h2 className="text-2xl font-bold mb-6 text-slate-900">About this {isSheet ? 'Sheet' : 'Template'}</h2>
              <p className="text-slate-600 mb-10 whitespace-pre-line leading-relaxed text-lg">{template.description}</p>

              <div className="grid md:grid-cols-2 gap-10">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <h3 className="font-extrabold mb-5 flex items-center gap-2 text-slate-900">
                    <div className="p-1.5 bg-indigo-100 rounded-lg text-indigo-600"><CheckCircle2 className="w-5 h-5" /></div>
                    Key Features
                  </h3>
                  <ul className="space-y-4">
                    {featuresList.map((f, idx) => (
                      <li key={idx} className="flex gap-3 text-slate-600 font-medium items-start">
                        <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <h3 className="font-extrabold mb-5 flex items-center gap-2 text-slate-900">
                    <div className="p-1.5 bg-purple-100 rounded-lg text-purple-600"><Users className="w-5 h-5" /></div>
                    Perfect For
                  </h3>
                  <ul className="space-y-4">
                    {whoShouldUseList.map((p, idx) => (
                      <li key={idx} className="flex gap-3 text-slate-600 font-medium items-start">
                        <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2.5 shrink-0"></div>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* AI Generator Section */}
            <div className="bg-indigo-600 rounded-3xl p-8 md:p-10 text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Sparkles className="w-6 h-6" /> How can this help your business?
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <input
                      type="text"
                      placeholder="Enter your industry (e.g. Real Estate)"
                      className="flex-grow px-5 py-3 rounded-xl text-slate-900 focus:outline-none"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                    />
                    <button
                      onClick={handleAiGeneration}
                      disabled={isAiLoading}
                      className="px-8 py-3 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
                    >
                      {isAiLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                      Generate
                    </button>
                  </div>
                  {aiResponse && (
                    <div className="mt-6 p-6 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-sm">
                      <div className="whitespace-pre-line leading-relaxed">{aiResponse}</div>
                    </div>
                  )}
                </div>
            </div>
          </div>

          {/* RIGHT SIDE (CHECKOUT) */}
          <div className="lg:col-span-4">
            <div className="bg-white p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-200 sticky top-24">
              <h3 className="text-lg font-bold text-slate-500 mb-2">Lifetime Access</h3>
              <div className="flex items-end gap-2 mb-6 border-b border-slate-100 pb-6">
                <span className="text-5xl font-extrabold text-slate-900 tracking-tight">₹{template.price}</span>
                <span className="text-slate-400 font-medium mb-1">/ one-time</span>
              </div>

              <ul className="space-y-4 mb-8">
                {includedList.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-slate-600 font-medium">
                    <div className="p-1 bg-emerald-50 rounded-full"><Check className="w-4 h-4 text-emerald-600" /></div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={handleBuyNow}
                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-extrabold rounded-xl flex justify-center items-center gap-2 transition-all shadow-lg hover:-translate-y-1 mb-4"
              >
                <ShoppingCart className="w-5 h-5" /> Buy Now
              </button>

              <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <Lock className="w-4 h-4" /> Secure Razorpay Checkout
              </div>

              <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-100 flex gap-4">
                <ShieldCheck className="w-8 h-8 text-indigo-400 shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">Quality Guaranteed</h4>
                  <p className="text-xs text-slate-500">Verified by experts. Works on {isSheet ? 'Google Sheets' : 'Excel'}.</p>
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