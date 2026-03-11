import { useState, useEffect } from "react";
import {
  LayoutGrid,
  Calculator,
  Users,
  Briefcase,
  TrendingUp,
  FolderOpen,
  FolderKanban,
  FileSpreadsheet
} from "lucide-react";

// Helper function to map category names to nice icons
const getCategoryIcon = (categoryName) => {
  const name = categoryName.toLowerCase();
  if (name.includes("finance") || name.includes("accounting")) return <Calculator className="w-8 h-8" />;
  if (name.includes("hr") || name.includes("human")) return <Users className="w-8 h-8" />;
  if (name.includes("marketing") || name.includes("sales")) return <TrendingUp className="w-8 h-8" />;
  if (name.includes("project") || name.includes("management")) return <FolderKanban className="w-8 h-8" />;
  if (name.includes("business")) return <Briefcase className="w-8 h-8" />;
  return <LayoutGrid className="w-8 h-8" />; // Default icon
};

const CategoriesPage = ({ onNavigate }) => {
  const [categories, setCategories] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDatabaseData = async () => {
      try {
        // 👇 YAHAN DONO JAGAH CHANGE KIYA HAI 👇
        const [catRes, tempRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/categories`),
          fetch(`${import.meta.env.VITE_API_URL}/templates`)
        ]);

        if (!catRes.ok || !tempRes.ok) throw new Error("Failed to fetch");

        const catData = await catRes.json();
        const tempData = await tempRes.json();

        setCategories(catData);
        setTemplates(tempData);
      } catch (error) {
        console.error("Error loading page data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDatabaseData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
        <p className="text-xl text-slate-500 font-semibold animate-pulse">Loading Collections...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-200">
      
      {/* ================= HEADER SECTION ================= */}
      <div className="bg-white border-b border-slate-200 pt-20 pb-16 relative overflow-hidden">
        {/* Subtle grid background for header */}
         <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
            backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
        }}></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-50 rounded-2xl mb-6 shadow-sm border border-indigo-100">
             <FolderOpen className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Browse by <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">Category</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Find the exact spreadsheet system you need to streamline your workflow. Whether it's Finance, HR, or Marketing, we have a template for you.
          </p>
        </div>
      </div>

      {/* ================= GRID SECTION ================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        
        {categories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {categories.map((cat) => {
              // Calculate template count
              const count = templates.filter((t) => {
                const templateCategoryId = typeof t.category === "object" ? t.category?._id : t.category;
                return templateCategoryId === cat._id;
              }).length;

              return (
                <div
                  key={cat._id}
                  onClick={() => onNavigate("category", { name: cat.name })}
                  className="group relative bg-white rounded-2xl shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-300 cursor-pointer overflow-hidden border border-slate-200 hover:border-transparent"
                >
                  {/* Hover Gradient Border Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ padding: '2px' }}>
                    <div className="w-full h-full bg-white rounded-2xl"></div>
                  </div>

                  <div className="relative p-8 flex flex-col items-center text-center">
                    
                    {/* Dynamic Icon */}
                    <div className="w-20 h-20 bg-slate-50 group-hover:bg-indigo-50 rounded-full flex items-center justify-center mb-6 transition-colors shadow-inner border border-slate-100 group-hover:border-indigo-100 text-slate-400 group-hover:text-indigo-600">
                      {getCategoryIcon(cat.name)}
                    </div>

                    <h3 className="text-xl font-extrabold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                      {cat.name}
                    </h3>

                    {/* Dynamic Template Count Badge */}
                    <span className={`px-3 py-1 rounded-full text-sm font-bold mt-2 ${
                      count > 0 
                      ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                      : "bg-slate-100 text-slate-500 border border-slate-200"
                    }`}>
                      {count} {count === 1 ? "Template" : "Templates"}
                    </span>
                    
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* ================= EMPTY STATE ================= */
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-3xl border border-slate-200 shadow-sm">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 border-4 border-white shadow-md">
              <FileSpreadsheet className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">No Categories Found</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-8">
              It looks like you haven't added any categories yet. Head over to the admin dashboard to create your first collection.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default CategoriesPage;