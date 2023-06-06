const cardRouter = require('express').Router();
const cardControllers = require('../controllers/cards');
const { idParamValidation, cardValidation } = require('../middlewares/preValidation');

cardRouter.get('/', cardControllers.getCards);
cardRouter.delete('/:id', idParamValidation, cardControllers.deleteCardById);
cardRouter.delete('/:id/likes', idParamValidation, cardControllers.deleteLikeOfCard);
cardRouter.post('/', cardValidation, cardControllers.createCard);
cardRouter.put('/:id/likes', idParamValidation, cardControllers.likeCard);

module.exports = cardRouter;
