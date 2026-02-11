const authRoutes = require("./routes/auth");
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(cors());

// middleware
app.use(express.json());
app.use("/api/auth", authRoutes);

// testowy endpoint
app.get("/", (req, res) => {
  res.send("API działa 🚀 + MongoDB");
});

// połączenie z MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Połączono z MongoDB");
  })
  .catch((err) => {
    console.error("❌ Błąd MongoDB:", err);
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server działa na porcie ${PORT}`);
});
