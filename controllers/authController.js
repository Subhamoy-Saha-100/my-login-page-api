const bcrypt = require("bcrypt");
const db = require("../config/db");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    // Clean the input
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    // Check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({
        message: "Please enter a valid email"
      });
    }

    // Check password
    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters"
      });
    }

    // ⭐ CHECK EMAIL IN DATABASE FIRST
    const [existingUser] = await db.execute(
      "SELECT id FROM users WHERE email = ?",
      [cleanEmail]
    );

    // Email already exists
    if (existingUser.length > 0) {
      return res.status(409).json({
        message: "Email already registered"
      });
    }

    // Email doesn't exist → hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Insert new user
    await db.execute(
      `INSERT INTO users (name, email, password)
       VALUES (?, ?, ?)`,
      [cleanName, cleanEmail, hashedPassword]
    );

    return res.status(201).json({
      message: "Registration successful"
    });

  } catch (error) {
    console.error("Registration error:", error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
};

const login = async (req, res) => {
  try {

    const { email, password } = req.body;

    // 1. Check required fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    // 2. Clean email
    const cleanEmail = email.trim().toLowerCase();

    // 3. Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({
        message: "Invalid email address"
      });
    }

    // 4. Find user by email
    const [users] = await db.execute(
      "SELECT id, name, email, password FROM users WHERE email = ?",
      [cleanEmail]
    );

    // 5. Email doesn't exist
    if (users.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const user = users[0];

    // 6. Compare entered password with stored hash
    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    // 7. Password doesn't match
    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // 8. Login successful
    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {

    console.error("Login error:", error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
};
module.exports = {
  register,
  login
};