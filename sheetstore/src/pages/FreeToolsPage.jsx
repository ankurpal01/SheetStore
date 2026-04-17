import { useState, useEffect } from "react";
import {
  Calculator, Percent, Activity, TrendingUp,
  Globe, Scale, ArrowRight, Sparkles,
  FileSpreadsheet, RotateCcw, PiggyBank, Receipt
} from "lucide-react";

import InvoiceGenerator from "../components/InvoiceGenerator";

// ── Shared UI components ──
const InputField = ({ label, value, onChange, placeholder, type = "number" }) => (
  <div>
    <label className="block text-sm font-bold text-slate-700 mb-2">{label}</label>
    <input 
      type={type} 
      value={value} 
      onChange={onChange} 
      placeholder={placeholder} 
      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-medium text-slate-900" 
    />
  </div>
);

const ResultCard = ({ children }) => (
  <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-slate-900/10 flex flex-col justify-center h-full relative overflow-hidden">
    <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/30 rounded-full blur-3xl"></div>
    <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl"></div>
    <div className="relative z-10">
      {children}
    </div>
  </div>
);

const ActionRow = ({ onReset, onCalc, calcLabel = "Calculate" }) => (
  <div className="flex gap-3 pt-2">
    <button onClick={onReset} className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-colors">
      <RotateCcw size={16} /> Reset
    </button>
    <button onClick={onCalc} className="flex-[2] py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-transform hover:-translate-y-0.5">
      {calcLabel}
    </button>
  </div>
);

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

    const setOG = (prop, val) => {
      let el = document.querySelector(`meta[property="${prop}"]`);
      if (!el) { el = document.createElement("meta"); el.setAttribute("property", prop); document.head.appendChild(el); }
      el.content = val;
    };
    setOG("og:title", t.seoTitle);
    setOG("og:description", t.seoDesc);
    setOG("og:type", "website");

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.appendChild(canonical); }
    canonical.href = `${window.location.origin}/tools#${t.id}`;
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
        const maturity = p * Math.pow(1 + r / 4, 4 * t);
        setFdResult({ maturity: Math.round(maturity), interest: Math.round(maturity - p), principal: p });
      }
    }
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
      let status = "Normal Weight", color = "text-emerald-400", border = "border-emerald-500/30";
      if (bmi < 18.5) { status = "Underweight"; color = "text-amber-400"; border = "border-amber-500/30"; }
      else if (bmi > 24.9 && bmi <= 29.9) { status = "Overweight"; color = "text-orange-400"; border = "border-orange-500/30"; }
      else if (bmi > 29.9) { status = "Obese"; color = "text-red-400"; border = "border-red-500/30"; }
      setBmiResult({ score: bmi, status, color, border });
    }
  };

  const resetAll = () => {
    setEmiResult(null); setSipResult(null); setGstResult(null);
    setFdResult(null); setCurrResult(null); setUnitResult(null); setBmiResult(null);
    setEmiData(initEmi); setSipData(initSip); setGstData(initGst);
    setFdData(initFd); setCurrData(initCurr); setUnitData(initUnit); setBmiData(initBmi);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-32 print:pt-0 print:pb-0">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 print:px-0">

        {/* HERO */}
        <div className="text-center max-w-3xl mx-auto mb-16 print:hidden">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs uppercase tracking-widest mb-6 border border-indigo-200">
            <Sparkles className="w-4 h-4" /> 100% Free Utilities
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
            Free Business <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Tools</span>
          </h1>
          <p className="text-lg text-slate-600 font-medium">
            Quick, accurate calculators and generators to handle your daily business math. No sign-up. No ads. Always free.
          </p>
        </div>

        {/* LAYOUT */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* SIDEBAR */}
          <div className="w-full lg:w-72 shrink-0 flex flex-col gap-2 sticky top-24 print:hidden">
            {tools.map(tool => {
              const Icon = tool.icon;
              const isActive = activeTool === tool.id;
              return (
                <button 
                  key={tool.id} 
                  onClick={() => { setActiveTool(tool.id); resetAll(); }}
                  className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 text-left border-2 
                    ${isActive ? 'bg-white border-indigo-200 shadow-xl shadow-indigo-100/50' : 'bg-transparent border-transparent hover:bg-white hover:border-slate-200'}`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors
                    ${isActive ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className={`font-bold ${isActive ? 'text-indigo-900' : 'text-slate-700'}`}>{tool.name}</h3>
                    <p className={`text-xs font-medium ${isActive ? 'text-indigo-600/70' : 'text-slate-500'}`}>{tool.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* MAIN PANEL */}
          <div className="flex-1 w-full min-w-0">

            {/* INVOICE (Custom Component) */}
            {activeTool === "invoice" && (
              <div className="animate-fade-in-up">
                <InvoiceGenerator />
                <div className="mt-8 bg-white rounded-3xl border border-slate-200 p-8 print:hidden">
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Free Professional Invoice Generator</h3>
                  <p className="text-slate-600 leading-relaxed mb-4">
                    Create stunning, professional GST-compliant invoices instantly. Add multiple line items, choose your currency, apply discounts and taxes, and instantly preview exactly how your invoice will look.
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    Once finished, click <strong>Generate PDF / Print</strong> to save a beautiful physical or digital copy for your records. For recurring invoices and bulk billing, check out our premium Excel invoice templates in the store!
                  </p>
                </div>
              </div>
            )}

            {/* OTHER STANDARD CALCULATORS */}
            {activeTool !== "invoice" && (
              <div className="space-y-6 animate-fade-in-up">
                <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/40 p-6 sm:p-10">
                  <div className="flex items-center gap-3 mb-8">
                    {tools.find(t => t.id === activeTool) && (() => {
                      const ActiveIcon = tools.find(t => t.id === activeTool).icon;
                      return <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <ActiveIcon className="w-5 h-5" />
                      </div>;
                    })()}
                    <h2 className="text-2xl font-black text-slate-900">{tools.find(t => t.id === activeTool)?.name}</h2>
                  </div>

                  {/* EMI */}
                  {activeTool === "emi" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                      <div className="space-y-5">
                        <InputField label="Loan Amount (₹)" value={emiData.amount} onChange={e => setEmiData({ ...emiData, amount: e.target.value })} placeholder="e.g. 500000" />
                        <InputField label="Interest Rate (% p.a.)" value={emiData.rate} onChange={e => setEmiData({ ...emiData, rate: e.target.value })} placeholder="e.g. 8.5" />
                        <InputField label="Loan Tenure (Years)" value={emiData.tenure} onChange={e => setEmiData({ ...emiData, tenure: e.target.value })} placeholder="e.g. 5" />
                        <ActionRow onReset={() => { setEmiData(initEmi); setEmiResult(null); }} onCalc={calcEMI} />
                      </div>
                      <ResultCard>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Monthly EMI</p>
                        <h3 className="text-4xl sm:text-5xl font-black text-emerald-400 mb-8">{emiResult ? `₹${emiResult.monthly.toLocaleString()}` : "₹—"}</h3>
                        <div className="space-y-3 font-medium text-sm">
                          <div className="flex justify-between border-b border-white/10 pb-3"><span className="text-slate-400">Principal</span><span>₹{emiResult ? (+emiData.amount).toLocaleString() : "—"}</span></div>
                          <div className="flex justify-between border-b border-white/10 pb-3"><span className="text-slate-400">Total Interest</span><span className="text-amber-400">{emiResult ? `₹${emiResult.totalInterest.toLocaleString()}` : "—"}</span></div>
                          <div className="flex justify-between pt-1"><span className="text-slate-400">Total Payable</span><span className="text-lg font-bold">{emiResult ? `₹${emiResult.totalAmount.toLocaleString()}` : "—"}</span></div>
                        </div>
                      </ResultCard>
                    </div>
                  )}

                  {/* SIP */}
                  {activeTool === "sip" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                      <div className="space-y-5">
                        <InputField label="Monthly Investment (₹)" value={sipData.amount} onChange={e => setSipData({ ...sipData, amount: e.target.value })} placeholder="e.g. 5000" />
                        <InputField label="Expected Return (% p.a.)" value={sipData.rate} onChange={e => setSipData({ ...sipData, rate: e.target.value })} placeholder="e.g. 12" />
                        <InputField label="Time Period (Years)" value={sipData.tenure} onChange={e => setSipData({ ...sipData, tenure: e.target.value })} placeholder="e.g. 10" />
                        <ActionRow onReset={() => { setSipData(initSip); setSipResult(null); }} onCalc={calcSIP} />
                      </div>
                      <ResultCard>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Total Corpus</p>
                        <h3 className="text-4xl sm:text-5xl font-black text-emerald-400 mb-8">{sipResult ? `₹${sipResult.total.toLocaleString()}` : "₹—"}</h3>
                        <div className="space-y-3 font-medium text-sm">
                          <div className="flex justify-between border-b border-white/10 pb-3"><span className="text-slate-400">Amount Invested</span><span>{sipResult ? `₹${sipResult.invested.toLocaleString()}` : "—"}</span></div>
                          <div className="flex justify-between pt-1"><span className="text-slate-400">Wealth Gained</span><span className="text-indigo-400 text-lg font-bold">{sipResult ? `+₹${sipResult.wealthGain.toLocaleString()}` : "—"}</span></div>
                        </div>
                      </ResultCard>
                    </div>
                  )}

                  {/* GST */}
                  {activeTool === "gst" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                      <div className="space-y-5">
                        <InputField label="Amount (₹)" value={gstData.amount} onChange={e => setGstData({ ...gstData, amount: e.target.value })} placeholder="e.g. 1000" />
                        <InputField label="GST Rate (%)" value={gstData.rate} onChange={e => setGstData({ ...gstData, rate: e.target.value })} placeholder="e.g. 18" />
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Calculation Type</label>
                          <div className="flex gap-3">
                            <button className={`flex-1 py-3 px-4 rounded-xl font-bold border-2 transition-colors ${gstData.type === "add" ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'bg-slate-50 border-transparent text-slate-500 hover:bg-slate-100'}`} onClick={() => setGstData({ ...gstData, type: "add" })}>+ Add GST</button>
                            <button className={`flex-1 py-3 px-4 rounded-xl font-bold border-2 transition-colors ${gstData.type === "remove" ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'bg-slate-50 border-transparent text-slate-500 hover:bg-slate-100'}`} onClick={() => setGstData({ ...gstData, type: "remove" })}>− Remove GST</button>
                          </div>
                        </div>
                        <ActionRow onReset={() => { setGstData(initGst); setGstResult(null); }} onCalc={calcGST} />
                      </div>
                      <ResultCard>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Total Price</p>
                        <h3 className="text-4xl sm:text-5xl font-black text-emerald-400 mb-8">{gstResult ? `₹${gstResult.total.toFixed(2)}` : "₹—"}</h3>
                        <div className="space-y-3 font-medium text-sm">
                          <div className="flex justify-between border-b border-white/10 pb-3"><span className="text-slate-400">Net Price</span><span>{gstResult ? `₹${gstResult.net.toFixed(2)}` : "—"}</span></div>
                          <div className="flex justify-between pt-1"><span className="text-slate-400">GST Amount</span><span className="text-amber-400 text-lg font-bold">{gstResult ? `₹${gstResult.gst.toFixed(2)}` : "—"}</span></div>
                        </div>
                      </ResultCard>
                    </div>
                  )}

                  {/* FD */}
                  {activeTool === "fd" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                      <div className="space-y-5">
                        <InputField label="Principal Amount (₹)" value={fdData.amount} onChange={e => setFdData({ ...fdData, amount: e.target.value })} placeholder="e.g. 100000" />
                        <InputField label="Annual Interest Rate (%)" value={fdData.rate} onChange={e => setFdData({ ...fdData, rate: e.target.value })} placeholder="e.g. 7.5" />
                        <InputField label="Tenure (Years)" value={fdData.tenure} onChange={e => setFdData({ ...fdData, tenure: e.target.value })} placeholder="e.g. 3" />
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Interest Type</label>
                          <div className="flex gap-3">
                            <button className={`flex-1 py-3 px-4 rounded-xl font-bold border-2 transition-colors ${fdData.type === "simple" ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'bg-slate-50 border-transparent text-slate-500 hover:bg-slate-100'}`} onClick={() => setFdData({ ...fdData, type: "simple" })}>Simple</button>
                            <button className={`flex-1 py-3 px-4 rounded-xl font-bold border-2 transition-colors ${fdData.type === "compound" ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'bg-slate-50 border-transparent text-slate-500 hover:bg-slate-100'}`} onClick={() => setFdData({ ...fdData, type: "compound" })}>Compound (Q)</button>
                          </div>
                        </div>
                        <ActionRow onReset={() => { setFdData(initFd); setFdResult(null); }} onCalc={calcFD} />
                      </div>
                      <ResultCard>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Maturity Amount</p>
                        <h3 className="text-4xl sm:text-5xl font-black text-emerald-400 mb-8">{fdResult ? `₹${fdResult.maturity.toLocaleString()}` : "₹—"}</h3>
                        <div className="space-y-3 font-medium text-sm">
                          <div className="flex justify-between border-b border-white/10 pb-3"><span className="text-slate-400">Principal</span><span>{fdResult ? `₹${fdResult.principal.toLocaleString()}` : "—"}</span></div>
                          <div className="flex justify-between pt-1"><span className="text-slate-400">Interest Earned</span><span className="text-emerald-400 text-lg font-bold">{fdResult ? `+₹${fdResult.interest.toLocaleString()}` : "—"}</span></div>
                        </div>
                      </ResultCard>
                    </div>
                  )}

                  {/* CURRENCY */}
                  {activeTool === "currency" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                      <div className="space-y-5">
                        <InputField label="Amount" value={currData.amount} onChange={e => setCurrData({ ...currData, amount: e.target.value })} placeholder="e.g. 100" />
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">From</label>
                            <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none font-medium text-slate-900" value={currData.from} onChange={e => setCurrData({ ...currData, from: e.target.value })}>
                              {Object.keys(rates).map(c => <option key={c}>{c}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">To</label>
                            <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none font-medium text-slate-900" value={currData.to} onChange={e => setCurrData({ ...currData, to: e.target.value })}>
                              {Object.keys(rates).map(c => <option key={c}>{c}</option>)}
                            </select>
                          </div>
                        </div>
                        <ActionRow onReset={() => { setCurrData(initCurr); setCurrResult(null); }} onCalc={calcCurr} calcLabel="Convert" />
                      </div>
                      <ResultCard>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Converted Amount</p>
                        <h3 className="text-4xl sm:text-5xl font-black text-emerald-400 mb-8">{currResult || "—"}</h3>
                        <div className="space-y-3 font-medium text-sm">
                          <div className="flex justify-between border-b border-white/10 pb-3"><span className="text-slate-400">Target Currency</span><span className="font-bold text-lg">{currData.to}</span></div>
                          <div className="flex justify-between pt-1"><span className="text-slate-400">Source</span><span className="text-slate-500 text-xs">open.er-api.com</span></div>
                        </div>
                      </ResultCard>
                    </div>
                  )}

                  {/* UNIT */}
                  {activeTool === "unit" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                      <div className="space-y-5">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                          <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none font-medium text-slate-900" value={unitData.category} onChange={e => {
                            const cat = e.target.value;
                            const keys = Object.keys(unitFactors[cat]);
                            setUnitData({ ...unitData, category: cat, from: keys[0], to: keys[1] });
                          }}>
                            {Object.keys(unitFactors).map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                          </select>
                        </div>
                        <InputField label="Value" value={unitData.amount} onChange={e => setUnitData({ ...unitData, amount: e.target.value })} placeholder="e.g. 10" />
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">From</label>
                            <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none font-medium text-slate-900" value={unitData.from} onChange={e => setUnitData({ ...unitData, from: e.target.value })}>
                              {Object.keys(unitFactors[unitData.category]).map(u => <option key={u}>{u}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">To</label>
                            <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none font-medium text-slate-900" value={unitData.to} onChange={e => setUnitData({ ...unitData, to: e.target.value })}>
                              {Object.keys(unitFactors[unitData.category]).map(u => <option key={u}>{u}</option>)}
                            </select>
                          </div>
                        </div>
                        <ActionRow onReset={() => { setUnitData(initUnit); setUnitResult(null); }} onCalc={calcUnit} calcLabel="Convert" />
                      </div>
                      <ResultCard>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Converted Value</p>
                        <h3 className="text-4xl sm:text-5xl font-black text-emerald-400 mb-8">{unitResult || "—"}</h3>
                        <div className="space-y-3 font-medium text-sm">
                          <div className="flex justify-between pt-1"><span className="text-slate-400">Target Unit</span><span className="font-bold text-lg">{unitData.to}</span></div>
                        </div>
                      </ResultCard>
                    </div>
                  )}

                  {/* BMI */}
                  {activeTool === "bmi" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                      <div className="space-y-5">
                        <InputField label="Weight (kg)" value={bmiData.weight} onChange={e => setBmiData({ ...bmiData, weight: e.target.value })} placeholder="e.g. 70" />
                        <InputField label="Height (cm)" value={bmiData.height} onChange={e => setBmiData({ ...bmiData, height: e.target.value })} placeholder="e.g. 175" />
                        <ActionRow onReset={() => { setBmiData(initBmi); setBmiResult(null); }} onCalc={calcBMI} />
                      </div>
                      <ResultCard>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Your BMI Score</p>
                        <h3 className={`text-5xl sm:text-6xl font-black mb-4 ${bmiResult ? bmiResult.color : "text-emerald-400"}`}>{bmiResult ? bmiResult.score : "—"}</h3>
                        {bmiResult && (
                          <div className={`inline-flex px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 border mb-8 ${bmiResult.color} ${bmiResult.border}`}>
                            {bmiResult.status}
                          </div>
                        )}
                        <div className="space-y-3 font-medium text-sm">
                          <div className="flex justify-between border-b border-white/10 pb-3"><span className="text-slate-400">Healthy Range</span><span>18.5 – 24.9</span></div>
                          <div className="flex justify-between border-b border-white/10 pb-3"><span className="text-slate-400">Underweight</span><span>&lt; 18.5</span></div>
                          <div className="flex justify-between pt-1"><span className="text-slate-400">Overweight</span><span>25 – 29.9</span></div>
                        </div>
                      </ResultCard>
                    </div>
                  )}
                </div>

                {/* SEO TEXT BLOCK */}
                <div className="bg-white rounded-3xl border border-slate-200 p-8 print:hidden">
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{tools.find(t => t.id === activeTool)?.name} Guidelines</h3>
                  <p className="text-slate-600 leading-relaxed">
                    {tools.find(t => t.id === activeTool)?.seoDesc} Use this tool for accurate estimations to help plan your finances or business operations effectively.
                  </p>
                </div>

              </div>
            )}

            {/* CROSS-SELL BANNER */}
            <div className="mt-8 bg-slate-900 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden print:hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
              <div className="flex items-center gap-6 relative z-10">
                <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-indigo-600/30">
                  <FileSpreadsheet className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-black text-white mb-2">Loved these free tools?</h4>
                  <p className="text-slate-400 text-sm font-medium">Save hours of manual work with our premium automated Excel & Google Sheets templates.</p>
                </div>
              </div>
              <button onClick={() => onNavigate("templates")} className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all hover:-translate-y-1 shadow-xl shadow-indigo-600/30 whitespace-nowrap relative z-10">
                Browse Templates <ArrowRight className="w-5 h-5" />
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}