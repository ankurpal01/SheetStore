import React, { useState } from 'react';
import { Plus, Trash2, Printer, CheckCircle2, FileText, Building, User, IndianRupee, DollarSign, Euro } from 'lucide-react';

export default function InvoiceGenerator() {
  const [data, setData] = useState({
    invoiceNumber: 'INV-001',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    currency: '₹',
    bizName: '',
    bizAddress: '',
    bizGst: '',
    clientName: '',
    clientAddress: '',
    clientGst: '',
    items: [{ id: Date.now(), desc: '', hsn: '', qty: 1, price: '' }],
    gstRate: '18',
    discountType: 'percentage',
    discountValue: '',
    notes: 'Thank you for your business!',
    terms: 'Payment is due within 15 days.'
  });

  const currencies = [
    { symbol: '₹', label: 'INR' },
    { symbol: '$', label: 'USD' },
    { symbol: '€', label: 'EUR' },
    { symbol: '£', label: 'GBP' }
  ];

  const updateData = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const addItem = () => {
    setData(prev => ({
      ...prev,
      items: [...prev.items, { id: Date.now(), desc: '', hsn: '', qty: 1, price: '' }]
    }));
  };

  const removeItem = (id) => {
    if (data.items.length === 1) return;
    setData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };

  const updateItem = (id, field, value) => {
    setData(prev => ({
      ...prev,
      items: prev.items.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  // Calculations
  const subtotal = data.items.reduce((sum, item) => sum + (+item.qty || 0) * (+item.price || 0), 0);
  
  let discountAmount = 0;
  let discountPercent = 0;
  
  if (data.discountType === 'percentage') {
    discountPercent = +data.discountValue || 0;
    discountAmount = subtotal * (discountPercent / 100);
  } else {
    discountAmount = +data.discountValue || 0;
    discountPercent = subtotal > 0 ? (discountAmount / subtotal) * 100 : 0;
  }

  const afterDiscount = subtotal - discountAmount;
  const gstAmount = afterDiscount * ((+data.gstRate || 0) / 100);
  const total = afterDiscount + gstAmount;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col gap-10 items-center w-full print:block max-w-4xl mx-auto">
      
      {/* LEFT PANE - FORM (Hidden during print) */}
      <div className="w-full bg-white rounded-3xl border border-slate-200 shadow-xl p-6 md:p-10 shrink-0 print:hidden">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <FileText className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Invoice Details</h2>
        </div>

        <div className="space-y-8">
          {/* Section 1: Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Invoice No.</label>
              <input type="text" value={data.invoiceNumber} onChange={(e) => updateData('invoiceNumber', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-medium text-slate-900" placeholder="e.g. INV-1001" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Currency</label>
              <select value={data.currency} onChange={(e) => updateData('currency', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-medium text-slate-900 appearance-none">
                {currencies.map(c => <option key={c.symbol} value={c.symbol}>{c.label} ({c.symbol})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Issue Date</label>
              <input type="date" value={data.issueDate} onChange={(e) => updateData('issueDate', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-medium text-slate-900" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Due Date</label>
              <input type="date" value={data.dueDate} onChange={(e) => updateData('dueDate', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-medium text-slate-900" />
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Section 2: Parties */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-slate-800 font-bold mb-1">
                <Building className="w-4 h-4 text-indigo-500" /> Your Business
              </div>
              <input type="text" value={data.bizName} onChange={(e) => updateData('bizName', e.target.value)} placeholder="Company Name" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none font-medium" />
              <input type="text" value={data.bizGst} onChange={(e) => updateData('bizGst', e.target.value)} placeholder="GSTIN" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none font-medium uppercase" />
              <textarea value={data.bizAddress} onChange={(e) => updateData('bizAddress', e.target.value)} placeholder="Address Details" rows="2" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none font-medium resize-none"></textarea>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-slate-800 font-bold mb-1">
                <User className="w-4 h-4 text-emerald-500" /> Client Details
              </div>
              <input type="text" value={data.clientName} onChange={(e) => updateData('clientName', e.target.value)} placeholder="Client Name" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 outline-none font-medium" />
              <input type="text" value={data.clientGst} onChange={(e) => updateData('clientGst', e.target.value)} placeholder="Client GSTIN" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 outline-none font-medium uppercase" />
              <textarea value={data.clientAddress} onChange={(e) => updateData('clientAddress', e.target.value)} placeholder="Client Address" rows="2" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 outline-none font-medium resize-none"></textarea>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Section 3: Line Items */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Line Items</label>
            <div className="space-y-3 mb-4">
              {data.items.map((item, index) => (
                <div key={item.id} className="flex gap-3 items-start group">
                  <div className="w-full grid grid-cols-12 gap-3 relative">
                    <div className="col-span-12 sm:col-span-4">
                      <input type="text" value={item.desc} onChange={(e) => updateItem(item.id, 'desc', e.target.value)} placeholder="Item Description" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none text-sm font-medium" />
                    </div>
                    <div className="col-span-12 sm:col-span-2">
                      <input type="text" value={item.hsn} onChange={(e) => updateItem(item.id, 'hsn', e.target.value)} placeholder="HSN/SAC" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none text-sm font-medium uppercase" />
                    </div>
                    <div className="col-span-6 sm:col-span-2">
                      <input type="number" value={item.qty} onChange={(e) => updateItem(item.id, 'qty', e.target.value)} placeholder="Qty" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none text-sm font-medium text-center" />
                    </div>
                    <div className="col-span-6 sm:col-span-4 relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">{data.currency}</span>
                      <input type="number" value={item.price} onChange={(e) => updateItem(item.id, 'price', e.target.value)} placeholder="Price" className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none text-sm font-medium" />
                    </div>
                  </div>
                  <button onClick={() => removeItem(item.id)} disabled={data.items.length === 1} className="p-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-30 disabled:cursor-not-allowed shrink-0">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
            <button onClick={addItem} className="flex items-center gap-2 text-sm font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2.5 rounded-xl transition-colors">
              <Plus className="w-4 h-4" /> Add Item
            </button>
          </div>

          <hr className="border-slate-100" />

          {/* Section 4: Taxes & Discounts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Discount</label>
                <div className="flex bg-slate-100 rounded-lg p-0.5">
                  <button 
                    onClick={() => updateData('discountType', 'percentage')} 
                    className={`px-2 py-1 text-xs font-bold rounded-md transition-colors ${data.discountType === 'percentage' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    %
                  </button>
                  <button 
                    onClick={() => updateData('discountType', 'amount')} 
                    className={`px-2 py-1 text-xs font-bold rounded-md transition-colors ${data.discountType === 'amount' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    {data.currency}
                  </button>
                </div>
              </div>
              <div className="relative">
                {data.discountType === 'amount' && <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">{data.currency}</span>}
                <input type="number" value={data.discountValue} onChange={(e) => updateData('discountValue', e.target.value)} className={`w-full ${data.discountType === 'amount' ? 'pl-8' : 'px-4'} pr-8 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none font-medium`} placeholder="0" />
                {data.discountType === 'percentage' && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">%</span>}
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Tax/GST (%)</label>
              <select value={data.gstRate} onChange={(e) => updateData('gstRate', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none font-medium appearance-none">
                <option value="0">0% (No Tax)</option>
                <option value="5">5%</option>
                <option value="12">12%</option>
                <option value="18">18%</option>
                <option value="28">28%</option>
              </select>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Section 5: Notes & Terms */}
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Notes</label>
              <textarea value={data.notes} onChange={(e) => updateData('notes', e.target.value)} rows="2" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none font-medium text-sm resize-none"></textarea>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Terms & Conditions</label>
              <textarea value={data.terms} onChange={(e) => updateData('terms', e.target.value)} rows="2" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none font-medium text-sm resize-none"></textarea>
            </div>
          </div>

        </div>
      </div>

      {/* RIGHT PANE - LIVE PREVIEW */}
      <div className="w-full flex flex-col gap-6 print:w-full print:block mt-8 print:mt-0 print:gap-0">
        
        {/* Action Bar (Hidden during print) */}
        <div className="flex flex-col sm:flex-row items-center justify-between bg-white rounded-2xl p-4 shadow-sm border border-slate-200 print:hidden gap-4">
          <div className="flex items-center gap-2 text-slate-600 font-medium">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Live Preview Active
          </div>
          <button onClick={handlePrint} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-8 py-3.5 rounded-xl font-bold transition-transform hover:-translate-y-0.5 shadow-xl shadow-slate-900/20">
            <Printer className="w-5 h-5" /> Generate PDF / Print
          </button>
        </div>

        {/* The Invoice Document - Formal Tax Invoice Style */}
        <div className="bg-white mx-auto print:shadow-none print:w-full max-w-4xl border-2 border-slate-900 text-slate-900 text-sm overflow-hidden mb-12">
          
          {/* Top Header */}
          <div className="flex justify-between items-center border-b-2 border-slate-900 px-4 py-2 font-bold text-xs bg-slate-50">
            <span>Page No. 1 of 1</span>
            <span className="text-sm tracking-widest uppercase">Tax Invoice</span>
            <span>Original Copy</span>
          </div>

          {/* Company Details */}
          <div className="flex border-b-2 border-slate-900 relative">
            {/* Logo Placeholder */}
            <div className="absolute left-4 top-4 w-24 h-24 border-2 border-slate-300 flex items-center justify-center text-slate-400 font-bold text-xs text-center p-2 rounded-lg bg-slate-50">
              Add Logo
            </div>
            
            <div className="w-full text-center py-6 px-32 flex flex-col items-center justify-center min-h-[140px]">
              <h2 className="text-2xl font-black uppercase mb-1">{data.bizName || 'Company Name'}</h2>
              <p className="text-sm whitespace-pre-wrap leading-snug text-slate-700">{data.bizAddress || 'Company Address\nCity, State ZIP'}</p>
              <div className="mt-2 text-xs font-bold space-y-0.5">
                {data.bizGst && <p>GSTIN: <span className="font-black text-slate-900 uppercase">{data.bizGst}</span></p>}
              </div>
            </div>
          </div>

          {/* Invoice Info & Transporter */}
          <div className="grid grid-cols-2 border-b-2 border-slate-900 divide-x-2 divide-slate-900 text-xs">
            <div className="p-4 space-y-2">
              <div className="grid grid-cols-2 gap-2 gap-x-4">
                <span className="font-medium text-slate-600">Invoice Number:</span>
                <span className="font-bold">{data.invoiceNumber || '---'}</span>
                
                <span className="font-medium text-slate-600">Invoice Date:</span>
                <span className="font-bold">{data.issueDate ? new Date(data.issueDate).toLocaleDateString() : '---'}</span>
                
                <span className="font-medium text-slate-600">Due Date:</span>
                <span className="font-bold">{data.dueDate ? new Date(data.dueDate).toLocaleDateString() : '---'}</span>
                
                <span className="font-medium text-slate-600">Place of Supply:</span>
                <span className="font-bold">---</span>
                
                <span className="font-medium text-slate-600">Reverse Charge:</span>
                <span className="font-bold">No</span>
              </div>
            </div>
            <div className="p-4 space-y-2 bg-slate-50/50">
              <div className="grid grid-cols-2 gap-2 gap-x-4">
                <span className="font-medium text-slate-600">Transporter Details:</span>
                <span className="font-bold">---</span>
                
                <span className="font-medium text-slate-600">Vehicle No.:</span>
                <span className="font-bold">---</span>
                
                <span className="font-medium text-slate-600">E-Way Bill No.:</span>
                <span className="font-bold">---</span>
              </div>
            </div>
          </div>

          {/* Billing & Shipping */}
          <div className="grid grid-cols-2 border-b-2 border-slate-900 divide-x-2 divide-slate-900 text-sm">
            <div className="p-4 space-y-1">
              <h3 className="font-black uppercase tracking-wider mb-3 text-xs bg-slate-100 inline-block px-2 py-1 rounded">Billing Details</h3>
              <p className="font-black text-base">{data.clientName || 'Client Name'}</p>
              <p className="whitespace-pre-wrap text-slate-600 text-xs leading-relaxed">{data.clientAddress || 'Client Address\nCity, State ZIP'}</p>
              {data.clientGst && <p className="pt-2 text-xs">GSTIN: <span className="font-black uppercase">{data.clientGst}</span></p>}
            </div>
            <div className="p-4 space-y-1 bg-slate-50/50">
              <h3 className="font-black uppercase tracking-wider mb-3 text-xs bg-slate-100 inline-block px-2 py-1 rounded">Shipping Details</h3>
              <p className="font-black text-base">{data.clientName || 'Client Name'}</p>
              <p className="whitespace-pre-wrap text-slate-600 text-xs leading-relaxed">{data.clientAddress || 'Client Address\nCity, State ZIP'}</p>
              {data.clientGst && <p className="pt-2 text-xs">GSTIN: <span className="font-black uppercase">{data.clientGst}</span></p>}
            </div>
          </div>

          {/* Table */}
          <div className="w-full">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-900 font-black uppercase tracking-wider bg-slate-100 divide-x-2 divide-slate-900">
                  <th className="py-3 px-2 w-12 text-center">Sr.</th>
                  <th className="py-3 px-4">Item Description</th>
                  <th className="py-3 px-2 w-24 text-center">HSN/SAC</th>
                  <th className="py-3 px-2 w-16 text-center">Qty</th>
                  <th className="py-3 px-4 w-32 text-right">Rate</th>
                  <th className="py-3 px-4 w-32 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300">
                {data.items.map((item, index) => {
                  const itemTotal = (+item.qty || 0) * (+item.price || 0);
                  return (
                    <tr key={item.id} className="divide-x-2 divide-slate-900 align-top group transition-colors hover:bg-slate-50 print:hover:bg-transparent min-h-[40px]">
                      <td className="py-3 px-2 text-center text-slate-500 font-medium">{index + 1}</td>
                      <td className="py-3 px-4 font-bold text-sm">{item.desc || '---'}</td>
                      <td className="py-3 px-2 text-center text-slate-600">{item.hsn || '---'}</td>
                      <td className="py-3 px-2 text-center font-medium">{item.qty || 0}</td>
                      <td className="py-3 px-4 text-right text-slate-600">{data.currency}{Number(item.price || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                      <td className="py-3 px-4 text-right font-black">{data.currency}{itemTotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                    </tr>
                  );
                })}
                {/* Fill empty space for layout (mock row) */}
                <tr className="divide-x-2 divide-slate-900 h-24 print:h-48 bg-slate-50/20">
                  <td></td><td></td><td></td><td></td><td></td><td></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Totals Section */}
          <div className="border-t-2 border-slate-900 text-sm flex flex-col bg-slate-50/50">
            <div className="grid grid-cols-[1fr_auto] divide-x-2 divide-slate-900 border-b border-slate-300">
              <div className="p-3 text-right font-medium text-slate-600">Subtotal</div>
              <div className="p-3 w-40 text-right font-bold">{data.currency}{subtotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
            </div>
            
            {discountAmount > 0 && (
              <div className="grid grid-cols-[1fr_auto] divide-x-2 divide-slate-900 border-b border-slate-300">
                <div className="p-3 text-right font-medium text-slate-600">Discount {data.discountType === 'percentage' ? `(${data.discountValue}%)` : `(${discountPercent.toFixed(2)}%)`}</div>
                <div className="p-3 w-40 text-right font-bold text-red-600">-{data.currency}{discountAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
              </div>
            )}
            
            {+data.gstRate > 0 && (
              <div className="grid grid-cols-[1fr_auto] divide-x-2 divide-slate-900 border-b-2 border-slate-900">
                <div className="p-3 text-right font-medium text-slate-600">Tax ({data.gstRate}%)</div>
                <div className="p-3 w-40 text-right font-bold">{data.currency}{gstAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
              </div>
            )}

            <div className="grid grid-cols-[1fr_auto] divide-x-2 divide-slate-900 border-b-2 border-slate-900 bg-indigo-50/50">
              <div className="p-4 text-right font-black uppercase text-base">Total</div>
              <div className="p-4 w-40 text-right font-black text-lg text-indigo-900">{data.currency}{total.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
            </div>
          </div>

          {/* Footer Grid */}
          <div className="grid grid-cols-2 divide-x-2 divide-slate-900 min-h-[180px] text-xs">
            <div className="p-4 flex flex-col space-y-4">
              <div>
                <h4 className="font-black uppercase tracking-wider mb-2 text-slate-600">Terms and Conditions</h4>
                <p className="whitespace-pre-wrap leading-relaxed">{data.terms || '---'}</p>
              </div>
              
              <div>
                <h4 className="font-black uppercase tracking-wider mb-2 text-slate-600">Notes</h4>
                <p className="whitespace-pre-wrap leading-relaxed">{data.notes || '---'}</p>
              </div>
            </div>
            
            <div className="p-4 flex flex-col justify-between items-end bg-slate-50/50">
              <p className="font-black text-sm uppercase text-slate-600 text-right">For {data.bizName || 'Company Name'}</p>
              
              <div className="text-center w-48 mt-16">
                <div className="border-b-2 border-slate-400 w-full mb-2"></div>
                <p className="font-bold uppercase tracking-wider text-slate-500">Authorized Signatory</p>
              </div>
            </div>
          </div>
          
          {/* Promotional Box */}
          <div className="border-t-2 border-slate-900 p-2 text-center bg-slate-900 text-[10px] font-bold text-white tracking-widest uppercase">
            Invoice Created by <a href="https://sheetstore.in" className="text-indigo-300 hover:text-white transition-colors">sheetstore.in</a>
          </div>

        </div>
      </div>

    </div>
  );
}
