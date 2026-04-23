const fieldsService = require("./fields.service");
const { AppError } = require("../../utils/errors");
const asyncHandler = require("../../middleware/asyncHandler");

const listFields = asyncHandler(async (req, res) => {
  const fields =
    req.user.role === "admin"
      ? await fieldsService.getAllFields()
      : await fieldsService.getAgentFields(req.user.id);
  res.json(fields);
});

const getField = asyncHandler(async (req, res) => {
  const field = await fieldsService.getFieldById(req.params.id);
  if (req.user.role === "agent" && field.agent_id !== req.user.id)
    throw new AppError("Forbidden", 403);
  res.json(field);
});

const createField = asyncHandler(async (req, res) => {
  const { name, crop_type, planting_date, assigned_to } = req.body;
  if (!name || !crop_type || !planting_date)
    throw new AppError("name, crop_type and planting_date are required", 400);
  const field = await fieldsService.createField({
    name,
    crop_type,
    planting_date,
    assigned_to,
  });
  res.status(201).json(field);
});

const updateField = asyncHandler(async (req, res) => {
  const { name, crop_type, planting_date, assigned_to } = req.body;
  if (!name || !crop_type || !planting_date)
    throw new AppError("name, crop_type and planting_date are required", 400);
  const field = await fieldsService.updateField(req.params.id, {
    name,
    crop_type,
    planting_date,
    assigned_to,
  });
  res.json(field);
});

const deleteField = asyncHandler(async (req, res) => {
  await fieldsService.deleteField(req.params.id);
  res.status(204).send();
});

module.exports = {
  listFields,
  getField,
  createField,
  updateField,
  deleteField,
};
