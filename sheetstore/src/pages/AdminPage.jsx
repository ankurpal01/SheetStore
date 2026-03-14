import { useEffect, useState, useRef } from "react";
import { 
  Lock, FileSpreadsheet, Link as LinkIcon, Download, 
  TrendingUp, ShoppingBag, Layers, Settings, X, Key 
} from "lucide-react";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard"); // dashboard, products, settings
  
  // ================= DASHBOARD STATS STATE =================
  const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0, totalTemplates: 0 });

  // ================= AUTH & LOGIN STATES =================
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // ================= PRODUCT & CAT STATES =================
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
    if (token === "admin-secret-token") {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCategories();
      fetchTemplates();
      fetchStats();
    }
  }, [isAuthenticated]);

  // ================= DATA FETCHING =================
  const fetchStats = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/stats`);
      const data = await res.json();
      setStats(data);
    } catch (err) { console.error("Stats error", err); }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/categories`);
      const data = await res.json();
      setCategories(data);
    } catch (err) { console.error("Category fetch error", err); }
  };

  const fetchTemplates = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/templates`);
      const data = await res.json();
      setTemplates(data);
    } catch (err) { console.error("Template fetch error", err); }
  };

  // ================= HANDLERS =================
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);
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
      } else { setLoginError(data.error || "Invalid credentials"); }
    } catch (err) { setLoginError("Network error."); }
    finally { setIsLoggingIn(false); }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/reset-password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword: oldPass, newPassword: newPass })
      });
      const data = await res.json();
      if (res.ok) {
        alert("Password updated successfully! Please login again.");
        handleLogout();
      } else { alert(data.error); }
    } catch (err) { alert("Error resetting password"); }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setIsAuthenticated(false);
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
    } catch (error) { alert("Error adding category"); }
    finally { setIsAddingCat(false); }
  };

  const handleAddTemplate = async () => {
    if (!title || !description || !price || !selectedCategory || !image) return alert("Fill required fields");
    setIsAddingTemp(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", Number(price)); 
    formData.append("category", selectedCategory);
    formData.append("features", features);
    formData.append("whoShouldUse", whoShouldUse);
    formData.append("image", image);
    formData.append("productType", productType);
    if (productType === "google_sheet") formData.append("sheetUrl", sheetUrl);
    else formData.append("file", file);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/template`, {
        method: "POST",
        body: formData
      });
      if (res.ok) {
        alert("Published!");
        fetchTemplates();
        fetchStats();
        // Clear forms...
      }
    } catch (error) { alert("Network error"); }
    finally { setIsAddingTemp(false); }
  };

  const handleDeleteTemplate = async (id) => {
    if(!window.confirm("Delete this?")) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/template/${id}`, { method: "DELETE" });
      if(res.ok) { fetchTemplates(); fetchStats(); }
    } catch (error) { alert("Error"); }
  };

  // ================= SUB-COMPONENTS =================
  const StatsCard = ({ title, value, icon, color }) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
      <div className={`p-4 rounded-xl ${color} bg-opacity-10 text-xl`}>{icon}</div>
      <div>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{title}</p>
        <h3 className="text-2xl font-black text-slate-900">{value}</h3>
      </div>
    </div>
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-xl border border-slate-200 text-center">
          <div className="w-20 h-20 bg-indigo-50 text-indigo-600 flex items-center justify-center rounded-2xl mx-auto mb-6 shadow-inner">
            <Lock className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-2">SheetStore Admin</h2>
          <p className="text-slate-500 mb-8 font-medium">Please enter your credentials</p>
          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <input type="text" placeholder="Username" value={loginUser} onChange={(e) => setLoginUser(e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-indigo-500" required />
            <input type="password" placeholder="Password" value={loginPass} onChange={(e) => setLoginPass(e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-indigo-500" required />
            {loginError && <p className="text-red-500 text-sm font-bold">{loginError}</p>}
            <button type="submit" disabled={isLoggingIn} className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all">{isLoggingIn ? "Authenticating..." : "Login Now"}</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ================= SIDEBAR / HEADER ================= */}
      <nav className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black italic shadow-lg">S</div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">SheetStore <span className="text-indigo-600">Admin</span></h1>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setShowResetModal(true)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"><Settings className="w-5 h-5" /></button>
          <button onClick={handleLogout} className="px-5 py-2.5 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-colors">Logout</button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-8">
        {/* ================= DASHBOARD OVERVIEW ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatsCard title="Total Revenue" value={`₹${stats.totalRevenue || 0}`} icon={<TrendingUp />} color="text-emerald-600" />
          <StatsCard title="Total Orders" value={stats.totalOrders || 0} icon={<ShoppingBag />} color="text-indigo-600" />
          <StatsCard title="Active Templates" value={stats.totalTemplates || 0} icon={<Layers />} color="text-amber-600" />
        </div>

        {/* ================= TABS ================= */}
        <div className="flex gap-4 mb-8">
            <button onClick={() => setActiveTab("products")} className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'products' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}`}>Inventory & Categories</button>
            <button onClick={() => setActiveTab("dashboard")} className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}`}>Live Templates</button>
        </div>

        {activeTab === "products" && (
          <div className="space-y-10 animate-in fade-in duration-500">
            {/* CATEGORY & ADD TEMPLATE SECTIONS (RE-USED FROM YOUR CODE WITH UI UPDATES) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                    <h2 className="text-xl font-black text-slate-900 mb-6">New Category</h2>
                    <div className="flex gap-2">
                        <input type="text" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl" placeholder="e.g. Sales Analytics" />
                        <button onClick={handleAddCategory} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold">Add</button>
                    </div>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                    <h2 className="text-xl font-black text-slate-900 mb-4">Categories List</h2>
                    <div className="flex flex-wrap gap-2">
                        {categories.map(cat => (
                            <span key={cat._id} className="px-4 py-2 bg-slate-50 border rounded-full text-sm font-bold flex items-center gap-2">
                                {cat.name}
                                <button onClick={() => handleDeleteCategory(cat._id)} className="text-red-400 hover:text-red-600">×</button>
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* ADD TEMPLATE FORM */}
            <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm">
                <h2 className="text-2xl font-black text-slate-900 mb-8">Upload New Digital Product</h2>
                {/* [Same form structure you provided, just keep using the variables like title, description etc.] */}
                <button onClick={handleAddTemplate} disabled={isAddingTemp} className="w-full bg-indigo-600 py-5 text-white font-black text-xl rounded-2xl shadow-lg hover:bg-indigo-700 transition-all">{isAddingTemp ? "Processing..." : "Publish Product Now 🚀"}</button>
            </div>
          </div>
        )}

        {activeTab === "dashboard" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in slide-in-from-bottom-5 duration-500">
                {templates.map(template => (
                    <div key={template._id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden group shadow-sm hover:shadow-xl transition-all">
                        <div className="h-40 bg-slate-100 relative">
                            <img src={template.image?.startsWith('http') ? template.image : `${import.meta.env.VITE_API_URL}/uploads/${template.image}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
                            <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur rounded-full text-[10px] font-black uppercase tracking-widest">{template.productType}</div>
                        </div>
                        <div className="p-5">
                            <h3 className="font-bold text-slate-900 mb-1">{template.title}</h3>
                            <div className="flex justify-between items-center mt-4">
                                <span className="font-black text-indigo-600 italic">₹{template.price}</span>
                                <button onClick={() => handleDeleteTemplate(template._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><X className="w-5 h-5" /></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>

      {/* ================= RESET PASSWORD MODAL ================= */}
      {showResetModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-10 shadow-2xl relative">
            <button onClick={() => setShowResetModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600"><X className="w-6 h-6" /></button>
            <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-6"><Key className="w-8 h-8" /></div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">Change Password</h2>
            <p className="text-slate-500 mb-8 font-medium">Update your admin credentials securely.</p>
            <form onSubmit={handlePasswordReset} className="space-y-4 text-left">
              <input type="password" placeholder="Current Password" value={oldPass} onChange={(e) => setOldPass(e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-indigo-500" required />
              <input type="password" placeholder="New Password" value={newPass} onChange={(e) => setNewPass(e.target.value)} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-indigo-500" required />
              <button type="submit" className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-black transition-all">Update Password</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}