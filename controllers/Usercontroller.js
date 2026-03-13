const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// POST /users/register
module.exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    return res.status(201).json({ message: "Registered Successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// POST /users/login
module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare provided password with stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Sign JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );

    return res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET /users/details
module.exports.getProfile = async (req, res) => {
  try {
    // req.user is set by the auth middleware after token verification
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};