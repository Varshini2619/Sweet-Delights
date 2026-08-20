import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(process.cwd(), "server-db.json");

// Define a default DB state
const DEFAULT_DB = {
  users: [
    {
      uid: "admin-uid",
      name: "Chef Varshini",
      email: "admin@sweetdelights.com",
      password: "admin123", // Simple plain or hashed text for preview purposes
      isAdmin: true,
      addresses: [
        {
          id: "addr-1",
          street: "100 Luxury Avenue, Ghee Corner",
          city: "Bengaluru",
          postalCode: "560001",
          phone: "+91 98765 43210",
          isDefault: true,
        },
      ],
    },
    {
      uid: "user-1",
      name: "Sienna Gold",
      email: "user@sweetdelights.com",
      password: "user123",
      isAdmin: false,
      addresses: [],
    },
  ],
  orders: [] as any[],
  plannerRequests: [] as any[],
  coupons: [
    { code: "SWEET10", discountType: "percentage", value: 10, expiryDate: "2026-12-31", minOrderValue: 40 },
    { code: "DELIGHTS20", discountType: "percentage", value: 20, expiryDate: "2026-12-31", minOrderValue: 100 },
    { code: "WELCOME5", discountType: "flat", value: 5, expiryDate: "2026-12-31", minOrderValue: 20 },
  ],
  blogPosts: [
    {
      id: "post-1",
      title: "Tips for Baking the Perfect Cake",
      slug: "tips-for-baking-the-perfect-cake",
      content: "Baking is both an exquisite science and an art form. To help you elevate your home baking to artisanal standards, here are our professional tips straight from the Sweet Delights kitchen:\n\n### 1. Temperature is Everything\nAlways ensure your butter, eggs, and dairy are at room temperature unless the recipe specifies otherwise. Room temperature ingredients emulsify much better, holding air bubbles that expand during baking for a cloud-soft rise.\n\n### 2. Guard the Cocoa Quality\nNever compromise on chocolate. We exclusively use rich, single-origin Ecuadorian cocoa to construct our decadent sponge layers. High-grade cocoa contains natural fats that prevent the final sponge from drying out under city dry heat.\n\n### 3. Whipping Eggs & Foaming\nWhen preparing custom tiered sponge bases, whip the egg yolks and premium sugar crystals until they form pale ribbons (the 'ribbon stage'). Fold the whipped egg whites inside with absolute light delicacy using a silicone spatula. Over-mixing will deflate the sponge.\n\n### 4. Know Your Oven Calibrations\nEven custom professional bakeries face oven discrepancy. Use an independent oven thermometer hook inside. If your oven drafts hot, place an insulated water bath underneath to generate uniform moist convection currents.\n\nHappy baking, and remember that patience is the ultimate ingredient!",
      image: "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=800&auto=format&fit=crop&q=80",
      category: "Baking Secrets",
      createdAt: "2026-06-15T10:00:00Z",
      comments: [
        {
          id: "comment-1",
          userName: "Rohan Deshmukh",
          userEmail: "rohan@example.com",
          content: "These tips saved my vanilla sponge! The water bath trick made it incredibly soft.",
          createdAt: "2026-06-16T12:30:00Z"
        }
      ]
    },
    {
      id: "post-2",
      title: "Behind the Scenes at Sweet Delights",
      slug: "behind-the-scenes-at-sweet-delights",
      content: "Have you ever wondered what goes on inside our luxury confectionery before dawn breaks? Today, we invite you behind the scenes to peer into our master workspace.\n\n### The Golden Morning Rush\nAt 4:00 AM, while Bengaluru is fast asleep, Chef Varshini and the pastry culinary squad fire up the ovens. The air is immediately filled with the rich aroma of baking cardamom, clarifying ghee, and pure vanilla seeds.\n\n### Hand-Sculpting Masterpieces\nEvery single cake is a unique masterpiece. For our signature 24K Gold Leaf Standard, our decorators carefully place individual sheets of 99.9% pure edible French gold foil onto cooling glaze. This is a delicate process requiring stable hands, specialized soft brushes, and zero breeze in the room.\n\n### Climate-Insulated Dispatches\nTo lock in freshness, transit is run like military operations. Every finished cake is escorted immediately into custom cold insulation cooling coaches. This keeps fragile multi-tiered designs pristine and safe from melting or slipping in the heavy afternoon sun.\n\nEverything we create at Sweet Delights is a blend of traditional values and AI-enabled efficiency. We are thrilled to share our passion with you!",
      image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&auto=format&fit=crop&q=80",
      category: "Inside the Kitchen",
      createdAt: "2026-06-16T14:00:00Z",
      comments: [
        {
          id: "comment-2",
          userName: "Ananya Sen",
          userEmail: "ananya@example.com",
          content: "I ordered the Rasmalai Fusion Cake last week and seeing the care that goes into it makes me love Sweet Delights even more!",
          createdAt: "2026-06-17T08:15:00Z"
        }
      ]
    }
  ],
  wishlist: {} as Record<string, string[]>, // userId -> productIds[]
};

