import { useState } from "react";
import { CheckCircle2, Send, Mail, Clock, MapPin, MessageSquare, Sparkles } from "lucide-react";

const ContactPage = () => {
  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Pre-sale Question",
    message: ""
  });

  // 👇 YAHAN APNA GOOGLE APPS SCRIPT WALA URL PASTE KAREIN 👇
  const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbzjhxCK2tWRk9Sm363oC3ohli17mG_BDIlNakNJhc8b5riYbZjZnih7XCjpI_rxFzxo9g/exec";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Google Sheet ke liye data format taiyar kar rahe hain
    const formBody = new FormData();
    formBody.append("name", formData.name);
    formBody.append("email", formData.email);
    formBody.append("subject", formData.subject);
    formBody.append("message", formData.message);

    try {
      // Data Google Sheet ko bhej rahe hain
      await fetch(GOOGLE_SHEET_URL, {
        method: "POST",
        body: formBody,
        mode: "no-cors" // Ye error se bachata hai
      });

      setStatus("Message sent successfully! We'll be in touch soon.");
      setFormData({ name: "", email: "", subject: "Pre-sale Question", message: "" });
      
      // 5 second baad success message hata denge
      setTimeout(() => setStatus(""), 5000);
    } catch (error) {
      console.error("Error submitting form", error);
      setStatus("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-200 relative overflow-hidden flex items-center">
      
      {/* Background Subtle Grid & Blobs */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)`, backgroundSize: '24px 24px' }}></div>
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-200/40 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-violet-200/40 rounded-full blur-[120px] pointer-events-none translate-y-1/3 -translate-x-1/3"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 w-full">
        
        <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col lg:flex-row border border-slate-100">
          
          {/* LEFT PANEL (CONTACT INFO) */}
          <div className="bg-slate-900 lg:w-5/12 p-10 lg:p-14 text-white relative overflow-hidden flex flex-col justify-between">
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
            <div className="absolute top-10 right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl"></div>

            <div className="relative z-10">
              <div className="inline-flex items-center justify-center p-3 bg-indigo-500/20 rounded-2xl mb-6 border border-indigo-500/30">
                 <MessageSquare className="w-6 h-6 text-indigo-300" />
              </div>
              <h2 className="text-3xl lg:text-4xl font-extrabold mb-4 tracking-tight">
                Let's talk about <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">your data.</span>
              </h2>
              <p className="text-slate-400 mb-10 leading-relaxed text-lg">
                Need a custom template? Have a question about an existing product? We're here to help you streamline your business.
              </p>

              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
                    <Mail className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 font-medium mb-1">Email us at</p>
                    <a href="mailto:support@sheetstore.com" className="text-white font-bold hover:text-indigo-400 transition-colors">
                      support@sheetstore.in
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
                    <Clock className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 font-medium mb-1">Response Time</p>
                    <p className="text-white font-bold">Within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
                    <MapPin className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 font-medium mb-1">Location</p>
                    <p className="text-white font-bold">New Delhi, India</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-16 pt-8 border-t border-slate-800 flex items-center gap-2 text-sm font-medium text-slate-400">
               <Sparkles className="w-4 h-4 text-indigo-400" />
               Join 10,000+ happy customers
            </div>
          </div>

          {/* RIGHT PANEL (FORM) */}
          <div className="lg:w-7/12 p-10 lg:p-14 bg-white relative">
            <h3 className="text-2xl font-bold text-slate-900 mb-8">Send us a message</h3>

            {status && (
              <div className="mb-8 p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl flex items-center gap-3 font-medium animate-[bounce_0.5s_ease-out]">
                <div className="p-1 bg-emerald-500 rounded-full text-white">
                   <CheckCircle2 className="w-4 h-4" />
                </div>
                {status}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Your Name <span className="text-red-500">*</span></label>
                  <input
                    required
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium text-slate-700 placeholder-slate-400"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Email Address <span className="text-red-500">*</span></label>
                  <input
                    required
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@company.com"
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium text-slate-700 placeholder-slate-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">How can we help? <span className="text-red-500">*</span></label>
                <select 
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium text-slate-700 cursor-pointer"
                >
                  <option>Pre-sale Question</option>
                  <option>Need help with a purchased template</option>
                  <option>Custom Template Request</option>
                  <option>Partnership or Collaboration</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Message <span className="text-red-500">*</span></label>
                <textarea
                  required
                  rows={5}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us everything we need to know..."
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium text-slate-700 placeholder-slate-400 resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-slate-900 text-white font-extrabold rounded-xl hover:bg-indigo-600 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 disabled:bg-slate-400 disabled:cursor-not-allowed group"
              >
                {isSubmitting ? "Sending Message..." : (
                  <>Send Message <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>
                )}
              </button>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;



