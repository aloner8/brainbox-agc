const express = require('express');
const router = express.Router();
const { query } = require('../services/db.service');
const { cryptPassword, comparePassword } = require('../services/auth.service');

router.post('/change', async (req, res) => {
  const { username, otp, newPassword } = req.body;

  const rows = await query(
    'SELECT id, remember_token FROM users WHERE upper(username)=$1',
    [username.toUpperCase()]
  );
  if (!rows[0]) return res.status(400).json({ message: 'No user' });

  const ok = await comparePassword(otp, rows[0].remember_token);
  if (!ok) return res.status(401).json({ message: 'Invalid OTP' });

  const hash = await cryptPassword(newPassword);
  await query(
    'UPDATE users SET password=$1, remember_token=NULL WHERE id=$2',
    [hash, rows[0].id]
  );

  res.json({ message: 'Password changed' });
});

router.post('/otp', async (req, res, next) => {
  try {
    const { username, email } = req.body;

    const rows = await query(
      'SELECT id, email FROM users WHERE upper(username)=$1',
      [username.toUpperCase()]
    );

    if (!rows[0] || rows[0].email !== email) {
      return res.status(400).json({ message: 'Invalid user' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await cryptPassword(otp);

    await query(
      'UPDATE users SET remember_token=$1 WHERE id=$2',
      [otpHash, rows[0].id]
    );

    await sendMail({
      to: email,
      subject: 'OTP for password reset',
      html: `<h2>Your OTP</h2><h1>${otp}</h1>`
    });

    res.json({ message: 'OTP sent' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
