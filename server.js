// server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

// =====================
// CONFIG
// =====================
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
const CREATOR_EMAIL = (process.env.CREATOR_EMAIL || "").toLowerCase();

// =====================
// DB SETUP
// =====================
const serviceAccount = JSON.parse(process.env.FIREBASE_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore(); // this gives you access to Firebase Firestore

// =====================
// USER MODEL
// =====================
const admin = require("firebase-admin");
const db = admin.firestore();

// Create new user
async function createUser(uid, email) {
  await db.collection("users").doc(uid).set({
    email: email,
    createdAt: new Date(),
  });
}

// Get user by ID
async function getUser(uid) {
  const userDoc = await db.collection("users").doc(uid).get();
  if (!userDoc.exists) {
    return null;
  }
  return userDoc.data();
}
// =====================
// MIDDLEWARE
// =====================
const admin = require("firebase-admin");

// Middleware to verify Firebase ID token
async function verifyFirebaseToken(req, res, next) {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized. No token provided." });
    }

    const idToken = authHeader.split(" ")[1];

    // Verify token with Firebase
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    // Attach user info to request
    req.user = decodedToken;

    next(); // Continue to route
  } catch (error) {
    console.error("❌ Token verification failed:", error.message);
    return res.status(401).json({ error: "Unauthorized. Invalid token." });
  }
}

module.exports = verifyFirebaseToken;
// =====================
// AUTH ROUTES
// =====================
const express = require("express");
const app = express();
const authRoutes = require("./routes/auth");

app.use(express.json());

// Routes
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("🚀 Kaiser AI is running with Firebase Auth!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
// =====================
// ADMIN ROUTES
// =====================
const adminRoutes = require("./routes/admin");
app.use("/admin", adminRoutes);
// =====================
// PREMIUM TEST ROUTE
// =====================
app.get("/api/premium-only", auth, premiumOnly, (req, res) => {
  res.json({ msg: "You are premium!" });
});

// =====================
// START SERVER
// =====================
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
app.get("/", (req, res) => {
  res.send("🚀 Kaiser AI Backend is running!");
});
