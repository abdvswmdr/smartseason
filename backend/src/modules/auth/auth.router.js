const router = require("express").Router();
const rateLimit = require("express-rate-limit");
const { authenticate, requireRole } = require("../../middleware/auth");
const ctrl = require("./auth.controller");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: "Too many login attempts, try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/login", loginLimiter, ctrl.login);
router.post("/register", authenticate, requireRole("admin"), ctrl.register);
router.get("/me", authenticate, ctrl.me);

module.exports = router;
