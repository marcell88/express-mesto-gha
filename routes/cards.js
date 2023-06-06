// const { celebrate, Joi } = require('celebrate');
const cardRouter = require('express').Router();
const cardControllers = require('../controllers/cards');

cardRouter.get('/', cardControllers.getCards);
cardRouter.delete('/:id', cardControllers.deleteCardById);
cardRouter.delete('/:id/likes', cardControllers.deleteLikeOfCard);

cardRouter.post('/', cardControllers.createCard);
cardRouter.put('/:id/likes', cardControllers.likeCard);

module.exports = cardRouter;
