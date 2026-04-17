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
    clientName: '',
    clientAddress: '',
    items: [{ id: Date.now(), desc: '', qty: 1, price: '' }],
    gstRate: '18',
    discountPercent: '',
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
      items: [...prev.items, { id: Date.now(), desc: '', qty: 1, price: '' }]
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
  const discountAmount = subtotal * ((+data.discountPercent || 0) / 100);
  const afterDiscount = subtotal - discountAmount;
  const gstAmount = afterDiscount * ((+data.gstRate || 0) / 100);
  const total = afterDiscount + gstAmount;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col xl:flex-row gap-8 items-start w-full print:block">
      
      {/* LEFT PANE - FORM (Hidden during print) */}
      <div className="w-full xl:w-[45%] bg-white rounded-3xl border border-slate-200 shadow-xl p-6 md:p-8 shrink-0 print:hidden sticky top-24 max-h-[85vh] overflow-y-auto custom-scrollbar">
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
              <textarea value={data.bizAddress} onChange={(e) => updateData('bizAddress', e.target.value)} placeholder="Address Details" rows="2" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none font-medium resize-none"></textarea>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-slate-800 font-bold mb-1">
                <User className="w-4 h-4 text-emerald-500" /> Client Details
              </div>
              <input type="text" value={data.clientName} onChange={(e) => updateData('clientName', e.target.value)} placeholder="Client Name" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 outline-none font-medium" />
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
                    <div className="col-span-12 sm:col-span-6">
                      <input type="text" value={item.desc} onChange={(e) => updateItem(item.id, 'desc', e.target.value)} placeholder="Item Description" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none text-sm font-medium" />
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
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Discount (%)</label>
              <input type="number" value={data.discountPercent} onChange={(e) => updateData('discountPercent', e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-indigo-500 outline-none font-medium" placeholder="0" />
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
      <div className="w-full xl:w-[55%] flex flex-col gap-6 print:w-full print:block">
        
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
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden print:shadow-none print:rounded-none">
          {/* Header Strip */}
          <div className="h-4 w-full bg-gradient-to-r from-indigo-600 to-violet-600"></div>
          
          <div className="p-8 sm:p-12">
            {/* Top Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-8 mb-16">
              <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase mb-2">Invoice</h1>
                <p className="text-slate-500 font-medium mb-1">#{data.invoiceNumber || '---'}</p>
              </div>
              <div className="text-left sm:text-right">
                <h2 className="text-2xl font-black text-indigo-600 mb-2 break-all">{data.bizName || 'Your Business Name'}</h2>
                <p className="text-slate-500 text-sm whitespace-pre-wrap">{data.bizAddress || 'Business Address\nCity, State ZIP'}</p>
              </div>
            </div>

            {/* Bill To & Details */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-8 mb-16 pb-8 border-b border-slate-100">
              <div>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Bill To</h3>
                <h4 className="text-lg font-bold text-slate-900 mb-1">{data.clientName || 'Client Name'}</h4>
                <p className="text-slate-500 text-sm whitespace-pre-wrap">{data.clientAddress || 'Client Address\nCity, State ZIP'}</p>
              </div>
              <div className="grid grid-cols-2 gap-x-12 gap-y-4 text-sm text-left sm:text-right">
                <div>
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Issue Date</h3>
                  <p className="font-bold text-slate-900">{data.issueDate ? new Date(data.issueDate).toLocaleDateString() : '---'}</p>
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Due Date</h3>
                  <p className="font-bold text-slate-900">{data.dueDate ? new Date(data.dueDate).toLocaleDateString() : '---'}</p>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="mb-12">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b-2 border-slate-900 text-sm font-black text-slate-900 uppercase">
                    <th className="py-4 pr-4">Description</th>
                    <th className="py-4 px-4 text-center">Qty</th>
                    <th className="py-4 px-4 text-right">Rate</th>
                    <th className="py-4 pl-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="text-slate-600 text-sm font-medium border-b border-slate-200">
                  {data.items.map((item, index) => {
                    const itemTotal = (+item.qty || 0) * (+item.price || 0);
                    return (
                      <tr key={item.id} className="border-b border-slate-100 last:border-0">
                        <td className="py-4 pr-4 font-bold text-slate-900">{item.desc || '---'}</td>
                        <td className="py-4 px-4 text-center">{item.qty || 0}</td>
                        <td className="py-4 px-4 text-right">{data.currency}{Number(item.price || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                        <td className="py-4 pl-4 text-right font-bold text-slate-900">{data.currency}{itemTotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Totals Section */}
            <div className="flex flex-col sm:flex-row justify-end mb-16">
              <div className="w-full sm:w-80 space-y-4">
                <div className="flex justify-between items-center text-sm font-bold text-slate-500">
                  <span>Subtotal</span>
                  <span>{data.currency}{subtotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                </div>
                {+data.discountPercent > 0 && (
                  <div className="flex justify-between items-center text-sm font-bold text-emerald-500">
                    <span>Discount ({data.discountPercent}%)</span>
                    <span>-{data.currency}{discountAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                  </div>
                )}
                {+data.gstRate > 0 && (
                  <div className="flex justify-between items-center text-sm font-bold text-slate-500">
                    <span>Tax ({data.gstRate}%)</span>
                    <span>{data.currency}{gstAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-4 border-t-2 border-slate-900">
                  <span className="text-lg font-black text-slate-900 uppercase">Total</span>
                  <span className="text-2xl font-black text-indigo-600">{data.currency}{total.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                </div>
              </div>
            </div>

            {/* Notes & Terms */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-sm text-slate-500 pt-8 border-t border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 mb-2 uppercase tracking-wider text-xs">Notes</h3>
                <p className="whitespace-pre-wrap leading-relaxed">{data.notes || '---'}</p>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-2 uppercase tracking-wider text-xs">Terms & Conditions</h3>
                <p className="whitespace-pre-wrap leading-relaxed">{data.terms || '---'}</p>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
