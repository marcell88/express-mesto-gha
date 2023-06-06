const { celebrate, Joi } = require('celebrate');
const { linkRegex, idRegex } = require('../utils/regexPatterns');

const signupValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(linkRegex),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const signinValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const idParamValidation = celebrate({
  params: Joi.object().keys({
    id: Joi.string().regex(idRegex),
  }),
});

const userProfileValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

const userAvatarValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(linkRegex),
  }),
});

const cardValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(linkRegex),
  }),
});

module.exports = {
  signupValidation,
  signinValidation,
  idParamValidation,
  userProfileValidation,
  userAvatarValidation,
  cardValidation,
};
