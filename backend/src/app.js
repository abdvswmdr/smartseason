require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(express.json());

// Routes
app.use("/api/auth", require("./modules/auth/auth.router"));
app.use("/api/users", require("./modules/users/users.router"));
app.use("/api/fields", require("./modules/fields/fields.router"));

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend on :${PORT}`));

module.exports = app;
