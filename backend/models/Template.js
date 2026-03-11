const mongoose = require("mongoose");

const templateSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true 
  },
  description: {
    type: String,
    required: true
  },
  price: { 
    type: Number, 
    required: true,
    min: 0 
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true 
  },
  features: {
    type: [String], // Array of strings (e.g. ["Fast", "Easy"])
    default: []
  },
  whoShouldUse: {
    type: [String], // Array of strings
    default: []
  },
  image: { 
    type: String, 
    required: true 
  },

  // ==========================================
  // 🔥 HYBRID PRODUCT FEATURE (Excel & Google Sheets)
  // ==========================================
  productType: {
    type: String,
    enum: ['excel', 'google_sheet'], // Sirf ye 2 option allowed hain
    default: 'excel' // Default Excel hi rahega
  },
  sheetUrl: {
    type: String // Agar Google Sheet hai, toh uska Link yahan aayega
  },
  fileName: { 
    type: String,
    // (Pehle ye required tha, par ab Google Sheet ke liye ye khali reh sakta hai)
  },

  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model("Template", templateSchema);