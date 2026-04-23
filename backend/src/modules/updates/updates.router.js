const router = require("express").Router({ mergeParams: true });
const { authenticate, requireRole } = require("../../middleware/auth");
const asyncHandler = require("../../middleware/asyncHandler");
const updatesService = require("./updates.service");
const { AppError } = require("../../utils/errors");

router.post(
  "/",
  authenticate,
  asyncHandler(async (req, res) => {
    if (req.user.role !== "agent") throw new AppError("Forbidden", 403);
    const { stage, notes } = req.body;
    if (!stage) throw new AppError("stage is required", 400);
    await updatesService.addUpdate(req.params.fieldId, req.user.id, {
      stage,
      notes,
    });
    res.status(201).json({ message: "Update recorded" });
  }),
);

router.get(
  "/",
  authenticate,
  asyncHandler(async (req, res) => {
    const updates = await updatesService.getUpdates(req.params.fieldId);
    res.json(updates);
  }),
);

module.exports = router;
