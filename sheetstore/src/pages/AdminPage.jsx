import { useEffect, useState, useRef } from "react";
import { 
  Lock, FileSpreadsheet, Link as LinkIcon, Download, 
  TrendingUp, ShoppingBag, Layers, Settings, X, Key 
} from "lucide-react";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState("products"); // products (for management), dashboard (for listing)
  
  // ================= STATS & AUTH STATES =================
  const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0, totalTemplates: 0 });
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // ================= TEMPLATE FORM STATES (YOUR ORIGINAL CODE) =================
  const [categories, setCategories] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [features, setFeatures] = useState(""); 
  const [whoShouldUse, setWhoShouldUse] = useState("");
  const [image, setImage] = useState(null);
  const [productType, setProductType] = useState("excel"); 
  const [sheetUrl, setSheetUrl] = useState("");
  const [file, setFile] = useState(null);
  
  const [isAddingCat, setIsAddingCat] = useState(false);
  const [isAddingTemp, setIsAddingTemp] = useState(false);

  // ================= PASSWORD RESET STATE =================
  const [showResetModal, setShowResetModal] = useState(false);
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");

  const imageInputRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token === "admin-secret-token") setIsAuthenticated(true);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCategories();
      fetchTemplates();
      fetchStats();
    }
  }, [isAuthenticated]);

  // ================= API CALLS =================
  const fetchStats = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/stats`);
      const data = await res.json();
      setStats(data);
    } catch (err) { console.error(err); }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/categories`);
      const data = await res.json();
      setCategories(data);
    } catch (err) { console.error(err); }
  };

  const fetchTemplates = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/templates`);
      const data = await res.json();
      setTemplates(data);
    } catch (err) { console.error(err); }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError(""); setIsLoggingIn(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: loginUser, password: loginPass })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("adminToken", data.token);
        setIsAuthenticated(true);
      } else setLoginError(data.error);
    } catch (err) { setLoginError("Error logging in"); }
    finally { setIsLoggingIn(false); }
  };

  const handleAddCategory = async () => {
    if (!categoryName.trim()) return;
    setIsAddingCat(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/category`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: categoryName })
      });
      if (res.ok) { setCategoryName(""); fetchCategories(); }
    } finally { setIsAddingCat(false); }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Delete category?")) return;
    await fetch(`${import.meta.env.VITE_API_URL}/admin/category/${id}`, { method: "DELETE" });
    fetchCategories();
  };

  const handleAddTemplate = async () => {
    if (!title || !description || !price || !selectedCategory || !image) return alert("Fill required fields!");
    setIsAddingTemp(true);
    const formData = new FormData();
    formData.append("title", title); formData.append("description", description);
    formData.append("price", Number(price)); formData.append("category", selectedCategory);
    formData.append("features", features); formData.append("whoShouldUse", whoShouldUse);
    formData.append("image", image); formData.append("productType", productType);
    if (productType === "google_sheet") formData.append("sheetUrl", sheetUrl);
    else formData.append("file", file);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/template`, { method: "POST", body: formData });
      if (res.ok) {
        alert("Template Published!");
        setTitle(""); setDescription(""); setPrice(""); setFeatures(""); setWhoShouldUse("");
        setImage(null); setFile(null); setSheetUrl("");
        if (imageInputRef.current) imageInputRef.current.value = "";
        if (fileInputRef.current) fileInputRef.current.value = "";
        fetchTemplates(); fetchStats();
      }
    } finally { setIsAddingTemp(false); }
  };

  const handleDeleteTemplate = async (id) => {
    if(!window.confirm("Delete template?")) return;
    await fetch(`${import.meta.env.VITE_API_URL}/admin/template/${id}`, { method: "DELETE" });
    fetchTemplates(); fetchStats();
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-xl border border-slate-200">
          <div className="flex flex-col items-center mb-8">
            <Lock className="w-10 h-10 text-indigo-600 mb-4" />
            <h2 className="text-3xl font-black text-slate-900">Admin Login</h2>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="text" placeholder="Username" value={loginUser} onChange={(e) => setLoginUser(e.target.value)} className="w-full px-5 py-4 border rounded-xl" required />
            <input type="password" placeholder="Password" value={loginPass} onChange={(e) => setLoginPass(e.target.value)} className="w-full px-5 py-4 border rounded-xl" required />
            <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl">{isLoggingIn ? "Loading..." : "Login"}</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-black text-slate-900">SheetStore Admin</h1>
        <div className="flex gap-3">
          <button onClick={() => setShowResetModal(true)} className="p-3 bg-white border rounded-xl hover:bg-slate-50"><Settings className="w-5 h-5" /></button>
          <button onClick={handleLogout} className="px-6 py-3 bg-red-100 text-red-600 font-bold rounded-xl">Logout</button>
        </div>
      </div>

      {/* DASHBOARD STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl"><TrendingUp /></div>
          <div><p className="text-xs font-bold text-slate-500 uppercase">Total Revenue</p><h3 className="text-2xl font-black italic">₹{stats.totalRevenue || 0}</h3></div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="p-4 bg-indigo-50 text-indigo-600 rounded-xl"><ShoppingBag /></div>
          <div><p className="text-xs font-bold text-slate-500 uppercase">Total Orders</p><h3 className="text-2xl font-black">{stats.totalOrders || 0}</h3></div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
          <div className="p-4 bg-amber-50 text-amber-600 rounded-xl"><Layers /></div>
          <div><p className="text-xs font-bold text-slate-500 uppercase">Templates</p><h3 className="text-2xl font-black">{stats.totalTemplates || 0}</h3></div>
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-4 mb-8">
        <button onClick={() => setActiveTab("products")} className={`px-6 py-3 rounded-xl font-bold ${activeTab === "products" ? "bg-indigo-600 text-white shadow-lg" : "bg-white text-slate-500 border"}`}>Management</button>
        <button onClick={() => setActiveTab("dashboard")} className={`px-6 py-3 rounded-xl font-bold ${activeTab === "dashboard" ? "bg-indigo-600 text-white shadow-lg" : "bg-white text-slate-500 border"}`}>Live Templates</button>
      </div>

      {activeTab === "products" && (
        <div className="space-y-10">
          {/* CATEGORY SECTION */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold mb-6">New Category</h2>
              <div className="flex gap-2">
                <input type="text" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} className="flex-1 px-4 py-3 bg-slate-50 border rounded-xl" placeholder="e.g. Sales" />
                <button onClick={handleAddCategory} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold">Add</button>
              </div>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold mb-4">Categories List</h2>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <span key={cat._id} className="px-4 py-2 bg-slate-50 border rounded-full text-sm font-bold flex items-center gap-2">
                    {cat.name} <button onClick={() => handleDeleteCategory(cat._id)} className="text-red-400 font-bold">×</button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ADD TEMPLATE FORM (RE-ADDED COMPLETE CODE) */}
          <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm space-y-8">
            <h2 className="text-2xl font-black text-slate-900 border-b pb-4">Add New Digital Product</h2>
            
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700 uppercase">1. Product Type</label>
              <div className="flex flex-col sm:flex-row gap-4">
                <label className={`flex-1 p-4 border-2 rounded-2xl cursor-pointer transition-all ${productType === 'excel' ? 'border-indigo-600 bg-indigo-50' : 'border-slate-100'}`}>
                  <input type="radio" className="hidden" onChange={() => setProductType('excel')} checked={productType === 'excel'} />
                  <div className="font-bold flex items-center gap-2"><Download className="w-4 h-4" /> Excel/Zip File</div>
                </label>
                <label className={`flex-1 p-4 border-2 rounded-2xl cursor-pointer transition-all ${productType === 'google_sheet' ? 'border-emerald-600 bg-emerald-50' : 'border-slate-100'}`}>
                  <input type="radio" className="hidden" onChange={() => setProductType('google_sheet')} checked={productType === 'google_sheet'} />
                  <div className="font-bold flex items-center gap-2"><LinkIcon className="w-4 h-4" /> Google Sheet Link</div>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input type="text" placeholder="Template Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-5 py-4 bg-slate-50 border rounded-xl" />
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full px-5 py-4 bg-slate-50 border rounded-xl">
                <option value="">-- Select Category --</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <textarea placeholder="Key Features (Comma separated)" value={features} onChange={(e) => setFeatures(e.target.value)} className="w-full px-5 py-4 bg-slate-50 border rounded-xl min-h-[100px]" />
              <textarea placeholder="Perfect For (Who should use this?)" value={whoShouldUse} onChange={(e) => setWhoShouldUse(e.target.value)} className="w-full px-5 py-4 bg-slate-50 border rounded-xl min-h-[100px]" />
            </div>

            <textarea placeholder="Detailed Description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-5 py-4 bg-slate-50 border rounded-xl min-h-[150px]" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div><label className="text-xs font-bold mb-2 block">Price (₹)</label><input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full px-5 py-4 bg-slate-50 border rounded-xl font-bold" /></div>
              <div><label className="text-xs font-bold mb-2 block">Cover Image</label><input type="file" accept="image/*" ref={imageInputRef} onChange={(e) => setImage(e.target.files[0])} className="w-full text-sm" /></div>
              {productType === "excel" ? (
                <div><label className="text-xs font-bold mb-2 block text-indigo-600 uppercase">Upload File</label><input type="file" ref={fileInputRef} onChange={(e) => setFile(e.target.files[0])} className="w-full text-sm" /></div>
              ) : (
                <div><label className="text-xs font-bold mb-2 block text-emerald-600 uppercase">Google Sheet URL</label><input type="text" value={sheetUrl} onChange={(e) => setSheetUrl(e.target.value)} className="w-full px-5 py-4 bg-emerald-50 border border-emerald-200 rounded-xl" placeholder="Paste Link Here" /></div>
              )}
            </div>

            <button onClick={handleAddTemplate} disabled={isAddingTemp} className="w-full bg-indigo-600 text-white font-black text-xl py-6 rounded-2xl shadow-xl hover:bg-indigo-700 transition-all">
              {isAddingTemp ? "Uploading Everything..." : "Publish Product Now 🚀"}
            </button>
          </div>
        </div>
      )}

      {/* LIVE TEMPLATES TAB */}
      {activeTab === "dashboard" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {templates.map(t => (
            <div key={t._id} className="bg-white rounded-3xl border overflow-hidden shadow-sm group">
              <div className="h-40 relative">
                <img src={t.image?.startsWith('http') ? t.image : `${import.meta.env.VITE_API_URL}/uploads/${t.image}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="" />
                <div className="absolute top-2 left-2 px-2 py-1 bg-white/90 text-[10px] font-black rounded uppercase">{t.productType}</div>
              </div>
              <div className="p-5">
                <h3 className="font-bold line-clamp-1">{t.title}</h3>
                <div className="flex justify-between items-center mt-4">
                  <span className="font-black text-indigo-600">₹{t.price}</span>
                  <button onClick={() => handleDeleteTemplate(t._id)} className="text-red-500 font-bold p-2 hover:bg-red-50 rounded-lg">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* RESET PASSWORD MODAL (HIDDEN) */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-10 shadow-2xl relative">
            <button onClick={() => setShowResetModal(false)} className="absolute top-6 right-6 text-slate-400">×</button>
            <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-6"><Key /></div>
            <h2 className="text-2xl font-black mb-2">Security Settings</h2>
            <p className="text-slate-500 mb-8">Update your password</p>
            <form className="space-y-4">
              <input type="password" placeholder="Current Password" value={oldPass} onChange={(e) => setOldPass(e.target.value)} className="w-full px-5 py-4 bg-slate-50 border rounded-xl" />
              <input type="password" placeholder="New Password" value={newPass} onChange={(e) => setNewPass(e.target.value)} className="w-full px-5 py-4 bg-slate-50 border rounded-xl" />
              <button className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl">Update Now</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}