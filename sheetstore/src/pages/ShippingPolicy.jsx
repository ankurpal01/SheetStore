import React from 'react';
import { PackageCheck, Mail, Clock, LifeBuoy, ShieldCheck } from "lucide-react";

export default function ShippingPolicy() {
  const policies = [
    {
      id: 1,
      title: "Delivery Method",
      icon: <PackageCheck className="w-6 h-6" />,
      desc: "Once your payment is successfully processed and verified, your order will be delivered instantly. You will receive a direct download link (for Excel/Zip files) or an access link (for Google Sheets) immediately on the payment success page."
    },
    {
      id: 2,
      title: "Email Delivery",
      icon: <Mail className="w-6 h-6" />,
      desc: "A confirmation email containing your order details and the download/access links will also be sent to the email address you provided during checkout."
    },
    {
      id: 3,
      title: "Delivery Time",
      icon: <Clock className="w-6 h-6" />,
      desc: "Delivery is almost always instant. However, in rare cases of technical or network delays, the email delivery may take up to 10-15 minutes."
    },
    {
      id: 4,
      title: "Issues with Delivery",
      icon: <LifeBuoy className="w-6 h-6" />,
      desc: "If you do not receive your download link or face any issues accessing your digital product after a successful payment, please contact our support team immediately. We will resolve the issue within 24 hours."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* ================= HEADER SECTION ================= */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 font-semibold text-sm mb-6 border border-indigo-100">
            <ShieldCheck className="w-4 h-4" />
            100% Digital Delivery
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Shipping & <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Delivery Policy</span>
          </h1>
          <p className="text-slate-500 font-medium">Last Updated: March 14, 2026</p>
        </div>

        {/* ================= INTRO CARD ================= */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 mb-8 text-center text-lg text-slate-600 leading-relaxed">
          At <strong className="text-indigo-600 font-bold">SheetStore</strong>, we provide digital products including Excel templates and Google Sheet links. Since our products are entirely digital, no physical shipping is required, and therefore, no physical delivery will be made to your address.
        </div>

        {/* ================= POLICY POINTS (GRID) ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {policies.map((policy) => (
            <div key={policy.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md hover:border-indigo-100 transition-all duration-300 group">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-5 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                {policy.icon}
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-3">
                {policy.id}. {policy.title}
              </h2>
              <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                {policy.desc}
              </p>
            </div>
          ))}
        </div>

        {/* ================= SUPPORT/CONTACT BOX ================= */}
        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-8 md:p-10 text-center text-white shadow-lg shadow-indigo-200">
          <h3 className="text-2xl font-bold mb-3">Need Help With Your Order?</h3>
          <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
            Our support team is always ready to assist you. If you haven't received your download link, just drop us an email!
          </p>
          <div className="inline-flex items-center justify-center px-6 py-3 bg-white rounded-full text-indigo-600 font-bold shadow-sm hover:scale-105 transition-transform">
            <Mail className="w-5 h-5 mr-2" />
            support@sheetstore.in
          </div>
        </div>

      </div>
    </div>
  );
}