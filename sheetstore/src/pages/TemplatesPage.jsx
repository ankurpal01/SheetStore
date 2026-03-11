import { useState, useMemo, useEffect } from "react";
import {
  Search,
  Sparkles,
  Loader2,
  FileSpreadsheet,
  SlidersHorizontal
} from "lucide-react";

import TemplateCard from "../components/TemplateCard";
import { callGemini } from "../utils/callGemini";

const TemplatesPage = ({ onNavigate, onBuy, initialCategory = "All" }) => {
  const [dbTemplates, setDbTemplates] = useState([]);
  const [dbCategories, setDbCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState("popular");

  const [aiQuery, setAiQuery] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 👇 YAHAN DONO JAGAH CHANGE KIYA HAI 👇
        const [tempRes, catRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/templates`),
          fetch(`${import.meta.env.VITE_API_URL}/categories`)
        ]);

        if (tempRes.ok && catRes.ok) {
          const templatesData = await tempRes.json();
          const categoriesData = await catRes.json();
          setDbTemplates(templatesData);
          setDbCategories(categoriesData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAiSearch = async () => {
    if (!aiQuery.trim()) return;

    setIsAiLoading(true);
    setAiResponse("");

    const availableTemplates = dbTemplates.map((t) => ({
      title: t.title,
      description: t.description,
      category: t.category?.name || "Uncategorized",
    }));

    const prompt = `
You are an expert business consultant helping a user find the right spreadsheet template.

User's request: "${aiQuery}"

Available Templates: ${JSON.stringify(availableTemplates)}

Recommend best 1 or 2 options. Be concise and practical.
`;

    const response = await callGemini(prompt);
    setAiResponse(response);
    setIsAiLoading(false);
  };

  const filteredTemplates = useMemo(() => {
    let result = [...dbTemplates];

    if (searchTerm) {
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "All") {
      result = result.filter((t) => {
        const catName = t.category?.name || t.category;
        return catName === selectedCategory;
      });
    }

    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return result;
  }, [dbTemplates, searchTerm, selectedCategory, sortBy]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
        <p className="text-xl text-slate-500 font-semibold animate-pulse">Loading Templates...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 selection:bg-indigo-200 relative pb-20">
      
      {/* Background subtle grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] h-[50vh]" style={{
          backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)`,
          backgroundSize: '20px 20px'
      }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-16">

        {/* ================= HEADER ================= */}
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            {selectedCategory === "All" ? (
              <>Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">All Templates</span></>
            ) : (
              <><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">{selectedCategory}</span> Systems</>
            )}
          </h1>
          <p className="text-slate-600 font-medium">Find the perfect spreadsheet to optimize your workflow and save hours of manual work.</p>
        </div>

        {/* ================= CONTROLS (SEARCH & FILTER) ================= */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-8 flex flex-col md:flex-row gap-4 relative z-20">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search templates by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl border-none bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium text-slate-700"
            />
          </div>

          <div className="flex gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <SlidersHorizontal className="w-4 h-4 text-slate-400" />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 pr-10 py-3.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500/20 appearance-none cursor-pointer hover:bg-slate-50 transition-colors"
              >
                <option value="All">All Categories</option>
                {dbCategories.map((c) => (
                  <option key={c._id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-5 py-3.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500/20 appearance-none cursor-pointer hover:bg-slate-50 transition-colors"
            >
              <option value="popular">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* ================= AI MATCHMAKER ================= */}
        <div className="mb-16 relative rounded-3xl overflow-hidden shadow-sm border border-indigo-100 bg-white p-6 md:p-8 group">
           {/* Decorative background glow */}
           <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-indigo-100/50 to-purple-100/50 rounded-full blur-[80px] -z-10 translate-x-1/3 -translate-y-1/3 group-hover:bg-indigo-200/50 transition-colors duration-700"></div>

          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-md">
               <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">AI Template Matchmaker</h3>
              <p className="text-sm text-slate-500">Tell us what you're trying to achieve, and we'll find the perfect template.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="e.g., I need to track my monthly startup expenses and runway..."
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              className="flex-grow px-5 py-4 rounded-xl border border-indigo-100 bg-white shadow-inner focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 focus:outline-none transition-all font-medium text-slate-700"
            />
            <button
              onClick={handleAiSearch}
              disabled={!aiQuery || isAiLoading}
              className="px-8 py-4 bg-slate-900 text-white font-bold rounded-xl flex items-center justify-center gap-2 disabled:bg-slate-300 transition-all hover:bg-indigo-600 hover:shadow-lg shrink-0"
            >
              {isAiLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Searching...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-indigo-300" /> Find Match
                </>
              )}
            </button>
          </div>

          {/* AI Response */}
          {aiResponse && (
            <div className="mt-6 p-6 bg-indigo-50/80 border border-indigo-100 rounded-2xl">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span className="font-bold text-indigo-900 text-sm uppercase tracking-wide">AI Recommendation</span>
              </div>
              <div className="whitespace-pre-line text-slate-700 font-medium leading-relaxed">
                {aiResponse}
              </div>
            </div>
          )}
        </div>

        {/* ================= TEMPLATES GRID ================= */}
        {filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTemplates.map((template) => (
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
          /* ================= EMPTY STATE ================= */
          <div className="text-center py-24 bg-white rounded-3xl border border-slate-200 shadow-sm mt-8">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-slate-100">
              <FileSpreadsheet className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-slate-900">
              No templates found
            </h3>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">We couldn't find any templates matching your current search or category filters.</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
              }}
              className="px-6 py-3 bg-indigo-50 text-indigo-600 font-bold rounded-xl hover:bg-indigo-100 transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default TemplatesPage;