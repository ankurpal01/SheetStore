import { Scale, ArrowLeft, CheckCircle, Copyright, AlertTriangle, FileText, XCircle } from "lucide-react";

export default function TermsPage({ onNavigate }) {
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
            <Scale className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Terms of <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">Service</span>
          </h1>
          <p className="text-slate-500 font-medium text-lg">
            Last updated: {lastUpdated}
          </p>
        </div>

        {/* Content Container */}
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200 space-y-12 text-slate-600 leading-relaxed">
          
          <p className="text-lg">
            Welcome to <strong>SheetStore</strong>. These Terms of Service ("Terms") govern your access to and use of our website, digital products, and services. By purchasing or using our templates, you agree to be bound by these Terms.
          </p>

          {/* Section 1 */}
          <div className="space-y-4">
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="p-2 bg-blue-50 rounded-lg"><CheckCircle className="w-5 h-5 text-blue-600" /></div>
              1. Agreement to Terms
            </h2>
            <div className="pl-11">
              <p>
                By accessing our website and purchasing our digital spreadsheets (Excel files and Google Sheets links), you confirm that you are at least 18 years old and have the legal capacity to enter into these Terms.
              </p>
            </div>
          </div>

          {/* Section 2 - Important License Rules */}
          <div className="space-y-4">
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="p-2 bg-indigo-50 rounded-lg"><Copyright className="w-5 h-5 text-indigo-600" /></div>
              2. Intellectual Property & License
            </h2>
            <div className="pl-11 space-y-6">
              <p>
                When you buy a template from SheetStore, you are not buying the rights to the software; you are purchasing a <strong>single-user, non-exclusive, non-transferable license</strong> to use it.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-xl">
                  <h3 className="font-bold text-emerald-900 flex items-center gap-2 mb-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600" /> You CAN:
                  </h3>
                  <ul className="text-sm space-y-2 text-emerald-800">
                    <li>• Modify formulas and design for your own business.</li>
                    <li>• Generate reports to share with your clients or team.</li>
                    <li>• Use the template indefinitely for personal or internal business use.</li>
                  </ul>
                </div>
                
                <div className="bg-rose-50 border border-rose-100 p-5 rounded-xl">
                  <h3 className="font-bold text-rose-900 flex items-center gap-2 mb-3">
                    <XCircle className="w-5 h-5 text-rose-600" /> You CANNOT:
                  </h3>
                  <ul className="text-sm space-y-2 text-rose-800">
                    <li>• Resell or redistribute the actual template file.</li>
                    <li>• Share the access link publicly online.</li>
                    <li>• Claim the original template design or logic as your own.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3 - Disclaimer */}
          <div className="space-y-4">
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="p-2 bg-amber-50 rounded-lg"><AlertTriangle className="w-5 h-5 text-amber-600" /></div>
              3. Disclaimer of Liability
            </h2>
            <div className="pl-11">
              <div className="p-6 bg-slate-50 border-l-4 border-amber-500 rounded-r-xl text-slate-700 italic">
                <p className="mb-2">
                  The templates are provided "as is" and without warranties of any kind. While we strive to ensure all formulas and logic are accurate, <strong>we are not liable for any financial losses, data loss, or business damages</strong> resulting from the use of our spreadsheet models.
                </p>
                <p>
                  You are solely responsible for verifying the accuracy of calculations before making financial or business decisions based on our templates.
                </p>
              </div>
            </div>
          </div>

          {/* Section 4 */}
          <div className="space-y-4">
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="p-2 bg-purple-50 rounded-lg"><FileText className="w-5 h-5 text-purple-600" /></div>
              4. Modifications
            </h2>
            <div className="pl-11">
              <p>
                We reserve the right to modify these terms at any time. Changes will become effective immediately upon being posted on this page. Your continued use of SheetStore after changes are posted constitutes your acceptance of the new terms.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}