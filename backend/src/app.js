require("dotenv").config();
const env = require("./config/env");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(helmet());
app.use(cors({ origin: env.server.frontendUrl }));
app.use(express.json({ limit: "10kb" }));

app.use("/api/auth", require("./modules/auth/auth.router"));
app.use("/api/users", require("./modules/users/users.router"));
app.use("/api/fields", require("./modules/fields/fields.router"));
app.use("/api/fields/:fieldId/updates", require("./modules/updates/updates.router"));

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

app.use(errorHandler);

const server = app.listen(env.server.port, () =>
  console.log(`Backend on :${env.server.port}`)
);

process.on("SIGTERM", () => {
  server.close(() => process.exit(0));
});

module.exports = app;
