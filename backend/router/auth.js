const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();

require("../db/conn");
const authenticate = require("../middleware/authenticate");
const User = require("../model/UserSchema");

// quick "who am I"
router.get("/me", authenticate, (req, res) => res.status(200).json(req.rootUser));

// Example protected endpoint
router.get("/announcement", authenticate, (req, res) => res.json(req.rootUser));

// Signup
router.post("/signup", async (req, res) => {
  const { name, email, phone, password, cpassword } = req.body;
  if (!name || !email || !phone || !password || !cpassword)
    return res.status(422).json({ error: "Please fill all fields" });
  if (password !== cpassword)
    return res.status(422).json({ error: "Passwords do not match" });

  try {
    const userExist = await User.findOne({ email });
    if (userExist) return res.status(422).json({ error: "Email already registered" });

    const user = new User({ name, email, phone, password, cpassword });
    await user.save();
    return res.status(201).json({ message: "Successfully registered" });
  } catch (err) {
    console.error("Signup error:", err.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Please fill the data" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = await user.generateAuthToken();
    res.cookie("jwtoken", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 25892000000), // ~300 days
      sameSite: "lax",
      // secure: true, // enable on HTTPS
      path: "/"
    });
    return res.json({ message: "Login successfully" });
  } catch (err) {
    console.error("Login error:", err.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Logout (POST!)
router.post("/logout", (req, res) => {
  res.clearCookie("jwtoken", { path: "/" });
  return res.status(200).send("user logout");
});

// Protected pings you were using
router.get("/preregistration", authenticate, (req, res) => res.json(req.rootUser));
router.get("/courseclash", authenticate, (req, res) => res.json(req.rootUser));
router.get("/courses", authenticate, (req, res) => res.json(req.rootUser));

module.exports = router;
