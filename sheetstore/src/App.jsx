import { useState, useEffect } from "react";
import ReactGA from "react-ga4";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Toast from "./components/Toast";

import HomePage from "./pages/HomePage";
import TemplatesPage from "./pages/TemplatesPage";
import TemplateDetailPage from "./pages/TemplateDetailPage";
import CategoriesPage from "./pages/CategoriesPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import SuccessPage from "./pages/SuccessPage";
import AdminPage from "./pages/AdminPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import RefundPage from "./pages/RefundPage";
import FreeToolsPage from "./pages/FreeToolsPage";
import { ArrowUp } from 'lucide-react';
import ShippingPolicy from "./pages/ShippingPolicy";

// ==========================================
// 🚀 ANALYTICS SAFETY INITIALIZATION
// ==========================================
const GA_ID = import.meta.env.VITE_GA_ID || import.meta.env.VITE_GA_MEASUREMENT_ID;
if (GA_ID) {
  ReactGA.initialize(GA_ID);
}

// Backend URL selection (Local vs Production)
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://sheetstore-backend.onrender.com";

export default function App() {
  // ==============================
  // 1️⃣ SMART ROUTING LOGIC (UPDATED FOR VERCEL FIX)
  // ==============================
  const [route, setRoute] = useState(() => {
    const path = window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);
    
    // 🔥 JADUU YAHAN HAI: Agar URL mein orderId hai, toh seedha Success Page kholo!
    if (searchParams.has("orderId")) {
      return { path: "success", params: { orderId: searchParams.get("orderId") } };
    }

    if (path === "/admin") return { path: "admin", params: {} };
    return { path: "home", params: {} };
  });

  const [toastConfig, setToastConfig] = useState({ isVisible: false, message: "" });
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isProgressVisible, setIsProgressVisible] = useState(false);

  // ==============================
  // 2️⃣ SCROLL & PROGRESS EFFECTS
  // ==============================
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  useEffect(() => {
    window.scrollTo(0, 0);

    // Track Page View
    if (GA_ID) {
      ReactGA.send({ hitType: "pageview", page: window.location.pathname });
    }

    // Progress Bar Animation
    setIsProgressVisible(true);
    setProgress(0);
    const step1 = setTimeout(() => setProgress(35), 100);
    const step2 = setTimeout(() => setProgress(75), 300);
    const step3 = setTimeout(() => setProgress(100), 500);

    const hideTimer = setTimeout(() => {
      setIsProgressVisible(false);
    }, 800);

    return () => {
      clearTimeout(step1); clearTimeout(step2); clearTimeout(step3); clearTimeout(hideTimer);
    };
  }, [route.path, route.params]);

  // ==============================
  // 3️⃣ NAVIGATION HANDLER
  // ==============================
  const navigate = (path, params = {}) => {
    // Basic browser history support
    const url = path === "home" ? "/" : `/${path}`;
    window.history.pushState({}, "", url);
    setRoute({ path, params });
  };

  // ==============================
  // 💳 REAL PAYMENT LOGIC
  // ==============================
  const handleBuyClick = async (template) => {
    try {
      if (GA_ID) ReactGA.event({ category: "Conversion", action: "Click Buy Now", label: template.title });

      const orderRes = await fetch(`${API_BASE_URL}/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          amount: template.price, 
          templateId: template._id, 
          templateName: template.title 
        })
      });

      if (!orderRes.ok) throw new Error("Backend connection failed");
      const order = await orderRes.json();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "SheetStore",
        description: template.title,
        order_id: order.id,
        handler: async function (response) {
          try {
            const verifyRes = await fetch(`${API_BASE_URL}/verify-payment`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response)
            });
            const data = await verifyRes.json();

            if (data.success) {
              if (GA_ID) ReactGA.event({ category: "Sales", action: "Payment Success", label: template.title });
              
              // 🔥 YAHAN CHANGE KIYA HAI: Safe URL Redirect taaki screen wapas home par na jaye
              window.location.href = `/?orderId=${response.razorpay_order_id}`;
            } else {
              alert("Payment verification failed. Please contact support.");
            }
          } catch (err) {
            console.error("Verification failed", err);
            alert("Payment verification server error.");
          }
        },
        theme: { color: "#4f46e5" }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Something went wrong with the payment gateway.");
    }
  };

  // ==============================
  // 4️⃣ RENDER SWITCH
  // ==============================
  const renderPage = () => {
    switch (route.path) {
      case "home": return <HomePage onNavigate={navigate} onBuy={handleBuyClick} />;
      case "templates": return <TemplatesPage onNavigate={navigate} onBuy={handleBuyClick} />;
      case "template": return <TemplateDetailPage id={route.params.id} onNavigate={navigate} onBuy={handleBuyClick} />;
      case "categories": return <CategoriesPage onNavigate={navigate} />;
      case "category": return <TemplatesPage onNavigate={navigate} onBuy={handleBuyClick} initialCategory={route.params.name} />;
      case "about": return <AboutPage />;
      case "tools": return <FreeToolsPage onNavigate={navigate} />;
      case "privacy": return <PrivacyPage onNavigate={navigate} />;
      case "terms": return <TermsPage onNavigate={navigate} />;
      case "refund": return <RefundPage onNavigate={navigate} />;
      case "contact": return <ContactPage onNavigate={navigate} />;
      case "shipping": return <ShippingPolicy />;
      case "admin": return <AdminPage onNavigate={navigate} />;
      case "success": return <SuccessPage orderId={route.params.orderId} onNavigate={navigate} />;
      default: return <HomePage onNavigate={navigate} onBuy={handleBuyClick} />;
    }
  };

  const circleRadius = 40;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circleCircumference - (progress / 100) * circleCircumference;

  return (
    <div className="min-h-screen flex flex-col relative font-sans selection:bg-indigo-100">
      
      {/* 🚀 PROGRESS LOADER */}
      {isProgressVisible && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-md transition-all duration-500">
          <div className="relative flex items-center justify-center w-32 h-32">
            <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r={circleRadius} stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-800" />
              <circle cx="50" cy="50" r={circleRadius} stroke="currentColor" strokeWidth="4" fill="transparent"
                strokeDasharray={circleCircumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round"
                className="text-indigo-500 transition-all duration-300 ease-out drop-shadow-[0_0_10px_rgba(79,70,229,0.6)]" />
            </svg>
            <span className="absolute text-white font-black text-2xl">{progress}%</span>
          </div>
          <p className="mt-6 text-indigo-400 font-bold tracking-widest animate-pulse uppercase text-xs">Initializing SheetStore</p>
        </div>
      )}

      <Navbar onNavigate={navigate} currentPath={route.path} />
      <main className="flex-grow">{renderPage()}</main>
      <Footer onNavigate={navigate} />

      <Toast message={toastConfig.message} isVisible={toastConfig.isVisible} onClose={() => setToastConfig({ isVisible: false, message: "" })} />

      {/* SCROLL TO TOP */}
      {showScrollTop && (
        <button onClick={scrollToTop} className="fixed bottom-8 right-8 z-50 p-4 rounded-2xl bg-indigo-600 text-white shadow-2xl shadow-indigo-500/40 hover:-translate-y-2 transition-all duration-300">
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}