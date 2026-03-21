import { Download, Link as LinkIcon, Star, ShoppingCart, Eye } from "lucide-react";

export default function TemplateCard({ template, onNavigate, onBuy }) {
  const imageUrl = template.image
    ? (template.image.startsWith("http")
        ? template.image
        : `${import.meta.env.VITE_API_URL}/uploads/${template.image}`)
    : "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop";

  const categoryName = typeof template.category === "object"
    ? template.category?.name
    : template.category;

  const isSheet = template.productType === "google_sheet";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap');

        .tc-card {
          position: relative;
          display: flex;
          flex-direction: column;
          height: 100%;
          background: #ffffff;
          border-radius: 20px;
          border: 1px solid #eef0f6;
          overflow: hidden;
          font-family: 'DM Sans', sans-serif;
          transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
                      box-shadow 0.35s ease,
                      border-color 0.3s ease;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          cursor: pointer;
        }

        .tc-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 60px rgba(99, 102, 241, 0.15), 0 6px 20px rgba(0,0,0,0.08);
          border-color: rgba(99, 102, 241, 0.25);
        }

        /* ── IMAGE ZONE ── */
        .tc-image-wrap {
          position: relative;
          height: 200px;
          overflow: hidden;
          background: #f1f2f8;
        }

        .tc-image-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top;
          transition: transform 0.55s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .tc-card:hover .tc-image-wrap img {
          transform: scale(1.06);
        }

        /* Overlay on hover */
        .tc-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(15,15,40,0.65) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.3s ease;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding-bottom: 16px;
        }

        .tc-card:hover .tc-overlay {
          opacity: 1;
        }

        .tc-preview-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,0.15);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.3);
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.8rem;
          font-weight: 600;
          padding: 8px 18px;
          border-radius: 50px;
          cursor: pointer;
          transform: translateY(8px);
          opacity: 0;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) 0.05s;
          letter-spacing: 0.02em;
        }

        .tc-card:hover .tc-preview-btn {
          transform: translateY(0);
          opacity: 1;
        }

        .tc-preview-btn:hover {
          background: rgba(255,255,255,0.25);
        }

        /* Type badge */
        .tc-type-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          display: flex;
          align-items: center;
          gap: 5px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 5px 10px;
          border-radius: 8px;
          z-index: 2;
          backdrop-filter: blur(8px);
        }

        .tc-type-badge.sheet {
          background: rgba(16, 185, 129, 0.15);
          color: #059669;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .tc-type-badge.excel {
          background: rgba(99, 102, 241, 0.12);
          color: #6366f1;
          border: 1px solid rgba(99, 102, 241, 0.25);
        }

        /* Price badge */
        .tc-price {
          position: absolute;
          top: 12px;
          right: 12px;
          background: #fff;
          color: #0f172a;
          font-family: 'Syne', sans-serif;
          font-size: 0.95rem;
          font-weight: 800;
          padding: 5px 12px;
          border-radius: 10px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.12);
          z-index: 2;
          letter-spacing: -0.02em;
        }

        /* ── CONTENT ZONE ── */
        .tc-body {
          padding: 20px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .tc-category {
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #6366f1;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .tc-category::before {
          content: '';
          display: inline-block;
          width: 18px;
          height: 2px;
          background: linear-gradient(90deg, #6366f1, #a78bfa);
          border-radius: 2px;
        }

        .tc-title {
          font-family: 'Syne', sans-serif;
          font-size: 1.05rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 8px;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
          letter-spacing: -0.01em;
        }

        .tc-desc {
          font-size: 0.845rem;
          color: #64748b;
          line-height: 1.6;
          flex-grow: 1;
          margin-bottom: 18px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Rating stars (static decoration) */
        .tc-meta {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-bottom: 16px;
        }

        .tc-stars {
          display: flex;
          gap: 2px;
        }

        .tc-star {
          color: #f59e0b;
          width: 13px;
          height: 13px;
          fill: #f59e0b;
        }

        .tc-rating-text {
          font-size: 0.75rem;
          font-weight: 600;
          color: #94a3b8;
          margin-left: 4px;
        }

        /* ── BUTTONS ── */
        .tc-actions {
          display: flex;
          gap: 10px;
          margin-top: auto;
        }

        .tc-btn-details {
          flex: 1;
          padding: 11px 0;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          background: transparent;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem;
          font-weight: 600;
          color: #475569;
          cursor: pointer;
          transition: all 0.25s ease;
          letter-spacing: 0.01em;
        }

        .tc-btn-details:hover {
          background: #f8faff;
          border-color: #c7d2fe;
          color: #4338ca;
        }

        .tc-btn-buy {
          flex: 1.4;
          padding: 11px 0;
          border: none;
          border-radius: 12px;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem;
          font-weight: 700;
          color: #fff;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          letter-spacing: 0.01em;
        }

        .tc-btn-buy::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #818cf8, #a78bfa);
          opacity: 0;
          transition: opacity 0.3s;
        }

        .tc-btn-buy:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(99, 102, 241, 0.45);
        }

        .tc-btn-buy:hover::before { opacity: 1; }
        .tc-btn-buy > * { position: relative; z-index: 1; }

        .tc-btn-buy:active { transform: scale(0.97); }

        /* Corner accent */
        .tc-corner-accent {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 80px;
          height: 80px;
          background: radial-gradient(circle at bottom right, rgba(99,102,241,0.06), transparent 70%);
          pointer-events: none;
        }
      `}</style>

      <div className="tc-card">

        {/* ── IMAGE ── */}
        <div className="tc-image-wrap">
          <img src={imageUrl} alt={template.title} />

          <div className="tc-overlay">
            <button
              className="tc-preview-btn"
              onClick={() => onNavigate("template", { id: template._id })}
            >
              <Eye size={13} /> Quick View
            </button>
          </div>

          {/* Type badge */}
          <div className={`tc-type-badge ${isSheet ? "sheet" : "excel"}`}>
            {isSheet
              ? <><LinkIcon size={10} /> Sheet</>
              : <><Download size={10} /> Excel</>
            }
          </div>

          {/* Price */}
          <div className="tc-price">₹{template.price}</div>
        </div>

        {/* ── BODY ── */}
        <div className="tc-body">

          <div className="tc-category">{categoryName || "Template"}</div>

          <h3 className="tc-title">{template.title}</h3>

          <p className="tc-desc">{template.description}</p>

          {/* Static stars decoration */}
          <div className="tc-meta">
            <div className="tc-stars">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="tc-star" size={13} />
              ))}
            </div>
            <span className="tc-rating-text">5.0 · Premium</span>
          </div>

          {/* Actions */}
          <div className="tc-actions">
            <button
              className="tc-btn-details"
              onClick={() => onNavigate("template", { id: template._id })}
            >
              Details
            </button>

            <button
              className="tc-btn-buy"
              onClick={() => onBuy(template)}
            >
              <ShoppingCart size={14} />
              Buy Now
            </button>
          </div>
        </div>

        <div className="tc-corner-accent" />
      </div>
    </>
  );
}