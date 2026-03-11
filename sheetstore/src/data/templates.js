import {
  Calculator,
  Users,
  Briefcase,
  Target,
  LayoutDashboard,
  FileSpreadsheet,
  Clock
} from "lucide-react";


// ===============================
// CATEGORIES
// ===============================
export const CATEGORIES = [
  { id: "finance", name: "Finance", icon: Calculator },
  { id: "hr-management", name: "HR Management", icon: Users },
  { id: "inventory", name: "Inventory Tracking", icon: Briefcase },
  { id: "habit-tracker", name: "Habit Tracker", icon: Target },
  { id: "project-management", name: "Project Management", icon: LayoutDashboard },
  { id: "sales", name: "Sales Dashboard", icon: FileSpreadsheet },
  { id: "freelancer", name: "Freelancer Tools", icon: Clock },
  { id: "startup", name: "Startup Planning", icon: Target }
];


// ===============================
// TEMPLATES
// ===============================
export const TEMPLATES = [
  {
    id: "finance-001",
    title: "Advanced Expense Tracker",
    category: "Finance",
    price: 299,
    description: "Track business expenses with automated dashboards and visual insights.",
    longDescription:
      "Take control of your finances with automated categorization and instant visual reports.",
    features: [
      "Auto calculations",
      "Monthly reports",
      "Visual charts",
      "Tax category flags",
      "Multi-currency support"
    ],
    whoShouldUse: [
      "Small Business Owners",
      "Freelancers",
      "Independent Contractors"
    ],
    included: [
      "Excel Template (.xlsx)",
      "Google Sheets Link",
      "PDF Instructions Guide"
    ],
    image:
      "https://images.unsplash.com/photo-1543286386-2e659306cd6c",
    featured: true
  },

  {
    id: "startup-001",
    title: "Lean Canvas & Pitch Planner",
    category: "Startup Planning",
    price: 499,
    description: "Map your startup business model and plan your investor pitch.",
    longDescription:
      "Toolkit for early-stage founders including Lean Canvas and projections.",
    features: [
      "1-Page Business Plan",
      "Financial Projections",
      "Competitor Matrix",
      "Cap Table Template"
    ],
    whoShouldUse: [
      "Startup Founders",
      "Entrepreneurs",
      "Business Students"
    ],
    included: [
      "Excel Template (.xlsx)",
      "Google Sheets Link",
      "Video Walkthrough"
    ],
    image:
      "https://images.unsplash.com/photo-1556761175-4b46a572b786",
    featured: true
  },

  {
    id: "sales-001",
    title: "B2B Sales CRM Dashboard",
    category: "Sales Dashboard",
    price: 599,
    description: "Lightweight CRM built in spreadsheets.",
    longDescription:
      "Track leads, deals, conversion rates and forecast revenue easily.",
    features: [
      "Kanban board view",
      "Revenue forecasting",
      "Lead scoring formula",
      "Follow-up reminders"
    ],
    whoShouldUse: ["Sales Reps", "B2B Founders", "Agencies"],
    included: [
      "Excel Template (.xlsx)",
      "Google Sheets Link",
      "Setup Guide PDF"
    ],
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
    featured: true
  },

  {
    id: "habit-001",
    title: "Ultimate Habit & Goal Tracker",
    category: "Habit Tracker",
    price: 199,
    description: "Build better habits with automated heatmaps.",
    longDescription:
      "Gamified daily, weekly and monthly tracker with progress visuals.",
    features: [
      "Automated heatmaps",
      "Goal milestones",
      "Daily/Weekly views",
      "Reward system"
    ],
    whoShouldUse: ["Students", "Professionals", "Productivity Enthusiasts"],
    included: ["Google Sheets Link"],
    image:
      "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b",
    featured: false
  }
];


// ===============================
// TESTIMONIALS (DATA ONLY)
// ===============================
export const TESTIMONIALS = [
  {
    id: 1,
    name: "Rohit Sharma",
    role: "Startup Founder",
    text:
      "The financial model helped me present investor-ready projections in hours."
  },
  {
    id: 2,
    name: "Priya Mehta",
    role: "HR Manager",
    text:
      "The onboarding template saved our team massive setup time."
  },
  {
    id: 3,
    name: "Aman Verma",
    role: "Freelancer",
    text:
      "The invoice tracker made billing completely stress-free."
  }
];


// ===============================
// FAQS (DATA ONLY)
// ===============================
export const FAQS = [
  {
    question: "How do I receive the template?",
    answer:
      "You get instant download access immediately after purchase."
  },
  {
    question: "Are templates compatible with Google Sheets?",
    answer:
      "Yes, most templates include a Google Sheets version."
  },
  {
    question: "Is this a subscription?",
    answer:
      "No. One-time payment. Lifetime access."
  },
  {
    question: "Can I customize the templates?",
    answer:
      "Yes. All files are fully editable."
  }
];
