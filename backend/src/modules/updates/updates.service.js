const pool = require("../../config/db");
const { AppError } = require("../../utils/errors");

// no ad-hoc states.
const VALID_STAGES = ["Planted", "Growing", "Ready", "Harvested"];

async function addUpdate(fieldId, agentId, { stage, notes }) {
  if (!VALID_STAGES.includes(stage))
    throw new AppError(`stage must be one of: ${VALID_STAGES.join(", ")}`, 400);

  const [[field]] = await pool.query(
    "SELECT id, assigned_to FROM fields WHERE id = ?",
    [fieldId],
  );
  if (!field) throw new AppError("Field not found", 404);
  // auth = DB ownership, not caller-provided field metadata.
  if (field.assigned_to !== agentId) throw new AppError("Forbidden", 403);

  // field snapshot first 
  await pool.query(
    "UPDATE fields SET stage = ?, updated_at = NOW() WHERE id = ?",
    [stage, fieldId],
  );
  await pool.query(
    "INSERT INTO field_updates (field_id, agent_id, stage, notes) VALUES (?, ?, ?, ?)",
    [fieldId, agentId, stage, notes || null],
  );
}

async function getUpdates(fieldId) {
  const [[field]] = await pool.query("SELECT id FROM fields WHERE id = ?", [
    fieldId,
  ]);
  if (!field) throw new AppError("Field not found", 404);

  const [rows] = await pool.query(
    `                                                 
    SELECT fu.id, fu.stage, fu.notes, fu.created_at,
           u.name AS agent_name                                                 
    FROM field_updates fu                                                           
    JOIN users u ON fu.agent_id = u.id
    WHERE fu.field_id = ?                                                            
    ORDER BY fu.created_at DESC
  `,
    [fieldId],
  );

  return rows;
}

module.exports = { addUpdate, getUpdates };
