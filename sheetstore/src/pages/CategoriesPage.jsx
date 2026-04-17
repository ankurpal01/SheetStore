import { useState, useEffect } from "react";
import {
  LayoutGrid, Calculator, Users, Briefcase,
  TrendingUp, FolderKanban, FileSpreadsheet, ArrowUpRight, Sparkles
} from "lucide-react";

const getCategoryIcon = (categoryName) => {
  const name = categoryName.toLowerCase();
  if (name.includes("finance") || name.includes("accounting")) return <Calculator size={22} />;
  if (name.includes("hr") || name.includes("human")) return <Users size={22} />;
  if (name.includes("marketing") || name.includes("sales")) return <TrendingUp size={22} />;
  if (name.includes("project") || name.includes("management")) return <FolderKanban size={22} />;
  if (name.includes("business")) return <Briefcase size={22} />;
  return <LayoutGrid size={22} />;
};

const PALETTE = [
  { icon: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-200", hoverIconBg: "group-hover:bg-indigo-600" },
  { icon: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", hoverIconBg: "group-hover:bg-emerald-600" },
  { icon: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", hoverIconBg: "group-hover:bg-amber-600" },
  { icon: "text-pink-600", bg: "bg-pink-50", border: "border-pink-200", hoverIconBg: "group-hover:bg-pink-600" },
  { icon: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", hoverIconBg: "group-hover:bg-blue-600" },
  { icon: "text-violet-600", bg: "bg-violet-50", border: "border-violet-200", hoverIconBg: "group-hover:bg-violet-600" },
  { icon: "text-teal-600", bg: "bg-teal-50", border: "border-teal-200", hoverIconBg: "group-hover:bg-teal-600" },
  { icon: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200", hoverIconBg: "group-hover:bg-orange-600" },
];

const CategoriesPage = ({ onNavigate }) => {
  const [categories, setCategories] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, tempRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/categories`),
          fetch(`${import.meta.env.VITE_API_URL}/templates`),
        ]);
        if (!catRes.ok || !tempRes.ok) throw new Error("Failed");
        setCategories(await catRes.json());
        setTemplates(await tempRes.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-slate-500 tracking-wide">Loading collections…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className="bg-white border-b border-slate-200 pt-20 pb-12 px-6 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full border border-indigo-200 mb-6">
          <Sparkles size={14} /> Browse Collections
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
          Browse by <span className="text-indigo-600">Category</span>
        </h1>
        <p className="text-base text-slate-500 max-w-lg mx-auto leading-relaxed">
          From Finance to HR to Marketing — every spreadsheet system you need, all in one place.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-6">
          {categories.length} {categories.length === 1 ? "Category" : "Categories"} Available
        </div>

        {categories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((cat, i) => {
              const p = PALETTE[i % PALETTE.length];
              const count = templates.filter((t) => {
                const id = typeof t.category === "object" ? t.category?._id : t.category;
                return id === cat._id;
              }).length;

              return (
                <div
                  key={cat._id}
                  onClick={() => onNavigate("category", { name: cat.name })}
                  className="group bg-white border border-slate-200 rounded-2xl p-6 cursor-pointer flex flex-col gap-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${p.bg} ${p.icon} transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3`}>
                    {getCategoryIcon(cat.name)}
                  </div>
                  <div className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {cat.name}
                  </div>
                  <div className={`text-xs font-bold px-3 py-1 rounded-full w-fit border ${count === 0 ? "bg-slate-50 text-slate-400 border-slate-200" : `${p.bg} ${p.icon} ${p.border}`}`}>
                    {count} {count === 1 ? "Template" : "Templates"}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                    <span className="text-xs font-semibold text-slate-400 group-hover:text-indigo-600 transition-colors">View all</span>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-slate-50 text-slate-400 transition-all duration-300 ${p.hoverIconBg} group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1`}>
                      <ArrowUpRight size={16} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
            <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-300">
              <FileSpreadsheet size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Categories Yet</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto">Add categories from the admin dashboard and they'll appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;