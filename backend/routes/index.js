const express = require('express');
const router = express.Router();

const { uploadFiles, moveFile, deleteFiles } = require('../services/file.service');
const { sendMail } = require('../services/mail.service');
const { sendMailByIdState } =   require('../services/project-state-mail.service');
/* home */
router.get('/', (req, res) => {
    res.json({
    status: 'ok',
    service: 'Brainbox API',
    version: '1.0.0'
  });
});
router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

router.post('/connecting', function(req, res, next) {
  console.log(req.body)
  res.send(req.body);
});
/* upload */
router.post('/uploadfile', async (req, res, next) => {
  try {
    if (!req.body.files) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    await uploadFiles(req.body.files);
    res.json({
      status: true,
      message: `upload ${req.body.files.length} success`
    });
  } catch (err) {
    next(err);
  }
});

/* move */
router.post('/movefile', async (req, res, next) => {
  try {
    await moveFile(req.body.currentPath, req.body.destinationDir);
    res.json({ status: true, message: 'File moved successfully' });
  } catch (err) {
    next(err);
  }
});

/* delete */
router.post('/deletefile', async (req, res, next) => {
  try {
    if (!req.body.files) {
      return res.status(400).json({ message: 'No file to delete' });
    }
    await deleteFiles(req.body.files);
    res.json({
      status: true,
      message: `delete ${req.body.files.length} success`
    });
  } catch (err) {
    next(err);
  }
});

/* send mail */
router.post('/sendmail', async (req, res, next) => {
  try {
    await sendMail(req.body);
    res.json({ status: 'success' });
  } catch (err) {
    next(err);
  }
});

router.post('/sendmailbyidstate', async (req, res, next) => {
  try {
    await sendMailByIdState(req.body.id_state);
    res.json({ status: 'success' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
