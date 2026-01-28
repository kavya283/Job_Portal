const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// Helper to generate JWT
const signToken = (user) => {
  return jwt.sign(
    { user: { id: user._id, role: user.role } },
    process.env.JWT_SECRET || "mysecretkey",
    { expiresIn: "1h" }
  );
};

// @route   POST api/auth/signup
// @desc    Register a new user (Candidate or Employer)
router.post("/signup", async (req, res) => {
  const { name, companyName, email, password, role } = req.body;

  try {
    // 1. Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 2. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create new user instance
    // Note: companyName is included here; it will be saved if the model allows it
    user = new User({
      name,
      companyName: role === "employer" ? companyName : undefined, // Clean data
      email,
      password: hashedPassword,
      role
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Signup Error:", err.message);
    res.status(500).json({ message: "Server error during signup" });
  }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
router.post("/login", async (req, res) => {
  const { email, password, role } = req.body;
  console.log(`Login attempt for: ${email}, Role: ${role}`);

  try {
    // 1. Explicitly select password due to 'select: false' in Model
    let user = await User.findOne({ email }).select("+password");
    
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // 2. Verify role matches
    if (user.role !== role) {
      return res.status(403).json({ 
        message: `Unauthorized. This account is registered as a ${user.role}.` 
      });
    }

    // 3. Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // 4. Create and return Token + User Info (Including companyName)
    const token = signToken(user);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyName: user.companyName // Fixed: Now passed to frontend state
      }
    });
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------- OAuth Routes ----------

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/linkedin", passport.authenticate("linkedin", { scope: ["openid", "profile", "email"] }));

router.get("/google/callback", 
  passport.authenticate("google", { failureRedirect: "http://localhost:5173/login", session: false }),
  (req, res) => {
    const token = signToken(req.user);
    res.redirect(`http://localhost:5173/login-success?token=${token}&role=${req.user.role}`);
  }
);

router.get("/linkedin/callback",
  passport.authenticate("linkedin", { failureRedirect: "http://localhost:5173/login", session: false }),
  (req, res) => {
    const token = signToken(req.user);
    res.redirect(`http://localhost:5173/login-success?token=${token}&role=${req.user.role}`);
  }
);

module.exports = router;