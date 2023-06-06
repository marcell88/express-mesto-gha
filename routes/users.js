const { celebrate, Joi } = require('celebrate');
const userRouter = require('express').Router();
const userControllers = require('../controllers/users');

userRouter.get('/', userControllers.getUsers);
userRouter.get('/me', userControllers.getCurrentUser);
userRouter.get('/:id', userControllers.getUserById);

const linkRegex = /^http(s)?:\/\/(www\.)?[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=]/;

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
