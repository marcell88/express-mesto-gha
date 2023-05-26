const cardRouter = require('express').Router();
const cardControllers = require('../controllers/cards');

cardRouter.get('/', cardControllers.getCards);
cardRouter.post('/', cardControllers.createCard);
cardRouter.delete('/:id', cardControllers.deleteCardById);

cardRouter.put('/:id/likes', cardControllers.likeCard);
cardRouter.delete('/:id/likes', cardControllers.deleteLikeOfCard);

module.exports = cardRouter;
