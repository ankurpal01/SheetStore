const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// 🔥 CLOUDINARY IMPORTS 🔥
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// 🔥 GEMINI AI IMPORT 🔥
const { GoogleGenerativeAI } = require("@google/generative-ai");

const Category = require("./models/Category");
const Template = require("./models/Template");
const Order = require("./models/Order");
const Admin = require("./models/Admin");

const app = express();

// ================= 1. CLOUDINARY CONFIG =================
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const extractPublicId = (url) => {
  if (!url) return null;
  const parts = url.split('/');
  const uploadIndex = parts.indexOf('upload');
  if (uploadIndex === -1) return null;
  const publicIdWithExt = parts.slice(uploadIndex + 2).join('/');
  return publicIdWithExt.split('.')[0];
};

const deleteFromCloudinary = async (url, resourceType = 'image') => {
  const publicId = extractPublicId(url);
  if (publicId) {
    try {
      await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    } catch (err) {
      console.error("Cloudinary delete error:", err);
    }
  }
};

// ================= 2. PRODUCTION CORS CONFIG =================
const allowedOrigins = process.env.FRONTEND_URL ? [process.env.FRONTEND_URL, "http://localhost:5173"] : "*";
app.use(cors({
  origin: allowedOrigins, 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// ================= 3. CLOUDINARY MULTER STORAGE =================
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    if (file.fieldname === "image") {
      return {
        folder: "sheetstore/images",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        resource_type: "image"
      };
    } else if (file.fieldname === "file") {
      return {
        folder: "sheetstore/files",
        resource_type: "raw", 
        format: file.originalname.split('.').pop() 
      };
    }
  }
});
const upload = multer({ storage });

// ================= 4. DATABASE CONNECTION =================
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB Connected Successfully");
    // Seed default admin if none exists
    const adminExists = await Admin.findOne();
    if (!adminExists) {
      const username = process.env.ADMIN_USER || "admin";
      const password = process.env.ADMIN_PASS || "admin123";
      const hashedPassword = await bcrypt.hash(password, 10);
      await Admin.create({ username, password: hashedPassword });
      console.log("Default admin created successfully.");
    }
  })
  .catch(err => console.error("Mongo Connection Error:", err));

// ================= 5. RAZORPAY CONFIG =================
const razorpaySecretKey = process.env.RAZORPAY_SECRET || process.env.RAZORPAY_KEY_SECRET;

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: razorpaySecretKey
});

// ================= 6. GEMINI AI CONFIG =================
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;
const JWT_SECRET = process.env.JWT_SECRET || "sheetstore_super_secret_key_123!";

// ================= AUTH MIDDLEWARE =================
const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.adminId = decoded.id;
    next();
  } catch (ex) {
    res.status(400).json({ error: "Invalid token." });
  }
};

// ================= CATEGORY & TEMPLATE ROUTES =================
app.post("/admin/category", authenticateAdmin, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Name is required" });
    const slug = name.toLowerCase().replace(/\s+/g, "-");
    const existing = await Category.findOne({ slug });
    if (existing) return res.status(400).json({ error: "Category already exists" });
    const newCategory = await Category.create({ name, slug });
    res.json(newCategory);
  } catch (err) {
    res.status(500).json({ error: "Failed to create category" });
  }
});

app.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

app.delete("/admin/category/:id", authenticateAdmin, async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete category" });
  }
});

app.post("/admin/template", authenticateAdmin, upload.fields([
  { name: "image", maxCount: 1 },
  { name: "file", maxCount: 1 }
]), async (req, res) => {
  try {
    const { title, description, price, category, features, whoShouldUse, productType, sheetUrl } = req.body;
    if (!req.files || !req.files['image']) return res.status(400).json({ error: "Product image is required" });

    const featuresArray = features ? features.split(",").map(f => f.trim()).filter(f => f) : [];
    const whoShouldUseArray = whoShouldUse ? whoShouldUse.split(",").map(w => w.trim()).filter(w => w) : [];

    let newTemplateData = {
      title, description, price, category,
      features: featuresArray,
      whoShouldUse: whoShouldUseArray,
      image: req.files['image'][0].path, 
      productType: productType || "excel"
    };

    if (newTemplateData.productType === "google_sheet") {
      if (!sheetUrl) return res.status(400).json({ error: "Google Sheet Link is required" });
      newTemplateData.sheetUrl = sheetUrl;
    } else {
      if (!req.files['file']) return res.status(400).json({ error: "Excel/Zip file is required" });
      newTemplateData.fileName = req.files['file'][0].path; 
    }

    const newTemplate = await Template.create(newTemplateData);
    res.json(newTemplate);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to create template" });
  }
});

