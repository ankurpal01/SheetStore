const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const Razorpay = require("razorpay");
const crypto = require("crypto");
require("dotenv").config();

// 🔥 CLOUDINARY IMPORTS 🔥
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const Category = require("./models/Category");
const Template = require("./models/Template");
const Order = require("./models/Order");

const app = express();

// ================= 1. CLOUDINARY CONFIG =================
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// ================= 2. PRODUCTION CORS CONFIG =================
app.use(cors({
  origin: "*", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

// ================= 3. CLOUDINARY MULTER STORAGE =================
// Ye automatically image ko images folder me aur excel ko raw folder me daalega
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
        resource_type: "raw", // Raw is used for Excel, Zip, PDF etc.
        format: file.originalname.split('.').pop() 
      };
    }
  }
});

const upload = multer({ storage });

// ================= 4. DATABASE CONNECTION =================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch(err => console.error("Mongo Connection Error:", err));

// ================= 5. RAZORPAY CONFIG =================
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET
});

// ================= CATEGORY ROUTES =================
app.post("/admin/category", async (req, res) => {
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

app.delete("/admin/category/:id", async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete category" });
  }
});

// ================= TEMPLATE ROUTES (CLOUD HYBRID) =================
app.post("/admin/template", upload.fields([
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
      image: req.files['image'][0].path, // 🔥 Ab yahan Cloudinary ka permanent link aayega!
      productType: productType || "excel"
    };

    if (newTemplateData.productType === "google_sheet") {
      if (!sheetUrl) return res.status(400).json({ error: "Google Sheet Link is required" });
      newTemplateData.sheetUrl = sheetUrl;
    } else {
      if (!req.files['file']) return res.status(400).json({ error: "Excel/Zip file is required" });
      newTemplateData.fileName = req.files['file'][0].path; // 🔥 File ka permanent Cloudinary link
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

app.delete("/admin/template/:id", async (req, res) => {
  try {
    const template = await Template.findById(req.params.id);
    if (!template) return res.status(404).json({ error: "Template not found" });

    // Local file system delete logic removed kyunki files ab Cloud par hain
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
    const options = {
      amount: amount * 100,
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
    res.status(500).json({ error: "Order creation failed" });
  }
});

app.post("/verify-payment", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) return res.status(400).json({ success: false });

    const order = await Order.findOne({ razorpay_order_id });
    if (!order) return res.status(404).json({ error: "Order not found" });

    order.razorpay_payment_id = razorpay_payment_id;
    order.razorpay_signature = razorpay_signature;
    order.status = "paid";
    await order.save();
    res.json({ success: true });
  } catch (err) {
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

// ================= DOWNLOAD / ACCESS ROUTE =================
app.get("/download/:templateId", async (req, res) => {
  try {
    const template = await Template.findById(req.params.templateId);
    if (!template || template.productType === 'google_sheet' || !template.fileName) {
       return res.status(400).json({ error: "Invalid download request" });
    }
    
    // 🔥 Ab fileName me Cloudinary ka link hai, toh hum user ko wahan redirect kar denge. 
    // Isse browser file automatically download kar lega.
    res.redirect(template.fileName);

  } catch (err) {
    res.status(500).json({ error: "Download failed" });
  }
});

// ================= ADMIN LOGIN =================
app.post("/admin/login", (req, res) => {
  const { username, password } = req.body;
  const ADMIN_USER = process.env.ADMIN_USER || "Ankurpal";
  const ADMIN_PASS = process.env.ADMIN_PASS || "Ankur001*";

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    res.json({ success: true, token: "admin-secret-token" });
  } else {
    res.status(401).json({ success: false, error: "Invalid credentials" });
  }
});

// ================= 6. SERVER START =================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});