const authService = require("./auth.service");
const { AppError } = require("../../utils/errors");

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email and password required" });

    const result = await authService.login(email, password);
    if (!result) return res.status(401).json({ error: "Invalid credentials" });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
}

async function register(req, res) {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password)
      return res
        .status(400)
        .json({ error: "name, email and password required" });

    const user = await authService.register({
      name,
      email,
      password,
      role: "agent",
    });
    res.status(201).json(user);
  } catch (err) {
    if (err instanceof AppError)
      return res.status(err.statusCode).json({ error: err.message });
    res.status(500).json({ error: "Internal server error" });
  }
}

async function me(req, res) {
  try {
    const user = await authService.getMe(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { login, register, me };
