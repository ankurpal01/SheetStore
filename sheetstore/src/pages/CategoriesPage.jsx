import { useState, useEffect } from "react";
import {
  LayoutGrid, Calculator, Users, Briefcase,
  TrendingUp, FolderKanban, FileSpreadsheet, ArrowRight, Sparkles
} from "lucide-react";

const getCategoryIcon = (categoryName) => {
  const name = categoryName.toLowerCase();
  if (name.includes("finance") || name.includes("accounting")) return <Calculator />;
  if (name.includes("hr") || name.includes("human")) return <Users />;
  if (name.includes("marketing") || name.includes("sales")) return <TrendingUp />;
  if (name.includes("project") || name.includes("management")) return <FolderKanban />;
  if (name.includes("business")) return <Briefcase />;
  return <LayoutGrid />;
};

// Each category gets a unique color pair
const PALETTE = [
  { bg: "rgba(99,102,241,0.08)",  icon: "#6366f1", accent: "#6366f1", glow: "rgba(99,102,241,0.18)" },
  { bg: "rgba(16,185,129,0.08)",  icon: "#10b981", accent: "#10b981", glow: "rgba(16,185,129,0.18)" },
  { bg: "rgba(245,158,11,0.08)",  icon: "#f59e0b", accent: "#f59e0b", glow: "rgba(245,158,11,0.18)" },
  { bg: "rgba(236,72,153,0.08)",  icon: "#ec4899", accent: "#ec4899", glow: "rgba(236,72,153,0.18)" },
  { bg: "rgba(59,130,246,0.08)",  icon: "#3b82f6", accent: "#3b82f6", glow: "rgba(59,130,246,0.18)" },
  { bg: "rgba(139,92,246,0.08)",  icon: "#8b5cf6", accent: "#8b5cf6", glow: "rgba(139,92,246,0.18)" },
  { bg: "rgba(20,184,166,0.08)",  icon: "#14b8a6", accent: "#14b8a6", glow: "rgba(20,184,166,0.18)" },
  { bg: "rgba(249,115,22,0.08)",  icon: "#f97316", accent: "#f97316", glow: "rgba(249,115,22,0.18)" },
];

