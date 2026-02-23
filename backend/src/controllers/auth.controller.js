const { registerUser, loginUser, refreshAccessToken, logoutUser } = require('../services/auth.service');

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const data = await registerUser({ name, email, password, role });
    return res.status(201).json({ message: 'User registered successfully', ...data });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const data = await loginUser({ email, password });
    return res.status(200).json({ message: 'Login successful', ...data });
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
};

const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token required' });
    }

    const data = await refreshAccessToken(refreshToken);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
};

const logout = async (req, res) => {
  try {
    await logoutUser(req.user.id);
    return res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Logout failed' });
  }
};

module.exports = { register, login, refresh, logout };
