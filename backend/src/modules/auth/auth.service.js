const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../../config/db");                                                    

async function login(email, password) {                                                     
const [[user]] = await pool.query(
    "SELECT id, name, email, password_hash, role FROM users WHERE email = ?",               
    [email]
);                                                                                        
if (!user) return null;

const match = await bcrypt.compare(password, user.password_hash);
if (!match) return null;

const token = jwt.sign(                                                                   
    { id: user.id, name: user.name, email: user.email, role: user.role },

