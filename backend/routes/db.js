const express = require('express');
const router = express.Router();
const requestIp = require('request-ip');

const { query, callProc, callFunc } = require('../services/db.service');

router.use(requestIp.mw());

/**
 * Health check
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    ip: req.clientIp
  });
});

/**
 * Example SAFE query
 */
router.get('/users/:id', async (req, res, next) => {
  try {
    const rows = await query(
      'SELECT * FROM public.users WHERE id = $1',
      [req.params.id]
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

/**
 * Call stored procedure
 */
router.post('/call-proc', async (req, res, next) => {
  try {
    const { procname, jsonparm } = req.body;
    await callProc(procname, jsonparm);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

/**
 * Call function
 */
router.post('/call-func', async (req, res, next) => {
  try {
    const { funcname, jsonparm } = req.body;
    const rows = await callFunc(funcname, jsonparm);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
