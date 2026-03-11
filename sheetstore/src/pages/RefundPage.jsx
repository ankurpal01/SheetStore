import { RefreshCcw, ArrowLeft, ShieldAlert, FileX, Copy, Mail, AlertTriangle } from "lucide-react";

export default function RefundPage({ onNavigate }) {
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
            <RefreshCcw className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Refund <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">Policy</span>
          </h1>
          <p className="text-slate-500 font-medium text-lg">
            Last updated: {lastUpdated}
          </p>
        </div>

        {/* Content Container */}
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200 space-y-10 text-slate-600 leading-relaxed">
          
          <p className="text-lg">
            At <strong>SheetStore</strong>, we want to ensure you are 100% happy with your purchase. However, due to the nature of digital goods, our refund policy differs from physical products.
          </p>

          {/* Strict Policy Alert Box */}
          <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start">
            <div className="bg-white p-3 rounded-full shadow-sm shrink-0">
              <ShieldAlert className="w-8 h-8 text-rose-500" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-rose-900 mb-2">General Rule for Digital Downloads</h2>
              <p className="text-rose-700/80 font-medium">
                Because our products are digital spreadsheets (Excel and Google Sheets) that are instantly downloaded and accessed, <strong>all sales are considered final</strong>. We generally do not offer refunds, exchanges, or cancellations once a file has been downloaded or a Google Sheet link has been accessed.
              </p>
            </div>
          </div>

          {/* Exceptions Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="p-2 bg-emerald-50 rounded-lg"><AlertTriangle className="w-5 h-5 text-emerald-600" /></div>
              Exceptions to the Rule
            </h2>
            <p className="font-medium">We may, at our sole discretion, issue a refund in the following exceptional circumstances:</p>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Point 1 */}
              <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl">
                <FileX className="w-6 h-6 text-indigo-500 mb-4" />
                <h3 className="font-bold text-slate-900 mb-2">Corrupted Files</h3>
                <p className="text-sm">The file you downloaded is corrupted or broken, and our support team is unable to provide a working replacement within 48 hours.</p>
              </div>

              {/* Point 2 */}
              <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl">
                <Copy className="w-6 h-6 text-indigo-500 mb-4" />
                <h3 className="font-bold text-slate-900 mb-2">Accidental Duplicate</h3>
                <p className="text-sm">You accidentally made a duplicate purchase of the exact same template within a 24-hour period.</p>
              </div>
            </div>
          </div>

          {/* Support Section */}
          <div className="bg-indigo-600 rounded-3xl p-8 md:p-10 text-white shadow-xl mt-12 text-center">
            <Mail className="w-10 h-10 mx-auto mb-4 text-indigo-200" />
            <h2 className="text-2xl font-bold mb-4">Need Technical Help?</h2>
            <p className="text-indigo-100 mb-6 max-w-lg mx-auto">
              Most issues can be solved easily! If your formula isn't working or you don't know how to open the file, please contact us before requesting a refund.
            </p>
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 font-bold rounded-xl shadow-sm">
              support@sheetstore.in
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}