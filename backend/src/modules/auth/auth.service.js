const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../../config/db");
const { jwt: jwtConfig } = require("../../config/env");

async function login(email, password) {
  const [[user]] = await pool.query(
    "SELECT id, name, email, password_hash, role FROM users WHERE email = ?",
    [email],
  );
  if (!user) return null;

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) return null;

  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    jwtConfig.secret,
    { expiresIn: "8h" },
  );
  return {
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  };
}

async function register({ name, email, password, role = "agent" }) {
  const [[existing]] = await pool.query(
    "SELECT id FROM users WHERE email = ?",
    [email],
  );
  if (existing) throw new Error("Email already in use");

  const password_hash = await bcrypt.hash(password, 10);
  const [result] = await pool.query(
    "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)",
    [name, email, password_hash, role],
  );
  return { id: result.insertId, name, email, role };
}

async function getMe(id) {
  const [[user]] = await pool.query(
    "SELECT id, name, email, role FROM users WHERE id = ?",
    [id],
  );
  return user || null;
}

module.exports = { login, register, getMe };
