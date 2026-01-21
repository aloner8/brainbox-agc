const path = require('path');

module.exports = {
  UPLOAD_PATH: process.env.UPLOADPATH || path.join(process.cwd(), 'uploads')
};
