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
  { icon: "#6366f1", bg: "#eef2ff", border: "#c7d2fe" },
  { icon: "#10b981", bg: "#ecfdf5", border: "#a7f3d0" },
  { icon: "#f59e0b", bg: "#fffbeb", border: "#fde68a" },
  { icon: "#ec4899", bg: "#fdf2f8", border: "#fbcfe8" },
  { icon: "#3b82f6", bg: "#eff6ff", border: "#bfdbfe" },
  { icon: "#8b5cf6", bg: "#f5f3ff", border: "#ddd6fe" },
  { icon: "#14b8a6", bg: "#f0fdfa", border: "#99f6e4" },
  { icon: "#f97316", bg: "#fff7ed", border: "#fed7aa" },
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

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');

        .cp-root {
          min-height: 100vh;
          background: #f8f9fc;
          font-family: 'DM Sans', sans-serif;
        }

        .cp-loader {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #f8f9fc;
          gap: 14px;
        }
        .cp-spinner {
          width: 44px; height: 44px;
          border: 3px solid #e0e7ff;
          border-top-color: #6366f1;
          border-radius: 50%;
          animation: spin 0.75s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .cp-loader p {
          font-size: 0.875rem;
          font-weight: 600;
          color: #94a3b8;
          letter-spacing: 0.04em;
        }

        .cp-hero {
          background: #fff;
          border-bottom: 1px solid #e9ecf3;
          padding: 52px 24px 44px;
          text-align: center;
        }
        .cp-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #eef2ff;
          color: #6366f1;
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 6px 14px;
          border-radius: 50px;
          border: 1px solid #c7d2fe;
          margin-bottom: 18px;
        }
        .cp-hero h1 {
          font-family: 'Syne', sans-serif;
          font-size: clamp(1.6rem, 3.5vw, 2.4rem);
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.03em;
          line-height: 1.2;
          margin-bottom: 12px;
        }
        .cp-hero h1 em {
          font-style: normal;
          color: #6366f1;
        }
        .cp-hero p {
          font-size: 0.9rem;
          color: #64748b;
          line-height: 1.7;
          max-width: 440px;
          margin: 0 auto;
        }

        .cp-section {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 24px 64px;
        }
        .cp-section-label {
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #94a3b8;
          margin-bottom: 20px;
        }

        .cp-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
          gap: 18px;
        }

        .cp-card {
          background: #fff;
          border: 1.5px solid #e9ecf3;
          border-radius: 16px;
          padding: 26px 22px 20px;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          gap: 11px;
          transition: transform 0.28s cubic-bezier(0.34,1.56,0.64,1),
                      box-shadow 0.28s ease,
                      border-color 0.22s ease;
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
          animation: fadeup 0.4s ease both;
        }
        @keyframes fadeup {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .cp-card:hover {
          transform: translateY(-5px);
          border-color: var(--c-border);
          box-shadow: 0 10px 32px rgba(0,0,0,0.08);
        }

        .cp-icon {
          width: 46px; height: 46px;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          background: var(--c-bg);
          color: var(--c-icon);
          transition: transform 0.28s cubic-bezier(0.34,1.56,0.64,1);
        }
        .cp-card:hover .cp-icon {
          transform: scale(1.1) rotate(-5deg);
        }

        .cp-card-name {
          font-family: 'Syne', sans-serif;
          font-size: 0.975rem;
          font-weight: 700;
          color: #0f172a;
          letter-spacing: -0.01em;
          line-height: 1.3;
          transition: color 0.2s;
        }
        .cp-card:hover .cp-card-name { color: var(--c-icon); }

        .cp-badge {
          display: inline-flex;
          align-items: center;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 20px;
          width: fit-content;
          background: var(--c-bg);
          color: var(--c-icon);
          border: 1px solid var(--c-border);
        }
        .cp-badge.empty {
          background: #f1f5f9;
          color: #94a3b8;
          border-color: #e2e8f0;
        }

        .cp-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 11px;
          border-top: 1px solid #f1f5f9;
          margin-top: auto;
        }
        .cp-card-link {
          font-size: 0.76rem;
          font-weight: 600;
          color: #94a3b8;
          transition: color 0.2s;
        }
        .cp-card:hover .cp-card-link { color: var(--c-icon); }

        .cp-arrow {
          display: flex; align-items: center; justify-content: center;
          width: 26px; height: 26px;
          border-radius: 50%;
          background: #f1f5f9;
          color: #94a3b8;
          transition: all 0.28s cubic-bezier(0.34,1.56,0.64,1);
        }
        .cp-card:hover .cp-arrow {
          background: var(--c-icon);
          color: #fff;
          transform: translate(2px, -2px);
        }

        .cp-empty {
          text-align: center;
          padding: 60px 24px;
          background: #fff;
          border-radius: 18px;
          border: 1.5px dashed #e2e8f0;
        }
        .cp-empty-icon {
          width: 60px; height: 60px;
          background: #f8faff;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 18px;
          color: #c7d2fe;
        }
        .cp-empty h3 {
          font-family: 'Syne', sans-serif;
          font-size: 1.2rem; font-weight: 700;
          color: #0f172a; margin-bottom: 8px;
        }
        .cp-empty p {
          font-size: 0.85rem; color: #94a3b8;
          max-width: 320px; margin: 0 auto; line-height: 1.6;
        }
      `}</style>

      {loading ? (
        <div className="cp-loader">
          <div className="cp-spinner" />
          <p>Loading collections…</p>
        </div>
      ) : (
        <div className="cp-root">
          <div className="cp-hero">
            <div className="cp-chip"><Sparkles size={11} /> Browse Collections</div>
            <h1>Browse by <em>Category</em></h1>
            <p>From Finance to HR to Marketing — every spreadsheet system you need, all in one place.</p>
          </div>

          <div className="cp-section">
            <div className="cp-section-label">
              {categories.length} {categories.length === 1 ? "Category" : "Categories"} Available
            </div>

            {categories.length > 0 ? (
              <div className="cp-grid">
                {categories.map((cat, i) => {
                  const p = PALETTE[i % PALETTE.length];
                  const count = templates.filter((t) => {
                    const id = typeof t.category === "object" ? t.category?._id : t.category;
                    return id === cat._id;
                  }).length;

                  return (
                    <div
                      key={cat._id}
                      className="cp-card"
                      style={{
                        "--c-icon": p.icon,
                        "--c-bg": p.bg,
                        "--c-border": p.border,
                        animationDelay: `${i * 50}ms`,
                      }}
                      onClick={() => onNavigate("category", { name: cat.name })}
                    >
                      <div className="cp-icon">{getCategoryIcon(cat.name)}</div>
                      <div className="cp-card-name">{cat.name}</div>
                      <div className={`cp-badge${count === 0 ? " empty" : ""}`}>
                        {count} {count === 1 ? "Template" : "Templates"}
                      </div>
                      <div className="cp-card-footer">
                        <span className="cp-card-link">View all</span>
                        <div className="cp-arrow"><ArrowUpRight size={13} /></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="cp-empty">
                <div className="cp-empty-icon"><FileSpreadsheet size={26} /></div>
                <h3>No Categories Yet</h3>
                <p>Add categories from the admin dashboard and they'll appear here.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CategoriesPage;