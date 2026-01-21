const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const { UPLOAD_PATH } = require('../config/storage.config');
const { query } = require('./db.service');

/* helper */
function safeJoin(base, target) {
  const targetPath = path.normalize(target).replace(/^(\.\.(\/|\\|$))+/, '');
  return path.join(base, targetPath);
}

/**
 * Upload multiple base64 files
 */
async function uploadFiles(files) {
  for (const element of files) {
    const photo = element.file.split(';base64,').pop();

    const timestamp = new Date().toISOString().replace(/[:.]/g, '');
    const original = element.filename;
    const ext = path.extname(original);
    const encodedName = Buffer.from(timestamp + original).toString('base64') + ext;

    const folder = safeJoin(UPLOAD_PATH, element.subfolder);
    await fsp.mkdir(folder, { recursive: true });

    const fullPath = path.join(folder, encodedName);
    await fsp.writeFile(fullPath, photo, { encoding: 'base64' });

    if (element.project_id == 0) {
      await query(
        `INSERT INTO project_document_new (user_id, filename, clientname, filepath, created_at)
         VALUES ($1,$2,$3,$4,now())`,
        [element.userid, encodedName, original, path.join(element.subfolder, encodedName)]
      );
    } else {
      await query(
        `INSERT INTO project_documents (project_id, filename, clientname, filepath, created_at)
         VALUES ($1,$2,$3,$4,now())`,
        [element.project_id, encodedName, original, path.join(element.subfolder, encodedName)]
      );
    }
  }
}

/**
 * Move file
 */
async function moveFile(currentPath, destinationPath) {
  const from = safeJoin(UPLOAD_PATH, currentPath);
  const to = safeJoin(UPLOAD_PATH, destinationPath);

  await fsp.mkdir(path.dirname(to), { recursive: true });

  try {
    await fsp.rename(from, to);
  } catch (err) {
    if (err.code === 'EXDEV') {
      await fsp.copyFile(from, to);
      await fsp.unlink(from);
    } else {
      throw err;
    }
  }
}

/**
 * Delete files
 */
async function deleteFiles(files) {
  for (const element of files) {
    const fullPath = safeJoin(UPLOAD_PATH, element.filepath);
    if (fs.existsSync(fullPath)) {
      await fsp.rm(fullPath);
    }

    if (element.id) {
      await query('DELETE FROM project_documents WHERE id=$1', [element.id]);
    } else {
      await query('DELETE FROM project_document_new WHERE rtrim(filepath)=$1', [element.filepath]);
    }
  }
}

module.exports = {
  uploadFiles,
  moveFile,
  deleteFiles
};
