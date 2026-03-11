const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true, // Extra spaces remove kar dega (e.g., " Finance " -> "Finance")
    unique: true // Same naam ki 2 category nahi banne dega
  },
  slug: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model("Category", categorySchema);