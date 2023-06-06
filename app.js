const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');
const auth = require('./middlewares/auth');
const router = require('./routes/index');
const { login, createUser } = require('./controllers/users');

// Constants
const { PORT = 3000 } = process.env;
const linkRegex = /^http(s)?:\/\/(www\.)?[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=]/;

const app = express();
mongoose.connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => {
    console.log('Connecteed to DB...');
  })
  .catch((err) => { console.log('Error with DB connection: ', err); });

app.use(express.json());

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(linkRegex),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), createUser);

app.use(auth);
app.use('/', router);

// Обработчик Celebrate
app.use(errors());

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
