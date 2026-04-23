const router = require("express").Router();
const { authenticate, requireRole } = require("../../middleware/auth");
const ctrl = require("./fields.controller");

router.get("/", authenticate, ctrl.listFields);
router.get("/:id", authenticate, ctrl.getField);
router.post("/", authenticate, requireRole("admin"), ctrl.createField);
router.patch("/:id", authenticate, requireRole("admin"), ctrl.updateField);
router.delete("/:id", authenticate, requireRole("admin"), ctrl.deleteField);

module.exports = router;
