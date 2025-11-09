// ***
// all fixed
const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authenticateToken = require("../middlewear/auth");
require("dotenv").config();

const SECRET_KEY = process.env.JWT_SECRET;

// Patients Login
router.post("/patients", async (req, res) => {
  const { phone_no, password } = req.body;

  try {
    const [results] = await db.query(
      "SELECT * FROM patients WHERE phone_no = ?",
      [phone_no]
    );

    if (results.length === 0) {
      return res
        .status(401)
        .json({ error: "Invalid phone number or password" });
    }

    const patient = results[0];
    const isMatch = await bcrypt.compare(password, patient.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ error: "Invalid phone number or password" });
    }

    const token = jwt.sign(
      { id: patient.id, phone_no: patient.phone_no },
      SECRET_KEY,
      { expiresIn: process.env.TOKEN_EXPIRY || "1h" }
    );

    const isFirstTimeLogin = patient.account_status === 0;

    res.json({
      message: "Login successful",
      token,
      firstTimeLogin: isFirstTimeLogin,
      id: patient.id,
    });

    console.log("Login Status:", res.statusCode);
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// Change Password
router.post(
  "/patients/change-password",
  authenticateToken,
  async (req, res) => {
    const { userId, newPassword } = req.body;

    if (!userId || !newPassword) {
      return res
        .status(400)
        .json({ error: "User ID and password are required" });
    }

    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      const [result] = await db.query(
        "UPDATE patients SET password = ?, account_status = 1 WHERE id = ?",
        [hashedPassword, userId]
      );

      res
        .status(200)
        .json({ success: true, message: "Password changed successfully" });
    } catch (err) {
      console.error("Password change error:", err);
      res.status(500).json({ error: "Database error" });
    }
  }
);

// Admin Login 
// phone number is the default password
router.post("/admins", async (req, res) => {
  console.log("Request body:", req.body);
  const { email, password } = req.body;

  try {
    const [results] = await db.query("SELECT * FROM admin WHERE email = ?", [
      email,
    ]);

    if (results.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const admin = results[0];
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: "admin" },
      SECRET_KEY,
      { expiresIn: process.env.TOKEN_EXPIRY || "8h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: "admin",
      },
    });
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// Doctor Login
// phone number is the default password
router.post("/doctors", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [results] = await db.query("SELECT * FROM doctors WHERE email = ?", [
      email,
    ]);

    if (results.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const doctor = results[0];
    const isMatch = await bcrypt.compare(password, doctor.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: doctor.id, email: doctor.email, role: "doctor" },
      SECRET_KEY,
      { expiresIn: process.env.TOKEN_EXPIRY || "8h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: doctor.id,
        name: doctor.name,
        email: doctor.email,
        role: "doctor",
      },
    });
  } catch (err) {
    console.error("Doctor login error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
