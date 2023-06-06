const { celebrate, Joi } = require('celebrate');
const userRouter = require('express').Router();
const userControllers = require('../controllers/users');

const linkRegex = /^http(s)?:\/\/(www\.)?[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=]/;
const idRegex = /[a-zA-Z0-9]{24,24}/;

userRouter.get('/', userControllers.getUsers);
userRouter.get('/me', userControllers.getCurrentUser);

userRouter.get('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().regex(idRegex),
  }),
}), userControllers.getUserById);

userRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), userControllers.updateProfile);

userRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(linkRegex),
  }),
}), userControllers.updateAvatar);

module.exports = userRouter;
