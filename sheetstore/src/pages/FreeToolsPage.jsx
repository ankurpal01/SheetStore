import { useState, useEffect } from "react";
import { 
  Calculator, 
  Percent, 
  Activity, 
  TrendingUp,
  Globe,
  Scale,
  ArrowRight,
  Sparkles,
  FileSpreadsheet,
  RotateCcw
} from "lucide-react";

export default function FreeToolsPage({ onNavigate }) {
  const [activeTool, setActiveTool] = useState("emi");

  // ================= TOOLS CONFIG & SEO DATA =================
  const tools = [
    { 
      id: "emi", 
      name: "EMI Calculator", 
      icon: Calculator, 
      desc: "Home & car loan EMIs",
      seoTitle: "Free EMI Calculator Online | Home & Car Loan - SheetStore",
      seoDesc: "Calculate your monthly EMI for home, car, or personal loans easily. Fast, accurate, and completely free online EMI calculator."
    },
    { 
      id: "sip", 
      name: "SIP Calculator", 
      icon: TrendingUp, 
      desc: "Mutual fund returns",
      seoTitle: "Online SIP Calculator | Mutual Fund Returns - SheetStore",
      seoDesc: "Calculate your expected mutual fund returns with our free SIP calculator. Plan your investment and wealth creation journey today."
    },
    { 
      id: "gst", 
      name: "GST Calculator", 
      icon: Percent, 
      desc: "Add/Remove GST",
      seoTitle: "Free GST Calculator Online | Add or Remove GST - SheetStore",
      seoDesc: "Easily add or remove GST from your product prices. Free online GST calculator for Indian businesses and freelancers."
    },
    { 
      id: "currency", 
      name: "Currency Converter", 
      icon: Globe, 
      desc: "Live exchange rates",
      seoTitle: "Live Currency Converter | Real-time Exchange Rates - SheetStore",
      seoDesc: "Convert USD to INR, EUR to USD, and more with our live, free currency converter tool. Get accurate real-time exchange rates."
    },
    { 
      id: "unit", 
      name: "Unit Converter", 
      icon: Scale, 
      desc: "Area, weight, length",
      seoTitle: "Free Unit Converter Online | Length, Weight, Area - SheetStore",
      seoDesc: "Convert kilograms to pounds, meters to feet, or square feet to acres instantly. Free online unit converter tool."
    },
    { 
      id: "bmi", 
      name: "BMI Calculator", 
      icon: Activity, 
      desc: "Body Mass Index",
      seoTitle: "BMI Calculator Online | Check Your Body Mass Index - SheetStore",
      seoDesc: "Calculate your Body Mass Index (BMI) for free. Check if your weight is in the healthy range with our online health tool."
    }
  ];

  // ================= SEO DYNAMIC INJECTION =================
  useEffect(() => {
    const currentTool = tools.find(t => t.id === activeTool);
    if (!currentTool) return;

    // 1. Update Document Title
    document.title = currentTool.seoTitle;

    // 2. Update Meta Description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = "description";
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = currentTool.seoDesc;

    // 3. Inject JSON-LD Schema (SoftwareApplication)
    let schemaScript = document.getElementById("tool-schema");
    if (!schemaScript) {
      schemaScript = document.createElement("script");
      schemaScript.id = "tool-schema";
      schemaScript.type = "application/ld+json";
      document.head.appendChild(schemaScript);
    }
    
    const schemaData = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": currentTool.name,
      "operatingSystem": "All",
      "applicationCategory": "BusinessApplication",
      "description": currentTool.seoDesc,
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "INR"
      }
    };
    schemaScript.innerText = JSON.stringify(schemaData);

    // Cleanup schema on unmount
    return () => {
      if (schemaScript && schemaScript.parentNode) {
        schemaScript.parentNode.removeChild(schemaScript);
      }
    };
  }, [activeTool]);

  // ================= CALCULATOR STATES & LOGIC =================
  
  // EMI
  const initialEmi = { amount: "", rate: "", tenure: "" }; 
  const [emiData, setEmiData] = useState(initialEmi);
  const [emiResult, setEmiResult] = useState(null);
  const calcEMI = () => {
    const p = parseFloat(emiData.amount) || 0;
    const r = parseFloat(emiData.rate) / 12 / 100 || 0;
    const n = parseFloat(emiData.tenure) * 12 || 0;
    if (p && r && n) {
      const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const totalAmt = emi * n;
      setEmiResult({ monthly: Math.round(emi), totalInterest: Math.round(totalAmt - p), totalAmount: Math.round(totalAmt) });
    }
  };

  // GST
  const initialGst = { amount: "", rate: "", type: "add" }; 
  const [gstData, setGstData] = useState(initialGst);
  const [gstResult, setGstResult] = useState(null);
  const calcGST = () => {
    const amt = parseFloat(gstData.amount) || 0;
    const rate = parseFloat(gstData.rate) || 0;
    if (amt && rate) {
      if (gstData.type === "add") {
        const gstAmount = (amt * rate) / 100;
        setGstResult({ net: amt, gst: gstAmount, total: amt + gstAmount });
      } else {
        const net = amt / (1 + rate / 100);
        const gstAmount = amt - net;
        setGstResult({ net: net, gst: gstAmount, total: amt });
      }
    }
  };

  // BMI
  const initialBmi = { weight: "", height: "" }; 
  const [bmiData, setBmiData] = useState(initialBmi);
  const [bmiResult, setBmiResult] = useState(null);
  const calcBMI = () => {
    const w = parseFloat(bmiData.weight) || 0;
    const h = parseFloat(bmiData.height) / 100 || 0; 
    if (w > 0 && h > 0) {
      const bmi = (w / (h * h)).toFixed(1);
      let status = "Normal", color = "text-emerald-500";
      if (bmi < 18.5) { status = "Underweight"; color = "text-amber-500"; }
      else if (bmi > 24.9 && bmi <= 29.9) { status = "Overweight"; color = "text-orange-500"; }
      else if (bmi > 29.9) { status = "Obese"; color = "text-red-500"; }
      setBmiResult({ score: bmi, status, color });
    }
  };

  // SIP
  const initialSip = { amount: "", rate: "", tenure: "" }; 
  const [sipData, setSipData] = useState(initialSip);
  const [sipResult, setSipResult] = useState(null);
  const calcSIP = () => {
    const P = parseFloat(sipData.amount) || 0;
    const i = parseFloat(sipData.rate) / 12 / 100 || 0;
    const n = parseFloat(sipData.tenure) * 12 || 0;
    if (P && i && n) {
      const M = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
      const invested = P * n;
      setSipResult({ invested: Math.round(invested), wealthGain: Math.round(M - invested), total: Math.round(M) });
    }
  };

  // Currency
  const [rates, setRates] = useState({});
  const initialCurr = { amount: "", from: "USD", to: "INR" }; 
  const [currData, setCurrData] = useState(initialCurr);
  const [currResult, setCurrResult] = useState(null);
  useEffect(() => {
    fetch("https://open.er-api.com/v6/latest/USD")
      .then(res => res.json())
      .then(data => setRates(data.rates))
      .catch(err => console.log("Currency API Error", err));
  }, []);
  const calcCurr = () => {
    const amt = parseFloat(currData.amount) || 0;
    if (amt && rates[currData.from] && rates[currData.to]) {
      const inUSD = amt / rates[currData.from];
      const result = inUSD * rates[currData.to];
      setCurrResult(result.toFixed(2));
    }
  };

  // Unit
  const unitFactors = {
    length: { m: 1, cm: 0.01, km: 1000, ft: 0.3048, "inch": 0.0254 },
    weight: { kg: 1, g: 0.001, lb: 0.453592, oz: 0.0283495 },
    area: { "sq m": 1, "sq ft": 0.092903, acre: 4046.86, hectare: 10000 }
  };
  const initialUnit = { category: "length", amount: "", from: "m", to: "ft" }; 
  const [unitData, setUnitData] = useState(initialUnit);
  const [unitResult, setUnitResult] = useState(null);
  const calcUnit = () => {
    const amt = parseFloat(unitData.amount) || 0;
    const cat = unitFactors[unitData.category];
    if (amt && cat && cat[unitData.from] && cat[unitData.to]) {
      const baseValue = amt * cat[unitData.from]; 
      const result = baseValue / cat[unitData.to]; 
      setUnitResult(result.toFixed(4));
    }
  };

  return (
    <div className="w-full bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 pb-24 selection:bg-indigo-200">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12 animate-[fadeIn_0.5s_ease-out]">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-4 border border-indigo-100">
            <Sparkles className="w-4 h-4" /> 100% Free Utilities
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Free Business <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">Tools</span>
          </h1>
          <p className="text-slate-500 font-medium max-w-2xl mx-auto text-lg">
            Quick, accurate, and completely free calculators to help you manage your daily business and personal math. No sign-up required.
          </p>
        </div>

        {/* Tools Section */}
        <div className="flex flex-col md:flex-row gap-8 mb-16">
          
          {/* Left Sidebar Menu */}
          <div className="md:w-1/3 flex flex-col gap-3">
            {tools.map((tool) => {
              const Icon = tool.icon;
              const isActive = activeTool === tool.id;
              return (
                <button
                  key={tool.id}
                  onClick={() => {
                    setActiveTool(tool.id);
                    setEmiResult(null); setGstResult(null); setBmiResult(null);
                    setSipResult(null); setCurrResult(null); setUnitResult(null);
                    setEmiData(initialEmi); setGstData(initialGst); setBmiData(initialBmi);
                    setSipData(initialSip); setCurrData(initialCurr); setUnitData(initialUnit);
                  }}
                  className={`p-4 rounded-2xl border text-left transition-all duration-300 flex items-center gap-4 ${
                    isActive 
                    ? "bg-white border-indigo-500 shadow-[0_10px_30px_rgba(79,70,229,0.15)] scale-[1.02] z-10" 
                    : "bg-transparent border-slate-200 hover:bg-white hover:border-slate-300"
                  }`}
                >
                  <div className={`p-3 rounded-xl ${isActive ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className={`font-bold ${isActive ? 'text-indigo-900' : 'text-slate-700'}`}>{tool.name}</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5 font-medium">{tool.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Main Content */}
          <div className="md:w-2/3">
            <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-slate-200 relative overflow-hidden flex flex-col mb-8">
              
              {/* --- EMI TOOL --- */}
              {activeTool === "emi" && (
                <div className="animate-[fadeIn_0.3s_ease-in-out] flex-grow">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <Calculator className="text-indigo-600 w-6 h-6" /> Loan EMI Calculator
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-bold text-slate-700 block mb-2">Loan Amount (₹)</label>
                        <input type="number" value={emiData.amount} onChange={(e)=>setEmiData({...emiData, amount: e.target.value})} placeholder="e.g. 500000" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium" />
                      </div>
                      <div>
                        <label className="text-sm font-bold text-slate-700 block mb-2">Interest Rate (% p.a.)</label>
                        <input type="number" value={emiData.rate} onChange={(e)=>setEmiData({...emiData, rate: e.target.value})} placeholder="e.g. 8.5" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium" />
                      </div>
                      <div>
                        <label className="text-sm font-bold text-slate-700 block mb-2">Loan Tenure (Years)</label>
                        <input type="number" value={emiData.tenure} onChange={(e)=>setEmiData({...emiData, tenure: e.target.value})} placeholder="e.g. 5" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium" />
                      </div>
                      <div className="flex gap-3 pt-2">
                        <button onClick={() => {setEmiData(initialEmi); setEmiResult(null)}} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                          <RotateCcw className="w-4 h-4"/> Reset
                        </button>
                        <button onClick={calcEMI} className="flex-[2] py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors shadow-md">Calculate</button>
                      </div>
                    </div>

                    <div className="bg-slate-900 rounded-2xl p-6 text-white flex flex-col justify-center">
                      <p className="text-slate-400 font-medium mb-1 text-sm">Monthly EMI</p>
                      <h3 className="text-4xl font-extrabold text-emerald-400 mb-6">{emiResult ? `₹${emiResult.monthly.toLocaleString()}` : '₹0'}</h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between border-b border-slate-700 pb-2">
                          <span className="text-slate-400">Principal Amount</span>
                          <span className="font-bold">₹{emiResult ? Number(emiResult.totalAmount - emiResult.totalInterest).toLocaleString() : '0'}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-700 pb-2">
                          <span className="text-slate-400">Total Interest</span>
                          <span className="font-bold text-amber-400">{emiResult ? `₹${emiResult.totalInterest.toLocaleString()}` : '₹0'}</span>
                        </div>
                        <div className="flex justify-between pt-1">
                          <span className="text-slate-400">Total Payable</span>
                          <span className="font-bold text-white">{emiResult ? `₹${emiResult.totalAmount.toLocaleString()}` : '₹0'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* --- SIP TOOL --- */}
              {activeTool === "sip" && (
                <div className="animate-[fadeIn_0.3s_ease-in-out] flex-grow">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <TrendingUp className="text-indigo-600 w-6 h-6" /> SIP Return Calculator
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-bold text-slate-700 block mb-2">Monthly Investment (₹)</label>
                        <input type="number" value={sipData.amount} onChange={(e)=>setSipData({...sipData, amount: e.target.value})} placeholder="e.g. 5000" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium" />
                      </div>
                      <div>
                        <label className="text-sm font-bold text-slate-700 block mb-2">Expected Return (% p.a.)</label>
                        <input type="number" value={sipData.rate} onChange={(e)=>setSipData({...sipData, rate: e.target.value})} placeholder="e.g. 12" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium" />
                      </div>
                      <div>
                        <label className="text-sm font-bold text-slate-700 block mb-2">Time Period (Years)</label>
                        <input type="number" value={sipData.tenure} onChange={(e)=>setSipData({...sipData, tenure: e.target.value})} placeholder="e.g. 10" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium" />
                      </div>
                      <div className="flex gap-3 pt-2">
                        <button onClick={() => {setSipData(initialSip); setSipResult(null)}} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                          <RotateCcw className="w-4 h-4"/> Reset
                        </button>
                        <button onClick={calcSIP} className="flex-[2] py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors shadow-md">Calculate</button>
                      </div>
                    </div>
                    <div className="bg-slate-900 rounded-2xl p-6 text-white flex flex-col justify-center">
                      <p className="text-slate-400 font-medium mb-1 text-sm">Total Expected Value</p>
                      <h3 className="text-4xl font-extrabold text-emerald-400 mb-6">{sipResult ? `₹${sipResult.total.toLocaleString()}` : '₹0'}</h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between border-b border-slate-700 pb-2">
                          <span className="text-slate-400">Total Investment</span>
                          <span className="font-bold">{sipResult ? `₹${sipResult.invested.toLocaleString()}` : '₹0'}</span>
                        </div>
                        <div className="flex justify-between pt-1">
                          <span className="text-slate-400">Wealth Gained</span>
                          <span className="font-bold text-indigo-400">{sipResult ? `+₹${sipResult.wealthGain.toLocaleString()}` : '₹0'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* --- GST TOOL --- */}
              {activeTool === "gst" && (
                <div className="animate-[fadeIn_0.3s_ease-in-out] flex-grow">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <Percent className="text-indigo-600 w-6 h-6" /> GST Calculator
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-bold text-slate-700 block mb-2">Amount (₹)</label>
                        <input type="number" value={gstData.amount} onChange={(e)=>setGstData({...gstData, amount: e.target.value})} placeholder="e.g. 1000" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium" />
                      </div>
                      <div>
                        <label className="text-sm font-bold text-slate-700 block mb-2">GST Rate (%)</label>
                        <input type="number" value={gstData.rate} onChange={(e)=>setGstData({...gstData, rate: e.target.value})} placeholder="e.g. 18" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium" />
                      </div>
                      <div>
                         <label className="text-sm font-bold text-slate-700 block mb-2">Calculation Type</label>
                         <div className="flex gap-2">
                           <button onClick={()=>setGstData({...gstData, type: "add"})} className={`flex-1 py-3 rounded-lg font-bold text-sm transition-colors border ${gstData.type === 'add' ? 'bg-indigo-50 border-indigo-600 text-indigo-700' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>+ Add GST</button>
                           <button onClick={()=>setGstData({...gstData, type: "remove"})} className={`flex-1 py-3 rounded-lg font-bold text-sm transition-colors border ${gstData.type === 'remove' ? 'bg-indigo-50 border-indigo-600 text-indigo-700' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>- Remove GST</button>
                         </div>
                      </div>
                      <div className="flex gap-3 pt-2">
                        <button onClick={() => {setGstData(initialGst); setGstResult(null)}} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                          <RotateCcw className="w-4 h-4"/> Reset
                        </button>
                        <button onClick={calcGST} className="flex-[2] py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors shadow-md">Calculate</button>
                      </div>
                    </div>
                    <div className="bg-slate-900 rounded-2xl p-6 text-white flex flex-col justify-center">
                      <p className="text-slate-400 font-medium mb-1 text-sm">Total Price</p>
                      <h3 className="text-4xl font-extrabold text-emerald-400 mb-6">{gstResult ? `₹${gstResult.total.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits:2})}` : '₹0'}</h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between border-b border-slate-700 pb-2">
                          <span className="text-slate-400">Net Price</span>
                          <span className="font-bold">{gstResult ? `₹${gstResult.net.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits:2})}` : '₹0'}</span>
                        </div>
                        <div className="flex justify-between pt-1">
                          <span className="text-slate-400">GST Amount</span>
                          <span className="font-bold text-amber-400">{gstResult ? `₹${gstResult.gst.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits:2})}` : '₹0'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* --- CURRENCY CONVERTER --- */}
              {activeTool === "currency" && (
                <div className="animate-[fadeIn_0.3s_ease-in-out] flex-grow">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <Globe className="text-indigo-600 w-6 h-6" /> Currency Converter
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-bold text-slate-700 block mb-2">Amount</label>
                        <input type="number" value={currData.amount} onChange={(e)=>setCurrData({...currData, amount: e.target.value})} placeholder="e.g. 100" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium" />
                      </div>
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <label className="text-sm font-bold text-slate-700 block mb-2">From</label>
                          <select value={currData.from} onChange={(e)=>setCurrData({...currData, from: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold">
                            {Object.keys(rates).length > 0 ? Object.keys(rates).map(c => <option key={c} value={c}>{c}</option>) : <option>USD</option>}
                          </select>
                        </div>
                        <div className="flex-1">
                          <label className="text-sm font-bold text-slate-700 block mb-2">To</label>
                          <select value={currData.to} onChange={(e)=>setCurrData({...currData, to: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold">
                            {Object.keys(rates).length > 0 ? Object.keys(rates).map(c => <option key={c} value={c}>{c}</option>) : <option>INR</option>}
                          </select>
                        </div>
                      </div>
                      <div className="flex gap-3 pt-2">
                        <button onClick={() => {setCurrData(initialCurr); setCurrResult(null)}} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                          <RotateCcw className="w-4 h-4"/> Reset
                        </button>
                        <button onClick={calcCurr} className="flex-[2] py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors shadow-md">Convert</button>
                      </div>
                    </div>
                    <div className="bg-slate-900 rounded-2xl p-6 text-white flex flex-col justify-center items-center text-center">
                      <p className="text-slate-400 font-medium mb-4 text-sm">Converted Amount</p>
                      <h3 className="text-5xl font-extrabold text-emerald-400 mb-2">{currResult ? currResult : '0.00'}</h3>
                      <p className="text-lg font-bold text-slate-300">{currData.to}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* --- UNIT CONVERTER --- */}
              {activeTool === "unit" && (
                <div className="animate-[fadeIn_0.3s_ease-in-out] flex-grow">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <Scale className="text-indigo-600 w-6 h-6" /> Unit Converter
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-bold text-slate-700 block mb-2">Conversion Type</label>
                        <select value={unitData.category} onChange={(e)=>{
                            const cat = e.target.value;
                            const firstUnit = Object.keys(unitFactors[cat])[0];
                            const secondUnit = Object.keys(unitFactors[cat])[1];
                            setUnitData({...unitData, category: cat, from: firstUnit, to: secondUnit});
                          }} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold capitalize">
                          {Object.keys(unitFactors).map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-bold text-slate-700 block mb-2">Value</label>
                        <input type="number" value={unitData.amount} onChange={(e)=>setUnitData({...unitData, amount: e.target.value})} placeholder="e.g. 10" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium" />
                      </div>
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <label className="text-sm font-bold text-slate-700 block mb-2">From</label>
                          <select value={unitData.from} onChange={(e)=>setUnitData({...unitData, from: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold">
                            {Object.keys(unitFactors[unitData.category]).map(u => <option key={u} value={u}>{u}</option>)}
                          </select>
                        </div>
                        <div className="flex-1">
                          <label className="text-sm font-bold text-slate-700 block mb-2">To</label>
                          <select value={unitData.to} onChange={(e)=>setUnitData({...unitData, to: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold">
                            {Object.keys(unitFactors[unitData.category]).map(u => <option key={u} value={u}>{u}</option>)}
                          </select>
                        </div>
                      </div>
                      <div className="flex gap-3 pt-2">
                        <button onClick={() => {setUnitData(initialUnit); setUnitResult(null)}} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                          <RotateCcw className="w-4 h-4"/> Reset
                        </button>
                        <button onClick={calcUnit} className="flex-[2] py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors shadow-md">Convert</button>
                      </div>
                    </div>
                    <div className="bg-slate-900 rounded-2xl p-6 text-white flex flex-col justify-center items-center text-center">
                      <p className="text-slate-400 font-medium mb-4 text-sm">Converted Value</p>
                      <h3 className="text-5xl font-extrabold text-emerald-400 mb-2">{unitResult ? unitResult : '0.00'}</h3>
                      <p className="text-lg font-bold text-slate-300">{unitData.to}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* --- BMI TOOL --- */}
              {activeTool === "bmi" && (
                <div className="animate-[fadeIn_0.3s_ease-in-out] flex-grow">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <Activity className="text-indigo-600 w-6 h-6" /> BMI Calculator
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-bold text-slate-700 block mb-2">Weight (kg)</label>
                        <input type="number" value={bmiData.weight} onChange={(e)=>setBmiData({...bmiData, weight: e.target.value})} placeholder="e.g. 70" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium" />
                      </div>
                      <div>
                        <label className="text-sm font-bold text-slate-700 block mb-2">Height (cm)</label>
                        <input type="number" value={bmiData.height} onChange={(e)=>setBmiData({...bmiData, height: e.target.value})} placeholder="e.g. 175" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium" />
                      </div>
                      <div className="flex gap-3 pt-2">
                        <button onClick={() => {setBmiData(initialBmi); setBmiResult(null)}} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                          <RotateCcw className="w-4 h-4"/> Reset
                        </button>
                        <button onClick={calcBMI} className="flex-[2] py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors shadow-md">Calculate</button>
                      </div>
                    </div>
                    <div className="bg-slate-900 rounded-2xl p-6 text-white flex flex-col justify-center items-center text-center">
                      <p className="text-slate-400 font-medium mb-2 text-sm">Your BMI Score</p>
                      <h3 className={`text-5xl font-extrabold mb-2 ${bmiResult ? bmiResult.color : 'text-slate-500'}`}>{bmiResult ? bmiResult.score : '0.0'}</h3>
                      {bmiResult && (
                        <div className={`px-4 py-1.5 rounded-full font-bold text-sm mb-4 border ${bmiResult.color.replace('text', 'border')} ${bmiResult.color}`}>
                          {bmiResult.status}
                        </div>
                      )}
                      <p className="text-xs text-slate-400 px-4 mt-2">Normal BMI range is 18.5 - 24.9. Maintaining a healthy weight helps prevent diseases.</p>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/*  SEO CONTENT BLOCK */}
            <div className="bg-slate-50 border-t border-slate-200 pt-8 mb-10 text-slate-600 text-sm">
              {activeTool === "emi" && (
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">About the Free EMI Calculator</h3>
                  <p className="mb-4">Equated Monthly Installment (EMI) is a fixed payment amount made by a borrower to a lender at a specified date each calendar month. Equated monthly installments are used to pay off both interest and principal each month so that over a specified number of years, the loan is paid off in full.</p>
                  <p><strong>Formula used:</strong> EMI = [P x R x (1+R)^N]/[(1+R)^N-1]</p>
                </div>
              )}
              {activeTool === "sip" && (
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">How does the SIP Calculator work?</h3>
                  <p className="mb-4">A Systematic Investment Plan (SIP) allows you to invest a certain predefined amount at a regular interval (monthly, quarterly, etc.). A SIP calculator is a tool that helps you determine the wealth gain and expected returns for your monthly SIP investment.</p>
                  <p>Mutual fund investments are subject to market risks, but long-term compounding can significantly grow your wealth.</p>
                </div>
              )}
              {activeTool === "gst" && (
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Understanding the GST Calculator</h3>
                  <p className="mb-4">Goods and Services Tax (GST) is an indirect tax used in India on the supply of goods and services. Our free GST calculator allows you to quickly figure out the final price of a product, or extract the base price if GST is already included.</p>
                  <p><strong>Common Rates:</strong> 5%, 12%, 18%, and 28%.</p>
                </div>
              )}
            </div>
            
          </div>
        </div>

        {/* Cross-Sell Banner */}
        <div className="w-full bg-slate-900 rounded-3xl p-8 md:p-12 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl group">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg shrink-0">
              <FileSpreadsheet className="w-8 h-8 text-white" />
            </div>
            <div>
              <h4 className="text-2xl font-extrabold text-white mb-2">Loved these free tools?</h4>
              <p className="text-sm font-medium text-slate-400 max-w-lg">Save hours of manual calculation work with our premium Excel & Google Sheets automated systems.</p>
            </div>
          </div>
          <button 
            onClick={() => onNavigate("templates")}
            className="w-full md:w-auto whitespace-nowrap px-8 py-4 bg-indigo-500 hover:bg-indigo-400 text-white font-extrabold rounded-xl transition-all shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] flex items-center justify-center gap-2"
          >
            Browse Premium Templates <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </div>
  );
}