const authService = require("./auth.service");
const { AppError } = require("../../utils/errors");
const asyncHandler = require("../../middleware/asyncHandler");

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    throw new AppError("Email and password required", 400);

  const result = await authService.login(email, password);
  if (!result) throw new AppError("Invalid credentials", 401);

  res.json(result);
});

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    throw new AppError("name, email and password required", 400);

  const user = await authService.register({
    name,
    email,
    password,
    role: "agent",
  });
  res.status(201).json(user);
});

const me = asyncHandler(async (req, res) => {
  const user = await authService.getMe(req.user.id);
  if (!user) throw new AppError("User not found", 404);
  res.json(user);
});

module.exports = { login, register, me };
