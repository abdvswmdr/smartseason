const authService = require("./auth.service");

async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email and password required" });

    const result = await authService.login(email, password);
    if (!result) return res.status(401).json({ error: "Invalid credentials" });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function register(req, res) {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password)
      return res
        .status(400)
        .json({ error: "name, email and password required" });

    const user = await authService.register({ name, email, password, role });
    res.status(201).json(user);
  } catch (err) {
    const status = err.message === "Email already in use!" ? 409 : 500;
    res.status(status).json({ error: err.message });
  }
}

async function me(req, res) {
  try {
    const user = await authService.getMe(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { login, register, me };
