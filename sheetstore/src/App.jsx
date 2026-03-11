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

// Google Analytics Initialize
const GA_ID = import.meta.env.VITE_GA_ID; // G-93CFG53WMT
ReactGA.initialize(GA_ID);

export default function App() {
  // ==============================
  // 1️⃣ SECRET URL LOGIC (ADMIN)
  // ==============================
  const [route, setRoute] = useState(() => {
    if (window.location.pathname === "/admin") {
      return { path: "admin", params: {} };
    }
    return { path: "home", params: {} };
  });

  // ==============================
  // 2️⃣ TOAST NOTIFICATION STATE
  // ==============================
  const [toastConfig, setToastConfig] = useState({
    isVisible: false,
    message: ""
  });

  // ==============================
  // 3️⃣ SCROLL TO TOP STATE
  // ==============================
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ==============================
  // 4️⃣ CIRCULAR LOADING PROGRESS BAR 
  // ==============================
  const [progress, setProgress] = useState(0);
  const [isProgressVisible, setIsProgressVisible] = useState(false);

  // ==============================
  // 5️⃣ ANALYTICS & ROUTE CHANGES
  // ==============================
  useEffect(() => {
    // Scroll to top on page change
    window.scrollTo(0, 0);

    // Google Analytics Page Tracking
    ReactGA.send({ hitType: "pageview", page: window.location.pathname + (route.path !== "home" ? `/${route.path}` : "") });

    // --- Circular Progress Bar Animation Logic ---
    setIsProgressVisible(true);
    setProgress(0);

    // Fake loading steps banayein taaki percentage badhta hua dikhe
    const step1 = setTimeout(() => setProgress(35), 150);
    const step2 = setTimeout(() => setProgress(75), 350);
    const step3 = setTimeout(() => setProgress(100), 550);

    // 100% hone ke thodi der baad hide karein
    const hideTimer = setTimeout(() => {
      setIsProgressVisible(false);
      setTimeout(() => setProgress(0), 300); // Reset after hide
    }, 800);

    return () => {
      clearTimeout(step1);
      clearTimeout(step2);
      clearTimeout(step3);
      clearTimeout(hideTimer);
    };
  }, [route.path]);

  // ==============================
  // 6️⃣ NAVIGATION HANDLER
  // ==============================
  const navigate = (path, params = {}) => {
    if (path === "admin") {
      window.history.pushState({}, "", "/admin");
    } else if (path === "home") {
      window.history.pushState({}, "", "/");
    }
    setRoute({ path, params });
  };

  // ==============================
  // 💳 HANDLE BUY CLICK
  // ==============================
  const handleBuyClick = async (template) => {
    try {
      ReactGA.event({ category: "Conversion", action: "Click Buy Now", label: template.title });

      const orderRes = await fetch("http://localhost:5000/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: template.price, templateId: template._id, templateName: template.title })
      });

      if (!orderRes.ok) throw new Error("Order creation failed");
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
            const verifyRes = await fetch("http://localhost:5000/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response)
            });
            const data = await verifyRes.json();

            if (data.success) {
              ReactGA.event({ category: "Sales", action: "Payment Success", label: template.title, value: template.price });
              setToastConfig({ isVisible: true, message: "Payment Successful!" });
              navigate("success", { orderId: response.razorpay_order_id });
            } else {
              alert("Payment verification failed");
            }
          } catch (err) {
            console.log(err);
            alert("Verification error");
          }
        },
        theme: { color: "#4f46e5" }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.log(error);
      alert("Payment Error");
    }
  };

  // ==============================
  // ROUTER
  // ==============================
  const renderPage = () => {
    switch (route.path) {
      case "home": return <HomePage onNavigate={navigate} onBuy={handleBuyClick} />;
      case "templates": return <TemplatesPage onNavigate={navigate} onBuy={handleBuyClick} />;
      case "template": return <TemplateDetailPage id={route.params.id} onNavigate={navigate} onBuy={handleBuyClick} />;
      case "categories": return <CategoriesPage onNavigate={navigate} />;
      case "category": return <TemplatesPage onNavigate={navigate} onBuy={handleBuyClick} initialCategory={route.params.name} />;
      case "about": return <AboutPage />;
      case "privacy": return <PrivacyPage />;
      case "tools": return <FreeToolsPage onNavigate={navigate} />;
      case "terms": return <TermsPage />;
      case "refund": return <RefundPage />;
      case "contact": return <ContactPage />;
      case "admin": return <AdminPage />;
      case "success": return <SuccessPage orderId={route.params.orderId} onNavigate={navigate} />;
      default: return <HomePage onNavigate={navigate} onBuy={handleBuyClick} />;
    }
  };

  // SVG Circle Logic
  const circleRadius = 40;
  const circleCircumference = 2 * Math.PI * circleRadius; // approx 251.2
  const strokeDashoffset = circleCircumference - (progress / 100) * circleCircumference;

  return (
    <div className="min-h-screen flex flex-col relative">
      
      {/* 🚀 CIRCULAR LOADER WITH BLUR BACKGROUND */}
      {isProgressVisible && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300">
          <div className="relative flex items-center justify-center w-28 h-28">
            {/* Background Track Circle */}
            <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r={circleRadius}
                stroke="currentColor"
                strokeWidth="6"
                fill="transparent"
                className="text-slate-700/50"
              />
              {/* Progress Circle */}
              <circle
                cx="50"
                cy="50"
                r={circleRadius}
                stroke="currentColor"
                strokeWidth="6"
                fill="transparent"
                strokeDasharray={circleCircumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="text-emerald-500 transition-all duration-300 ease-out drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]"
              />
            </svg>
            
            {/* Percentage Text inside Circle */}
            <span className="absolute text-white font-bold text-xl tracking-wider">
              {progress}%
            </span>
          </div>
          <p className="mt-4 text-emerald-400 font-medium tracking-wide animate-pulse">Loading...</p>
        </div>
      )}

      <Navbar onNavigate={navigate} currentPath={route.path} />

      <main className="flex-grow">{renderPage()}</main>

      <Footer onNavigate={navigate} />

      <Toast
        message={toastConfig.message}
        isVisible={toastConfig.isVisible}
        onClose={() => setToastConfig({ isVisible: false, message: "" })}
      />

      {/* SCROLL TO TOP BUTTON */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="fixed bottom-8 right-8 z-50 p-3 rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500 text-white shadow-lg shadow-indigo-500/30 hover:-translate-y-1 hover:shadow-indigo-500/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}
      
    </div>
  );
}