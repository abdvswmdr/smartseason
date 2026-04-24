require("dotenv").config();
const env = require("./config/env");
const express = require("express");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors({ origin: env.server.frontendUrl }));
app.use(express.json());

app.use("/api/auth", require("./modules/auth/auth.router"));
app.use("/api/users", require("./modules/users/users.router"));
app.use("/api/fields", require("./modules/fields/fields.router"));
app.use("/api/fields/:fieldId/updates", require("./modules/updates/updates.router"));

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

app.use(errorHandler);

app.listen(env.server.port, () => console.log(`Backend on :${env.server.port}`));

module.exports = app;
