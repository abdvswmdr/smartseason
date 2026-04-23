const router = require("express").Router();
const { authenticate, requireRole } = require("../../middleware/auth");
const ctrl = require("./auth.controller");

router.post("/login", ctrl.login);
router.post("/register", authenticate, requireRole("admin"), ctrl.register);
router.get("/me", authenticate, ctrl.me);

module.exports = router;
