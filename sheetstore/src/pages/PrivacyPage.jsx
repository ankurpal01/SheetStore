import { ShieldCheck, Lock, User, Mail, Cookie, Server, ArrowLeft } from "lucide-react";

export default function PrivacyPage({ onNavigate }) {
  const lastUpdated = new Date().toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-slate-50 relative pb-24 selection:bg-indigo-200">
      
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)`,
          backgroundSize: '30px 30px'
      }}></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-16">
        
        {/* Navigation / Back button */}
        {onNavigate && (
          <button 
            onClick={() => onNavigate("home")}
            className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </button>
        )}

        {/* Header */}
        <div className="text-center mb-12 animate-[fadeIn_0.5s_ease-out]">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-6 shadow-inner border border-indigo-200">
            <ShieldCheck className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Privacy <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">Policy</span>
          </h1>
          <p className="text-slate-500 font-medium text-lg">
            Last updated: {lastUpdated}
          </p>
        </div>

        {/* Content Container */}
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200 space-y-10 text-slate-600 leading-relaxed">
          
          <p className="text-lg">
            At <strong>SheetStore</strong>, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and purchase our digital products (Excel & Google Sheets templates).
          </p>

          {/* Section 1 */}
          <div className="space-y-3">
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 flex items-center gap-3">
              <div className="p-2 bg-indigo-50 rounded-lg"><User className="w-5 h-5 text-indigo-600" /></div>
              1. Information We Collect
            </h2>
            <div className="pl-11 space-y-3">
              <p>We collect information that you voluntarily provide to us when you make a purchase or contact us for support. This includes:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Personal Data:</strong> Name and email address required to send your purchased digital files.</li>
                <li><strong>Financial Data:</strong> We use secure third-party payment gateways. We do <strong>not</strong> store your credit card or bank details on our servers.</li>
              </ul>
            </div>
          </div>

          {/* Section 2 */}
          <div className="space-y-3">
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 flex items-center gap-3">
              <div className="p-2 bg-emerald-50 rounded-lg"><Lock className="w-5 h-5 text-emerald-600" /></div>
              2. Payment Security (Razorpay)
            </h2>
            <div className="pl-11 space-y-3">
              <p>
                All transactions on our website are securely processed using <strong>Razorpay</strong>. Your payment data is encrypted through the Payment Card Industry Data Security Standard (PCI-DSS). 
                We only receive the transaction status and order ID to deliver your templates instantly.
              </p>
            </div>
          </div>

          {/* Section 3 */}
          <div className="space-y-3">
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg"><Server className="w-5 h-5 text-blue-600" /></div>
              3. How We Use Your Information
            </h2>
            <div className="pl-11 space-y-3">
              <p>We use the information we collect primarily to deliver our services:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>To process your transactions and deliver the purchased digital products.</li>
                <li>To send administrative information, such as purchase receipts and updates.</li>
                <li>To respond to customer service requests and provide support.</li>
              </ul>
            </div>
          </div>

          {/* Section 4 */}
          <div className="space-y-3">
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 flex items-center gap-3">
              <div className="p-2 bg-amber-50 rounded-lg"><Cookie className="w-5 h-5 text-amber-600" /></div>
              4. Cookies and Analytics
            </h2>
            <div className="pl-11 space-y-3">
              <p>
                We use <strong>Google Analytics</strong> to track website traffic and user behavior. This helps us understand what templates our users find most valuable. Google Analytics uses cookies to collect anonymous data about your visit, such as your IP address, browser type, and pages viewed. 
              </p>
            </div>
          </div>

          {/* Section 5 */}
          <div className="space-y-3">
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 flex items-center gap-3">
              <div className="p-2 bg-purple-50 rounded-lg"><Mail className="w-5 h-5 text-purple-600" /></div>
              5. Contact Us
            </h2>
            <div className="pl-11 space-y-3">
              <p>If you have questions or comments about this Privacy Policy, please contact us at:</p>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl inline-block mt-2">
                <p className="font-bold text-slate-900">SheetStore Support</p>
                <p className="text-indigo-600 font-medium">palankur1508@email.com</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}