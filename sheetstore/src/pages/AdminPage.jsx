import { useEffect, useState, useRef } from "react";
import { Lock, FileSpreadsheet, Link as LinkIcon, Download } from "lucide-react";

export default function AdminPage() {
  // ================= AUTHENTICATION STATES =================
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // ================= EXISTING DASHBOARD STATES =================
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
  
  // 🔥 PRODUCT TYPE STATES
  const [productType, setProductType] = useState("excel"); 
  const [sheetUrl, setSheetUrl] = useState("");
  const [file, setFile] = useState(null);
  
  const [isAddingCat, setIsAddingCat] = useState(false);
  const [isAddingTemp, setIsAddingTemp] = useState(false);

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
    }
  }, [isAuthenticated]);

  // ================= LOGIN HANDLER =================
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);

    try {
      // 👇 CHANGE 1
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: loginUser, password: loginPass })
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("adminToken", data.token); 
        setIsAuthenticated(true);
      } else {
        setLoginError(data.error || "Invalid credentials");
      }
    } catch (err) {
      setLoginError("Network error. Is server running?");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setIsAuthenticated(false);
  };

  // ================= FETCH FUNCTIONS =================
  const fetchCategories = async () => {
    try {
      // 👇 CHANGE 2
      const res = await fetch(`${import.meta.env.VITE_API_URL}/categories`);
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error("Category fetch error", err);
    }
  };

  const fetchTemplates = async () => {
    try {
      // 👇 CHANGE 3
      const res = await fetch(`${import.meta.env.VITE_API_URL}/templates`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setTemplates(data);
    } catch (err) {
      console.error("Template fetch error", err);
    }
  };

  // ================= ACTION HANDLERS =================
  const handleAddCategory = async () => {
    if (!categoryName.trim()) {
      alert("Category name cannot be empty.");
      return;
    }
    setIsAddingCat(true);
    try {
      // 👇 CHANGE 4
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/category`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: categoryName })
      });
      const data = await res.json();
      if (res.ok) {
        setCategoryName("");
        fetchCategories();
        alert("Category Added!");
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      alert("Network error.");
    } finally {
      setIsAddingCat(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      // 👇 CHANGE 5
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/category/${id}`, { method: "DELETE" });
      if (res.ok) fetchCategories(); 
      else alert("Failed to delete category.");
    } catch (error) {
      alert("Network error.");
    }
  };

  const handleAddTemplate = async () => {
    if (!title || !description || !price || !selectedCategory || !image) {
      alert("Core fields (Title, Desc, Price, Category, Image) are required!");
      return;
    }
    if (Number(price) < 0) return alert("Price cannot be negative.");

    if (productType === "excel" && !file) {
      alert("Please upload the Excel/Zip file.");
      return;
    }
    if (productType === "google_sheet" && !sheetUrl.trim()) {
      alert("Please provide the Google Sheet Link.");
      return;
    }

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
    if (productType === "google_sheet") {
      formData.append("sheetUrl", sheetUrl);
    } else {
      formData.append("file", file);
    }

    try {
      // 👇 CHANGE 6
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/template`, {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        setTitle(""); setDescription(""); setPrice(""); setSelectedCategory("");
        setFeatures(""); setWhoShouldUse(""); setImage(null); 
        
        setProductType("excel");
        setSheetUrl("");
        setFile(null);
        if (imageInputRef.current) imageInputRef.current.value = "";
        if (fileInputRef.current) fileInputRef.current.value = "";
        
        alert("Template Published Successfully!");
        fetchTemplates();
      } else {
        alert("Server Error: " + (data.error || "Failed to add template"));
      }
    } catch (error) {
      alert("Network error. Failed to save the template.");
    } finally {
      setIsAddingTemp(false);
    }
  };

  const handleDeleteTemplate = async (id) => {
    if(!window.confirm("Are you sure you want to delete this template?")) return;
    try {
      // 👇 CHANGE 7
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/template/${id}`, { method: "DELETE" });
      if(res.ok) fetchTemplates();
      else alert("Failed to delete template.");
    } catch (error) {
       alert("Network error.");
    }
  };


  // ================= 1. RENDER LOGIN SCREEN =================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-indigo-100 text-indigo-600 flex items-center justify-center rounded-full mb-4">
              <Lock className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Admin Access Only</h2>
            <p className="text-slate-500 text-sm mt-1">Please login to manage your store</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Username</label>
              <input
                type="text"
                value={loginUser}
                onChange={(e) => setLoginUser(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-indigo-500"
                placeholder="Enter username"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
              <input
                type="password"
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-indigo-500"
                placeholder="Enter password"
                required
              />
            </div>
            
            {loginError && <p className="text-red-500 text-sm font-medium text-center">{loginError}</p>}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition"
            >
              {isLoggingIn ? "Checking..." : "Login to Dashboard"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ================= 2. RENDER ADMIN DASHBOARD =================
  return (
    <div className="min-h-screen p-10 space-y-12 bg-gray-50">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
        <button 
          onClick={handleLogout}
          className="px-5 py-2 bg-red-100 text-red-600 font-bold rounded-lg hover:bg-red-200 transition"
        >
          Logout
        </button>
      </div>

      {/* ================= CATEGORY MANAGEMENT ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border p-6 rounded-lg shadow-sm">
          <h2 className="text-xl mb-4 font-semibold">Add Category</h2>
          <div className="flex gap-4">
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="border px-3 py-2 flex-1 rounded focus:outline-indigo-500"
              placeholder="e.g. HR Management"
              disabled={isAddingCat}
            />
            <button
              onClick={handleAddCategory}
              disabled={isAddingCat}
              className={`text-white px-6 py-2 rounded ${isAddingCat ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}
            >
              {isAddingCat ? "Adding..." : "Add"}
            </button>
          </div>
        </div>

        <div className="bg-white border p-6 rounded-lg shadow-sm">
           <h2 className="text-xl mb-4 font-semibold">Existing Categories</h2>
           <div className="flex flex-wrap gap-2">
             {categories.length === 0 ? <p className="text-gray-500 text-sm">No categories yet.</p> : 
               categories.map(cat => (
                 <span key={cat._id} className="bg-slate-100 border border-slate-200 text-slate-700 px-3 py-1 rounded-full text-sm flex items-center gap-2 group transition-colors hover:bg-red-50 hover:border-red-200">
                   {cat.name}
                   <button 
                     onClick={() => handleDeleteCategory(cat._id)}
                     className="text-gray-400 hover:text-red-600 font-bold ml-1 text-lg leading-none"
                   >
                     &times;
                   </button>
                 </span>
               ))
             }
           </div>
        </div>
      </div>

      {/* ================= ADD TEMPLATE ================= */}
      <div className="bg-white border p-8 rounded-lg shadow-sm space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 border-b pb-4">Add New Digital Product</h2>

        {/* PRODUCT TYPE TOGGLE */}
        <div className="space-y-2 mb-6">
          <label className="text-sm font-semibold text-slate-700">Select Product Type <span className="text-red-500">*</span></label>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Excel Option */}
            <label className={`flex-1 border-2 p-4 rounded-xl flex items-center gap-3 cursor-pointer transition-all ${productType === 'excel' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200 bg-white hover:bg-slate-50'}`}>
              <input type="radio" name="productType" value="excel" checked={productType === 'excel'} onChange={() => setProductType('excel')} className="hidden" />
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${productType === 'excel' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                 <Download className="w-5 h-5" />
              </div>
              <div>
                <h4 className={`font-bold ${productType === 'excel' ? 'text-indigo-900' : 'text-slate-700'}`}>Excel / Zip File</h4>
                <p className="text-xs text-slate-500">Customer will download a file</p>
              </div>
            </label>
            
            {/* Google Sheet Option */}
            <label className={`flex-1 border-2 p-4 rounded-xl flex items-center gap-3 cursor-pointer transition-all ${productType === 'google_sheet' ? 'border-emerald-600 bg-emerald-50/50' : 'border-slate-200 bg-white hover:bg-slate-50'}`}>
              <input type="radio" name="productType" value="google_sheet" checked={productType === 'google_sheet'} onChange={() => setProductType('google_sheet')} className="hidden" />
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${productType === 'google_sheet' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                 <LinkIcon className="w-5 h-5" />
              </div>
              <div>
                <h4 className={`font-bold ${productType === 'google_sheet' ? 'text-emerald-900' : 'text-slate-700'}`}>Google Sheet Link</h4>
                <p className="text-xs text-slate-500">Customer gets a secret sheet link</p>
              </div>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">Template Title <span className="text-red-500">*</span></label>
            <input
              type="text"
              placeholder="e.g., Startup Financial Model"
              className="border px-3 py-2 w-full rounded focus:outline-indigo-500 bg-slate-50"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-1">
             <label className="text-sm font-semibold text-slate-700">Category <span className="text-red-500">*</span></label>
             <select
              className="border px-3 py-2 w-full rounded focus:outline-indigo-500 bg-slate-50"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">-- Select Category --</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">Key Features (Comma separated)</label>
            <textarea
              placeholder="e.g., Instant download, Fully customizable"
              className="border px-3 py-2 w-full rounded focus:outline-indigo-500 bg-slate-50 min-h-[80px]"
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">Perfect For (Who should use this?)</label>
            <textarea
              placeholder="e.g., Freelancers, Startup Founders"
              className="border px-3 py-2 w-full rounded focus:outline-indigo-500 bg-slate-50 min-h-[80px]"
              value={whoShouldUse}
              onChange={(e) => setWhoShouldUse(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-700">Main Description <span className="text-red-500">*</span></label>
          <textarea
            placeholder="Write a detailed description of what this template does..."
            className="border px-3 py-2 w-full rounded focus:outline-indigo-500 bg-slate-50 min-h-[120px]"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
           <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">Price (₹) <span className="text-red-500">*</span></label>
            <input
              type="number"
              min="0"
              className="border px-3 py-2 w-full rounded focus:outline-indigo-500 bg-slate-50 text-lg font-bold"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">Cover Image <span className="text-red-500">*</span></label>
            <div className="border border-slate-300 p-2 rounded bg-slate-50">
              <input
                type="file"
                accept="image/*"
                ref={imageInputRef}
                onChange={(e) => setImage(e.target.files[0])}
                className="text-sm w-full cursor-pointer"
              />
            </div>
          </div>

          {/* CONDITIONAL FILE UPLOAD OR URL PASTE */}
          {productType === "excel" ? (
            <div className="space-y-1 animate-[fadeIn_0.3s_ease-in-out]">
               <label className="text-sm font-semibold text-slate-700">Upload Excel File <span className="text-red-500">*</span></label>
              <div className="border border-slate-300 p-2 rounded bg-slate-50">
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv,.pdf,.zip"
                  ref={fileInputRef}
                  onChange={(e) => setFile(e.target.files[0])}
                  className="text-sm w-full cursor-pointer"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-1 animate-[fadeIn_0.3s_ease-in-out]">
               <label className="text-sm font-semibold text-emerald-700">Google Sheet URL <span className="text-red-500">*</span></label>
               <input
                type="text"
                placeholder="https://docs.google.com/spreadsheets/d/..."
                className="border px-3 py-2 w-full rounded focus:outline-emerald-500 border-emerald-200 bg-emerald-50"
                value={sheetUrl}
                onChange={(e) => setSheetUrl(e.target.value)}
              />
            </div>
          )}
        </div>

        <div className="pt-4">
          <button
            onClick={handleAddTemplate}
            disabled={isAddingTemp}
            className={`text-white px-8 py-4 rounded-xl w-full text-lg font-bold transition-all shadow-md ${isAddingTemp ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5"}`}
          >
            {isAddingTemp ? "Publishing Data..." : "Publish Product 🚀"}
          </button>
        </div>
      </div>

      {/* ================= TEMPLATE LIST ================= */}
      <div className="bg-white border p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-6">All Published Templates</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {templates.length === 0 ? <p className="text-gray-500 col-span-full">No templates published yet.</p> : templates.map((template) => (
            <div key={template._id} className="border border-gray-200 rounded-lg overflow-hidden flex flex-col group hover:shadow-md transition-shadow relative">
              
              <div className="h-40 bg-gray-100 relative">
                {template.image ? (
                   // 👇 CHANGE 8
                   <img
                     src={`${import.meta.env.VITE_API_URL}/uploads/${template.image}`}
                     alt={template.title}
                     className="w-full h-full object-cover"
                   />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                )}
                {/* Product Type Badge */}
                {template.productType === 'google_sheet' ? (
                   <span className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded shadow-sm flex items-center gap-1">
                     <LinkIcon className="w-3 h-3" /> Sheet
                   </span>
                ) : (
                   <span className="absolute top-2 left-2 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded shadow-sm flex items-center gap-1">
                     <Download className="w-3 h-3" /> Excel
                   </span>
                )}

                {template.category && (
                  <span className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-xs font-semibold px-2 py-1 rounded shadow-sm text-gray-700">
                    {template.category.name}
                  </span>
                )}
              </div>

              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-bold text-gray-900 line-clamp-1" title={template.title}>{template.title}</h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2 flex-1">{template.description}</p>
                
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                   <span className="font-bold text-lg text-emerald-600">₹{template.price}</span>
                   <button
                      onClick={() => handleDeleteTemplate(template._id)}
                      className="text-red-500 hover:bg-red-50 px-2 py-1 rounded text-sm font-medium transition-colors"
                    >
                      Delete
                    </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}