// Ensure DB exists
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_DB, null, 2));
}

// Helpers to read/write DB
function readDb(): typeof DEFAULT_DB {
  try {
    const data = fs.readFileSync(DB_FILE, "utf-8");
    const parsed = JSON.parse(data);
    
    // Ensure all critical root fields exist
    if (!parsed.blogPosts) {
      parsed.blogPosts = DEFAULT_DB.blogPosts;
    }
    if (!parsed.coupons) {
      parsed.coupons = DEFAULT_DB.coupons;
    }
    
    // Make sure all coupons have default expiryDate safely
    parsed.coupons = parsed.coupons.map((c: any) => ({
      expiryDate: "2026-12-31", // fallback
      ...c
    }));
    
    return parsed;
  } catch (err) {
    return DEFAULT_DB;
  }
}

function writeDb(data: any) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// Helper to load products or import them from /src/data.ts safely
let staticProducts: any[] = [];
try {
  // We can write a script or load products dynamically.
  // Actually, let's keep a complete product catalog inside the DB as well!
  // If we read products from data.ts, we can also let admins add/edit them.
  // Let's copy products over or define them on the server too.
} catch (e) {}

// Initialize Gemini Client
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log("Gemini client successfully initialized.");
  } catch (err) {
    console.error("Gemini failed to initialize", err);
  }
} else {
  console.log("No GEMINI_API_KEY provided. Model calls will use professional fallbacks.");
}

