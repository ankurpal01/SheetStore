import { Download, Link as LinkIcon } from "lucide-react";

export default function TemplateCard({ template, onNavigate, onBuy }) {
  // 👇 YAHAN SMART IMAGE LOGIC ADD KIYA HAI 👇
  const imageUrl = template.image 
    ? (template.image.startsWith("http") 
        ? template.image // Agar naya Cloudinary link hai, toh wahi dikhao
        : `${import.meta.env.VITE_API_URL}/uploads/${template.image}`) // Agar purani image hai, toh backend ka URL jodo
    : "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop"; // Default image

  const categoryName = typeof template.category === 'object' ? template.category?.name : template.category;

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden relative">

      {/* ================= IMAGE SECTION ================= */}
      <div className="relative h-48 bg-slate-100 border-b border-slate-100">
        <img
          src={imageUrl}
          alt={template.title}
          className="w-full h-full object-cover object-top"
        />

        {/* 🔥 PRODUCT TYPE BADGE */}
        {template.productType === 'google_sheet' ? (
           <div className="absolute top-3 left-3 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded shadow-sm flex items-center gap-1">
             <LinkIcon className="w-3 h-3" /> Sheet
           </div>
        ) : (
           <div className="absolute top-3 left-3 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded shadow-sm flex items-center gap-1">
             <Download className="w-3 h-3" /> Excel
           </div>
        )}

        <div className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full text-sm font-bold text-slate-800 shadow">
          ₹{template.price}
        </div>
      </div>

      {/* ================= CONTENT SECTION ================= */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider mb-2">
          {categoryName || "TEMPLATE"}
        </div>

        <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-1">
          {template.title}
        </h3>

        <p className="text-sm text-slate-500 mb-6 flex-grow line-clamp-2 leading-relaxed">
          {template.description}
        </p>

        <div className="flex gap-3 mt-auto">
          <button
            onClick={() => onNavigate("template", { id: template._id })}
            className="flex-1 py-2.5 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            Details
          </button>

          <button
            onClick={() => onBuy(template)}
            className="flex-1 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}