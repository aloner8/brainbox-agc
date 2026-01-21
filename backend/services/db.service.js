const { Pool } = require('pg');
const config = require('../config/db.config');

const pool = new Pool(config);

async function query(sql, params = []) {
  console.log('config:', config);
  const { rows } = await pool.query(sql, params);
  return rows;
}

async function callProc(proc, json) {
  await pool.query(`CALL ${proc}($1)`, [json]);
}

async function callFunc(func, json) {
  const { rows } = await pool.query(
    `SELECT * FROM ${func}($1)`,
    [json]
  );
  return rows;
}

module.exports = { query, callProc, callFunc };
