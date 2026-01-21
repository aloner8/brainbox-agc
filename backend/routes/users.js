const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const { query } = require('../services/db.service');

router.use(auth());

router.get('/me', async (req, res) => {
  const rows = await query(
    'SELECT id, username, role FROM users WHERE id=$1',
    [req.user.id]
  );
  res.json(rows[0]);
});

module.exports = router;
