const router = require("express").Router();
const { authenticate, requireRole } = require("../../middleware/auth");
const pool = require("../../config/db");

router.get("/agents", authenticate, requireRole("admin"), async (req, res) => {
  try {
    const [agents] = await pool.query(
      "SELECT id, name FROM users WHERE role = 'agent' ORDER BY name",
    );
    res.json(agents);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
