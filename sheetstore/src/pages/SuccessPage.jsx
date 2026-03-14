import { useEffect, useState } from "react";
import { CheckCircle, Download, Link as LinkIcon, ArrowRight, FileSpreadsheet, FileText } from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export default function SuccessPage({ orderId, onNavigate }) {
  const [order, setOrder] = useState(null);
  const [template, setTemplate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSuccessData = async () => {
      try {
        
        const orderRes = await fetch(`${import.meta.env.VITE_API_URL}/order/${orderId}`);
        const orderData = await orderRes.json();
        setOrder(orderData);

        if (orderData && orderData.templateId) {
       
          const tempRes = await fetch(`${import.meta.env.VITE_API_URL}/templates`);
          const allTemplates = await tempRes.json();
          const purchasedTemplate = allTemplates.find(t => t._id === orderData.templateId);
          setTemplate(purchasedTemplate);
        }
      } catch (err) {
        console.error("Error fetching order details:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (orderId) {
      fetchSuccessData();
    }
  }, [orderId]);

  // 🔥 Dynamic Invoice Generator with GST Calculation
  const generateInvoice = () => {
    try {
      if (!order) return alert("Order data missing!");

      const doc = new jsPDF();
      const totalAmount = Number(order.amount) || 0;
      const gstRate = 0.18;
      const basePrice = (totalAmount / (1 + gstRate)).toFixed(2);
      const gstAmount = (totalAmount - basePrice).toFixed(2);

      // --- 1. BRANDING SECTION ---
      doc.setFillColor(79, 70, 229); // Indigo Header Background
      doc.rect(0, 0, 210, 40, 'F'); 
      
      doc.setFontSize(28);
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.text("SheetStore", 14, 25);
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("Premium Spreadsheet Systems | sheetstore.in", 14, 32);

      // --- 2. INVOICE INFO ---
      doc.setTextColor(50, 50, 50);
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("TAX INVOICE", 140, 60);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Invoice No: #SS-${order.razorpay_order_id.substring(6, 14).toUpperCase()}`, 140, 70);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 140, 75);
      doc.text(`Payment ID: ${order.razorpay_payment_id || 'SUCCESS'}`, 140, 80);

      // --- 3. BILLING DETAILS ---
      doc.setFont("helvetica", "bold");
      doc.text("Billed From:", 14, 60);
      doc.setFont("helvetica", "normal");
      doc.text("SheetStore India", 14, 65);
      doc.text("Email: palankur1508@email.com", 14, 70); 

      // --- 4. PRODUCT TABLE ---
      autoTable(doc, {
        startY: 95,
        head: [['Product Description', 'Base Price', 'GST (18%)', 'Total Amount']],
        body: [
          [order.templateName, `INR ${basePrice}`, `INR ${gstAmount}`, `INR ${totalAmount}`]
        ],
        headStyles: { fillColor: [79, 70, 229], fontSize: 11, halign: 'center' },
        columnStyles: {
          0: { cellWidth: 80 },
          1: { halign: 'right' },
          2: { halign: 'right' },
          3: { halign: 'right', fontStyle: 'bold' }
        },
        styles: { fontSize: 10, cellPadding: 5 }
      });

      // --- 5. SUMMARY & TOTAL ---
      const finalY = doc.lastAutoTable.finalY + 10;
      doc.setDrawColor(200, 200, 200);
      doc.line(130, finalY, 196, finalY); // Horizontal Line

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(`Grand Total:`, 130, finalY + 10);
      doc.text(`INR ${totalAmount}`, 196, finalY + 10, { align: 'right' });

      // --- 6. FOOTER & SUPPORT ---
      const footerY = 260;
      doc.setDrawColor(79, 70, 229);
      doc.setLineWidth(0.5);
      doc.line(14, footerY, 196, footerY);

      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(79, 70, 229);
      doc.text("CUSTOMER SUPPORT & TERMS", 14, footerY + 7);
      
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100);
      doc.text("• For any technical issues, please contact palankur1508@email.com", 14, footerY + 13);
      doc.text("• This is a digital product; no physical copy will be shipped.", 14, footerY + 18);
      doc.text("• This invoice is digitally generated and requires no physical signature.", 14, footerY + 23);

      doc.setFont("helvetica", "italic");
      doc.text("Thank you for choosing SheetStore to master your productivity!", 105, footerY + 32, { align: 'center' });

      // Save PDF
      doc.save(`Invoice_SheetStore_${order.razorpay_order_id.replace('order_', '')}.pdf`);

    } catch (error) {
      console.error("PDF Error:", error);
      alert("Error generating invoice: " + error.message);
    }
  };

  const getSecureCopyLink = (url) => {
    if (!url) return "#";
    if (url.includes("/edit")) return url.replace(/\/edit.*$/, "/copy");
    if (url.endsWith("/copy")) return url;
    return url.endsWith("/") ? `${url}copy` : `${url}/copy`;
  };

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-slate-50">
        <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-bold animate-pulse">Preparing your secure product...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-slate-50 text-center px-4">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Order Not Found</h2>
        <button onClick={() => onNavigate("home")} className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg">Go to Home</button>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] bg-slate-50 py-16 px-4 flex items-center justify-center">
      <div className="max-w-xl w-full">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden text-center p-8 md:p-12 relative">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-emerald-50 to-white"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 border-4 border-white shadow-sm">
              <CheckCircle className="w-10 h-10" />
            </div>

            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Payment Successful!</h1>
            <p className="text-slate-500 mb-8 font-medium">Order ID: <span className="text-slate-700 font-bold">#{order.razorpay_order_id.replace('order_', '')}</span></p>

            <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 text-left mb-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100 shrink-0">
                <FileSpreadsheet className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="overflow-hidden">
                <h3 className="font-bold text-slate-900 truncate">{order.templateName}</h3>
                <p className="text-sm font-semibold text-emerald-600">Total Paid: ₹{order.amount}</p>
              </div>
            </div>

            <div className="w-full space-y-3">
              {template ? (
                template.productType === "google_sheet" ? (
                  <a href={getSecureCopyLink(template.sheetUrl)} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-3 bg-emerald-600 text-white px-8 py-4 rounded-xl font-black shadow-lg hover:-translate-y-1 transition-all">
                    <LinkIcon className="w-6 h-6" /> Make a Copy to Your Drive
                  </a>
                ) : (
                  // 👇 3. YAHAN CHANGE KIYA HAI 👇
                  <a href={`${import.meta.env.VITE_API_URL}/download/${template._id}`} className="w-full flex items-center justify-center gap-3 bg-indigo-600 text-white px-8 py-4 rounded-xl font-black shadow-lg hover:-translate-y-1 transition-all">
                    <Download className="w-6 h-6" /> Download Excel File
                  </a>
                )
              ) : null}

              {/* DOWNLOAD INVOICE BUTTON */}
              <button 
                onClick={generateInvoice}
                className="w-full flex items-center justify-center gap-3 bg-slate-100 hover:bg-slate-200 text-slate-700 px-8 py-4 rounded-xl font-bold border border-slate-300 transition-all"
              >
                <FileText className="w-6 h-6" /> Download Tax Invoice (PDF)
              </button>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <button onClick={() => onNavigate("templates")} className="inline-flex items-center gap-2 text-slate-500 font-bold hover:text-indigo-600 transition-colors group">
            Continue Browsing <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}