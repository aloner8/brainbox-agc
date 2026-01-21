const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  res.json({
    status: 'ok',
    env: process.env.NODE_ENV,
    time: new Date().toISOString()
  });
});

module.exports = router;