const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// REJESTRACJA
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email i hasło są wymagane" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Użytkownik już istnieje" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Użytkownik utworzony",
      userId: user._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Błąd serwera" });
  }
});

// LOGOWANIE
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email i hasło są wymagane" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Nieprawidłowe dane logowania" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Nieprawidłowe dane logowania" });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Zalogowano pomyślnie",
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Błąd serwera" });
  }
});

module.exports = router;
