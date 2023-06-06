const mongoose = require('mongoose');
const http2 = require('node:http2');

const Card = require('../models/cards');

const BadRequestError = require('../errors/BadRequestError');
const DocumentNotFoundError = require('../errors/DocumentNotFoundError');
const UnhandledError = require('../errors/UnhandledErrod');
const ForbiddenError = require('../errors/ForbiddenError');

const { HTTP_STATUS_OK, HTTP_STATUS_CREATED } = http2.constants;

const getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.status(HTTP_STATUS_OK).send(cards))
    .catch(() => {
      next(new UnhandledError('Server has broken while trying to get all cards'));
    });
};

const deleteCardById = (req, res, next) => {
  Card.findById(req.params.id)
    .orFail(() => { throw new mongoose.Error.DocumentNotFoundError(); })
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError();
      }
      // Этот промис не имеет catch, но его должен обработать один общий catch ниже - добавил return
      return Card.findByIdAndDelete(req.params.id)
        .then(() => {
          res.status(HTTP_STATUS_OK).send({ message: 'Deleted successfully' });
        });
    })
    .catch((err) => {
      if (err instanceof ForbiddenError) {
        next(new ForbiddenError('Access denied, this is not your card'));
        return;
      }
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new DocumentNotFoundError('Card with such id has not found'));
        return;
      }
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Please enter correct card id'));
        return;
      }
      next(new UnhandledError('Server has broken while trying to delete the card'));
    });
};

const createCard = (req, res, next) => {
  Card.create({
    name: req.body.name,
    link: req.body.link,
    owner: req.user._id,
  })
    .then((card) => res.status(HTTP_STATUS_CREATED).send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Incorrect data were send to server for card creation'));
        return;
      }
      next(new UnhandledError('Server has broken while trying to create new card'));
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .orFail(() => { throw new mongoose.Error.DocumentNotFoundError(); })
    .then((card) => res.status(HTTP_STATUS_OK).send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new DocumentNotFoundError('Card with such id has not found'));
        return;
      }
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Please enter correct card id'));
        return;
      }
      next(new UnhandledError('Server has broken while trying to like the card'));
    });
};

const deleteLikeOfCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .orFail(() => { throw new mongoose.Error.DocumentNotFoundError(); })
    .then((card) => res.status(HTTP_STATUS_OK).send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next(new DocumentNotFoundError('Card with such id has not found'));
        return;
      }
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Please enter correct card id'));
        return;
      }
      next(new UnhandledError('Server has broken while trying to dislike the card'));
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  deleteLikeOfCard,
};
