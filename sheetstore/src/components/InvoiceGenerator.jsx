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

        {/* The Invoice Document */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden print:shadow-none print:rounded-none relative min-h-[1056px] print:min-h-0 flex flex-col">
          {/* Header Strip */}
          <div className="h-2 w-full bg-indigo-600 print:bg-indigo-600"></div>
          
          <div className="p-8 sm:p-12 print:p-8 flex flex-col flex-1">
            {/* Top Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-8 mb-12 print:mb-8 print:gap-4">
              <div className="text-left">
                <h2 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tight">{data.bizName || 'Your Business Name'}</h2>
                <p className="text-slate-500 text-sm whitespace-pre-wrap leading-relaxed">{data.bizAddress || 'Business Address\nCity, State ZIP'}</p>
                {data.bizGst && <p className="text-slate-700 text-sm font-bold mt-1 uppercase">GSTIN: {data.bizGst}</p>}
              </div>
              <div className="text-left sm:text-right">
                <h1 className="text-4xl font-black text-indigo-600 tracking-tight uppercase mb-2">Invoice</h1>
                <p className="text-slate-500 font-medium mb-1">Invoice No: <span className="text-slate-900 font-bold">{data.invoiceNumber || '---'}</span></p>
                <p className="text-slate-500 font-medium mb-1">Issue Date: <span className="text-slate-900 font-bold">{data.issueDate ? new Date(data.issueDate).toLocaleDateString() : '---'}</span></p>
                {data.dueDate && <p className="text-slate-500 font-medium">Due Date: <span className="text-slate-900 font-bold">{new Date(data.dueDate).toLocaleDateString()}</span></p>}
              </div>
            </div>

            {/* Bill To & Details */}
            <div className="mb-12 pb-8 border-b-2 border-slate-100 print:mb-8 print:pb-6">
              <h3 className="text-xs font-black text-indigo-600 uppercase tracking-widest mb-4">Billed To</h3>
              <h4 className="text-lg font-bold text-slate-900 mb-1">{data.clientName || 'Client Name'}</h4>
              <p className="text-slate-500 text-sm whitespace-pre-wrap leading-relaxed max-w-sm">{data.clientAddress || 'Client Address\nCity, State ZIP'}</p>
              {data.clientGst && <p className="text-slate-700 text-sm font-bold mt-1 uppercase">GSTIN: {data.clientGst}</p>}
            </div>

            {/* Table */}
            <div className="mb-12 print:mb-8 overflow-x-auto">
              <table className="w-full text-left min-w-[500px] border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-y-2 border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-4 pl-4 pr-4">Description</th>
                    <th className="py-4 px-4 text-center">HSN/SAC</th>
                    <th className="py-4 px-4 text-center">Qty</th>
                    <th className="py-4 px-4 text-right">Rate</th>
                    <th className="py-4 pr-4 pl-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700 text-sm font-medium">
                  {data.items.map((item, index) => {
                    const itemTotal = (+item.qty || 0) * (+item.price || 0);
                    return (
                      <tr key={item.id} className="border-b border-slate-100 last:border-b-2 last:border-slate-200 transition-colors hover:bg-slate-50/50 print:hover:bg-transparent">
                        <td className="py-4 pl-4 pr-4 font-bold text-slate-900">{item.desc || '---'}</td>
                        <td className="py-4 px-4 text-center">{item.hsn || '---'}</td>
                        <td className="py-4 px-4 text-center">{item.qty || 0}</td>
                        <td className="py-4 px-4 text-right">{data.currency}{Number(item.price || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                        <td className="py-4 pr-4 pl-4 text-right font-bold text-slate-900">{data.currency}{itemTotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Totals Section */}
            <div className="flex flex-col sm:flex-row justify-between mb-16 print:mb-8 gap-8">
              <div className="w-full sm:w-1/2">
                {/* Notes & Terms */}
                <div className="space-y-6 text-sm text-slate-600">
                  {data.notes && (
                    <div>
                      <h3 className="font-bold text-slate-900 mb-2 uppercase tracking-wider text-xs">Notes</h3>
                      <p className="whitespace-pre-wrap leading-relaxed">{data.notes}</p>
                    </div>
                  )}
                  {data.terms && (
                    <div>
                      <h3 className="font-bold text-slate-900 mb-2 uppercase tracking-wider text-xs">Terms & Conditions</h3>
                      <p className="whitespace-pre-wrap leading-relaxed">{data.terms}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="w-full sm:w-80 space-y-3 print:space-y-2 bg-slate-50 p-6 rounded-2xl print:bg-transparent print:p-0 print:rounded-none h-fit">
                <div className="flex justify-between items-center text-sm font-medium text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-900">{data.currency}{subtotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between items-center text-sm font-medium text-emerald-600">
                    <span>Discount {data.discountType === 'percentage' ? `(${data.discountValue}%)` : `(${discountPercent.toFixed(2)}%)`}</span>
                    <span className="font-bold">-{data.currency}{discountAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                  </div>
                )}
                {+data.gstRate > 0 && (
                  <div className="flex justify-between items-center text-sm font-medium text-slate-600">
                    <span>Tax ({data.gstRate}%)</span>
                    <span className="font-bold text-slate-900">{data.currency}{gstAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-4 border-t-2 border-slate-200 mt-4">
                  <span className="text-lg font-black text-slate-900 uppercase">Total</span>
                  <span className="text-2xl font-black text-indigo-600">{data.currency}{total.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                </div>
              </div>
            </div>

            {/* Signature Area */}
            <div className="mt-auto pt-16 print:pt-12 flex justify-end">
              <div className="text-center w-48">
                <div className="border-b-2 border-slate-300 h-16 mb-2"></div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Authorized Signatory</p>
              </div>
            </div>
            
            {/* Promotional Message */}
            <div className="mt-12 pt-6 border-t border-slate-100 text-center print:mt-8">
              <p className="text-xs font-medium text-slate-400">
                Invoice generated by <span className="font-bold text-indigo-600">SheetStore</span> - <a href="https://sheetstore.in" className="text-indigo-500 hover:underline">sheetstore.in</a>
              </p>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