const CategoriesPage = ({ onNavigate }) => {
  const [categories, setCategories] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDatabaseData = async () => {
      try {
        const [catRes, tempRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/categories`),
          fetch(`${import.meta.env.VITE_API_URL}/templates`),
        ]);
        if (!catRes.ok || !tempRes.ok) throw new Error("Failed to fetch");
        setCategories(await catRes.json());
        setTemplates(await tempRes.json());
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDatabaseData();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');

        .cp-root {
          min-height: 100vh;
          background: #f7f8fc;
          font-family: 'DM Sans', sans-serif;
        }

        /* ── LOADING ── */
        .cp-loader {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #f7f8fc;
          gap: 16px;
        }

        .cp-spinner {
          width: 52px;
          height: 52px;
          border: 3px solid #e0e7ff;
          border-top-color: #6366f1;
          border-radius: 50%;
          animation: cp-spin 0.8s linear infinite;
        }

        @keyframes cp-spin { to { transform: rotate(360deg); } }

        .cp-loader-text {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          font-weight: 600;
          color: #94a3b8;
          letter-spacing: 0.04em;
        }

        /* ── HERO ── */
        .cp-hero {
          position: relative;
          overflow: hidden;
          padding: 88px 24px 72px;
          text-align: center;
          background: #fff;
          border-bottom: 1px solid #eef0f6;
        }

        /* Dot grid bg */
        .cp-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, #c7d2fe 1px, transparent 1px);
          background-size: 28px 28px;
          opacity: 0.35;
          pointer-events: none;
        }

        /* Bottom fade */
        .cp-hero::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 80px;
          background: linear-gradient(to top, #fff, transparent);
          pointer-events: none;
        }

        .cp-hero-inner {
          position: relative;
          z-index: 1;
          max-width: 680px;
          margin: 0 auto;
        }

        .cp-hero-chip {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: #eef2ff;
          color: #6366f1;
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 7px 16px;
          border-radius: 50px;
          border: 1px solid #c7d2fe;
          margin-bottom: 24px;
        }

        .cp-hero-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(2rem, 5vw, 3.25rem);
          font-weight: 800;
          color: #0f172a;
          line-height: 1.1;
          letter-spacing: -0.03em;
          margin-bottom: 20px;
        }

        .cp-hero-title em {
          font-style: normal;
          background: linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .cp-hero-sub {
          font-size: 1rem;
          color: #64748b;
          line-height: 1.7;
          max-width: 520px;
          margin: 0 auto;
        }

        /* ── GRID ── */
        .cp-section {
          max-width: 1280px;
          margin: 0 auto;
          padding: 64px 24px 80px;
        }

        .cp-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 24px;
        }

        /* ── CATEGORY CARD ── */
        .cp-card {
          position: relative;
          background: #fff;
          border-radius: 20px;
          border: 1.5px solid #eef0f6;
          padding: 32px 28px 28px;
          cursor: pointer;
          overflow: hidden;
          transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
                      box-shadow 0.35s ease,
                      border-color 0.3s ease;
          box-shadow: 0 2px 12px rgba(0,0,0,0.04);
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .cp-card:hover {
          transform: translateY(-7px);
          box-shadow: 0 20px 50px var(--card-glow), 0 4px 16px rgba(0,0,0,0.06);
          border-color: var(--card-accent);
        }

        /* Background blob */
        .cp-card-blob {
          position: absolute;
          top: -30px;
          right: -30px;
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: var(--card-bg);
          filter: blur(20px);
          transition: transform 0.4s ease;
          pointer-events: none;
        }

        .cp-card:hover .cp-card-blob {
          transform: scale(1.5);
        }

        /* Icon box */
        .cp-icon-box {
          width: 60px;
          height: 60px;
          border-radius: 16px;
          background: var(--card-bg);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--card-accent);
          margin-bottom: 20px;
          transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
                      box-shadow 0.3s ease;
          position: relative;
          z-index: 1;
        }

        .cp-card:hover .cp-icon-box {
          transform: scale(1.1) rotate(-4deg);
          box-shadow: 0 8px 24px var(--card-glow);
        }

        .cp-icon-box svg {
          width: 26px;
          height: 26px;
        }

        .cp-card-name {
          font-family: 'Syne', sans-serif;
          font-size: 1.1rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 10px;
          position: relative;
          z-index: 1;
          transition: color 0.25s;
          letter-spacing: -0.01em;
        }

        .cp-card:hover .cp-card-name {
          color: var(--card-accent);
        }

        .cp-card-count {
          display: inline-flex;
          align-items: center;
          font-size: 0.78rem;
          font-weight: 700;
          padding: 5px 12px;
          border-radius: 20px;
          background: var(--card-bg);
          color: var(--card-accent);
          border: 1px solid color-mix(in srgb, var(--card-accent) 20%, transparent);
          margin-bottom: 20px;
          position: relative;
          z-index: 1;
          width: fit-content;
        }

        .cp-card-count.empty {
          background: #f1f5f9;
          color: #94a3b8;
          border-color: #e2e8f0;
        }

        /* Arrow row */
        .cp-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
          padding-top: 16px;
          border-top: 1px solid #f1f5f9;
          position: relative;
          z-index: 1;
        }

        .cp-card-cta {
          font-size: 0.8rem;
          font-weight: 700;
          color: #94a3b8;
          letter-spacing: 0.02em;
          transition: color 0.25s;
        }

        .cp-card:hover .cp-card-cta {
          color: var(--card-accent);
        }

        .cp-card-arrow {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: #f8faff;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #94a3b8;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .cp-card:hover .cp-card-arrow {
          background: var(--card-accent);
          color: #fff;
          transform: translateX(3px);
        }

        /* ── EMPTY STATE ── */
        .cp-empty {
          text-align: center;
          padding: 80px 24px;
          background: #fff;
          border-radius: 24px;
          border: 1.5px dashed #e2e8f0;
        }

        .cp-empty-icon {
          width: 80px;
          height: 80px;
          background: #f8faff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
          color: #c7d2fe;
          border: 2px solid #eef2ff;
        }

        .cp-empty h3 {
          font-family: 'Syne', sans-serif;
          font-size: 1.4rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 10px;
        }

        .cp-empty p {
          font-size: 0.9rem;
          color: #94a3b8;
          max-width: 380px;
          margin: 0 auto;
          line-height: 1.6;
        }

        /* Stagger animation */
        .cp-card {
          animation: cp-fadeup 0.5s ease both;
        }

        @keyframes cp-fadeup {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {loading ? (
        <div className="cp-loader">
          <div className="cp-spinner" />
          <span className="cp-loader-text">Loading Collections…</span>
        </div>
      ) : (
        <div className="cp-root">

          {/* ── HERO ── */}
          <div className="cp-hero">
            <div className="cp-hero-inner">
              <div className="cp-hero-chip">
                <Sparkles size={12} /> Browse Collections
              </div>
              <h1 className="cp-hero-title">
                Find Your Perfect<br /><em>Template Category</em>
              </h1>
              <p className="cp-hero-sub">
                From Finance to HR to Marketing — every spreadsheet system you need to run your business better, all in one place.
              </p>
            </div>
          </div>

          {/* ── GRID ── */}
          <div className="cp-section">
            {categories.length > 0 ? (
              <div className="cp-grid">
                {categories.map((cat, i) => {
                  const palette = PALETTE[i % PALETTE.length];
                  const count = templates.filter((t) => {
                    const id = typeof t.category === "object" ? t.category?._id : t.category;
                    return id === cat._id;
                  }).length;

                  return (
                    <div
                      key={cat._id}
                      className="cp-card"
                      style={{
                        "--card-bg": palette.bg,
                        "--card-accent": palette.accent,
                        "--card-glow": palette.glow,
                        animationDelay: `${i * 60}ms`,
                      }}
                      onClick={() => onNavigate("category", { name: cat.name })}
                    >
                      <div className="cp-card-blob" />

                      <div className="cp-icon-box">
                        {getCategoryIcon(cat.name)}
                      </div>

                      <div className="cp-card-name">{cat.name}</div>

                      <div className={`cp-card-count ${count === 0 ? "empty" : ""}`}>
                        {count} {count === 1 ? "Template" : "Templates"}
                      </div>

                      <div className="cp-card-footer">
                        <span className="cp-card-cta">Explore all</span>
                        <div className="cp-card-arrow">
                          <ArrowRight size={14} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="cp-empty">
                <div className="cp-empty-icon">
                  <FileSpreadsheet size={32} />
                </div>
                <h3>No Categories Yet</h3>
                <p>Head over to the admin dashboard to create your first collection and it'll show up right here.</p>
              </div>
            )}
          </div>

        </div>
      )}
    </>
  );
};

export default CategoriesPage;