const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/index');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => {
    console.log('Connecteed to DB...');
  })
  .catch((err) => { console.log('Error with DB connection: ', err); });

app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: '64709b6087ee65521a88aee9',
  };
  next();
});

app.use('/', router);

// Дефолтный обработчик ошибок
app.use((err, req, res, next) => {
  console.log('Attention! Default error handler has activated...');
  res.status(err.statusCode).send({
    name: err.name,
    description: err.description,
    message: err.message,
    code: err.statusCode,
    stack: err.stack,
  });
});

app.listen(PORT, () => { console.log('Server is ON...'); });
