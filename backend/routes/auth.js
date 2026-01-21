const express = require('express');
const router = express.Router();

const { query } = require('../services/db.service');
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  comparePassword
} = require('../services/auth.service');
const { authenticateLDAP } = require('../services/ldap.service');

router.post('/login', async (req, res, next) => {
  try {
    const username = req.body.username.toUpperCase();
    const password = req.body.password;

    const users = await query(
      'SELECT id, username, password, role FROM users WHERE upper(username)=$1',
      [username]
    );
    if (!users[0]) return res.status(401).json({ message: 'Invalid' });

    const user = users[0];
    let ok = false;

    try {
      ok = await authenticateLDAP(user.username, password);
    } catch {}

    if (!ok) {
      ok = await comparePassword(password, user.password);
      if (!ok) return res.status(401).json({ message: 'Invalid' });
    }

    const accessToken = signAccessToken({
      id: user.id,
      username: user.username,
      role: user.role
    });
    const refreshToken = signRefreshToken({ id: user.id });

    await query(
      'INSERT INTO refresh_tokens (user_id, token) VALUES ($1,$2)',
      [user.id, refreshToken]
    );

    res.json({ accessToken, refreshToken });
  } catch (e) {
    next(e);
  }
});

router.post('/refresh', async (req, res) => {
  try {
    const decoded = verifyRefreshToken(req.body.refreshToken);
    const accessToken = signAccessToken({ id: decoded.id });
    res.json({ accessToken });
  } catch {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
});

router.post('/logout', async (req, res) => {
  await query(
    'UPDATE refresh_tokens SET revoked=true WHERE token=$1',
    [req.body.refreshToken]
  );
  res.json({ message: 'Logged out' });
});

router.post('/check-token', (req, res) => {
  try {
    const token = req.body.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ valid: true, user: decoded });
  } catch {
    res.status(401).json({ valid: false });
  }
});

module.exports = router;
