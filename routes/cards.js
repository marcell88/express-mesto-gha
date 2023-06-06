const { celebrate, Joi } = require('celebrate');
const cardRouter = require('express').Router();
const cardControllers = require('../controllers/cards');

const linkRegex = /^http(s)?:\/\/(www\.)?[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=]/;
const idRegex = /[a-zA-Z0-9]{24,24}/;

cardRouter.get('/', cardControllers.getCards);

cardRouter.delete('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().regex(idRegex),
  }),
}), cardControllers.deleteCardById);

cardRouter.delete('/:id/likes', celebrate({
  params: Joi.object().keys({
    id: Joi.string().regex(idRegex),
  }),
}), cardControllers.deleteLikeOfCard);

cardRouter.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(linkRegex),
  }),
}), cardControllers.createCard);

cardRouter.put('/:id/likes', cardControllers.likeCard);

module.exports = cardRouter;
