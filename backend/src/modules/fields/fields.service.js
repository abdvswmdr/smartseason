const pool = require("../../config/db");
const { AppError } = require("../../utils/errors");

function computeStatus(field) {
  const now = Date.now();
  const msPerDay = 86400000;

  if (field.stage === "Harvested") return "Completed";

  const daysSincePlanting = (now - new Date(field.planting_date)) / msPerDay;
  const daysSinceUpdate = (now - new Date(field.updated_at)) / msPerDay;

  if (field.stage === "Planted" && daysSincePlanting > 30) return "At Risk";
  if (daysSinceUpdate > 14) return "At Risk";

  return "Active";
}

async function getAllFields() {
  const [rows] = await pool.query(`
    SELECT f.id, f.name, f.crop_type, f.planting_date, f.stage, f.updated_at,
           u.id AS agent_id, u.name AS agent_name
    FROM fields f
    LEFT JOIN users u ON f.assigned_to = u.id
    ORDER BY f.name
  `);
  return rows.map((r) => ({ ...r, status: computeStatus(r) }));
}

async function getAgentFields(agentId) {
  const [rows] = await pool.query(`
    SELECT f.id, f.name, f.crop_type, f.planting_date, f.stage, f.updated_at,
           u.id AS agent_id, u.name AS agent_name
    FROM fields f
    LEFT JOIN users u ON f.assigned_to = u.id
    WHERE f.assigned_to = ?
    ORDER BY f.name
  `, [agentId]);
  return rows.map((r) => ({ ...r, status: computeStatus(r) }));
}

async function getFieldById(id) {
  const [[row]] = await pool.query(`
    SELECT f.id, f.name, f.crop_type, f.planting_date, f.stage, f.updated_at,
           u.id AS agent_id, u.name AS agent_name
    FROM fields f
    LEFT JOIN users u ON f.assigned_to = u.id
    WHERE f.id = ?
  `, [id]);
  if (!row) throw new AppError("Field not found", 404);
  return { ...row, status: computeStatus(row) };
}

async function createField({ name, crop_type, planting_date, assigned_to }) {
  const [result] = await pool.query(
    "INSERT INTO fields (name, crop_type, planting_date, assigned_to, stage) VALUES (?, ?, ?, ?, 'Planted')",
    [name, crop_type, planting_date, assigned_to || null]
  );
  return await getFieldById(result.insertId);
}

async function updateField(id, { name, crop_type, planting_date, assigned_to }) {
  await getFieldById(id);
  await pool.query(
    "UPDATE fields SET name = ?, crop_type = ?, planting_date = ?, assigned_to = ? WHERE id = ?",
    [name, crop_type, planting_date, assigned_to || null, id]
  );
  return await getFieldById(id);
}

async function deleteField(id) {
  await getFieldById(id);
  await pool.query("DELETE FROM fields WHERE id = ?", [id]);
}

module.exports = { getAllFields, getAgentFields, getFieldById, createField, updateField, deleteField };