async function startServer() {
  const app = express();

  // Security middleware
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:", "https://images.unsplash.com"],
        connectSrc: ["'self'", "https://*.firebaseio.com", "https://*.googleapis.com"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false,
  }));

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  });

  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    message: 'Too many API requests from this IP, please try again later.',
  });

  app.use(limiter);
  app.use('/api', apiLimiter);

  app.use(express.json());

  // API Check Status
  app.get("/api/health", (req, res) => {
    res.json({ status: "healthy", time: new Date() });
  });

  // DB Products Catalog List Check & Sync (If they are empty, we populate on the fly)
  app.get("/api/seed-check", (req, res) => {
    res.json({ seeded: true });
  });

  // ==================== AUTHENTICATION API ====================
  app.post("/api/auth/register", (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Please provide all required fields." });
    }

    const db = readDb();
    const existing = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(400).json({ error: "An account with this email already exists." });
    }

    const newUser = {
      uid: "usr-" + Math.random().toString(36).substr(2, 9),
      name,
      email: email.toLowerCase(),
      password,
      isAdmin: email.toLowerCase().includes("admin"), // Simple role assignment rule
      addresses: [],
    };

    db.users.push(newUser);
    writeDb(db);

    const { password: _, ...userWithoutPassword } = newUser;
    res.json({ user: userWithoutPassword, token: "jwt-" + newUser.uid });
  });

  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Missing email or password." });
    }

    const db = readDb();
    const user = db.users.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password credentials." });
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword, token: "jwt-" + user.uid });
  });

  app.get("/api/auth/profile", (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer jwt-")) {
      return res.status(401).json({ error: "Unauthorized access." });
    }
    const uid = authHeader.replace("Bearer jwt-", "");
    const db = readDb();
    const user = db.users.find((u) => u.uid === uid);
    if (!user) {
      return res.status(404).json({ error: "User profile not found." });
    }
    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  });

  app.post("/api/auth/addresses", (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer jwt-")) {
      return res.status(401).json({ error: "Unauthorized." });
    }
    const uid = authHeader.replace("Bearer jwt-", "");
    const { street, city, postalCode, phone } = req.body;

    if (!street || !city || !postalCode || !phone) {
      return res.status(400).json({ error: "Please fill out all address details." });
    }

    const db = readDb();
    const userIndex = db.users.findIndex((u) => u.uid === uid);
    if (userIndex === -1) return res.status(404).json({ error: "User not found." });

    const newAddr = {
      id: "addr-" + Math.random().toString(36).substr(2, 5),
      street,
      city,
      postalCode,
      phone,
      isDefault: db.users[userIndex].addresses.length === 0,
    };

    db.users[userIndex].addresses.push(newAddr);
    writeDb(db);
    res.json({ user: db.users[userIndex], address: newAddr });
  });

  // ==================== COUPONS API ====================
  app.get("/api/coupons", (req, res) => {
    const db = readDb();
    res.json({ coupons: db.coupons });
  });

  app.post("/api/coupons", (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer jwt-")) {
      return res.status(401).json({ error: "Unauthorized access." });
    }
    const uid = authHeader.replace("Bearer jwt-", "");
    const db = readDb();
    const user = db.users.find((u) => u.uid === uid);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: "Only admins can create coupon codes." });
    }

    const { code, discountType, value, expiryDate, minOrderValue } = req.body;
    if (!code || !discountType || value === undefined || !expiryDate) {
      return res.status(400).json({ error: "Please supply code, discount type, value, and expiry date." });
    }

    const uppercaseCode = code.trim().toUpperCase();
    if (db.coupons.some((c) => c.code.toUpperCase() === uppercaseCode)) {
      return res.status(400).json({ error: "A coupon with this code already exists." });
    }

    const newCoupon = {
      code: uppercaseCode,
      discountType,
      value: Number(value),
      expiryDate,
      minOrderValue: Number(minOrderValue) || 0,
    };

    db.coupons.push(newCoupon);
    writeDb(db);
    res.json({ success: true, coupon: newCoupon });
  });

  app.delete("/api/coupons/:code", (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer jwt-")) {
      return res.status(401).json({ error: "Unauthorized access." });
    }
    const uid = authHeader.replace("Bearer jwt-", "");
    const db = readDb();
    const user = db.users.find((u) => u.uid === uid);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: "Only admins can delete coupon codes." });
    }

    const targetCode = req.params.code.trim().toUpperCase();
    const initialLen = db.coupons.length;
    db.coupons = db.coupons.filter((c) => c.code.toUpperCase() !== targetCode);

    if (db.coupons.length === initialLen) {
      return res.status(404).json({ error: "Coupon code not found." });
    }

    writeDb(db);
    res.json({ success: true, message: `Coupon ${targetCode} deleted successfully.` });
  });

  app.post("/api/coupons/validate", (req, res) => {
    const { code, cartSubtotal } = req.body;
    if (!code) return res.status(400).json({ error: "No coupon code specified." });

    const db = readDb();
    const coupon = db.coupons.find((c) => c.code.toUpperCase() === code.toUpperCase());
    if (!coupon) {
      return res.status(400).json({ error: "Invalid Coupon Code." });
    }

    // Expiry verification
    const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    if (coupon.expiryDate && currentDate > coupon.expiryDate) {
      return res.status(400).json({ error: "This coupon code has expired." });
    }

    if (cartSubtotal < coupon.minOrderValue) {
      return res.status(400).json({
        error: `This coupon requires a minimum subtotal of $${coupon.minOrderValue}.`,
      });
    }

    res.json({ coupon });
  });

  // ==================== BLOG API ====================
  app.get("/api/blog", (req, res) => {
    const db = readDb();
    res.json({ posts: db.blogPosts || [] });
  });

  app.get("/api/blog/:slug", (req, res) => {
    const db = readDb();
    const post = (db.blogPosts || []).find(
      (p: any) => p.slug === req.params.slug || p.id === req.params.slug
    );
    if (!post) {
      return res.status(404).json({ error: "Blog post not found." });
    }
    res.json({ post });
  });

  app.post("/api/blog", (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer jwt-")) {
      return res.status(401).json({ error: "Unauthorized access." });
    }
    const uid = authHeader.replace("Bearer jwt-", "");
    const db = readDb();
    const user = db.users.find((u) => u.uid === uid);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: "Only admins can create blog content." });
    }

    const { title, content, image, category } = req.body;
    if (!title || !content || !category) {
      return res.status(400).json({ error: "Please provide title, category, and body content." });
    }

    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const newPost = {
      id: "post-" + Math.random().toString(36).substr(2, 9),
      title,
      slug,
      content,
      image: image || "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80",
      category,
      createdAt: new Date().toISOString(),
      comments: [],
    };

    if (!db.blogPosts) db.blogPosts = [];
    db.blogPosts.unshift(newPost);
    writeDb(db);

    res.json({ success: true, post: newPost });
  });

  app.put("/api/blog/:id", (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer jwt-")) {
      return res.status(401).json({ error: "Unauthorized access." });
    }
    const uid = authHeader.replace("Bearer jwt-", "");
    const db = readDb();
    const user = db.users.find((u) => u.uid === uid);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: "Only admins can edit blog content." });
    }

    const { title, content, image, category } = req.body;
    const postIndex = (db.blogPosts || []).findIndex((p: any) => p.id === req.params.id);
    if (postIndex === -1) {
      return res.status(404).json({ error: "Blog post not found." });
    }

    const currentPost = db.blogPosts[postIndex];
    if (title) {
      currentPost.title = title;
      currentPost.slug = title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
    }
    if (content) currentPost.content = content;
    if (image !== undefined) currentPost.image = image;
    if (category) currentPost.category = category;

    db.blogPosts[postIndex] = currentPost;
    writeDb(db);

    res.json({ success: true, post: currentPost });
  });

  app.delete("/api/blog/:id", (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer jwt-")) {
      return res.status(401).json({ error: "Unauthorized access." });
    }
    const uid = authHeader.replace("Bearer jwt-", "");
    const db = readDb();
    const user = db.users.find((u) => u.uid === uid);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: "Only admins can delete blog content." });
    }

    const postIndex = (db.blogPosts || []).findIndex((p: any) => p.id === req.params.id);
    if (postIndex === -1) {
      return res.status(404).json({ error: "Blog post not found." });
    }

    db.blogPosts.splice(postIndex, 1);
    writeDb(db);

    res.json({ success: true, message: "Blog post deleted successfully." });
  });

  app.post("/api/blog/:id/comments", (req, res) => {
    const { userName, userEmail, content } = req.body;
    if (!userName || !content) {
      return res.status(400).json({ error: "Please enter your name and some comment content." });
    }

    const db = readDb();
    const postIndex = (db.blogPosts || []).findIndex((p: any) => p.id === req.params.id);
    if (postIndex === -1) {
      return res.status(404).json({ error: "Blog post not found." });
    }

    const newComment = {
      id: "comment-" + Math.random().toString(36).substr(2, 5),
      userName,
      userEmail: userEmail || "",
      content,
      createdAt: new Date().toISOString(),
    };

    if (!db.blogPosts[postIndex].comments) {
      db.blogPosts[postIndex].comments = [];
    }
    db.blogPosts[postIndex].comments.push(newComment);
    writeDb(db);

    res.json({ success: true, comment: newComment, comments: db.blogPosts[postIndex].comments });
  });

  // ==================== ORDERS API ====================
  app.post("/api/orders", (req, res) => {
    const authHeader = req.headers.authorization;
    const { items, couponApplied, discountAmount, taxAmount, deliveryFee, subtotal, total, paymentMethod, deliveryAddress, userName, email } = req.body;

    if (!items || items.length === 0 || !deliveryAddress) {
      return res.status(400).json({ error: "Incomplete order details physically supplied." });
    }

    let userId = "guest";
    if (authHeader && authHeader.startsWith("Bearer jwt-")) {
      userId = authHeader.replace("Bearer jwt-", "");
    }

    const db = readDb();
    const newOrder = {
      id: "ORDER-" + Math.floor(100000 + Math.random() * 900000),
      userId,
      userName: userName || "Valued Shopper",
      email: email || "customer@sweetdelights.com",
      items,
      couponApplied,
      discountAmount: discountAmount || 0,
      taxAmount: taxAmount || 0,
      deliveryFee: deliveryFee || 0,
      subtotal: subtotal || 0,
      total: total || 0,
      paymentMethod: paymentMethod || "COD",
      paymentStatus: paymentMethod === "COD" ? "Pending" : "Paid",
      deliveryAddress,
      orderStatus: "Placed",
      createdAt: new Date().toISOString(),
    };

    db.orders.unshift(newOrder);
    writeDb(db);

    res.json({ success: true, order: newOrder });
  });

  app.get("/api/orders", (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer jwt-")) {
      return res.status(401).json({ error: "Unauthorized." });
    }
    const uid = authHeader.replace("Bearer jwt-", "");
    const db = readDb();

    // Check if admin to yield all orders
    const requester = db.users.find((u) => u.uid === uid);
    if (requester?.isAdmin) {
      return res.json({ orders: db.orders });
    }

    const userOrders = db.orders.filter((o) => o.userId === uid);
    res.json({ orders: userOrders });
  });

  app.put("/api/orders/:id/status", (req, res) => {
    const authHeader = req.headers.authorization;
    const { status } = req.body;

    if (!authHeader || !authHeader.startsWith("Bearer jwt-")) {
      return res.status(401).json({ error: "Unauthorized." });
    }
    const uid = authHeader.replace("Bearer jwt-", "");
    const db = readDb();

    const requester = db.users.find((u) => u.uid === uid);
    if (!requester || !requester.isAdmin) {
      return res.status(403).json({ error: "Admin privilege required." });
    }

    const orderIndex = db.orders.findIndex((o) => o.id === req.params.id);
    if (orderIndex === -1) return res.status(404).json({ error: "Order not found." });

    db.orders[orderIndex].orderStatus = status;
    if (status === "Delivered") {
      db.orders[orderIndex].paymentStatus = "Paid";
    }
    writeDb(db);

    res.json({ success: true, order: db.orders[orderIndex] });
  });

  // ==================== EVENT PLANNER & SMART AI SUGGESTIONS ====================
  app.post("/api/planner/generate-suggestions", async (req, res) => {
    const { guests, budgetRange, eventType } = req.body;
    const guestCount = parseInt(guests) || 10;
    const budgetValue = budgetRange || "Medium";

    // 1. Core Rule-of-Thumb Calculations as solid fallback and base
    const baseCakeKg = Math.max(1, Math.round((guestCount * 0.08) * 10) / 10); // ~80g cake per guest
    const sweetCount = Math.round(guestCount * 1.5); // 1.5 sweets per guest
    const savouryCount = Math.round(guestCount * 1.2); // 1.2 puff/bun per guest

    // Baseline estimated cost based on standard luxury pricing averages
    // Cake avg $45/kg, Sweets $3 each, Savouries $4 each
    const estimatedPrice = Math.round(baseCakeKg * 45 + sweetCount * 3 + savouryCount * 4);

    let suggestions = {
      recommendedCake: `${baseCakeKg} Kg custom tiered sponge cake (Theme-aligned)`,
      recommendedSweets: `${sweetCount} premium confectionery sweets (including Gold Leaf Kaju Katles or miniature Rabri Rasmalai Cups)`,
      recommendedSavouries: `${savouryCount} assorted butter gourmet puffs and savoury rolls`,
      estimatedPrice: estimatedPrice,
    };

    // 2. Call Gemini for rich creative suggestions if available
    if (ai) {
      try {
        const prompt = `You are the Executive pastry master for Sweet Delights, a luxury confectionery. Give accurate, highly gourmet suggestions for a ${eventType} with ${guestCount} guests.
Provide recommendations strictly as a JSON object with this exact JSON schema:
{
  "recommendedCake": "string describing beautiful custom Cake options and estimated weight needed in Kg",
  "recommendedSweets": "string detailing premium sweets count and specifically chosen elite luxury varieties",
  "recommendedSavouries": "string specifying savoury item counts and appetizing descriptions",
  "estimatedPrice": number representing total estimated USD budget cost
}
Choose options matching the budget category of "${budgetValue}". Ensure the estimate is a realistic number close to ${estimatedPrice} USD. Focus on luxurious descriptors like gold foil, saffron, multi-layered butter puffs.`;

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          },
        });

        if (response.text) {
          const parsedSuggestion = JSON.parse(response.text.trim());
          if (parsedSuggestion.recommendedCake) {
            suggestions = {
              recommendedCake: parsedSuggestion.recommendedCake,
              recommendedSweets: parsedSuggestion.recommendedSweets || suggestions.recommendedSweets,
              recommendedSavouries: parsedSuggestion.recommendedSavouries || suggestions.recommendedSavouries,
              estimatedPrice: parsedSuggestion.estimatedPrice || suggestions.estimatedPrice,
            };
          }
        }
      } catch (err) {
        console.error("Gemini context suggestion errored, falling back beautifully", err);
      }
    }

    res.json(suggestions);
  });

  app.post("/api/planner-requests", (req, res) => {
    const authHeader = req.headers.authorization;
    const { eventType, eventDate, guests, cakeRequirement, sweetRequirement, savouriesRequirement, themeSelection, customNotes, budgetRange, deliveryAddress, aiSuggestions } = req.body;

    if (!eventType || !eventDate || !guests || !deliveryAddress) {
      return res.status(400).json({ error: "Missing required details to submit booking planner." });
    }

    let userId = "guest";
    if (authHeader && authHeader.startsWith("Bearer jwt-")) {
      userId = authHeader.replace("Bearer jwt-", "");
    }

    const db = readDb();
    const newRequest = {
      id: "PLAN-" + Math.floor(1000 + Math.random() * 9000),
      userId,
      eventType,
      eventDate,
      guests: parseInt(guests),
      cakeRequirement,
      sweetRequirement,
      savouriesRequirement,
      themeSelection,
      customNotes: customNotes || "None",
      budgetRange,
      deliveryAddress,
      createdAt: new Date().toISOString(),
      status: "Pending",
      aiSuggestions: aiSuggestions || {
        recommendedCake: `${Math.max(1, Math.ceil(guests * 0.08))} Kg Cake`,
        recommendedSweets: `${Math.ceil(guests * 1.5)} Sweets`,
        recommendedSavouries: `${Math.ceil(guests * 1.2)} Savouries`,
        estimatedPrice: guests * 10,
      },
    };

    db.plannerRequests.unshift(newRequest);
    writeDb(db);

    res.json({ success: true, request: newRequest });
  });

  app.get("/api/planner-requests", (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer jwt-")) {
      return res.status(401).json({ error: "Unauthorized access." });
    }
    const uid = authHeader.replace("Bearer jwt-", "");
    const db = readDb();

    const requester = db.users.find((u) => u.uid === uid);
    if (requester?.isAdmin) {
      return res.json({ requests: db.plannerRequests });
    }

    const userRequests = db.plannerRequests.filter((r) => r.userId === uid);
    res.json({ requests: userRequests });
  });

  app.put("/api/planner-requests/:id/status", (req, res) => {
    const authHeader = req.headers.authorization;
    const { status } = req.body;

    if (!authHeader || !authHeader.startsWith("Bearer jwt-")) {
      return res.status(401).json({ error: "Unauthorized." });
    }
    const uid = authHeader.replace("Bearer jwt-", "");
    const db = readDb();

    const requester = db.users.find((u) => u.uid === uid);
    if (!requester || !requester.isAdmin) {
      return res.status(403).json({ error: "Admin privilege required." });
    }

    const index = db.plannerRequests.findIndex((r) => r.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "Planner request not found." });

    db.plannerRequests[index].status = status;
    writeDb(db);

    res.json({ success: true, request: db.plannerRequests[index] });
  });

  // ==================== WISHLIST API ====================
  app.get("/api/wishlist", (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer jwt-")) {
      return res.json({ productIds: [] });
    }
    const uid = authHeader.replace("Bearer jwt-", "");
    const db = readDb();
    res.json({ productIds: db.wishlist[uid] || [] });
  });

  app.post("/api/wishlist/toggle", (req, res) => {
    const authHeader = req.headers.authorization;
    const { productId } = req.body;
    if (!authHeader || !authHeader.startsWith("Bearer jwt-")) {
      return res.status(401).json({ error: "Please log in to save wishlist items." });
    }
    const uid = authHeader.replace("Bearer jwt-", "");
    const db = readDb();

    if (!db.wishlist[uid]) db.wishlist[uid] = [];
    const index = db.wishlist[uid].indexOf(productId);

    if (index > -1) {
      db.wishlist[uid].splice(index, 1);
    } else {
      db.wishlist[uid].push(productId);
    }

    writeDb(db);
    res.json({ success: true, productIds: db.wishlist[uid] });
  });

  // ==================== FLOATING AI ASSISTANT CHATBOT ====================
  app.post("/api/chat", async (req, res) => {
    const { message, chatHistory } = req.body;
    if (!message) return res.status(400).json({ error: "Message context is empty." });

    const systemInstruction = `You are Gâteau-AI, the luxury baking assistant chatbot for Sweet Delights (the premium confectionery & gourmet bakery).
You have deep knowledge about the menu: Cakes (like Red Velvet, Rasmalai Fusion, and Royal Wedding celebrations), Sweets (Royal Rasmalai, Prestige Kaju Katli), and Savouries (Paneer Puffs, Samosas, Garlic Baguettes).
Your voice parameters:
- Polite, incredibly warm, charming, and food-lovingly descriptive (using words like "melt-in-the-mouth", "saffron-infused", "glistening ivory Royal icing").
- Highly helpful. Recommend specific products from Sweet Delights!
- Assist with event planning calculations (e.g. telling customers that 50 guests will need roughly a 4 Kg cake, 75 sweets, and 60 savouries).
- Answer FAQs cheerfully (e.g., shelf life is 3-5 days refrigerated; yes we deliver; yes, they can book custom configurations on our Planner page).
Keep your answers brief, readable, and beautifully formatted (max 120 words). If the customer asks how to place an order, tell them they can easily add cakes to their Shopping Cart and completecheckout with COD, credit card or UPI!`;

    // Baseline fallback answers if Gemini is offline or not configured
    let reply = "Hello! I am Gâteau, your luxury Sweet Delights pastry assistant. I can recommend our signature Rose-petaled Rasmalai Fusion Cake, golden ghee-drenched Gulab Jamun, or crisp Paneer Puffs! How may I sweeten your day today?";

    const lowercaseMsg = message.toLowerCase();
    if (lowercaseMsg.includes("cake") || lowercaseMsg.includes("birthday") || lowercaseMsg.includes("wedding")) {
      reply = "Ah, Gâteau is my absolute passion! I highly recommend our signature Rasmalai Fusion Cake—soaked in saffron rabri with rose petals—or our dense Ecuadorian Chocolate Truffle Cake. For large milestones, our multi-tiered Royal Wedding Cake is draped in ivory royal icing. You can configure precise weights on our collection pages and add them right to your cart!";
    } else if (lowercaseMsg.includes("sweet") || lowercaseMsg.includes("confectionery") || lowercaseMsg.includes("gulab") || lowercaseMsg.includes("kaju")) {
      reply = "Our sweets are prepared royalty-style! Our diamond-shaped Prestige Kaju Katli is layered with genuine silver leaf (silver vark). Also, our traditional Royal Rasmalai soaked in cold saffron cardamom milk is a cloud-soft dream. We package them in elegant luxury gold boxes perfect for gifting!";
    } else if (lowercaseMsg.includes("savour") || lowercaseMsg.includes("puff") || lowercaseMsg.includes("samosa") || lowercaseMsg.includes("savory")) {
      reply = "Craving something savoury to balance the sweetness? Try our multi-folded butter French puff pastry Veg Puff slices or our smoky Tandoori Paneer Spiced Puffs. Our Sourdough Butter Garlic Baguette is also baked fresh every single morning!";
    } else if (lowercaseMsg.includes("plan") || lowercaseMsg.includes("party") || lowercaseMsg.includes("event") || lowercaseMsg.includes("guest")) {
      reply = "Planning an exquisite celebration is effortless here! You can head directly to our custom 'Event & Function Planner' tab. Enter your guest count and our system, powered by AI, will instantly estimate your required cake kilograms, sweets and savouries quantities, and draft a luxury quotation!";
    } else if (lowercaseMsg.includes("delivery") || lowercaseMsg.includes("deliver") || lowercaseMsg.includes("ship")) {
      reply = "We offer premium climate-controlled delivery within Bengaluru using specialized insulated coaches to guarantee your pristine multi-tiered cakes, chilled ice cream logs, and warm flaky puffs arrive in stunning masterwork condition. Simply checkout with your address!";
    }

    if (ai) {
      try {
        // Format history according to Gemini expected SDK format
        // The simple way is: pass the chat history inside the contents as strings or maps.
        // Let's call regenerate content with the context
        const contents = [];
        // Add chat history context if any
        if (chatHistory && Array.isArray(chatHistory)) {
          chatHistory.slice(-5).forEach(item => {
            contents.push({
              role: item.role === "user" ? "user" : "model",
              parts: [{ text: item.text }]
            });
          });
        }
        contents.push({
          role: "user",
          parts: [{ text: message }]
        });

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: contents,
          config: {
            systemInstruction: systemInstruction,
          }
        });

        if (response.text) {
          reply = response.text.trim();
        }
      } catch (err) {
        console.error("Gemini failed in chat response fallback to scripted response", err);
      }
    }

    res.json({ reply });
  });

  // ==================== MOUNT DEV SERVER / SERVE STATIC FILES ====================
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Sweet Delights Full-Stack Server booted on http://0.0.0.0:${PORT}`);
  });
}

startServer();
