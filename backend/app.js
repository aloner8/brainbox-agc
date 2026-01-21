const express = require('express');
const logger = require('morgan');
const cors = require('cors');

const app = express();
app.set('trust proxy', true);

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/', require('./routes/index'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/password', require('./routes/password'));
app.use('/api/user', require('./routes/users'));
app.use('/api/db', require('./routes/db'));

app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});


app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err.message });
});

module.exports = app;
