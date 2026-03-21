import { useState, useEffect } from "react";
import {
  Calculator, Percent, Activity, TrendingUp,
  Globe, Scale, ArrowRight, Sparkles,
  FileSpreadsheet, RotateCcw, PiggyBank, Receipt
} from "lucide-react";

export default function FreeToolsPage({ onNavigate }) {
  const [activeTool, setActiveTool] = useState("emi");

  const tools = [
    {
      id: "emi", name: "EMI Calculator", icon: Calculator, desc: "Home & car loan EMIs",
      seoTitle: "Free EMI Calculator Online | Home & Car Loan - SheetStore",
      seoDesc: "Calculate your monthly EMI for home, car, or personal loans instantly. Fast, accurate, and completely free online EMI calculator."
    },
    {
      id: "sip", name: "SIP Calculator", icon: TrendingUp, desc: "Mutual fund returns",
      seoTitle: "Online SIP Calculator | Mutual Fund Returns - SheetStore",
      seoDesc: "Calculate your expected mutual fund returns with our free SIP calculator. Plan your investment and wealth creation journey today."
    },
    {
      id: "gst", name: "GST Calculator", icon: Percent, desc: "Add/Remove GST",
      seoTitle: "Free GST Calculator Online | Add or Remove GST - SheetStore",
      seoDesc: "Easily add or remove GST from your product prices. Free online GST calculator for Indian businesses and freelancers."
    },
    {
      id: "fd", name: "FD Calculator", icon: PiggyBank, desc: "Fixed deposit returns",
      seoTitle: "Free FD Calculator Online | Fixed Deposit Maturity - SheetStore",
      seoDesc: "Calculate your Fixed Deposit maturity amount and interest earned. Free online FD calculator for all Indian banks."
    },
    {
      id: "invoice", name: "Invoice Generator", icon: Receipt, desc: "Quick GST invoice",
      seoTitle: "Free Invoice Generator Online | GST Invoice - SheetStore",
      seoDesc: "Generate professional GST invoices instantly for free. Add items, apply GST, and get a ready-to-print invoice in seconds."
    },
    {
      id: "currency", name: "Currency Converter", icon: Globe, desc: "Live exchange rates",
      seoTitle: "Live Currency Converter | Real-time Exchange Rates - SheetStore",
      seoDesc: "Convert USD to INR, EUR to USD, and more with live exchange rates. Free online currency converter tool."
    },
    {
      id: "unit", name: "Unit Converter", icon: Scale, desc: "Area, weight, length",
      seoTitle: "Free Unit Converter Online | Length, Weight, Area - SheetStore",
      seoDesc: "Convert kilograms to pounds, meters to feet, or square feet to acres instantly. Free online unit converter tool."
    },
    {
      id: "bmi", name: "BMI Calculator", icon: Activity, desc: "Body Mass Index",
      seoTitle: "BMI Calculator Online | Check Your Body Mass Index - SheetStore",
      seoDesc: "Calculate your Body Mass Index (BMI) for free. Check if your weight is in the healthy range with our online health tool."
    },
  ];

  useEffect(() => {
    const t = tools.find(t => t.id === activeTool);
    if (!t) return;
    document.title = t.seoTitle;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement("meta"); meta.name = "description"; document.head.appendChild(meta); }
    meta.content = t.seoDesc;

    // OG tags
    const setOG = (prop, val) => {
      let el = document.querySelector(`meta[property="${prop}"]`);
      if (!el) { el = document.createElement("meta"); el.setAttribute("property", prop); document.head.appendChild(el); }
      el.content = val;
    };
    setOG("og:title", t.seoTitle);
    setOG("og:description", t.seoDesc);
    setOG("og:type", "website");

    // canonical
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.appendChild(canonical); }
    canonical.href = `${window.location.origin}/tools#${t.id}`;

    // JSON-LD schema
    let schema = document.getElementById("tool-schema");
    if (!schema) { schema = document.createElement("script"); schema.id = "tool-schema"; schema.type = "application/ld+json"; document.head.appendChild(schema); }
    schema.innerText = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": t.name,
      "operatingSystem": "All",
      "applicationCategory": "BusinessApplication",
      "description": t.seoDesc,
      "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
    });
    return () => { if (schema?.parentNode) schema.parentNode.removeChild(schema); };
  }, [activeTool]);

  // ── States ──
  const initEmi = { amount: "", rate: "", tenure: "" };
  const [emiData, setEmiData] = useState(initEmi);
  const [emiResult, setEmiResult] = useState(null);
  const calcEMI = () => {
    const p = +emiData.amount, r = +emiData.rate / 12 / 100, n = +emiData.tenure * 12;
    if (p && r && n) {
      const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      setEmiResult({ monthly: Math.round(emi), totalInterest: Math.round(emi * n - p), totalAmount: Math.round(emi * n) });
    }
  };

  const initSip = { amount: "", rate: "", tenure: "" };
  const [sipData, setSipData] = useState(initSip);
  const [sipResult, setSipResult] = useState(null);
  const calcSIP = () => {
    const P = +sipData.amount, i = +sipData.rate / 12 / 100, n = +sipData.tenure * 12;
    if (P && i && n) {
      const M = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
      setSipResult({ invested: Math.round(P * n), wealthGain: Math.round(M - P * n), total: Math.round(M) });
    }
  };

  const initGst = { amount: "", rate: "", type: "add" };
  const [gstData, setGstData] = useState(initGst);
  const [gstResult, setGstResult] = useState(null);
  const calcGST = () => {
    const amt = +gstData.amount, rate = +gstData.rate;
    if (amt && rate) {
      if (gstData.type === "add") {
        const gstAmt = (amt * rate) / 100;
        setGstResult({ net: amt, gst: gstAmt, total: amt + gstAmt });
      } else {
        const net = amt / (1 + rate / 100);
        setGstResult({ net, gst: amt - net, total: amt });
      }
    }
  };

  // FD Calculator
  const initFd = { amount: "", rate: "", tenure: "", type: "simple" };
  const [fdData, setFdData] = useState(initFd);
  const [fdResult, setFdResult] = useState(null);
  const calcFD = () => {
    const p = +fdData.amount, r = +fdData.rate / 100, t = +fdData.tenure;
    if (p && r && t) {
      if (fdData.type === "simple") {
        const interest = p * r * t;
        setFdResult({ maturity: Math.round(p + interest), interest: Math.round(interest), principal: p });
      } else {
        // compound quarterly
        const maturity = p * Math.pow(1 + r / 4, 4 * t);
        setFdResult({ maturity: Math.round(maturity), interest: Math.round(maturity - p), principal: p });
      }
    }
  };

  // Invoice Generator
  const initInv = { bizName: "", clientName: "", gstRate: "18", items: [{ desc: "", qty: 1, price: "" }] };
  const [invData, setInvData] = useState(initInv);
  const addInvItem = () => setInvData(d => ({ ...d, items: [...d.items, { desc: "", qty: 1, price: "" }] }));
  const removeInvItem = (i) => setInvData(d => ({ ...d, items: d.items.filter((_, idx) => idx !== i) }));
  const updateInvItem = (i, field, val) => setInvData(d => {
    const items = [...d.items]; items[i] = { ...items[i], [field]: val }; return { ...d, items };
  });
  const invSubtotal = invData.items.reduce((s, it) => s + (+it.qty || 0) * (+it.price || 0), 0);
  const invGst = invSubtotal * (+invData.gstRate / 100);
  const invTotal = invSubtotal + invGst;
  const printInvoice = () => {
    const w = window.open("", "_blank");
    w.document.write(`<html><head><title>Invoice</title><style>
      body{font-family:sans-serif;padding:40px;color:#1e293b}
      h2{color:#6366f1;margin-bottom:4px}
      .sub{color:#64748b;font-size:13px;margin-bottom:24px}
      table{width:100%;border-collapse:collapse;margin:20px 0}
      th{background:#f1f5f9;padding:10px 12px;text-align:left;font-size:13px}
      td{padding:10px 12px;border-bottom:1px solid #e2e8f0;font-size:13px}
      .total-row{font-weight:700;background:#f8faff}
      .gst-row{color:#6366f1}
      .footer{margin-top:40px;font-size:12px;color:#94a3b8;border-top:1px solid #e2e8f0;padding-top:16px}
    </style></head><body>
      <h2>${invData.bizName || "Your Business"}</h2>
      <div class="sub">Invoice for: <strong>${invData.clientName || "Client"}</strong> &nbsp;|&nbsp; Date: ${new Date().toLocaleDateString("en-IN")}</div>
      <table>
        <thead><tr><th>#</th><th>Description</th><th>Qty</th><th>Rate (₹)</th><th>Amount (₹)</th></tr></thead>
        <tbody>
          ${invData.items.map((it, i) => `<tr><td>${i + 1}</td><td>${it.desc || "-"}</td><td>${it.qty}</td><td>${it.price || 0}</td><td>${((+it.qty || 0) * (+it.price || 0)).toFixed(2)}</td></tr>`).join("")}
          <tr><td colspan="4" style="text-align:right;font-weight:600">Subtotal</td><td>₹${invSubtotal.toFixed(2)}</td></tr>
          <tr class="gst-row"><td colspan="4" style="text-align:right;font-weight:600">GST (${invData.gstRate}%)</td><td>₹${invGst.toFixed(2)}</td></tr>
          <tr class="total-row"><td colspan="4" style="text-align:right">Total</td><td>₹${invTotal.toFixed(2)}</td></tr>
        </tbody>
      </table>
      <div class="footer">Generated by SheetStore • sheetstore.in</div>
    </body></html>`);
    w.document.close(); w.print();
  };

  const [rates, setRates] = useState({});
  const initCurr = { amount: "", from: "USD", to: "INR" };
  const [currData, setCurrData] = useState(initCurr);
  const [currResult, setCurrResult] = useState(null);
  useEffect(() => {
    fetch("https://open.er-api.com/v6/latest/USD").then(r => r.json()).then(d => setRates(d.rates)).catch(() => {});
  }, []);
  const calcCurr = () => {
    const amt = +currData.amount;
    if (amt && rates[currData.from] && rates[currData.to])
      setCurrResult((amt / rates[currData.from] * rates[currData.to]).toFixed(2));
  };

  const unitFactors = {
    length: { m: 1, cm: 0.01, km: 1000, ft: 0.3048, inch: 0.0254 },
    weight: { kg: 1, g: 0.001, lb: 0.453592, oz: 0.0283495 },
    area: { "sq m": 1, "sq ft": 0.092903, acre: 4046.86, hectare: 10000 },
  };
  const initUnit = { category: "length", amount: "", from: "m", to: "ft" };
  const [unitData, setUnitData] = useState(initUnit);
  const [unitResult, setUnitResult] = useState(null);
  const calcUnit = () => {
    const amt = +unitData.amount, cat = unitFactors[unitData.category];
    if (amt && cat[unitData.from] && cat[unitData.to])
      setUnitResult((amt * cat[unitData.from] / cat[unitData.to]).toFixed(4));
  };

  const initBmi = { weight: "", height: "" };
  const [bmiData, setBmiData] = useState(initBmi);
  const [bmiResult, setBmiResult] = useState(null);
  const calcBMI = () => {
    const w = +bmiData.weight, h = +bmiData.height / 100;
    if (w > 0 && h > 0) {
      const bmi = (w / (h * h)).toFixed(1);
      let status = "Normal Weight", color = "#10b981";
      if (bmi < 18.5) { status = "Underweight"; color = "#f59e0b"; }
      else if (bmi > 24.9 && bmi <= 29.9) { status = "Overweight"; color = "#f97316"; }
      else if (bmi > 29.9) { status = "Obese"; color = "#ef4444"; }
      setBmiResult({ score: bmi, status, color });
    }
  };

  const resetAll = () => {
    setEmiResult(null); setSipResult(null); setGstResult(null);
    setFdResult(null); setCurrResult(null); setUnitResult(null); setBmiResult(null);
    setEmiData(initEmi); setSipData(initSip); setGstData(initGst);
    setFdData(initFd); setCurrData(initCurr); setUnitData(initUnit); setBmiData(initBmi);
    setInvData(initInv);
  };

  // ── Shared UI helpers ──
  const InputField = ({ label, value, onChange, placeholder, type = "number" }) => (
    <div>
      <label className="ft-label">{label}</label>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} className="ft-input" />
    </div>
  );

  const ResultCard = ({ children }) => (
    <div className="ft-result-card">{children}</div>
  );

  const ActionRow = ({ onReset, onCalc, calcLabel = "Calculate" }) => (
    <div className="ft-action-row">
      <button onClick={onReset} className="ft-btn-reset"><RotateCcw size={14} /> Reset</button>
      <button onClick={onCalc} className="ft-btn-calc">{calcLabel}</button>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');

        .ft-root { width: 100%; background: #f8f9fc; padding: 56px 16px 80px; font-family: 'DM Sans', sans-serif; }
        .ft-wrap { max-width: 1100px; margin: 0 auto; }

        /* HERO */
        .ft-hero { text-align: center; margin-bottom: 48px; }
        .ft-chip {
          display: inline-flex; align-items: center; gap: 6px;
          background: #eef2ff; color: #6366f1;
          font-size: 0.68rem; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase;
          padding: 6px 14px; border-radius: 50px; border: 1px solid #c7d2fe; margin-bottom: 16px;
        }
        .ft-hero h1 {
          font-family: 'Syne', sans-serif;
          font-size: clamp(1.75rem, 4vw, 2.6rem); font-weight: 800;
          color: #0f172a; letter-spacing: -0.03em; margin-bottom: 12px;
        }
        .ft-hero h1 em { font-style: normal; color: #6366f1; }
        .ft-hero p { font-size: 0.95rem; color: #64748b; max-width: 520px; margin: 0 auto; line-height: 1.7; }

        /* LAYOUT */
        .ft-layout { display: flex; flex-direction: column; gap: 24px; }
        @media(min-width: 768px) { .ft-layout { flex-direction: row; align-items: flex-start; } }

        /* SIDEBAR */
        .ft-sidebar { display: flex; flex-direction: column; gap: 8px; }
        @media(min-width: 768px) { .ft-sidebar { width: 240px; flex-shrink: 0; position: sticky; top: 88px; } }

        .ft-tab {
          display: flex; align-items: center; gap: 12px;
          padding: 12px 14px; border-radius: 14px; border: 1.5px solid transparent;
          background: transparent; cursor: pointer; text-align: left;
          transition: all 0.22s ease; font-family: 'DM Sans', sans-serif;
        }
        .ft-tab:hover { background: #fff; border-color: #e2e8f0; }
        .ft-tab.active { background: #fff; border-color: #c7d2fe; box-shadow: 0 4px 16px rgba(99,102,241,0.1); }

        .ft-tab-icon {
          width: 38px; height: 38px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          background: #f1f5f9; color: #94a3b8; flex-shrink: 0;
          transition: all 0.22s ease;
        }
        .ft-tab.active .ft-tab-icon { background: #eef2ff; color: #6366f1; }

        .ft-tab-label { font-size: 0.875rem; font-weight: 700; color: #475569; transition: color 0.2s; }
        .ft-tab.active .ft-tab-label { color: #3730a3; }
        .ft-tab-sub { font-size: 0.7rem; color: #94a3b8; font-weight: 500; }

        /* MAIN PANEL */
        .ft-main { flex: 1; min-width: 0; }

        .ft-panel {
          background: #fff; border-radius: 20px;
          border: 1.5px solid #e9ecf3;
          padding: 32px 28px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.04);
          margin-bottom: 16px;
        }

        .ft-panel-title {
          display: flex; align-items: center; gap: 10px;
          font-family: 'Syne', sans-serif; font-size: 1.2rem;
          font-weight: 700; color: #0f172a; margin-bottom: 24px;
        }
        .ft-panel-title svg { color: #6366f1; }

        .ft-grid { display: grid; gap: 24px; }
        @media(min-width: 580px) { .ft-grid { grid-template-columns: 1fr 1fr; } }

        /* Form elements */
        .ft-label { display: block; font-size: 0.8rem; font-weight: 700; color: #374151; margin-bottom: 7px; letter-spacing: 0.01em; }
        .ft-input {
          width: 100%; padding: 11px 14px;
          background: #f8faff; border: 1.5px solid #e2e8f0; border-radius: 11px;
          font-family: 'DM Sans', sans-serif; font-size: 0.9rem; font-weight: 500; color: #0f172a;
          outline: none; transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }
        .ft-input:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }

        .ft-action-row { display: flex; gap: 10px; padding-top: 8px; }
        .ft-btn-reset {
          display: flex; align-items: center; gap: 6px; justify-content: center;
          flex: 1; padding: 11px; background: #f1f5f9; border: none; border-radius: 11px;
          font-family: 'DM Sans', sans-serif; font-size: 0.85rem; font-weight: 700;
          color: #475569; cursor: pointer; transition: background 0.2s;
        }
        .ft-btn-reset:hover { background: #e2e8f0; }
        .ft-btn-calc {
          flex: 2; padding: 11px; background: #6366f1; border: none; border-radius: 11px;
          font-family: 'DM Sans', sans-serif; font-size: 0.875rem; font-weight: 700;
          color: #fff; cursor: pointer; transition: all 0.22s ease;
          box-shadow: 0 4px 14px rgba(99,102,241,0.3);
        }
        .ft-btn-calc:hover { background: #4f46e5; box-shadow: 0 6px 20px rgba(99,102,241,0.4); transform: translateY(-1px); }

        /* Result card */
        .ft-result-card {
          background: #0f172a; border-radius: 16px; padding: 24px 22px;
          color: #fff; display: flex; flex-direction: column; justify-content: center;
        }
        .ft-res-label { font-size: 0.75rem; font-weight: 600; color: #64748b; margin-bottom: 6px; letter-spacing: 0.05em; text-transform: uppercase; }
        .ft-res-value { font-family: 'Syne', sans-serif; font-size: 2.4rem; font-weight: 800; color: #34d399; margin-bottom: 18px; letter-spacing: -0.02em; }
        .ft-res-row { display: flex; justify-content: space-between; padding: 9px 0; border-bottom: 1px solid rgba(255,255,255,0.07); font-size: 0.82rem; }
        .ft-res-row:last-child { border-bottom: none; }
        .ft-res-row-label { color: #64748b; }
        .ft-res-row-val { font-weight: 700; }

        /* Toggle buttons */
        .ft-toggle-row { display: flex; gap: 8px; }
        .ft-toggle {
          flex: 1; padding: 10px; border-radius: 10px; border: 1.5px solid #e2e8f0;
          font-family: 'DM Sans', sans-serif; font-size: 0.82rem; font-weight: 700;
          background: #f8faff; color: #64748b; cursor: pointer; transition: all 0.2s;
        }
        .ft-toggle.on { background: #eef2ff; border-color: #6366f1; color: #4338ca; }

        /* SEO content */
        .ft-seo {
          background: #fff; border-radius: 16px; border: 1.5px solid #e9ecf3;
          padding: 24px 26px; margin-bottom: 16px;
        }
        .ft-seo h3 { font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 700; color: #0f172a; margin-bottom: 10px; }
        .ft-seo p { font-size: 0.85rem; color: #64748b; line-height: 1.7; margin-bottom: 8px; }
        .ft-seo strong { color: #374151; }

        /* Invoice specific */
        .ft-inv-item-row { display: grid; grid-template-columns: 1fr 60px 90px 32px; gap: 8px; align-items: center; margin-bottom: 8px; }
        .ft-inv-item-row input { width: 100%; padding: 9px 12px; background: #f8faff; border: 1.5px solid #e2e8f0; border-radius: 10px; font-family: 'DM Sans', sans-serif; font-size: 0.82rem; font-weight: 500; outline: none; transition: border-color 0.2s; box-sizing: border-box; }
        .ft-inv-item-row input:focus { border-color: #6366f1; }
        .ft-inv-remove { width: 30px; height: 30px; border: none; background: #fee2e2; color: #ef4444; border-radius: 8px; cursor: pointer; font-size: 1rem; display: flex; align-items: center; justify-content: center; }
        .ft-inv-add { font-size: 0.8rem; font-weight: 700; color: #6366f1; background: #eef2ff; border: none; padding: 8px 14px; border-radius: 8px; cursor: pointer; margin-bottom: 16px; }
        .ft-inv-summary { background: #f8faff; border-radius: 12px; padding: 16px 18px; border: 1px solid #e2e8f0; }
        .ft-inv-summary-row { display: flex; justify-content: space-between; font-size: 0.85rem; padding: 5px 0; color: #475569; }
        .ft-inv-summary-row.total { font-family: 'Syne', sans-serif; font-size: 1.05rem; font-weight: 800; color: #0f172a; border-top: 1px solid #e2e8f0; margin-top: 6px; padding-top: 10px; }
        .ft-print-btn {
          width: 100%; margin-top: 16px; padding: 13px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff;
          border: none; border-radius: 12px; font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem; font-weight: 700; cursor: pointer;
          box-shadow: 0 4px 16px rgba(99,102,241,0.3); transition: all 0.25s ease;
        }
        .ft-print-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(99,102,241,0.4); }

        /* Cross-sell banner */
        .ft-banner {
          background: #0f172a; border-radius: 20px; padding: 32px 28px;
          display: flex; flex-direction: column; gap: 20px;
          border: 1px solid #1e293b;
        }
        @media(min-width: 640px) { .ft-banner { flex-direction: row; align-items: center; justify-content: space-between; } }
        .ft-banner-icon { width: 56px; height: 56px; background: #6366f1; border-radius: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .ft-banner h4 { font-family: 'Syne', sans-serif; font-size: 1.15rem; font-weight: 800; color: #fff; margin-bottom: 4px; }
        .ft-banner p { font-size: 0.82rem; color: #64748b; max-width: 360px; line-height: 1.6; }
        .ft-banner-btn {
          display: flex; align-items: center; gap: 8px; white-space: nowrap;
          padding: 13px 22px; background: #6366f1; color: #fff; border: none; border-radius: 12px;
          font-family: 'DM Sans', sans-serif; font-size: 0.875rem; font-weight: 700;
          cursor: pointer; transition: all 0.25s ease;
          box-shadow: 0 0 0 1px rgba(99,102,241,0.3), 0 4px 16px rgba(99,102,241,0.3);
        }
        .ft-banner-btn:hover { background: #4f46e5; transform: translateY(-2px); }
      `}</style>

      <div className="ft-root">
        <div className="ft-wrap">

          {/* HERO */}
          <div className="ft-hero">
            <div className="ft-chip"><Sparkles size={11} /> 100% Free Utilities</div>
            <h1>Free Business <em>Tools</em></h1>
            <p>Quick, accurate calculators and generators to handle your daily business math. No sign-up. No ads. Always free.</p>
          </div>

          {/* LAYOUT */}
          <div className="ft-layout">

            {/* SIDEBAR */}
            <div className="ft-sidebar">
              {tools.map(tool => {
                const Icon = tool.icon;
                const isActive = activeTool === tool.id;
                return (
                  <button key={tool.id} className={`ft-tab ${isActive ? "active" : ""}`}
                    onClick={() => { setActiveTool(tool.id); resetAll(); }}>
                    <div className="ft-tab-icon"><Icon size={18} /></div>
                    <div>
                      <div className="ft-tab-label">{tool.name}</div>
                      <div className="ft-tab-sub">{tool.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* MAIN PANEL */}
            <div className="ft-main">

              {/* EMI */}
              {activeTool === "emi" && (
                <>
                  <div className="ft-panel">
                    <div className="ft-panel-title"><Calculator size={20} /> Loan EMI Calculator</div>
                    <div className="ft-grid">
                      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        <InputField label="Loan Amount (₹)" value={emiData.amount} onChange={e => setEmiData({ ...emiData, amount: e.target.value })} placeholder="e.g. 500000" />
                        <InputField label="Interest Rate (% p.a.)" value={emiData.rate} onChange={e => setEmiData({ ...emiData, rate: e.target.value })} placeholder="e.g. 8.5" />
                        <InputField label="Loan Tenure (Years)" value={emiData.tenure} onChange={e => setEmiData({ ...emiData, tenure: e.target.value })} placeholder="e.g. 5" />
                        <ActionRow onReset={() => { setEmiData(initEmi); setEmiResult(null); }} onCalc={calcEMI} />
                      </div>
                      <ResultCard>
                        <div className="ft-res-label">Monthly EMI</div>
                        <div className="ft-res-value">{emiResult ? `₹${emiResult.monthly.toLocaleString()}` : "₹—"}</div>
                        <div className="ft-res-row"><span className="ft-res-row-label">Principal</span><span className="ft-res-row-val">₹{emiResult ? (+emiData.amount).toLocaleString() : "—"}</span></div>
                        <div className="ft-res-row"><span className="ft-res-row-label">Total Interest</span><span className="ft-res-row-val" style={{ color: "#fbbf24" }}>{emiResult ? `₹${emiResult.totalInterest.toLocaleString()}` : "—"}</span></div>
                        <div className="ft-res-row"><span className="ft-res-row-label">Total Payable</span><span className="ft-res-row-val">{emiResult ? `₹${emiResult.totalAmount.toLocaleString()}` : "—"}</span></div>
                      </ResultCard>
                    </div>
                  </div>
                  <div className="ft-seo">
                    <h3>About the EMI Calculator</h3>
                    <p>EMI (Equated Monthly Installment) is the fixed monthly amount you pay towards repaying a loan. It covers both principal and interest, distributed over the loan tenure.</p>
                    <p><strong>Formula:</strong> EMI = [P × R × (1+R)^N] / [(1+R)^N − 1] — where P = principal, R = monthly rate, N = months.</p>
                  </div>
                </>
              )}

              {/* SIP */}
              {activeTool === "sip" && (
                <>
                  <div className="ft-panel">
                    <div className="ft-panel-title"><TrendingUp size={20} /> SIP Return Calculator</div>
                    <div className="ft-grid">
                      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        <InputField label="Monthly Investment (₹)" value={sipData.amount} onChange={e => setSipData({ ...sipData, amount: e.target.value })} placeholder="e.g. 5000" />
                        <InputField label="Expected Return (% p.a.)" value={sipData.rate} onChange={e => setSipData({ ...sipData, rate: e.target.value })} placeholder="e.g. 12" />
                        <InputField label="Time Period (Years)" value={sipData.tenure} onChange={e => setSipData({ ...sipData, tenure: e.target.value })} placeholder="e.g. 10" />
                        <ActionRow onReset={() => { setSipData(initSip); setSipResult(null); }} onCalc={calcSIP} />
                      </div>
                      <ResultCard>
                        <div className="ft-res-label">Total Corpus</div>
                        <div className="ft-res-value">{sipResult ? `₹${sipResult.total.toLocaleString()}` : "₹—"}</div>
                        <div className="ft-res-row"><span className="ft-res-row-label">Amount Invested</span><span className="ft-res-row-val">{sipResult ? `₹${sipResult.invested.toLocaleString()}` : "—"}</span></div>
                        <div className="ft-res-row"><span className="ft-res-row-label">Wealth Gained</span><span className="ft-res-row-val" style={{ color: "#818cf8" }}>{sipResult ? `+₹${sipResult.wealthGain.toLocaleString()}` : "—"}</span></div>
                      </ResultCard>
                    </div>
                  </div>
                  <div className="ft-seo">
                    <h3>How SIP Calculator Works</h3>
                    <p>A SIP (Systematic Investment Plan) lets you invest a fixed amount monthly in mutual funds. The power of compounding over time significantly multiplies your wealth.</p>
                    <p>Mutual fund investments are subject to market risks. Past returns don't guarantee future performance.</p>
                  </div>
                </>
              )}

              {/* GST */}
              {activeTool === "gst" && (
                <>
                  <div className="ft-panel">
                    <div className="ft-panel-title"><Percent size={20} /> GST Calculator</div>
                    <div className="ft-grid">
                      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        <InputField label="Amount (₹)" value={gstData.amount} onChange={e => setGstData({ ...gstData, amount: e.target.value })} placeholder="e.g. 1000" />
                        <InputField label="GST Rate (%)" value={gstData.rate} onChange={e => setGstData({ ...gstData, rate: e.target.value })} placeholder="e.g. 18" />
                        <div>
                          <label className="ft-label">Calculation Type</label>
                          <div className="ft-toggle-row">
                            <button className={`ft-toggle ${gstData.type === "add" ? "on" : ""}`} onClick={() => setGstData({ ...gstData, type: "add" })}>+ Add GST</button>
                            <button className={`ft-toggle ${gstData.type === "remove" ? "on" : ""}`} onClick={() => setGstData({ ...gstData, type: "remove" })}>− Remove GST</button>
                          </div>
                        </div>
                        <ActionRow onReset={() => { setGstData(initGst); setGstResult(null); }} onCalc={calcGST} />
                      </div>
                      <ResultCard>
                        <div className="ft-res-label">Total Price</div>
                        <div className="ft-res-value">{gstResult ? `₹${gstResult.total.toFixed(2)}` : "₹—"}</div>
                        <div className="ft-res-row"><span className="ft-res-row-label">Net Price</span><span className="ft-res-row-val">{gstResult ? `₹${gstResult.net.toFixed(2)}` : "—"}</span></div>
                        <div className="ft-res-row"><span className="ft-res-row-label">GST Amount</span><span className="ft-res-row-val" style={{ color: "#fbbf24" }}>{gstResult ? `₹${gstResult.gst.toFixed(2)}` : "—"}</span></div>
                      </ResultCard>
                    </div>
                  </div>
                  <div className="ft-seo">
                    <h3>Understanding GST in India</h3>
                    <p>GST (Goods and Services Tax) is an indirect tax levied on supply of goods and services. Common rates are <strong>5%, 12%, 18%, and 28%</strong>.</p>
                    <p>Use "Add GST" when you have the base price, and "Remove GST" when GST is already included in the quoted price.</p>
                  </div>
                </>
              )}

              {/* FD */}
              {activeTool === "fd" && (
                <>
                  <div className="ft-panel">
                    <div className="ft-panel-title"><PiggyBank size={20} /> Fixed Deposit Calculator</div>
                    <div className="ft-grid">
                      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        <InputField label="Principal Amount (₹)" value={fdData.amount} onChange={e => setFdData({ ...fdData, amount: e.target.value })} placeholder="e.g. 100000" />
                        <InputField label="Annual Interest Rate (%)" value={fdData.rate} onChange={e => setFdData({ ...fdData, rate: e.target.value })} placeholder="e.g. 7.5" />
                        <InputField label="Tenure (Years)" value={fdData.tenure} onChange={e => setFdData({ ...fdData, tenure: e.target.value })} placeholder="e.g. 3" />
                        <div>
                          <label className="ft-label">Interest Type</label>
                          <div className="ft-toggle-row">
                            <button className={`ft-toggle ${fdData.type === "simple" ? "on" : ""}`} onClick={() => setFdData({ ...fdData, type: "simple" })}>Simple</button>
                            <button className={`ft-toggle ${fdData.type === "compound" ? "on" : ""}`} onClick={() => setFdData({ ...fdData, type: "compound" })}>Compound (Q)</button>
                          </div>
                        </div>
                        <ActionRow onReset={() => { setFdData(initFd); setFdResult(null); }} onCalc={calcFD} />
                      </div>
                      <ResultCard>
                        <div className="ft-res-label">Maturity Amount</div>
                        <div className="ft-res-value">{fdResult ? `₹${fdResult.maturity.toLocaleString()}` : "₹—"}</div>
                        <div className="ft-res-row"><span className="ft-res-row-label">Principal</span><span className="ft-res-row-val">{fdResult ? `₹${fdResult.principal.toLocaleString()}` : "—"}</span></div>
                        <div className="ft-res-row"><span className="ft-res-row-label">Interest Earned</span><span className="ft-res-row-val" style={{ color: "#34d399" }}>{fdResult ? `+₹${fdResult.interest.toLocaleString()}` : "—"}</span></div>
                      </ResultCard>
                    </div>
                  </div>
                  <div className="ft-seo">
                    <h3>About Fixed Deposit (FD)</h3>
                    <p>A Fixed Deposit is a secure investment where you deposit a lump sum for a fixed tenure at a guaranteed interest rate. Most banks offer <strong>6%–8% p.a.</strong> returns.</p>
                    <p><strong>Compound (Quarterly)</strong> gives higher returns than simple interest for the same rate and tenure, as interest is reinvested every 3 months.</p>
                  </div>
                </>
              )}

              {/* INVOICE */}
              {activeTool === "invoice" && (
                <>
                  <div className="ft-panel">
                    <div className="ft-panel-title"><Receipt size={20} /> Quick Invoice Generator</div>
                    <div style={{ display: "grid", gap: 14 }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                        <div>
                          <label className="ft-label">Your Business Name</label>
                          <input className="ft-input" type="text" value={invData.bizName} onChange={e => setInvData({ ...invData, bizName: e.target.value })} placeholder="e.g. Acme Pvt. Ltd." />
                        </div>
                        <div>
                          <label className="ft-label">Client Name</label>
                          <input className="ft-input" type="text" value={invData.clientName} onChange={e => setInvData({ ...invData, clientName: e.target.value })} placeholder="e.g. John Doe" />
                        </div>
                      </div>

                      <div>
                        <label className="ft-label">Items</label>
                        <div style={{ marginBottom: 8 }}>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 60px 90px 32px", gap: 8, marginBottom: 6 }}>
                            <span className="ft-label" style={{ margin: 0 }}>Description</span>
                            <span className="ft-label" style={{ margin: 0 }}>Qty</span>
                            <span className="ft-label" style={{ margin: 0 }}>Rate (₹)</span>
                            <span />
                          </div>
                          {invData.items.map((it, i) => (
                            <div key={i} className="ft-inv-item-row">
                              <input type="text" value={it.desc} onChange={e => updateInvItem(i, "desc", e.target.value)} placeholder="Item description" />
                              <input type="number" value={it.qty} onChange={e => updateInvItem(i, "qty", e.target.value)} />
                              <input type="number" value={it.price} onChange={e => updateInvItem(i, "price", e.target.value)} placeholder="0" />
                              <button className="ft-inv-remove" onClick={() => removeInvItem(i)}>×</button>
                            </div>
                          ))}
                        </div>
                        <button className="ft-inv-add" onClick={addInvItem}>+ Add Item</button>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, alignItems: "end" }}>
                        <div>
                          <label className="ft-label">GST Rate (%)</label>
                          <select className="ft-input" value={invData.gstRate} onChange={e => setInvData({ ...invData, gstRate: e.target.value })}>
                            {["0", "5", "12", "18", "28"].map(r => <option key={r} value={r}>{r}%</option>)}
                          </select>
                        </div>
                        <div className="ft-inv-summary">
                          <div className="ft-inv-summary-row"><span>Subtotal</span><span>₹{invSubtotal.toFixed(2)}</span></div>
                          <div className="ft-inv-summary-row"><span>GST ({invData.gstRate}%)</span><span>₹{invGst.toFixed(2)}</span></div>
                          <div className="ft-inv-summary-row total"><span>Total</span><span>₹{invTotal.toFixed(2)}</span></div>
                        </div>
                      </div>

                      <button className="ft-print-btn" onClick={printInvoice}>🖨️ &nbsp; Generate & Print Invoice</button>
                    </div>
                  </div>
                  <div className="ft-seo">
                    <h3>Free GST Invoice Generator</h3>
                    <p>Create professional GST-compliant invoices instantly. Add multiple line items, choose the applicable GST rate, and print or save as PDF with one click.</p>
                    <p>For recurring invoices and bulk billing, check out our <strong>premium Excel invoice templates</strong> in the store.</p>
                  </div>
                </>
              )}

              {/* CURRENCY */}
              {activeTool === "currency" && (
                <>
                  <div className="ft-panel">
                    <div className="ft-panel-title"><Globe size={20} /> Currency Converter</div>
                    <div className="ft-grid">
                      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        <InputField label="Amount" value={currData.amount} onChange={e => setCurrData({ ...currData, amount: e.target.value })} placeholder="e.g. 100" />
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                          <div>
                            <label className="ft-label">From</label>
                            <select className="ft-input" value={currData.from} onChange={e => setCurrData({ ...currData, from: e.target.value })}>
                              {Object.keys(rates).map(c => <option key={c}>{c}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="ft-label">To</label>
                            <select className="ft-input" value={currData.to} onChange={e => setCurrData({ ...currData, to: e.target.value })}>
                              {Object.keys(rates).map(c => <option key={c}>{c}</option>)}
                            </select>
                          </div>
                        </div>
                        <ActionRow onReset={() => { setCurrData(initCurr); setCurrResult(null); }} onCalc={calcCurr} calcLabel="Convert" />
                      </div>
                      <ResultCard>
                        <div className="ft-res-label">Converted Amount</div>
                        <div className="ft-res-value" style={{ fontSize: "2rem" }}>{currResult || "—"}</div>
                        <div className="ft-res-row"><span className="ft-res-row-label">Currency</span><span className="ft-res-row-val">{currData.to}</span></div>
                        <div className="ft-res-row"><span className="ft-res-row-label">Source</span><span className="ft-res-row-val" style={{ color: "#64748b", fontSize: "0.72rem" }}>open.er-api.com</span></div>
                      </ResultCard>
                    </div>
                  </div>
                  <div className="ft-seo">
                    <h3>Live Currency Converter</h3>
                    <p>Get real-time exchange rates powered by the open exchange rates API. Supports 150+ world currencies including USD, EUR, GBP, JPY, AED, and INR.</p>
                  </div>
                </>
              )}

              {/* UNIT */}
              {activeTool === "unit" && (
                <>
                  <div className="ft-panel">
                    <div className="ft-panel-title"><Scale size={20} /> Unit Converter</div>
                    <div className="ft-grid">
                      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        <div>
                          <label className="ft-label">Category</label>
                          <select className="ft-input" value={unitData.category} onChange={e => {
                            const cat = e.target.value;
                            const keys = Object.keys(unitFactors[cat]);
                            setUnitData({ ...unitData, category: cat, from: keys[0], to: keys[1] });
                          }}>
                            {Object.keys(unitFactors).map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                          </select>
                        </div>
                        <InputField label="Value" value={unitData.amount} onChange={e => setUnitData({ ...unitData, amount: e.target.value })} placeholder="e.g. 10" />
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                          <div>
                            <label className="ft-label">From</label>
                            <select className="ft-input" value={unitData.from} onChange={e => setUnitData({ ...unitData, from: e.target.value })}>
                              {Object.keys(unitFactors[unitData.category]).map(u => <option key={u}>{u}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="ft-label">To</label>
                            <select className="ft-input" value={unitData.to} onChange={e => setUnitData({ ...unitData, to: e.target.value })}>
                              {Object.keys(unitFactors[unitData.category]).map(u => <option key={u}>{u}</option>)}
                            </select>
                          </div>
                        </div>
                        <ActionRow onReset={() => { setUnitData(initUnit); setUnitResult(null); }} onCalc={calcUnit} calcLabel="Convert" />
                      </div>
                      <ResultCard>
                        <div className="ft-res-label">Converted Value</div>
                        <div className="ft-res-value" style={{ fontSize: "2rem" }}>{unitResult || "—"}</div>
                        <div className="ft-res-row"><span className="ft-res-row-label">Unit</span><span className="ft-res-row-val">{unitData.to}</span></div>
                      </ResultCard>
                    </div>
                  </div>
                  <div className="ft-seo">
                    <h3>Free Unit Converter</h3>
                    <p>Instantly convert between length (m, ft, km), weight (kg, lb, oz), and area (sq ft, acre, hectare) units. Perfect for real estate, logistics, and daily use.</p>
                  </div>
                </>
              )}

              {/* BMI */}
              {activeTool === "bmi" && (
                <>
                  <div className="ft-panel">
                    <div className="ft-panel-title"><Activity size={20} /> BMI Calculator</div>
                    <div className="ft-grid">
                      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        <InputField label="Weight (kg)" value={bmiData.weight} onChange={e => setBmiData({ ...bmiData, weight: e.target.value })} placeholder="e.g. 70" />
                        <InputField label="Height (cm)" value={bmiData.height} onChange={e => setBmiData({ ...bmiData, height: e.target.value })} placeholder="e.g. 175" />
                        <ActionRow onReset={() => { setBmiData(initBmi); setBmiResult(null); }} onCalc={calcBMI} />
                      </div>
                      <ResultCard>
                        <div className="ft-res-label">Your BMI Score</div>
                        <div className="ft-res-value" style={{ color: bmiResult ? bmiResult.color : "#34d399" }}>{bmiResult ? bmiResult.score : "—"}</div>
                        {bmiResult && (
                          <div style={{ display: "inline-block", padding: "5px 14px", borderRadius: 20, fontSize: "0.8rem", fontWeight: 700, background: "rgba(255,255,255,0.08)", color: bmiResult.color, border: `1px solid ${bmiResult.color}40`, marginBottom: 14 }}>
                            {bmiResult.status}
                          </div>
                        )}
                        <div className="ft-res-row"><span className="ft-res-row-label">Healthy Range</span><span className="ft-res-row-val">18.5 – 24.9</span></div>
                        <div className="ft-res-row"><span className="ft-res-row-label">Underweight</span><span className="ft-res-row-val">&lt; 18.5</span></div>
                        <div className="ft-res-row"><span className="ft-res-row-label">Overweight</span><span className="ft-res-row-val">25 – 29.9</span></div>
                      </ResultCard>
                    </div>
                  </div>
                  <div className="ft-seo">
                    <h3>About BMI Calculator</h3>
                    <p>BMI (Body Mass Index) = weight(kg) ÷ height²(m). It provides a quick screening indicator of healthy weight ranges for adults.</p>
                    <p>BMI is a screening tool, not a diagnostic measure. Consult a healthcare provider for a complete health assessment.</p>
                  </div>
                </>
              )}

              {/* CROSS-SELL */}
              <div className="ft-banner">
                <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                  <div className="ft-banner-icon"><FileSpreadsheet size={26} color="#fff" /></div>
                  <div>
                    <h4>Loved these free tools?</h4>
                    <p>Save hours of manual work with our premium automated Excel & Google Sheets templates.</p>
                  </div>
                </div>
                <button className="ft-banner-btn" onClick={() => onNavigate("templates")}>
                  Browse Templates <ArrowRight size={16} />
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}