app.get("/templates", async (req, res) => {
  try {
    const templates = await Template.find().populate("category"); 
    res.json(templates);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch templates" });
  }
});

app.delete("/admin/template/:id", authenticateAdmin, async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    if (!template) return res.status(404).json({ error: "Template not found" });
    
    await deleteFromCloudinary(template.image, 'image');
    if (template.productType === 'excel' && template.fileName) {
      await deleteFromCloudinary(template.fileName, 'raw');
    }

    await Template.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted from database" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});

// ================= PAYMENT ROUTES =================
app.post("/create-order", async (req, res) => {
  try {
    const { amount, templateId, templateName } = req.body;
    
    if (!process.env.RAZORPAY_KEY_ID || !razorpaySecretKey) {
      return res.status(500).json({ error: "Payment Gateway not configured" });
    }

    const options = {
      amount: Math.round(Number(amount) * 100), 
      currency: "INR",
      receipt: "rcpt_" + Date.now()
    };
    
    const razorpayOrder = await razorpay.orders.create(options);
    
    await Order.create({
      razorpay_order_id: razorpayOrder.id,
      templateId, templateName, amount, status: "pending"
    });
    res.json(razorpayOrder);
  } catch (err) {
    res.status(500).json({ error: "Order creation failed", details: err.message });
  }
});

app.post("/verify-payment", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", razorpaySecretKey)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) return res.status(400).json({ success: false, error: "Invalid Signature" });

    const order = await Order.findOne({ razorpay_order_id });
    if (!order) return res.status(404).json({ error: "Order not found" });

    order.razorpay_payment_id = razorpay_payment_id;
    order.razorpay_signature = razorpay_signature;
    order.status = "paid";
    await order.save();
    res.json({ success: true });
  } catch (err) {
    console.error("Verification Error:", err);
    res.status(500).json({ error: "Verification failed" });
  }
});

app.get("/order/:orderId", async (req, res) => {
  try {
    const order = await Order.findOne({ razorpay_order_id: req.params.orderId });
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: "Fetch Order Error" });
  }
});

// ================= SECURE DOWNLOAD ROUTE =================
app.get("/download/:templateId", async (req, res) => {
  try {
    const { orderId } = req.query;
    if (!orderId) {
      return res.status(401).json({ error: "Unauthorized access. Order ID is required." });
    }

    const order = await Order.findOne({ razorpay_order_id: orderId });
    if (!order || order.status !== "paid" || order.templateId !== req.params.templateId) {
      return res.status(401).json({ error: "Unauthorized access. Invalid or unpaid order." });
    }

    const template = await Template.findById(req.params.templateId);
    if (!template || template.productType === 'google_sheet' || !template.fileName) {
       return res.status(400).json({ error: "Invalid download request" });
    }
    res.redirect(template.fileName);
  } catch (err) {
    res.status(500).json({ error: "Download failed" });
  }
});

// ================= ADMIN DASHBOARD & LOGIN =================
app.get("/admin/stats", authenticateAdmin, async (req, res) => {
  try {
    const totalOrdersCount = await Order.countDocuments({ status: "paid" });
    const totalTemplates = await Template.countDocuments();
    const orders = await Order.find({ status: "paid" });
    const totalRevenue = orders.reduce((sum, order) => sum + (order.amount || 0), 0);

    res.json({ totalRevenue, totalOrders: totalOrdersCount, totalTemplates });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

app.delete("/admin/clear-orders", authenticateAdmin, async (req, res) => {
  try {
    await Order.deleteMany({});
    res.json({ message: "All test orders cleared successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to clear orders" });
  }
});

app.post("/admin/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(401).json({ success: false, error: "Invalid credentials" });
    
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ success: false, error: "Invalid credentials" });
    
    const token = jwt.sign({ id: admin._id, username: admin.username }, JWT_SECRET, { expiresIn: "24h" });
    res.json({ success: true, token });
  } catch (err) {
    res.status(500).json({ success: false, error: "Login failed" });
  }
});

app.put("/admin/reset-password", authenticateAdmin, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    const admin = await Admin.findById(req.adminId);
    if (!admin) return res.status(404).json({ error: "Admin not found" });

    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!isMatch) return res.status(401).json({ error: "Old password is wrong" });

    admin.password = await bcrypt.hash(newPassword, 10);
    await admin.save();
    
    res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update password" });
  }
});

// ================= GEMINI AI ROUTE =================
app.post("/api/ai-usecase", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!genAI) return res.status(500).json({ error: "AI Key missing in Backend" });
    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    res.json({ text: result.response.text() });
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ error: "AI is unavailable right now" });
  }
});

// ================= 7. SERVER START =================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});