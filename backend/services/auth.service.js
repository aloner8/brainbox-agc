const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const signAccessToken = payload =>
  jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES
  });

const signRefreshToken = payload =>
  jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES
  });

const verifyAccessToken = token =>
  jwt.verify(token, process.env.JWT_ACCESS_SECRET);

const verifyRefreshToken = token =>
  jwt.verify(token, process.env.JWT_REFRESH_SECRET);

const cryptPassword = password => bcrypt.hash(password, 10);
const comparePassword = (password, hash) =>
  bcrypt.compare(password, hash);

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  cryptPassword,
  comparePassword
};
